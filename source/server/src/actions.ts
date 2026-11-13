// VTuber 监控台 actions.
//
// Data model: a curated, hand-verified roster (vtubers + channels) written
// once by `populateRoster`, plus a `live_status` row per channel that
// `refreshLive` rewrites from the platforms' public endpoints:
//   - Bilibili: api.live.bilibili.com room info by mid (status/title/cover/area)
//   - YouTube:  the channel's public /live page HTML — judged from the
//     player response's videoDetails (isLive vs isUpcoming) in the full
//     page shape, and from the main video's view-count renderer
//     ("watching now" + its isLive sibling) in the bot-check shape
//     YouTube intermittently serves instead (LOGIN_REQUIRED player,
//     canonical literally "undefined"); a page with no usable anchor
//     is "unknown", never offline — see parseYoutubeLivePage.
//   - Twitch:   decapi.me public endpoints (viewercount / game / status / uptime)
// Live thumbnails are downloaded into ctx.blobs so the client never hotlinks
// a platform CDN. Separately, each live channel records the platform's own
// live preview-frame source as screenshotUrl — the client polls it directly
// to show real-time screenshots; the blob cover is only the labelled
// fallback when a platform yields no live frame:
//   - YouTube: NO live frame at usable resolution exists (exhaustively
//     re-verified 2026-11-09 — see storeYoutubeCover), so the field
//     carries the stream's current cover URL at its highest real tier
//     and the client labels it 直播封面， never a screenshot.
//   - Twitch: the previews-ttv live_user frame (verified real frames).
//   - Bilibili: the room keyframe from the room-info response.
// Anything a source cannot prove becomes state "unknown" — never a guess.
//
// Module map: the curated roster data and the primary-platform table
// live in roster.ts; all live-status fetching and judgment rules live
// in detect.ts; this file holds only the response shapes and the four
// actions that wire them together.

import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { asc, eq } from "drizzle-orm";
import * as schema from "./schema";
import { ROSTER, primaryPlatformOf } from "./roster";
import {
  UNKNOWN,
  checkBilibili,
  checkTwitch,
  checkYoutube,
  onAirSortKeyOf,
  type ChannelRow,
  type StatusUpdate,
} from "./detect";
// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

const channelOut = z.object({
  channelId: z.number(),
  platform: z.enum(["youtube", "twitch", "bilibili"]),
  // Platform account id (YouTube UC id / Twitch login / Bilibili mid)
  // and Bilibili room id: the roster card's 个人主页 / 直播间 buttons
  // build their targets from these verified values.
  accountId: z.string(),
  roomId: z.string(),
  handle: z.string(),
  url: z.string(),
  appUrl: z.string(),
  followersLabel: z.string(),
  state: z.enum(["live", "chat", "offline", "unknown"]),
  liveTitle: z.string(),
  game: z.string(),
  // THIS session is an ASMR session (per-session判定， see
  // isAsmrTitle) — distinct from the streamer's resident ASMR tag
  // in vtubers.tags. True only while live/chat with an ASMR session.
  isAsmr: z.boolean(),
  // Real concurrent viewers (YouTube watching-now / Twitch viewer
  // count / Bilibili gold-rank onlineNum). Null for a live Bilibili
  // room only when that room's gold-rank call failed — the client
  // then orders her by the popularity/K sort-only fallback and the
  // card keeps showing 人气值 alone.
  viewers: z.number().nullable(),
  // Bilibili 人气值 (popularity score); null on every other platform.
  popularity: z.number().nullable(),
  thumbUrl: z.string(),
  screenshotUrl: z.string(),
  liveUrl: z.string(),
  appLiveUrl: z.string(),
  startedAt: z.number().nullable(),
});

const boardResponse = z.object({
  refreshedAt: z.number().nullable(),
  liveCount: z.number(),
  games: z.array(
    z.object({
      name: z.string(),
      streamers: z.array(z.string()),
      viewers: z.number().nullable(),
    }),
  ),
  vtubers: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      nameAlt: z.string(),
      region: z.enum(["jp", "en", "cn", "tw"]),
      agency: z.string(),
      reason: z.string(),
      tags: z.array(z.string()),
      hidden: z.boolean(),
      primaryPlatform: z.enum(["youtube", "twitch", "bilibili", ""]),
      channels: z.array(channelOut),
    }),
  ),
});

