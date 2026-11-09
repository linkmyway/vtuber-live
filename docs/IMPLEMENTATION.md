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

- A scheduled refresh (every 30 minutes) re-checks every channel
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
