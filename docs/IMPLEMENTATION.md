# Implementation method

## Data model

```
vtubers  (id, name, nameAlt, slug, agency, region, tags[], reason, hidden)
channels (id, vtuberId, platform, handle, url, appUrl,
          state, liveTitle, liveUrl, screenshotUrl, thumbUrl,
          viewers, game, startedAt)
```

- One person, many channels. Live state lives on the channel, never on
  the person.
- `hidden` is the owner's screening flag: the roster row is never
  deleted, only hidden — the board's philosophy is "roster everything
  verifiable, let the owner filter".

## Refresh cycle

- A scheduled refresh (every 15 minutes; 30 until 2026-11-10) re-checks every channel
  against the platforms' public endpoints and stores the result; the
  page also exposes a manual refresh.
- The board read is a single aggregate: roster + per-channel state +
  an aggregated "hot games" list (game → streamers, summed viewers).

## YouTube live detection (dual-form)

1. Fetch the channel's live page logged-out.
2. Normal form: read the embedded player data (live video id, title,
   viewer count).
3. Bot-check form (the common case, roughly 3 of 4 fetches): player
   data is stripped; use the viewer-count and like anchors that remain
   in the page markup to decide "live" and recover the video id.
4. No anchors in either form → state `unknown`, retried next cycle.
   Never persist a parse failure as `offline`.

Twitch is checked against its public stream endpoints; Bilibili
against its room API (live status + keyframe).

## Preview strategy

| Platform | Card image | Honesty label |
| --- | --- | --- |
| Twitch | Real stream frame, 1280×720, refreshed ~45 s | live frame |
| YouTube | Current stream cover (`maxresdefault`) | "stream cover — not a live frame" |
| Bilibili | Room keyframe while live | live frame |

Rationale: a sharp, correctly labelled cover beats a 159×90 blur
masquerading as a live frame.

## Filter semantics

- Five dimensions (search, platform, agency, game, category) share one
  predicate and apply to roster and live stage simultaneously.
- Platform filters by **channel**, not by person: a streamer whose
  YouTube channel is idle but who is live on Twitch appears under
  Twitch only.
- A previous version filtered only the roster and not the stage, which
  read as "the filters are lying" — one predicate, everywhere, is the
  fix.

## Mobile scrolling lessons

- A collapsing sticky header that changes document height mid-scroll
  makes the page jump (the browser keeps re-anchoring). The ON AIR
  strip is now plain flow content that scrolls away naturally; only a
  constant-height filter bar is sticky.
- Header height must never be driven by per-frame measurement during
  scroll.

## Roster curation

- Growth by official member-list reconciliation, with a written ledger
  per agency (official / rostered / added / not-added-with-reason).
- Only verifiable, currently active members are added; gaps are
  reported, not padded.
- Link audits load every channel and match name + handle + avatar to
  the card; wrong links are replaced and listed individually.

## Features and implementation, in detail

Feature by feature: what it does, how it is built, and where its
edges are. Where this section and earlier summaries differ, this
section governs.

### Roster and grouping

- What: a large roster grouped by agency, with independent streamers
  as a first-class group; one person can hold channels on several
  platforms.
- How: two tables — people and channels. Live state lives on the
  channel, never on the person (a person idle on YouTube while live
  on Twitch is the normal case; state on the person would misjudge
  it). Bulk roster intake is idempotent and non-overwriting, so
  curated fields and the owner's screening state survive re-imports.
  Small agencies are padded only with verifiable, currently active
  members — never with graduated or unverifiable names.
- Edges: growth is by official-list reconciliation (below), never by
  recollection.

### Live detection

- What: every channel is re-checked on a 15-minute cadence and lands
  in one of three states — live, offline, unknown — with title,
  viewers, game, start time and room URL.
- How: YouTube uses dual-form parsing (above). Twitch is read from
  its public endpoints (state + preview frame URL); Bilibili from
  its room API (state, room id, keyframe). Results are written back
  to the channel rows; the board read is a pure aggregate and never
  fetches live.
- Edges: **a parse failure is never persisted as "offline"** — the
  board's most expensive lesson: bot-check pages once silently
  blacked out most of it. The 15-minute cadence (raised from 30)
  slightly increases the check-page rate; the unknown-and-retry
  semantics absorb that instead of brute-forcing.

### Game identification and hot games

- What: each live session carries a game; the board header aggregates
  "hot games" (game → summed live viewers).
- How: **identification is per session, never per streamer** — the
  same person games one day and does ASMR the next, and the label
  follows the session. Game names are normalised through an alias
  dictionary (abbreviations, alternate and multi-language names map
  to one canonical name) before aggregation by summed viewers.
- Edges: evidence is the session's own title/platform game field;
  when it doesn't settle the game, no label is attached.

### ON AIR strip and stage

- What: a strip at the top gathering whoever is live right now.
- How: the strip and the roster share the same filter predicate and
  the same state data. **Dual-platform members appear via their
  primary platform only**: each multi-channel member has a verified
  primary platform; the stage shows that feed, and the secondary
  route is merely noted on the roster card — showing a person twice
  would corrupt "who is live now". Primary is decided by where the
  person actually mainstreams, not by channel registration order.
