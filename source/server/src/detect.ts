// VTuber 监控台 live-status detection — every platform check and every
// judgment rule refreshLive relies on: the per-platform fetchers
// (checkBilibili / checkYoutube / checkTwitch), the YouTube /live page
// parser, title folding, game identification, and the ASMR session
// rules (explicit markers, plus the Bilibili euphemism layer). Pure
// judgment over fetched pages: anything a source cannot prove comes
// back as state "unknown" — never a guess. The roster it checks lives
// in roster.ts; the actions that call these live in actions.ts.

import type { Ctx } from "@hatch/space-sdk";
import * as schema from "./schema";

// ---------------------------------------------------------------------------
// Live-status fetching
// ---------------------------------------------------------------------------

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export type StatusUpdate = {
  state: "live" | "chat" | "offline" | "unknown";
  title: string;
  game: string;
  // Whether THIS session is an ASMR session (platform-native category
  // first, then explicit title markers — see isAsmrTitle). Independent
  // of the streamer's resident ASMR roster tag: an ASMR streamer
  // playing a game has isAsmr false, a non-roster streamer doing an
  // ASMR session has it true. isAsmr sessions always carry game "".
  isAsmr: boolean;
  // Real concurrent viewers. YouTube reports watching-now, Twitch a
  // viewer count, and Bilibili — since 2026-11-11 — the onlineNum of
  // its gold-rank endpoint (documented as 在线观众数量; see
  // checkBilibili for the measured evidence). Bilibili ALSO reports
  // its 人气值 in `popularity`: that weighted heat score is a
  // different quantity and is never stored here. When the gold-rank
  // call fails for a room, viewers stays null and the client falls
  // back to ordering that room by popularity / K (sort-only, never
  // displayed as a headcount).
  viewers: number | null;
  popularity: number | null;
  thumbKey: string;
  screenshotUrl: string;
  liveUrl: string;
  appLiveUrl: string;
  startedAt: number | null;
};

export const UNKNOWN: StatusUpdate = {
  state: "unknown", title: "", game: "", isAsmr: false, viewers: null, popularity: null,
  thumbKey: "", screenshotUrl: "", liveUrl: "", appLiveUrl: "", startedAt: null,
};
const OFFLINE: StatusUpdate = { ...UNKNOWN, state: "offline" };

// Bilibili popularity → concurrent-viewer conversion, SORT-ONLY.
// Calibrated 2026-11-11 from the six live roster rooms measured
// against the gold rank's onlineNum (see checkBilibili): ratios
// 人气值/onlineNum were 贝拉 61.6, 勾檀 40.4, 永雏塔菲 105.7,
// 真红莉爱 105.9, 桃井月月 196.4, 呜米 267.9 (event-inflated
// outlier) — median ≈ 106. The client carries the same constant
// (BILI_POP_PER_ONLINE in App.tsx); the two must stay in sync. The
// converted value only ever orders streams whose real onlineNum
// could not be fetched — it is never stored in `viewers`, never
// displayed as a headcount, never summed into game totals.
const BILI_POP_PER_ONLINE = 106;

type StatusLike = { viewers?: number | null; popularity?: number | null } | undefined;

/** Effective ON AIR sort key for one channel's stored status. */
export function onAirSortKeyOf(st: StatusLike, platform: string): number {
  if (st?.viewers != null) return st.viewers;
  if (platform === "bilibili" && st?.popularity != null) {
    return st.popularity / BILI_POP_PER_ONLINE;
  }
  return 0;
}

async function fetchText(url: string, headers: Record<string, string> = {}): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function storeThumb(ctx: Ctx, channelId: number, url: string, referer: string): Promise<string> {
  if (!url) return "";
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: referer } });
    if (!res.ok) return "";
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 800) return "";
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    if (!ct.startsWith("image/")) return "";
    const key = `thumb/${channelId}`;
    await ctx.blobs.put(key, buf, { contentType: ct });
    return key;
  } catch {
    return "";
  }
}

export type ChannelRow = typeof schema.channels.$inferSelect;

