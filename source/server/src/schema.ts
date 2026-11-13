// VTuber 监控台 schema: curated roster (vtubers + channels) and the
// per-channel live status refreshed every 30 minutes.

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vtubers = sqliteTable("vtubers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameAlt: text("name_alt").notNull().default(""),
  region: text("region", { enum: ["jp", "en", "cn", "tw"] }).notNull(),
  agency: text("agency").notNull().default(""),
  reason: text("reason").notNull().default(""),
  tags: text("tags").notNull().default(""),
  sortRank: integer("sort_rank").notNull().default(100),
  // 1 when the user has screened this person out from the board (restorable).
  hidden: integer("hidden").notNull().default(0),
  // Her main streaming platform ("" until populateRoster fills it).
  // When she is live on several platforms at once, ON AIR pushes only
  // this platform's stream; a stream on any other platform is pushed
  // only when the primary one is not live. Single-platform members
  // simply carry their one platform.
  primaryPlatform: text("primary_platform", {
    enum: ["youtube", "twitch", "bilibili"],
  }),
});

export const channels = sqliteTable("channels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vtuberId: integer("vtuber_id").notNull(),
  platform: text("platform", {
    enum: ["youtube", "twitch", "bilibili"],
  }).notNull(),
  // YouTube: UC channel id. Twitch: login. Bilibili: mid (uid).
  accountId: text("account_id").notNull(),
  roomId: text("room_id").notNull().default(""),
  handle: text("handle").notNull().default(""),
  url: text("url").notNull(),
  appUrl: text("app_url").notNull().default(""),
  followersLabel: text("followers_label").notNull().default(""),
});

export const liveStatus = sqliteTable("live_status", {
  channelId: integer("channel_id").primaryKey(),
  state: text("state", { enum: ["live", "chat", "offline", "unknown"] })
    .notNull()
    .default("unknown"),
  title: text("title").notNull().default(""),
  game: text("game").notNull().default(""),
  // 1 when THIS session itself is an ASMR session (see isAsmrTitle /
  // the platform-native checks in actions.ts) — a per-session fact,
  // unrelated to whether the streamer is on the resident ASMR roster
  // (that lives in vtubers.tags). An ASMR session always has game "".
  isAsmr: integer("is_asmr").notNull().default(0),
  // Real concurrent viewers — the ONLY number allowed into cross-
  // platform ranking and hot-games totals. YouTube (watching now) and
  // Twitch (viewer count) report true concurrents; Bilibili's comes
  // from the online gold rank's `onlineNum`, which bilibili-API-
  // collect documents as 在线观众数量 (measured live 2026-11-11 on
  // every roster Bilibili room — see checkBilibili in actions.ts).
  // A live Bilibili row leaves this null only when that room's
  // gold-rank call failed; the client then orders her by the
  // popularity/K sort-only fallback (never displayed, never summed).
  viewers: integer("viewers"),
  // Bilibili's 人气值 (popularity score): getRoomInfoOld's `online`,
  // which bilibili-API-collect documents as 直播间人气 and which
  // get_info returns byte-identical for the same room at the same
  // moment (measured 2026-11-11: room 5050 → 1,411,186 from both).
  // It is a weighted heat score (danmaku / gifts / watch time), NOT a
  // concurrent count, so it lives in its own column: displayed only
  // with the 人气值 label alongside the real 同接， and never summed
  // or ranked as if it were viewers.
  popularity: integer("popularity"),
  thumbKey: text("thumb_key").notNull().default(""),
  // Direct URL of the platform's live preview frame (YouTube
  // hqdefault_live still, Twitch previews-ttv frame, Bilibili room
  // keyframe). The client polls this URL itself for real-time
  // screenshots; empty when the platform gave no live frame, in which
  // case the stored cover (thumbKey) is shown and labelled as a cover.
  screenshotUrl: text("screenshot_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  appLiveUrl: text("app_live_url").notNull().default(""),
  startedAt: integer("started_at"),
  updatedAt: integer("updated_at").notNull().default(0),
});

export const meta = sqliteTable("meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});