- Edges: the strip is not sticky (see the mobile section): it
  scrolls away naturally.

### The five-dimension filter (one predicate)

- What: search, platform, agency, game and category (e.g. ASMR)
  apply to roster and stage simultaneously.
- How: there is exactly **one predicate function** in the codebase
  and both surfaces call it — an earlier version filtered only the
  roster, which read as "the filters are lying". The platform
  dimension matches by **channel**: a person qualifies only if one
  of their channels *on that platform* satisfies the rest of the
  filter; an idle channel elsewhere can't carry them in. The filter
  panel carries a "hidden · N" shortcut for reviewing screened-out
  members.
- Edges: the predicate reads stored state only and never triggers
  detection; an empty result stays empty — filters are never relaxed
  to fill the board.

### ASMR category

- What: ASMR content as a filterable category (Japanese and English
  circles only, by the owner's scoping).
- How: **judged per session, not per person** — when an ASMR
  streamer plays a game, that session files under the game; a real
  ASMR session takes no game label and enters the ASMR category. The
  resident list is evidence-audited: each candidate's actual session
  mix over ~90 days (ASMR share and frequency) decides residency,
  and an audit verdict can be overturned by the owner's first-hand
  data and corrected on the spot (it has happened: a wrongful
  removal restored the same day on hard streaming data). Bulk list
  imports are verified person by person against official channels;
  graduated or unverifiable names are skipped with per-person
  reasons.
- Edges: the list prefers a miss over a mislabel; one-off sessions
  don't make a resident.

### Card link buttons

- What: each roster card has a [Homepage] and a [Live room] button.
- How: **the homepage button is pinned to the primary platform**
  (the same verified decision as the stage rule), so it never lands
  on an idle secondary channel. Bilibili links are plain https
  universal links, never `bilibili://` deep links (dead in some
  environments). The live-room button follows the channel's current
  `liveUrl` from the latest detection round.
- Edges: button wording is specified separately from other in-app
  copy and managed as its own constant set.

### Hide, don't delete

- What: the owner screens the roster by hiding people.
- How: hiding sets a flag; **the row is never deleted**. The board
  read carries the state, the UI doesn't render hidden members, and
  the filter panel's hidden shortcut brings them back for review.
  Hidden state is curation data and rides the archive snapshots.
- Edges: the curator never pre-screens "who the owner might dislike"
  — the strategy is roster-everything-verifiable and let the owner
  filter.

### Refresh and freshness

- What: the board keeps itself current.
- How: a scheduled job runs the full re-check every 15 minutes; the
  page reads the latest round and shows its export time, and offers
  a manual refresh. Live state is point-in-time data — archive
  snapshots label the roster as the durable part and the state as a
  moment's reading, in the file header.
- Edges: some channels returning unknown in a round is normal and is
  kept as unknown; last round's "live" is never dressed up as this
  round's result.

### Curation and link audits

- What: the people are real and the links point at the right places.
- How: growth follows **official member-list reconciliation** — a
  written ledger per agency (official count / already rostered /
  added this round / not added, with per-person reasons). Link
  audits load every channel and match name + handle + avatar against
  the card; a full audit once caught impersonator, fan and
  placeholder channels among the links and replaced each with the
  verified one, on record.
- Edges: unverifiable means not added; when the owner's first-hand
  data overturns an audit conclusion, the record is corrected
  (see ASMR) rather than defended.

### Mobile scrolling and nav landing

- What: smooth scrolling and navigation that lands where it points.
- How: only the constant-height filter bar is sticky; any sticky
  element whose height changes mid-scroll is banned (it re-anchors
  the document and the page jumps). Nav landing uses one unified
  offset — measured bar height + 10px. The search input is 16px to
  stop iOS focus zoom, with a landing correction after focus.
- Edges: scroll behaviour is accepted on the owner's real device;
  probe screenshots are not a verdict.

## Sync note (2026-11-12, covering the 2026-11-11 Space changes)

- **Per-session ASMR detection**: a per-session flag (`live_status.is_asmr`) judges each stream on its own, separate from the per-person resident ASMR list. The detection chain is shared with game recognition: the platform's native category wins first, then strong title markers (ASMR, ear-cleaning / whisper terms, 3DIO / KU100, etc.); sleep-related words are weak markers and must pass a second check against game detection. Sessions judged ASMR get a distinct bright badge, and the ASMR view splits into "streaming ASMR now" and "live, but this session is not ASMR". A session with no marker at all is judged not-ASMR (no guessing without evidence).
- **Bilibili viewer metric**: the room-info `online` field is a popularity score, not a concurrent-viewer count. The real concurrent count comes from the online gold-rank endpoint's `onlineNum`, read only after the live status confirms the room is actually streaming (for idle / looping rooms the value is a stale leftover). The on-air board ranks all platforms by real concurrent counts; roster cards show both figures with separate labels while the main stage shows only the concurrent count. When `onlineNum` is unavailable, a popularity-divided-by-K estimate is used for sorting only — never displayed and never summed.
- **Auto-refresh**: every 15 minutes (changed from 30 minutes on 2026-11-10, page copy updated to match).