export async function checkBilibili(
  ctx: Ctx,
  ch: ChannelRow,
  selfNames: string[],
  isAsmrResident: boolean = false,
): Promise<StatusUpdate> {
  const raw = await fetchText(
    `https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=${encodeURIComponent(ch.accountId)}`,
    { Referer: "https://www.bilibili.com/" },
  );
  if (!raw) return UNKNOWN;
  type BiliRoom = { liveStatus?: number; title?: string; cover?: string; online?: number; roomid?: number };
  let data: BiliRoom | null = null;
  try {
    const parsed = JSON.parse(raw) as { data?: BiliRoom };
    data = parsed.data ?? null;
  } catch {
    return UNKNOWN;
  }
  if (!data) return UNKNOWN;
  if (data.liveStatus !== 1) return OFFLINE;
  const roomId = data.roomid ?? Number(ch.roomId || 0);
  let game = "";
  let keyframe = "";
  let areaName = "";
  let parentName = "";
  const infoRaw = await fetchText(
    `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`,
    { Referer: "https://www.bilibili.com/" },
  );
  if (infoRaw) {
    try {
      const info = JSON.parse(infoRaw) as {
        data?: {
          area_v2_name?: string;
          area_v2_parent_name?: string;
          area_name?: string;
          parent_area_name?: string;
          keyframe?: string;
        };
      };
      // The room area names a real game only under a game parent area
      // （单机游戏 / 网游 / 手游…): there area_name IS the game （影之刃零）.
      // Under the 虚拟主播 / 娱乐 parents the same field is a content
      // category （虚拟日常 / 虚拟Gamer — measured live on the board as
      // fake "games"), while the actual game sits in the room title
      // (【无畏契约】…) — so non-game parents go through title
      // identification instead, and game areas are canonicalised so
      // the same game merges with its YouTube/Twitch spelling.
      areaName = (info.data?.area_v2_name || info.data?.area_name || "").trim();
      parentName = (
        info.data?.area_v2_parent_name ||
        info.data?.parent_area_name ||
        ""
      ).trim();
      const NON_GAME_PARENT = /虚拟|娱乐|生活|电台|音乐|舞蹈/;
      const GENERIC_AREA = /^(游戏|单机游戏|网络游戏|网游|手游|手机游戏|主机游戏|电子竞技|其他游戏|虚拟主播|日常)$/;
      if (areaName && !GENERIC_AREA.test(areaName) && !NON_GAME_PARENT.test(parentName)) {
        game = canonicalGameName(areaName);
      } else {
        game = gameFromTitle(data.title ?? "", selfNames);
      }
      // keyframe is Bilibili's own system screenshot of the live room —
      // the platform refreshes it while the stream runs (empty when the
      // room is not actually sending frames). It is the real-time frame
      // source for Bilibili cards; the room cover below stays only as
      // the honestly-labelled fallback.
      keyframe = (info.data?.keyframe ?? "").trim();
    } catch {
      game = "";
    }
  }
  // Room-info unavailable or yielded no game area: the title is the
  // only remaining source — better a title-derived game than none.
  if (!game) game = gameFromTitle(data.title ?? "", selfNames);
  // Session ASMR判定 — Bilibili runs the shared chain first, then ONE
  // Bilibili-only extra layer (isBilibiliEuphemisticAsmr, defined next
  // to isAsmrTitle). Why Bilibili needs its own layer (user report
  // 2026-11-12, verified by sampling the same day — full corpus and
  // replay table in DATA-PLAN「2026-11-12 B站 ASMR 委婉标题针对性
  // 判定」): Bilibili restricts ASMR live content, so Bilibili
  // streamers do not dare put ASMR / 采耳-style explicit words in
  // LIVE titles (their投稿 may still carry them; live titles switch
  // to euphemisms — 3D麦 for the binaural mic, 酥麻 / 吐息 / 催眠 /
  // 掏耳 in simplified spellings the global STRONG list does not
  // carry, plus comfort flavour like 呼呼 / 舒缓 / 抚摸）. And the
  // platform gives no native rescue: the full live-area taxonomy
  // sampled 2026-11-12 contains NO ASMR area at all, so the
  // nativeAsmr check below can essentially never fire — ASMR rooms
  // park in 虚拟声优 (under 虚拟主播） or 聊天电台 instead. The shared
  // chain's verdicts are untouched (YouTube/Twitch never see the
  // extra layer); the layer only runs when the shared chain said
  // no, and the game veto inside it keeps game sessions game-first.
  const nativeAsmr =
    /asmr/i.test(foldTitle(areaName)) || /asmr/i.test(foldTitle(parentName));
  const isAsmr =
    nativeAsmr ||
    isAsmrTitle(data.title ?? "", selfNames) ||
    isBilibiliEuphemisticAsmr({
      title: data.title ?? "",
      game,
      areaName,
      parentName,
      isResident: isAsmrResident,
    });
  if (isAsmr) game = "";
  // Bilibili's real concurrent count lives in a different endpoint
  // than the room info: the online gold rank (高能榜). bilibili-API-
  // collect (docs/live/user.md, 查询直播间贡献榜） documents its
  // data.onlineNum as 「在线观众数量」, and a second source
  // (LovelyCat's B站API合集） lists this very endpoint under
  // 「获得直播间在线人数」. Measured live 2026-11-11 (~22:20–22:40
  // JST) on every roster Bilibili room, code=0 on all 16 rooms:
  //   贝拉    popularity 233,080 → onlineNum 3,781 (drifting
  //           3,712→3,808 across samples, tracking the stream)
  //   永雏塔菲 popularity 183,983 → onlineNum 1,740
  //   真红莉爱 popularity  75,650 → onlineNum   714
  //   勾檀    popularity  20,158 → onlineNum   499
  //   呜米    popularity 189,372 → onlineNum   707 (her 红包 event
  //           inflates the heat score, not the people)
  //   桃井月月 popularity   3,142 → onlineNum    16
  // onlineNum ≤ popularity for every live room, magnitudes match
  // real YouTube/Twitch concurrents, and live values drift second
  // to second. Offline / carousel rooms also return a stale-looking
  // onlineNum (向晚's carousel room sat frozen at 3,234), which is
  // why this call happens ONLY after liveStatus === 1 above — the
  // number is never read for a room that is not actually live.
  // When this call fails (non-zero code / missing field) viewers
  // stays null for THIS room only — never a whole-batch fallback —
  // and the client orders her by popularity / BILI_POP_PER_ONLINE
  // (a sort-only estimate, never displayed as a headcount).
  let onlineViewers: number | null = null;
  const goldRaw = await fetchText(
    `https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?roomId=${roomId}&ruid=${encodeURIComponent(ch.accountId)}&page=1&pageSize=1`,
    { Referer: "https://www.bilibili.com/" },
  );
  if (goldRaw) {
    try {
      const gold = JSON.parse(goldRaw) as {
        code?: number;
        data?: { onlineNum?: number };
      };
      const n = gold.data?.onlineNum;
      if (gold.code === 0 && typeof n === "number" && n > 0) {
        onlineViewers = n;
      }
    } catch {
      onlineViewers = null;
    }
  }
  const thumbKey = await storeThumb(ctx, ch.id, data.cover ?? "", "https://www.bilibili.com/");
  const liveUrl = `https://live.bilibili.com/${roomId}`;
  return {
    state: "live",
    title: data.title ?? "",
    game,
    isAsmr,
    // Bilibili's room-info `online` is NOT a concurrent-viewer count.
    // Evidence (measured 2026-11-11): bilibili-API-collect documents
    // that field as 「直播间人气」 (popularity); the room get_info
    // endpoint returns the byte-identical value for the same room at
    // the same moment (room 5050: 1,411,186 from both). It is a
    // weighted heat score (danmaku / gifts / watch time) — a top
    // Bilibili VTuber's daily stream shows millions, dwarfing every
    // real concurrent on the board — so it is stored as `popularity`
    // ONLY and never ranked as a headcount. The real concurrent
    // count is onlineViewers above (the gold rank's onlineNum),
    // which is what `viewers` carries and what ON AIR ranks by.
    viewers: onlineViewers,
    popularity: typeof data.online === "number" && data.online > 0 ? data.online : null,
    thumbKey,
    screenshotUrl: keyframe,
    liveUrl,
    // The App target is the LIVE ROOM's https universal link, never
    // her space page (user reports, 2026-11-10): the bilibili://live/
    // <roomId> custom scheme this used to store was silently swallowed
    // by the WebView — first on the roster cards, then on the main
    // stage (贝拉) — so the https room URL is stored instead; with the
    // Bilibili app installed the system routes it into the app's live
    // room, without it the web room page opens.
    appLiveUrl: liveUrl,
    startedAt: null,
  };
}

// Stylised Latin letters VTubers decorate titles with (small capitals and
// lookalikes) folded back to ASCII, so "ғʀᴇᴇ ᴄʜᴀᴛ" reads as "free chat".
const SMALL_CAPS: Record<string, string> = {
  ᴀ: "a", ʙ: "b", ᴄ: "c", ᴅ: "d", ᴇ: "e", ꜰ: "f", ɢ: "g", ʜ: "h", ɪ: "i",
  ᴊ: "j", ᴋ: "k", ʟ: "l", ᴍ: "m", ɴ: "n", ᴏ: "o", ᴘ: "p", ʀ: "r", ꜱ: "s",
  ᴛ: "t", ᴜ: "u", ᴠ: "v", ᴡ: "w", ʏ: "y", ᴢ: "z", ғ: "f",
};

function foldTitle(s: string): string {
  const nfkc = s.normalize("NFKC").toLowerCase();
  return [...nfkc].map((c) => SMALL_CAPS[c] ?? c).join("");
}

