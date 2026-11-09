/**
 * YouTube live detection with dual-form parsing.
 *
 * A channel's live page, fetched logged-out, comes back in one of two
 * forms:
 *
 *  1. Normal form — the embedded player response (ytInitialPlayerResponse)
 *     is present and carries the live video id, title and viewer count.
 *
 *  2. Bot-check form (the common case — roughly 3 of 4 fetches) — the
 *     player data is stripped and its fields are empty. A naive parser
 *     reads "no fields" as "not live" and silently marks most of the
 *     board offline. That was the single biggest missed-live bug this
 *     design fixes.
 *
 * In the check form, the viewer-count and like anchors elsewhere in the
 * page markup remain intact, so detection falls back to them. When
 * neither form yields anchors the result is `unknown` — a parse failure
 * must NEVER be persisted as `offline`.
 */

export type LiveState = "live" | "chat" | "offline" | "unknown";

export interface LiveResult {
  state: LiveState;
  videoId?: string;
  title?: string;
  viewers?: number;
  /** YouTube offers no true live frame above 159×90; the card image is
   *  the stream cover and must be labelled as such. */
  coverUrl?: string;
}

const VIDEO_ID_RE = /"videoId":"([\w-]{11})"/;
const LIVE_NOW_RE = /"isLiveNow":true/;
const VIEWERS_RE = /"viewCountText":\{"simpleText":"([\d,.]+)\s*(?:watching|人視聴中|正在观看)/;
const LIKE_ANCHOR_RE = /"likeButtonViewModel"|"likeCount":"?([\d,]+)/;
const TITLE_RE = /"title":\{"simpleText":"([^"]+)"/;

function parseViewers(html: string): number | undefined {
  const m = html.match(VIEWERS_RE);
  if (!m) return undefined;
  const n = Number(m[1].replace(/[,.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Form 1: the embedded player response. */
function parsePlayerForm(html: string): LiveResult | null {
  const start = html.indexOf("ytInitialPlayerResponse");
  if (start < 0) return null;
  const slice = html.slice(start, start + 200_000);
  if (!LIVE_NOW_RE.test(slice)) {
    // A fully-formed player response that says "not live" is a real
    // offline signal — unlike missing data.
    return slice.includes('"status":"ok"') || slice.includes('"playabilityStatus"')
      ? { state: "offline" }
      : null;
  }
  const videoId = slice.match(VIDEO_ID_RE)?.[1];
  if (!videoId) return null;
  return {
    state: "live",
    videoId,
    title: slice.match(TITLE_RE)?.[1],
    viewers: parseViewers(slice),
    coverUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

/** Form 2: bot-check page — decide from the surviving anchors. */
function parseCheckForm(html: string): LiveResult | null {
  const viewers = parseViewers(html);
  const hasLikeAnchor = LIKE_ANCHOR_RE.test(html);
  const videoId = html.match(VIDEO_ID_RE)?.[1];
  if (viewers !== undefined && videoId) {
    return {
      state: "live",
      videoId,
      viewers,
      title: html.match(TITLE_RE)?.[1],
      coverUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }
  // A free-chat room shows anchors but no viewer stream: state "chat".
  if (hasLikeAnchor && videoId && /free ?chat|フリーチャット/i.test(html)) {
    return { state: "chat", videoId, coverUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` };
  }
  return null; // no anchors → caller records `unknown`, never `offline`
}

export async function detectYouTubeLive(
  channelHandle: string,
  fetchText: (url: string) => Promise<string>,
): Promise<LiveResult> {
  const html = await fetchText(`https://www.youtube.com/${channelHandle}/live`);
  return parsePlayerForm(html) ?? parseCheckForm(html) ?? { state: "unknown" };
}
