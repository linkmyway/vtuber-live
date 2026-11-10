/**
 * Board model: platform detectors, aggregation, and the ONE filter
 * predicate shared by the roster and the live stage.
 *
 * Two rules do the heavy lifting:
 * - Live state lives on the CHANNEL, never on the person.
 * - Platform filtering is by channel: a person whose YouTube channel is
 *   idle but who is live on Twitch appears under Twitch only. (An early
 *   version filtered only the roster and not the stage, which read as
 *   "the filters are lying". One predicate, everywhere, is the fix.)
 */

import type { LiveResult, LiveState } from "./youtube-live-detect";

export type Platform = "youtube" | "twitch" | "bilibili";

export interface Channel {
  id: number;
  platform: Platform;
  handle: string;
  url: string;
  state: LiveState;
  liveTitle: string;
  liveUrl: string;
  /** Platform preview image; semantics differ per platform and the UI
   *  labels them honestly (Twitch/Bilibili: real frame; YouTube: cover). */
  screenshotUrl: string;
  viewers: number | null;
  game: string;
  startedAt: string | null;
}

export interface Vtuber {
  slug: string;
  name: string;
  nameAlt: string;
  agency: string; // "个人势" (independent) is a first-class agency value
  region: "jp" | "en" | "cn" | "tw";
  tags: string[];
  hidden: boolean; // owner's screening flag; the row is never deleted
  channels: Channel[];
}

/** One detector per platform; each returns the shared LiveResult shape. */
export interface PlatformDetector {
  platform: Platform;
  detect(channel: Channel): Promise<LiveResult>;
}

export async function refreshBoard(
  roster: Vtuber[],
  detectors: Record<Platform, PlatformDetector>,
): Promise<{ liveCount: number }> {
  let liveCount = 0;
  for (const person of roster) {
    for (const channel of person.channels) {
      const r = await detectors[channel.platform].detect(channel);
      // `unknown` never overwrites a known state with a guess: keep the
      // previous state and let the next cycle retry.
      if (r.state !== "unknown") {
        channel.state = r.state;
        channel.liveTitle = r.title ?? "";
        channel.viewers = r.viewers ?? null;
        if (r.coverUrl) channel.screenshotUrl = r.coverUrl;
      }
      if (channel.state === "live" || channel.state === "chat") liveCount++;
    }
  }
  return { liveCount };
}

export interface BoardFilter {
  query?: string;
  platform?: Platform;
  agency?: string;
  game?: string;
  categoryTag?: string; // e.g. an ASMR-only view
  liveOnly?: boolean;
}

const isLive = (c: Channel) => c.state === "live" || c.state === "chat";

/** The single predicate. Roster grid and ON AIR stage both call this.
 *
 * @example
 * matchesFilter(person, { platform: "twitch" })
 * // → true only if one of the person's TWITCH channels satisfies the
 * //   rest of the filter; her idle YouTube channel cannot carry her in.
 * matchesFilter(hiddenPerson, {})
 * // → false — hidden members never match, whatever the filter.
 */
export function matchesFilter(person: Vtuber, f: BoardFilter): boolean {
  if (person.hidden) return false;
  if (f.agency && person.agency !== f.agency) return false;
  if (f.categoryTag && !person.tags.includes(f.categoryTag)) return false;
  if (
    f.query &&
    !`${person.name} ${person.nameAlt} ${person.agency}`
      .toLowerCase()
      .includes(f.query.toLowerCase())
  ) {
    return false;
  }
  // Channel-scoped dimensions: at least one channel must satisfy all of
  // them together (platform ∧ game ∧ live), so a person never matches
  // "YouTube" through an idle YouTube channel while live on Twitch.
  const channelOk = (c: Channel) =>
    (!f.platform || c.platform === f.platform) &&
    (!f.game || c.game === f.game) &&
    (!f.liveOnly || isLive(c));
  return person.channels.some(channelOk);
}

/** Aggregated "hot games" for the board header.
 *
 * @example
 * hotGames(roster)
 * // → [ { name: "VALORANT", streamers: ["…", "…"], viewers: 2995 }, … ]
 * //   sorted by total viewers desc; ASMR sessions contribute no game.
 */
export function hotGames(roster: Vtuber[]): { name: string; streamers: string[]; viewers: number }[] {
  const byGame = new Map<string, { streamers: string[]; viewers: number }>();
  for (const p of roster) {
    for (const c of p.channels) {
      if (!isLive(c) || !c.game) continue;
      const g = byGame.get(c.game) ?? { streamers: [], viewers: 0 };
      g.streamers.push(p.name);
      g.viewers += c.viewers ?? 0;
      byGame.set(c.game, g);
    }
  }
  return [...byGame.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.viewers - a.viewers);
}