const CHAT_ROOM_RE =
  /free\s*chat|free\s*talk|フリーチャット|フリー\s*チャット|フリチャ|ふりーちゃっと|交流場|交流场|集會所|集会所|チャットルーム|chat\s?room/;

// ---------------------------------------------------------------------------
// Game identification (the 热播游戏 board + per-card game label + game filter
// all read live_status.game, so every platform writes ONE canonical name
// for the same game — Apex Legends streamed on YouTube as 【APEX】, on
// Twitch as "Apex Legends" and on Bilibili as a 无畏契约-style area must
// aggregate, not split into three board entries).
//
// Why this block exists (measured 2026-11-09, board snapshot + live page
// draws): YouTube game hits were 0/19 live channels. The old rule gated
// extraction on the page's "category":"Gaming" field, which lives in the
// player response — the bot-check page shape (the majority of draws)
// strips the player response entirely, so the gate silently failed
// almost every refresh. Bilibili wrote the room's area name verbatim,
// which for rooms parked in the 虚拟主播 parent area is a content
// category （虚拟日常 / 虚拟Gamer), not a game at all, while the real game
// sat in the room title (【无畏契约】…). The fix: a canonical alias
// dictionary matched against titles on every platform, bracket-segment
// extraction that no longer depends on the category field, and Bilibili
// area names trusted only when they name an actual game area.
// ---------------------------------------------------------------------------

// Canonical display name -> aliases as streamers/platforms write them
// (JP / EN / CN spellings, abbreviations). Aliases are folded with
// foldTitle before matching, so case and full/half width don't matter.
const GAME_ALIASES: [string, string[]][] = [
  ["Apex Legends", ["apex legends", "apex", "エーペックス", "エーペックスレジェンズ"]],
  ["VALORANT", ["valorant", "ヴァロラント", "バロラント", "无畏契约"]],
  ["Minecraft", ["minecraft", "マインクラフト", "マイクラ", "我的世界"]],
  ["League of Legends", ["league of legends", "リーグ・オブ・レジェンド", "リーグオブレジェンド", "英雄联盟"]],
  ["Genshin Impact", ["genshin impact", "genshin", "原神"]],
  ["Honkai: Star Rail", ["honkai: star rail", "honkai star rail", "崩壊：スターレイル", "崩壊スターレイル", "スターレイル", "崩坏：星穹铁道", "崩坏星穹铁道", "星穹铁道"]],
  ["Zenless Zone Zero", ["zenless zone zero", "ゼンレスゾーンゼロ", "ゼンゼロ", "绝区零"]],
  ["Wuthering Waves", ["wuthering waves", "鳴潮", "鸣潮"]],
  ["Blue Archive", ["blue archive", "ブルーアーカイブ", "ブルアカ", "碧蓝档案", "蔚蓝档案"]],
  ["Uma Musume", ["uma musume", "ウマ娘", "赛马娘"]],
  ["Project Sekai", ["プロジェクトセカイ", "プロセカ", "世界计划"]],
  ["Grand Theft Auto V", ["grand theft auto v", "grand theft auto", "gta v", "gtav", "gta5", "gta", "グランド・セフト・オート", "侠盗猎车"]],
  ["Among Us", ["among us", "アモングアス", "アモアス"]],
  ["GeoGuessr", ["geoguessr"]],
  ["Splatoon 3", ["splatoon 3", "スプラトゥーン3"]],
  ["Splatoon", ["splatoon", "スプラトゥーン"]],
  ["Monster Hunter Wilds", ["monster hunter wilds", "モンスターハンターワイルズ", "モンハンワイルズ"]],
  ["Monster Hunter", ["monster hunter", "モンスターハンター", "モンハン", "怪物猎人"]],
  ["The Legend of Zelda: Ocarina of Time", ["時のオカリナ", "ocarina of time"]],
  ["The Legend of Zelda", ["ゼルダの伝説", "the legend of zelda", "zelda", "塞尔达传说"]],
  ["Pokémon", ["ポケモン", "pokemon", "pokémon", "宝可梦", "精灵宝可梦"]],
  ["Super Smash Bros.", ["super smash bros", "スマブラ", "大乱闘スマッシュブラザーズ"]],
  ["Street Fighter 6", ["street fighter 6", "ストリートファイター6", "スト6", "街头霸王6"]],
  ["Tekken 8", ["tekken 8", "鉄拳8", "铁拳8"]],
  ["Mario Kart", ["mario kart", "マリオカート"]],
  ["Super Mario", ["super mario", "スーパーマリオ"]],
  ["Overwatch 2", ["overwatch 2", "overwatch", "オーバーウォッチ", "守望先锋"]],
  ["Fortnite", ["fortnite", "フォートナイト", "堡垒之夜"]],
  ["Dead by Daylight", ["dead by daylight", "デッドバイデイライト", "dbd", "黎明杀机"]],
  ["PUBG: Battlegrounds", ["pubg: battlegrounds", "pubg", "绝地求生"]],
  ["Final Fantasy XIV", ["final fantasy xiv", "ffxiv", "ff14", "ファイナルファンタジーxiv", "ファイナルファンタジー14"]],
  ["Elden Ring", ["elden ring", "エルデンリング", "艾尔登法环"]],
  ["Dark Souls", ["dark souls", "ダークソウル", "黑暗之魂"]],
  ["Lethal Company", ["lethal company", "リーサルカンパニー"]],
  ["Palworld", ["palworld", "パルワールド", "幻兽帕鲁"]],
  ["Phasmophobia", ["phasmophobia", "ファズモフォビア"]],
  ["Dragon Quest", ["dragon quest", "ドラゴンクエスト", "ドラクエ"]],
  ["Mahjong Soul", ["mahjong soul", "majsoul", "雀魂"]],
  ["Identity V", ["identity v", "第五人格", "アイデンティティv"]],
  ["Naraka: Bladepoint", ["naraka: bladepoint", "naraka", "永劫无间"]],
  ["Delta Force", ["delta force", "三角洲行动"]],
  ["Honor of Kings", ["honor of kings", "王者荣耀"]],
  ["Mabinogi Mobile", ["mabinogi mobile", "マビノギモバイル"]],
  ["Judge Eyes", ["judge eyes", "ジャッジアイズ"]],
  ["RATATAN", ["ratatan", "ラタタン"]],
  ["Suika Game", ["suika game", "スイカゲーム"]],
  ["The Exit 8", ["the exit 8", "8番出口"]],
  ["Fall Guys", ["fall guys", "フォールガイズ"]],
  ["Rocket League", ["rocket league", "ロケットリーグ"]],
  ["Hollow Knight", ["hollow knight", "ホロウナイト"]],
  ["Stardew Valley", ["stardew valley", "スターデューバレー", "星露谷物语"]],
  ["Terraria", ["terraria", "テラリア", "泰拉瑞亚"]],
];