type BoardResponse = z.infer<typeof boardResponse>;

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const Actions = {
  populateRoster: defineAction({
    description: "Writes the curated, verified VTuber roster into the database once (idempotent; never overwrites existing rows).",
    request: z.object({}),
    response: z.object({ inserted: z.number(), alreadyPresent: z.boolean() }),
    async handler(ctx): Promise<{ inserted: number; alreadyPresent: boolean }> {
      const db = ctx.db<typeof schema>();
      const existingRows = await db.select().from(schema.vtubers);
      const bySlug = new Map(existingRows.map((r) => [r.slug, r]));
      const alreadyPresent = existingRows.length > 0;
      let inserted = 0;
      for (const entry of ROSTER) {
        const fields = {
          name: entry.name, nameAlt: entry.nameAlt, region: entry.region,
          agency: entry.agency, reason: entry.reason, tags: entry.tags,
          sortRank: entry.sortRank,
          primaryPlatform:
            primaryPlatformOf(
              entry.slug,
              null,
              entry.channels.map((c) => c.platform),
            ) || null,
        };
        let vtuberId: number;
        const existing = bySlug.get(entry.slug);
        if (existing) {
          // Curated roster: keep descriptive fields in sync (e.g. name fixes).
          await db.update(schema.vtubers).set(fields).where(eq(schema.vtubers.id, existing.id));
          vtuberId = existing.id;
        } else {
          const rows = await db
            .insert(schema.vtubers)
            .values({ slug: entry.slug, ...fields })
            .returning({ id: schema.vtubers.id });
          const v = rows[0];
          if (!v) continue;
          vtuberId = v.id;
          inserted += 1;
        }
        const existingChans = await db
          .select()
          .from(schema.channels)
          .where(eq(schema.channels.vtuberId, vtuberId));
        for (const ch of entry.channels) {
          const found = existingChans.find(
            (c) => c.platform === ch.platform && c.accountId === ch.accountId,
          );
          if (found) {
            // Keep channel display fields (handle / urls / followers label)
            // in sync with the curated roster for existing rows too.
            await db
              .update(schema.channels)
              .set({
                roomId: ch.roomId ?? "",
                handle: ch.handle,
                url: ch.url,
                appUrl: ch.appUrl,
                followersLabel: ch.followersLabel ?? "",
              })
              .where(eq(schema.channels.id, found.id));
            continue;
          }
          const chRows = await db
            .insert(schema.channels)
            .values({
              vtuberId, platform: ch.platform, accountId: ch.accountId,
              roomId: ch.roomId ?? "", handle: ch.handle, url: ch.url,
              appUrl: ch.appUrl, followersLabel: ch.followersLabel ?? "",
            })
            .returning({ id: schema.channels.id });
          const c = chRows[0];
          if (c) {
            await db.insert(schema.liveStatus).values({ channelId: c.id, state: "unknown", updatedAt: 0 });
          }
        }
        // Link audit (2026-11-09): when a roster entry's channel is
        // corrected (a wrong-person channel replaced by the verified
        // one), the stale channel row must not linger — the board
        // would otherwise keep showing and refreshing the wrong
        // homepage next to the right one. Drop any stored channel of
        // this VTuber that the curated entry no longer lists, with
        // its live-status row.
        for (const old of existingChans) {
          const kept = entry.channels.some(
            (c) => c.platform === old.platform && c.accountId === old.accountId,
          );
          if (!kept) {
            await db.delete(schema.liveStatus).where(eq(schema.liveStatus.channelId, old.id));
            await db.delete(schema.channels).where(eq(schema.channels.id, old.id));
          }
        }
      }
      ctx.invalidateQueries();
      return { inserted, alreadyPresent };
    },
  }),

  getBoard: defineAction({
    description: "Returns the full monitoring board: roster with per-channel live status and the aggregated hot-games list.",
    request: z.object({}),
    response: boardResponse,
    async handler(ctx): Promise<BoardResponse> {
      const db = ctx.db<typeof schema>();
      const [vts, chans, statuses, metaRows] = await Promise.all([
        db.select().from(schema.vtubers).orderBy(asc(schema.vtubers.sortRank)),
        db.select().from(schema.channels),
        db.select().from(schema.liveStatus),
        db.select().from(schema.meta),
      ]);
      const statusByChannel = new Map(statuses.map((s) => [s.channelId, s]));
      const refreshedMeta = metaRows.find((m) => m.key === "last_refresh");
      const refreshedAt = refreshedMeta ? Number(refreshedMeta.value) || null : null;

      const gameMap = new Map<
        string,
        { streamers: { name: string; viewers: number; popularity: number }[]; viewers: number; hasViewers: boolean }
      >();
      let liveCount = 0;

      const vtubers: BoardResponse["vtubers"] = [];
      for (const v of vts) {
        const ownChans = chans.filter((c) => c.vtuberId === v.id);
        const primaryPlatform = primaryPlatformOf(
          v.slug,
          v.primaryPlatform,
          ownChans.map((c) => c.platform),
        );
        // The ONE stream of hers the board pushes (user rule: when she
        // is live on several platforms at once, ON AIR pushes her
        // primary platform's stream). The headcount and the hot-games
        // aggregation count this featured stream only — a simulcast
        // must not count her twice, nor split her across two games.
        // When the primary platform is not live, the (single) live
        // secondary stream is featured instead: priority orders
        // simultaneous streams, it never hides a lone one.
        const liveChans = ownChans.filter(
          (c) => statusByChannel.get(c.id)?.state === "live",
        );
        const featuredLive =
          liveChans.find((c) => c.platform === primaryPlatform) ??
          liveChans.reduce<(typeof liveChans)[number] | undefined>(
            (best, c) =>
              best == null ||
              onAirSortKeyOf(statusByChannel.get(c.id), c.platform) >
                onAirSortKeyOf(statusByChannel.get(best.id), best.platform)
                ? c
                : best,
            undefined,
          );
        if (featuredLive && v.hidden !== 1) {
          const st = statusByChannel.get(featuredLive.id);
          liveCount += 1;
          const g = (st?.game ?? "").trim();
          if (g) {
            const agg = gameMap.get(g) ?? { streamers: [], viewers: 0, hasViewers: false };
            // Viewers here means real concurrents only — for a
            // Bilibili featured stream that is the gold rank's
            // onlineNum, which therefore DOES enter the game's total
            // on the same terms as YouTube/Twitch counts. Her 人气值
            // never enters any total; it is carried solely to order
            // the streamer names among themselves. A Bilibili stream
            // whose onlineNum could not be fetched (viewers null)
            // contributes nothing to the total — the popularity/K
            // sort estimate is never summed.
            agg.streamers.push({ name: v.name, viewers: st?.viewers ?? 0, popularity: st?.popularity ?? 0 });
            if (st?.viewers != null) {
              agg.viewers += st.viewers;
              agg.hasViewers = true;
            }
            gameMap.set(g, agg);
          }
        }
        const outChannels: BoardResponse["vtubers"][number]["channels"] = [];
        for (const ch of ownChans) {
          const st = statusByChannel.get(ch.id);
          const state = st?.state ?? "unknown";
          let thumbUrl = "";
          if (st?.thumbKey) {
            thumbUrl = (await ctx.blobs.getUrl(st.thumbKey)) ?? "";
          }
          outChannels.push({
            channelId: ch.id,
            platform: ch.platform,
            accountId: ch.accountId,
            roomId: ch.roomId,
            handle: ch.handle,
            url: ch.url,
            appUrl: ch.appUrl,
            followersLabel: ch.followersLabel,
            state,
            liveTitle: st?.title ?? "",
            game: st?.game ?? "",
            isAsmr: st?.isAsmr === 1,
            viewers: st?.viewers ?? null,
            popularity: st?.popularity ?? null,
            thumbUrl,
            screenshotUrl: st?.screenshotUrl ?? "",
            liveUrl: st?.liveUrl ?? "",
            appLiveUrl: st?.appLiveUrl ?? "",
            startedAt: st?.startedAt ?? null,
          });
        }
        vtubers.push({
          slug: v.slug,
          name: v.name,
          nameAlt: v.nameAlt,
          region: v.region,
          agency: v.agency,
          reason: v.reason,
          tags: v.tags ? v.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          hidden: v.hidden === 1,
          primaryPlatform,
          channels: outChannels,
        });
      }

      const games = [...gameMap.entries()]
        .map(([name, agg]) => ({
          name,
          // Streamers ordered by concurrent viewers, highest first —
          // the board's two-column cells surface streamers[0] as the
          // game's top streamer, so this order is part of the contract.
          // Bilibili streamers carry their onlineNum as viewers when
          // it was fetched (0 only when it was not); the popularity
          // tiebreak then orders only the no-onlineNum remainder among
          // themselves, behind every real concurrent count.
          streamers: [...agg.streamers]
            .sort((a, b) => b.viewers - a.viewers || b.popularity - a.popularity)
            .map((s) => s.name),
          viewers: agg.hasViewers ? agg.viewers : null,
        }))
        .sort((a, b) => b.streamers.length - a.streamers.length || (b.viewers ?? 0) - (a.viewers ?? 0));

      return { refreshedAt, liveCount, games, vtubers };
    },
  }),

  setHidden: defineAction({
    description: "Hides a VTuber from the board or restores her, per the user's own screening (the roster row itself is never deleted).",
    request: z.object({ slug: z.string().min(1), hidden: z.boolean() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ ok: true }> {
      const db = ctx.db<typeof schema>();
      await db
        .update(schema.vtubers)
        .set({ hidden: args.hidden ? 1 : 0 })
        .where(eq(schema.vtubers.slug, args.slug));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  refreshLive: defineAction({
    description: "Re-checks every channel's live status against Bilibili / YouTube / Twitch public endpoints and stores the result. Runs on the 15-minute schedule and from the page's refresh button.",
    request: z.object({}),
    response: z.object({
      checked: z.number(),
      live: z.number(),
      unknown: z.number(),
      refreshedAt: z.number(),
    }),
    async handler(ctx): Promise<{ checked: number; live: number; unknown: number; refreshedAt: number }> {
      const db = ctx.db<typeof schema>();
      const chans = await db.select().from(schema.channels);
      const vts = await db.select().from(schema.vtubers);
      // The streamer's own names, for game identification: a title's
      // 【own name】 channel tag must never be read as a game.
      const selfNamesByVtuber = new Map(vts.map((v) => [v.id, [v.name, v.nameAlt]]));
      // ASMR-roster residency per vtuber (her verified tags carry
      // ASMR) — read ONLY by the Bilibili euphemism layer, where a
      // resident's soft title markers weigh more than a stranger's
      // (see isBilibiliEuphemisticAsmr). Session判定 on the other
      // platforms never looks at identity, as before.
      const asmrResidentByVtuber = new Map(
        vts.map((v) => [
          v.id,
          (v.tags ?? "").split(",").map((t) => t.trim()).includes("ASMR"),
        ]),
      );
      const now = Date.now();
      let live = 0;
      let unknown = 0;
      // Bilibili rate-limits bursts; run checks in small sequential batches.
      const results: { ch: ChannelRow; st: StatusUpdate }[] = [];
      const queue = [...chans];
      const workers = Array.from({ length: 3 }, async () => {
        for (;;) {
          const ch = queue.shift();
          if (!ch) return;
          let st: StatusUpdate;
          try {
            const selfNames = selfNamesByVtuber.get(ch.vtuberId) ?? [];
            if (ch.platform === "bilibili") {
              st = await checkBilibili(ctx, ch, selfNames, asmrResidentByVtuber.get(ch.vtuberId) ?? false);
            }
            else if (ch.platform === "youtube") st = await checkYoutube(ctx, ch, selfNames);
            else st = await checkTwitch(ctx, ch, selfNames);
          } catch {
            st = UNKNOWN;
          }
          results.push({ ch, st });
        }
      });
      await Promise.all(workers);

      for (const { ch, st } of results) {
        if (st.state === "live") live += 1;
        if (st.state === "unknown") unknown += 1;
        await db
          .insert(schema.liveStatus)
          .values({
            channelId: ch.id, state: st.state, title: st.title, game: st.game,
            isAsmr: st.isAsmr ? 1 : 0,
            viewers: st.viewers, popularity: st.popularity, thumbKey: st.thumbKey, screenshotUrl: st.screenshotUrl,
            liveUrl: st.liveUrl,
            appLiveUrl: st.appLiveUrl, startedAt: st.startedAt, updatedAt: now,
          })
          .onConflictDoUpdate({
            target: schema.liveStatus.channelId,
            set: {
              state: st.state, title: st.title, game: st.game, isAsmr: st.isAsmr ? 1 : 0,
              viewers: st.viewers, popularity: st.popularity,
              thumbKey: st.thumbKey, screenshotUrl: st.screenshotUrl, liveUrl: st.liveUrl, appLiveUrl: st.appLiveUrl,
              startedAt: st.startedAt, updatedAt: now,
            },
          });
      }
      await db
        .insert(schema.meta)
        .values({ key: "last_refresh", value: String(now) })
        .onConflictDoUpdate({ target: schema.meta.key, set: { value: String(now) } });
      ctx.invalidateQueries();
      return { checked: chans.length, live, unknown, refreshedAt: now };
    },
  }),
} satisfies ActionsModule;