// Folded alias -> canonical, longest alias first so a specific title
// (時のオカリナ) beats its franchise （ゼルダの伝説) when both appear.
const ALIAS_INDEX: { alias: string; canonical: string; latin: boolean }[] = GAME_ALIASES
  .flatMap(([canonical, aliases]) =>
    aliases.map((a) => {
      const alias = foldTitle(a);
      return { alias, canonical, latin: /^[\x00-\x7f]+$/.test(alias) };
    }),
  )
  .sort((x, y) => y.alias.length - x.alias.length);

/** Does this folded text name this alias? Latin aliases need word
 *  boundaries ("gta" inside another word is not GTA); CJK aliases match
 *  as plain substrings. */
function aliasHit(foldedText: string, entry: { alias: string; latin: boolean }): boolean {
  if (!entry.latin) return foldedText.includes(entry.alias);
  const esc = entry.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`).test(foldedText);
}

/** First canonical game named anywhere in a folded text, or "". */
function canonicalInText(foldedText: string): string {
  for (const entry of ALIAS_INDEX) {
    if (aliasHit(foldedText, entry)) return entry.canonical;
  }
  return "";
}

/** Canonical name when `raw` IS a known game/alias (Twitch category,
 *  Bilibili area name); otherwise the trimmed raw string unchanged. */
function canonicalGameName(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  const folded = foldTitle(t);
  for (const entry of ALIAS_INDEX) {
    if (folded === entry.alias) return entry.canonical;
  }
  return t;
}

// Bracket segments in stream titles: 【】 [] 〖〗 〚〛 『』 「」 《》 ꒰꒱.
// (〚〛 added 2026-11-10: 苺氷えな brackets her ASMR streams 〚ASMR〛 —
// a bracket style the extractor did not know is a segment it cannot see.)
const BRACKET_RE =
  /【([^】]{1,60})】|\[([^\]]{1,60})\]|〖([^〗]{1,60})〗|〚([^〛]{1,60})〛|『([^』]{1,60})』|「([^」]{1,60})」|《([^》]{1,60})》|꒰([^꒱]{1,60})꒱/g;

// Folded tokens that are stream-format labels, agency/channel tags or
// announcements — never a game, however they are bracketed.
const NON_GAME_TOKEN =
  /歌枠|雑談|告知|お知らせ|生放送|ライブ|live|3d|メン限|メンバー|同時視聴|作業|凸待ち|参加型|spoiler|ネタバレ|初見|耐久|お披露目|新衣装|生誕|記念|周年|第\d+回|カウントダウン|スケジュール|schedule|free\s?chat|free\s?talk|フリーチャット|フリチャ|交流場|交流场|集会所|集會所|チャットルーム|chat\s?room|asmr|カラオケ|karaoke|歌ってみた|振り返り|重大発表|発表会|休止|卒業|ラジオ|radio|ニュース|news|料理|カメラ|ギター|ピアノ|弾き語り|演奏|ホロライブ|にじさんじ|ぶいすぽ|hololive|nijisanji|vspo|regloss|flow\s?glow|dev_is|phase|ななしいんく|774|ネオポルテ|neo-porte|のりプロ|あおぎり|virtualive|vshojo|mythic/;

// Folded markers that declare THIS session's actual content is ASMR —
// the performed content itself (ear cleaning, sleep induction,
// binaural whispering…), not the streamer's identity. An "ASMR
// streamer" playing a game has none of these as her session content;
// an ASMR session carries several by construction (measured on
// 周防パトラ's live ASMR title: 耳つぼ・深部耳かき・睡眠誘導・囁き・
// 吐息 + an 【ASMR】 bracket — and the old logic still labelled that
// stream with a "game": her own channel tag 【周防パトラ】).
// Two tiers, split by the 2026-11-10 title replay (水宮枢 35 titles +
// 天結ひいろ 27 titles, 62/62 aligned — see DATA-PLAN):
// - STRONG markers name the performed ASMR content itself (the ASMR
//   label, ear cleaning in its かき/掻き/搔 spellings, whispering in
//   JP/CN/EN, the binaural mics 3DIO/KU100 by name, binaural itself,
//   ear blowing, chewing sounds). Any one of them makes the session
//   ASMR, full stop.
// - SLEEP markers （睡眠導入/誘導， 助眠， 安眠， 哄睡） only name the
//   session's PURPOSE — a chill rhythm-game stream can carry one
//   too (measured: 水宮枢's 【A Dance of Fire and Ice】睡眠導入
//   チルく音ゲーするよ〜 is a game stream, not performed ASMR). A
//   sleep marker therefore counts only when the title yields no
//   game candidate at all (see isAsmrTitle).
const ASMR_STRONG =
  /asmr|耳かき|耳掻き|耳舐め|耳つぼ|耳マッサージ|耳搔|耳掻|耳语|囁き|ささやき|whisper|3dio|ku100|バイノーラル|binaural|耳ふぅ|耳ふー|ear cleaning|ear blowing|咀嚼音/;
const ASMR_SLEEP = /睡眠誘導|睡眠導入|睡眠诱导|助眠|安眠|哄睡/;
// The game veto inside gameFromTitle keys off the STRONG tier only:
// a sleep-purpose game stream must still get its game name (the old
// single regex, which included the sleep words, silently emptied
// the game field of exactly those streams).
const ASMR_SESSION = ASMR_STRONG;

// A title that itself declares a talk / singing / radio format: any
// unbracketed "game" in it is the show's name, not a game being played
// (measured: 周央サンゴ's 【おつかれさんご】定期雑談， Aki's 深夜ラジオ
// segment). Known-alias hits still count — 【APEX】雑談しながら is a
// game stream with chat, not a talk show.
const NON_GAME_TITLE = /雑談|歌枠|カラオケ|karaoke|ラジオ|radio|相談室|相談会/;

/**
 * Identify the game THIS SESSION is playing, or "" when it plays none.
 * Identification looks only at the session's own signals — never at
 * who the streamer is (an ASMR streamer playing Zelda is playing
 * Zelda; the user's two symmetric rules, 2026-11-10). Priority:
 * platform-native category/area (handled by the callers) > an explicit
 * game marker in the title > none.
 *
 * Order: (1) a known alias inside a bracketed segment that carries no
 * ASMR marker of its own — the explicit game marker, and the ONLY path
 * that survives an ASMR session: 【原神】 on an ASMR streamer's title
 * is a game stream, but a game name appearing as flavour inside an
 * ASMR session (【ASMR】原神の音で耳かき, 【原神ASMR】…) is the ASMR
 * session's theme, not a game being played; (2) a raw bracketed
 * segment that is a plausible game title — never in an ASMR session,
 * never when the title declares a talk/singing/radio format (segments
 * are show names there), never the streamer's own channel tag
 * (【周防パトラ】 closes every one of her titles and was measured
 * reaching the hot-games board AS a "game" on her ASMR stream), never
 * a sentence-like flavour line; a "/" segment is a channel tag only
 * when one side names the streamer / a format / an agency — dual
 * JP/EN game titles （丁字路/FORK ROAD) are real games; (3) a known
 * alias anywhere in the unbracketed title (e.g. "THE IMPOSTOR IS
 * AMONG US") — also vetoed in an ASMR session. Deliberately no
 * dependence on the page's category field — see the block comment.
 */
function gameFromTitle(title: string, selfNames: string[] = []): string {
  if (!title) return "";
  const folded = foldTitle(title);
  const segments: string[] = [];
  for (const m of title.matchAll(BRACKET_RE)) {
    const seg = (m.slice(1).find((g) => g !== undefined) ?? "").trim();
    if (seg) segments.push(seg);
  }
  const foldedSegs = segments.map((s) => foldTitle(s.replace(/^#+/, "").trim()));
  const self = selfNames.map((n) => foldTitle(n).trim()).filter((n) => n.length >= 2);
  const isSelfTag = (f: string) => self.some((n) => f === n || f.startsWith(n));
  const asmrSession = ASMR_SESSION.test(folded);
  // (1) Explicit game marker first, across ALL segments: a raw segment
  // early in the title (a collab partner's name, a show title) must
  // not shadow a real game named in a later segment. A segment that
  // itself carries an ASMR marker is an ASMR label, not a game marker.
  for (let i = 0; i < segments.length; i += 1) {
    const f = foldedSegs[i] ?? "";
    if (ASMR_SESSION.test(f) || ASMR_SLEEP.test(f)) continue;
    const known = canonicalInText(f);
    if (known) return known;
  }
  // An ASMR session's game field stays empty: ASMR is a content
  // attribute, never a game, and flavour mentions don't promote it.
  if (asmrSession) return "";
  // (2) Raw segments — unless the title itself declares a non-game
  // format, in which case its segments are show names, not games.
  if (!NON_GAME_TITLE.test(folded)) {
    for (let i = 0; i < segments.length; i += 1) {
      const seg = segments[i] ?? "";
      const f = foldedSegs[i] ?? "";
      if (f.length < 2 || f.length > 44) continue;
      if (NON_GAME_TOKEN.test(f)) continue;
      // An ASMR / sleep-purpose segment is a content label, never a
      // game name — without this, 【睡眠導入】 alone would reach the
      // hot-games board AS a "game" and would also veto its own
      // session's ASMR判定 in isAsmrTitle.
      if (ASMR_STRONG.test(f) || ASMR_SLEEP.test(f)) continue;
      if (isSelfTag(f)) continue; // the streamer's own 【name】 channel tag
      if (/。|！|？|!$|\?$/.test(f)) continue; // a flavour sentence, not a title
      if (/^[#\s]*$/.test(f)) continue;
      if (/\d+\/\d+/.test(f)) continue; // a date/deadline ("11/10まで"), not a name
      if (f.includes("/")) {
        // Channel tag ("苺氷えな/個人Vtuber") vs dual-name game
        // （丁字路/FORK ROAD): a tag when either side names the
        // streamer, a format label or an agency.
        const sides = f.split("/").map((s) => s.trim());
        if (sides.some((s) => !s || NON_GAME_TOKEN.test(s) || isSelfTag(s))) continue;
      }
      return seg.replace(/^#+/, "").trim();
    }
  }
  return canonicalInText(folded);
}

/**
 * Whether THIS SESSION is an ASMR session, judged from its title
 * alone — the title half of the one content chain every platform
 * shares (the platform-native category/area is checked by each
 * platform's checker first and OR-ed with this). It looks only at
 * the session's own signals, never at who the streamer is: an ASMR
 * roster member playing ARK has no marker and returns false, a
 * non-roster member's 【ASMR / 黒3Dio】 title returns true.
 *
 * STRONG markers decide outright. SLEEP markers （睡眠導入 and kin)
 * name a purpose, not a performance, so they count only when the
 * title yields NO game candidate through the very same
 * gameFromTitle the board uses — 【A Dance of Fire and Ice】睡眠導入
 * チルく音ゲー (a game candidate exists) is a game stream, while a
 * 睡眠導入雑談 with no game anywhere in it is an ASMR session.
 * Validated by replay against 62 real titles （水宮枢 35 + 天結ひいろ
 * 27, fetched from their YouTube /streams pages + an ASMR search for
 * 水宮枢's member-trial ASMR streams): 62/62 aligned — see DATA-PLAN.
 */
function isAsmrTitle(title: string, selfNames: string[] = []): boolean {
  if (!title) return false;
  const folded = foldTitle(title);
  if (ASMR_STRONG.test(folded)) return true;
  if (ASMR_SLEEP.test(folded)) return gameFromTitle(title, selfNames) === "";
  return false;
}

// ---------------------------------------------------------------------------
// Bilibili-only euphemism layer (2026-11-12). Bilibili restricts ASMR
// live content, so its streamers title ASMR lives euphemistically.
// This layer runs ONLY inside checkBilibili, after the native-area
// check and the shared isAsmrTitle chain — YouTube/Twitch verdicts
// and the 62/62 replay behind them are untouched.
//
// Lexicon provenance (sampled 2026-11-12 from Bilibili's own public
// APIs; full corpus + per-word sources in DATA-PLAN「2026-11-12 B站
// ASMR 委婉标题针对性判定」): 桃井月月's投稿 corpus (the roster's
// Bilibili ASMR resident: 【ASMR/无损Hires】/【月月のASMR】 series,
// 38+ of her last 50 posts) and the 60 live rooms then streaming in
// the 虚拟声优 area + 60 in the two 电台 areas. Words the sampling
// did NOT produce were deliberately NOT added, however plausible:
// 晚安 (only seen inside a username), 白噪音， 雨声 (only 雨天，
// inside a 贴贴 title), 敲击， 摸摸头， 哄睡/陪睡 as title words
// （哄睡 already lives in the shared ASMR_SLEEP tier anyway).
//
// HARD euphemisms name the performed ear / binaural content itself,
// in the spellings Bilibili titles actually use — the global
// ASMR_STRONG list carries the Japanese/traditional forms （耳かき/
// 耳掻/囁き） but not these:
// - 掏耳 / 采耳： the standard simplified spellings of ear cleaning
//   (sampled: 【3D麦】顶级酥麻掏耳~~~; 月月 series 掏耳/采耳）.
// - 耳腔： ear-cavity cleaning as 月月 titles it （耳腔清洁计划，
//   耳腔挖掘）.
// - 酥麻： the tingle word （顶级酥麻掏耳 / 黏糊兔兔の酥麻吐息 /
//   妹妹の酥麻口技 — three different streamers in one area page).
// - 吐息： breath-play （月月 捂耳吐息； 酥麻吐息 above).
// - 催眠： sleep-induction ASMR's Bilibili name （掌管午休の催眠大师）.
// - 3d麦： "3D mic" — THE Bilibili way to say binaural without
//   writing ASMR or 3DIO; ~12 of the 60 sampled 虚拟声优 rooms wore
//   【3D麦】/【3d麦】 brackets, near-always over ear content.
// A hard hit decides on its own (like a STRONG hit), for resident
// and non-resident alike — subject to the game veto below.
const BILI_ASMR_HARD = /掏耳|采耳|耳腔|酥麻|吐息|催眠|3d麦/;
// SOFT euphemisms are comfort / sleep flavour — genuinely ambiguous
// (a cuddly talk stream can carry 贴贴）, so they never decide alone
// for a non-resident. Every word sampled from 月月's ASMR corpus:
// 呼呼 （左右交替呼呼 / 午间舒缓呼呼 / 呼呼助眠）, 舒缓 （午间舒缓
// 呼呼）, 抚摸 （黑洞+抚摸+气息 / 耳腔清洁计划…抚摸 / 对耳朵的抚摸
// 魔法）, 气息 （抚摸+气息 / 呼吸/气息/掏耳）, 鼻息 （贴近的鼻息 /
// 猫娘湿漉漉的鼻息）, 呼吸 （耳边呼吸）, 心跳 （听心跳安详入睡 /
// …/心跳/…), 心音 （生乳心音）, 贴贴 （雨天贴贴 / 午间贴贴时间 /
// 【3D麦双声道】贴贴）, 轻语 (3D麦 这轻语太顶了）, 安睡 （适合安睡
// 的一期）, 入睡 （安详入睡）, 睡前 (3D麦 / 睡前姐姐安慰）, 呼噜
// （耳边打呼噜 / …/呼噜/…). A bare 【3d】 bracket (no 麦） counts as
// ONE soft hit: 月月's live wore exactly that (【3d】午间舒缓呼呼）,
// but plain "3D" alone is also just a 3D stream elsewhere.
const BILI_ASMR_SOFT: string[] = [
  "呼呼", "舒缓", "抚摸", "气息", "鼻息", "呼吸", "心跳", "心音",
  "贴贴", "轻语", "安睡", "入睡", "睡前", "呼噜",
];

/**
 * The Bilibili euphemism layer: is THIS Bilibili session an ASMR
 * session whose title dares not say so? Layered against false
 * positives, in order:
 * 0. Game veto — a session whose game was identified (title or
 *    area) is a game session, full stop (same priority as the
 *    shared SLEEP tier's game check; 月月 playing 决战平安京 stays
 *    a game stream however cuddly the title sounds).
 * 1. A HARD euphemism hit decides outright.
 * 2. SOFT hits need company: an ASMR-roster resident needs just one
 *    (her identity is already verified — the layer only separates
 *    her ASMR lives from her game lives, and the veto above guards
 *    those); anyone else needs ≥2 distinct soft hits, or 1 soft hit
 *    plus an auxiliary area signal.
 * Auxiliary area signals (sampled, see DATA-PLAN): 虚拟声优 — the
 * voice area ASMR lives park in （月月's ASMR live ran there; the
 * area page is dense with 3D麦 ear streams) — and 聊天电台 under
 * the 电台 parent. NOT signals: the 电台 parent alone, 唱见电台
 * (30/30 sampled rooms were singing), 虚拟主播 parent alone, and
 * 虚拟声优 ALONE either (its page also carries plain talk/RP rooms
 * — 一骂就发抖 怎么办 has no marker and stays not-ASMR).
 */
function isBilibiliEuphemisticAsmr(args: {
  title: string;
  game: string;
  areaName: string;
  parentName: string;
  isResident: boolean;
}): boolean {
  if (!args.title) return false;
  if (args.game) return false; // (0) game priority, unchanged
  const folded = foldTitle(args.title);
  if (BILI_ASMR_HARD.test(folded)) return true; // (1) hard tier
  let softHits = 0;
  for (const w of BILI_ASMR_SOFT) {
    if (folded.includes(w)) softHits += 1;
  }
  // A bare 3d mention that is not already the hard 3d麦 counts once.
  if (/3d/.test(folded) && !/3d麦/.test(folded)) softHits += 1;
  if (softHits === 0) return false;
  if (args.isResident) return true; // (2) resident + any soft hit
  if (softHits >= 2) return true;
  const area = foldTitle(args.areaName);
  const parent = foldTitle(args.parentName);
  const auxArea = area.includes("虚拟声优") || (parent.includes("电台") && area.includes("聊天"));
  return auxArea; // (2) non-resident: 1 soft hit + auxiliary area
}

/** Width/height of a JPEG from its SOF0/SOF2 marker; null when unparseable. */
function jpegSize(buf: Uint8Array): { w: number; h: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1] ?? 0;
    if (marker === 0xc0 || marker === 0xc2) {
      const h = ((buf[i + 5] ?? 0) << 8) | (buf[i + 6] ?? 0);
      const w = ((buf[i + 7] ?? 0) << 8) | (buf[i + 8] ?? 0);
      return w > 0 && h > 0 ? { w, h } : null;
    }
    if (marker === 0xd9 || marker === 0xda) return null;
    const len = ((buf[i + 2] ?? 0) << 8) | (buf[i + 3] ?? 0);
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

async function fetchImageBytes(
  url: string,
  referer: string,
): Promise<{ buf: Uint8Array; contentType: string } | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: referer } });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 800) return null;
    return { buf, contentType: ct };
  } catch {
    return null;
  }
}

/**
 * A YouTube stream's CURRENT COVER at the highest tier that really
 * exists: maxresdefault (1280×720) when the stream has one, hqdefault
 * (480×360) otherwise. YouTube answers a missing maxresdefault with a
 * 120×90 placeholder at HTTP 200, so the tier is chosen by the decoded
 * pixel width, never by the status code. The chosen image is stored
 * into blobs (thumbKey) AND its source URL returned, so the client can
 * show the stored copy first and the CDN original as backup.
 *
 * Why a cover and not a live frame: an exhaustive re-check on
 * 2026-11-09 (two live streams) proved no ≥480-wide real frame exists
 * for YouTube live — the player response carries exactly ONE live
 * storyboard spec (159×90 tiles, signature-bound: every mutated size /
 * grid / segment returns 403, so server-side cropping cannot beat it
 * either), and every *_live still is byte-identical (md5) to the
 * static cover. Per the user's instruction the cards therefore show
 * the cover, labelled 直播封面. Twitch keeps its real 720p frames.
 */
async function storeYoutubeCover(
  ctx: Ctx,
  channelId: number,
  videoId: string,
): Promise<{ thumbKey: string; coverUrl: string }> {
  const referer = "https://www.youtube.com/";
  const maxUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const max = await fetchImageBytes(maxUrl, referer);
  if (max) {
    const size = jpegSize(max.buf);
    if (size && size.w >= 1000) {
      const key = `thumb/${channelId}`;
      await ctx.blobs.put(key, max.buf, { contentType: max.contentType });
      return { thumbKey: key, coverUrl: maxUrl };
    }
  }
  const hqUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const hq = await fetchImageBytes(hqUrl, referer);
  if (hq) {
    const key = `thumb/${channelId}`;
    await ctx.blobs.put(key, hq.buf, { contentType: hq.contentType });
    return { thumbKey: key, coverUrl: hqUrl };
  }
  if (max) {
    // Even the placeholder-width maxres beats nothing at all.
    const key = `thumb/${channelId}`;
    await ctx.blobs.put(key, max.buf, { contentType: max.contentType });
    return { thumbKey: key, coverUrl: maxUrl };
  }
  return { thumbKey: "", coverUrl: hqUrl };
}


/** Decode a JSON string literal captured from raw page JSON (escapes intact). */
function jsonString(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`) as string;
  } catch {
    return raw;
  }
}

type YtPage = {
  // The watch video /live resolved to, from whichever anchor the served
  // page variant carries; null when no anchor proved one.
  videoId: string | null;
  // True when /live resolved to the channel home page (canonical points
  // at the channel URL): the only page shape that proves "not live".
  resolvedToChannel: boolean;
  title: string;
  broadcasting: boolean;
  viewers: number | null;
};

/**
 * Parse a channel /live page in EITHER shape YouTube serves.
 *
 * Full shape: canonical watch URL + a player-response videoDetails with
 * isLive / isUpcoming. Bot-check shape (playabilityStatus LOGIN_REQUIRED,
 * "Sign in to confirm you're not a bot" — served intermittently to
 * unauthenticated datacenter fetches, measured 3 of 4 draws): the player
 * response is stripped (no videoDetails at all), the canonical link is
 * literally href="undefined" and <title> is empty — but ytInitialData is
 * complete, so the watch page still proves liveness through the main
 * video's view-count renderer ("N watching now" with an "isLive":true
 * sibling) and yields the videoId through the like-endpoint target and
 * the title through the player-overlay details renderer. The previous
 * parser bailed to OFFLINE the moment the canonical was missing, which
 * silently dropped every live YouTube channel whose refresh draw hit
 * the bot-check shape.
 */
function parseYoutubeLivePage(html: string): YtPage {
  const canonical = html.match(
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/,
  );
  let videoId: string | null = canonical?.[1] ?? null;
  const resolvedToChannel =
    !videoId &&
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/[\w-]{24}"/.test(html);

  // Player-response videoDetails (full shape only). The anchor includes
  // "videoId" so the player-overlay renderer of the same name in
  // ytInitialData is never mistaken for it.
  let vdLive = false;
  let vdUpcoming = false;
  let vdTitle = "";
  const vdIdx = html.indexOf('"videoDetails":{"videoId":"');
  if (vdIdx >= 0) {
    const vdId = html.slice(vdIdx, vdIdx + 80).match(/"videoId":"([\w-]{11})"/)?.[1];
    if (vdId && !videoId) videoId = vdId;
    const vdEnd = html.indexOf('"isLiveContent"', vdIdx);
    const vdSeg = html.slice(vdIdx, vdEnd > vdIdx ? vdEnd : vdIdx + 20000);
    vdLive = vdSeg.includes('"isLive":true');
    vdUpcoming = vdSeg.includes('"isUpcoming":true');
    const t = vdSeg.match(/"title":"((?:\\.|[^"\\])*)"/)?.[1];
    if (t) vdTitle = jsonString(t);
  }

  // The main video's own view-count renderer: "watching now" in either
  // text format. Only the first occurrence is the main video's; its
  // "isLive":true sibling sits in the same renderer block.
  // The patterns run page-wide (earlier renderer mentions are decoys
  // without a count); whichever block actually carries "watching now"
  // is the main video's, and its "isLive":true sibling follows it.
  let viewers: number | null = null;
  let vcLive = false;
  const vm =
    html.match(/"viewCount":\{"videoViewCountRenderer":\{"viewCount":\{"simpleText":"([\d,]+) watching now"\}/) ??
    html.match(/"viewCount":\{"videoViewCountRenderer":\{"viewCount":\{"runs":\[\{"text":"([\d,]+)"\},\{"text":" watching now"\}/);
  if (vm?.[1]) {
    const n = Number(vm[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n > 0) viewers = n;
    const after = html.slice((vm.index ?? 0) + vm[0].length, (vm.index ?? 0) + vm[0].length + 200);
    vcLive = after.includes('"isLive":true');
  }

  // Bot-check shape videoId: the like endpoints in ytInitialData target
  // the main video and nothing else on the page.
  if (!videoId) {
    videoId =
      html.match(/"likeEndpoint":\{"status":"LIKE","target":\{"videoId":"([\w-]{11})"/)?.[1] ??
      html.match(/"likeEndpoint":\{"status":"INDIFFERENT","target":\{"videoId":"([\w-]{11})"/)?.[1] ??
      null;
  }

  const decode = (s: string) =>
    s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  let title =
    decode((html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").replace(/\s*-\s*YouTube\s*$/, "").trim()) ||
    decode(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? "");
  if (!title) {
    // Bot-check shape: the player overlay carries the real title.
    const ov = html.match(
      /"playerOverlayVideoDetailsRenderer":\{"title":\{"simpleText":"((?:\\.|[^"\\])*)"/,
    )?.[1];
    if (ov) title = jsonString(ov);
  }
  if (!title) title = vdTitle;

  // On air = the player says live and not merely scheduled; in the
  // bot-check shape the view-count renderer's isLive + "watching now"
  // pair is the equivalent proof. An upcoming flag anywhere in the
  // player details vetoes both.
  const broadcasting = !vdUpcoming && (vdLive || (vcLive && viewers != null) || viewers != null);
  return { videoId, resolvedToChannel, title, broadcasting, viewers };
}

export async function checkYoutube(ctx: Ctx, ch: ChannelRow, selfNames: string[]): Promise<StatusUpdate> {
  // The page shape varies per request (see parseYoutubeLivePage), and a
  // shape with no usable anchor proves nothing — draw once more before
  // giving up, and only call a channel offline when a page actually
  // resolved to the channel home or proved a non-live watch page.
  let page: YtPage | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const fetched = await fetchText(`https://www.youtube.com/channel/${ch.accountId}/live`, {
      "Accept-Language": "en-US,en;q=0.9",
    });
    if (!fetched) return UNKNOWN;
    page = parseYoutubeLivePage(fetched);
    if (page.videoId || page.resolvedToChannel) break;
    page = null;
  }
  if (!page) return UNKNOWN;
  if (!page.videoId) return OFFLINE; // resolved to the channel home page
  const { videoId, title, broadcasting } = page;
  const viewers = broadcasting ? page.viewers : null;
  const liveUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // Permanent free-chat rooms are open around the clock (usually parked as
  // never-started "upcoming" streams) but are not a performance: they get
  // the "chat" state whether or not the room's stream has formally started.
  const isChatRoom = CHAT_ROOM_RE.test(foldTitle(title));
  // The picture for both chat rooms and on-air streams is the stream's
  // current COVER at its highest real tier (see storeYoutubeCover for
  // the proof that no ≥480-wide live frame exists on YouTube). The
  // *_live stills are the same bytes as the static covers, so the plain
  // cover URLs are used directly; the client labels this 直播封面.
  if (!broadcasting) {
    if (!isChatRoom) return OFFLINE;
    const cover = await storeYoutubeCover(ctx, ch.id, videoId);
    return {
      state: "chat", title, game: "", isAsmr: false, viewers: null, popularity: null, thumbKey: cover.thumbKey,
      screenshotUrl: cover.coverUrl,
      liveUrl, appLiveUrl: liveUrl, startedAt: null,
    };
  }
  // Game: YouTube exposes no structured game field to scrapers, so the
  // game is read from the title (bracket segments + the canonical alias
  // dictionary — see gameFromTitle). The previous rule gated this on the
  // page's "category":"Gaming" field, which lives in the player
  // response: the bot-check page shape strips that response entirely,
  // so the gate silently zeroed game detection on most refreshes
  // (measured 0/19 live YouTube channels identified). The title is
  // present in both page shapes, so detection no longer depends on it.
  // Session ASMR判定： YouTube exposes no native category to
  // scrapers, so the title is the only signal (isAsmrTitle — the
  // shared chain). An ASMR session's game stays empty.
  const isAsmr = isAsmrTitle(title, selfNames);
  const game = isAsmr ? "" : gameFromTitle(title, selfNames);
  // A free-chat room whose stream HAS started is still not a performance:
  // same "chat" treatment as the parked ones above. The picture is the
  // stream's current cover (highest real tier), stored + URL both set.
  const cover = await storeYoutubeCover(ctx, ch.id, videoId);
  return {
    state: isChatRoom ? "chat" : "live",
    title,
    game: isChatRoom ? "" : game,
    isAsmr: isChatRoom ? false : isAsmr,
    viewers: isChatRoom ? null : viewers,
    popularity: null,
    thumbKey: cover.thumbKey,
    screenshotUrl: cover.coverUrl,
    liveUrl,
    appLiveUrl: liveUrl,
    startedAt: null,
  };
}

export async function checkTwitch(ctx: Ctx, ch: ChannelRow, selfNames: string[] = []): Promise<StatusUpdate> {
  const login = ch.accountId;
  const vc = await fetchText(`https://decapi.me/twitch/viewercount/${encodeURIComponent(login)}`);
  if (!vc) return UNKNOWN;
  const text = vc.trim();
  if (/user not found|invalid|not exist/i.test(text)) return UNKNOWN;
  if (/offline/i.test(text)) return OFFLINE;
  // decapi answers a live channel with a bare viewer count. Anything else
  // (an error string, a rate-limit notice…) proves nothing — previously any
  // non-"offline" text fell through to "live", which put offline channels
  // on stage whenever decapi hiccuped.
  let viewers: number | null = null;
  const bare = text.match(/^([\d,]+)$/);
  if (bare?.[1]) {
    viewers = Number(bare[1].replace(/,/g, ""));
  } else {
    const worded = text.match(/([\d,]+)\s*(?:viewers|watching)/i);
    if (worded?.[1]) viewers = Number(worded[1].replace(/,/g, ""));
  }
  if (viewers === null || !Number.isFinite(viewers)) return UNKNOWN;
  const [gameRaw, titleRaw, uptimeRaw] = await Promise.all([
    fetchText(`https://decapi.me/twitch/game/${encodeURIComponent(login)}`),
    fetchText(`https://decapi.me/twitch/status/${encodeURIComponent(login)}`),
    fetchText(`https://decapi.me/twitch/uptime/${encodeURIComponent(login)}`),
  ]);
  // decapi returns Twitch's own category name — the platform-native
  // signal, top of the identification priority, but written in
  // Twitch's spelling; canonicalise so it merges with the same game
  // identified from YouTube/Bilibili titles on the hot-games board.
  // Twitch's non-game categories are content types, not games — the
  // same class of error as Bilibili's 虚拟日常 — so they store "".
  // ASMR heads the list (user rule, 2026-11-10): a session Twitch
  // itself categorises as ASMR has an empty game field, always; ASMR
  // is a content attribute, never a game on the board.
  const NON_GAME_CATEGORY =
    /^(just chatting|asmr|music|talk shows & podcasts|special events|science & technology|food & drink|travel & outdoors|art|pools, hot tubs, and beaches)$/i;
  const gameCategory = gameRaw && !/offline|not found/i.test(gameRaw) ? gameRaw.trim() : "";
  const title = titleRaw && !/offline|not found/i.test(titleRaw) ? titleRaw.trim() : "";
  // Session ASMR判定 (shared chain, native signal first): Twitch's
  // own category IS the platform-native signal — category "ASMR"
  // decides outright. Otherwise the title decides (isAsmrTitle),
  // exactly like YouTube. Either way an ASMR session's game field
  // stays empty, even when Twitch also reports a game category
  // (an "ASMR GAMING" hybrid is presented as the ASMR session it
  // declares itself to be).
  const isAsmr = /^asmr$/i.test(gameCategory) || isAsmrTitle(title, selfNames);
  const game = isAsmr
    ? ""
    : NON_GAME_CATEGORY.test(gameCategory)
      ? ""
      : canonicalGameName(gameCategory);
  let startedAt: number | null = null;
  if (uptimeRaw) {
    const h = uptimeRaw.match(/(\d+)\s*hour/);
    const m = uptimeRaw.match(/(\d+)\s*minute/);
    const sec = uptimeRaw.match(/(\d+)\s*second/);
    const secs = (h ? Number(h[1]) * 3600 : 0) + (m ? Number(m[1]) * 60 : 0) + (sec ? Number(sec[1]) : 0);
    if (secs > 0) startedAt = Date.now() - secs * 1000;
  }
  const liveUrl = `https://www.twitch.tv/${login}`;
  // Twitch's official live preview frame — Twitch re-renders it while
  // the channel is on air; the client polls it for real-time shots. A
  // copy is also stored as the channel thumb (like the YouTube *_live
  // still) so cards — the main stage first — can paint a real frame
  // from this artifact's own storage before/instead of reaching the
  // Twitch CDN, which some webviews cannot load at all. Size: the
  // previews-ttv URL takes arbitrary dimensions and serves REAL frames
  // at each (verified 2026-11-09 against a live channel: 640×360,
  // 1280×720, 1920×1080, 2560×1440 all returned distinct real frames).
  // 1280×720 is the working size — ≥2× a phone card's device pixels
  // without the 1080p file weight on a 45s poll.
  const previewUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${login}-1280x720.jpg`;
  const thumbKey = await storeThumb(ctx, ch.id, previewUrl, "https://www.twitch.tv/");
  return {
    state: "live",
    title,
    game,
    isAsmr,
    viewers,
    popularity: null,
    thumbKey,
    screenshotUrl: previewUrl,
    liveUrl,
    appLiveUrl: liveUrl,
    startedAt,
  };
}
