**English** | [简体中文](README.zh-CN.md)

# VTuber Live — a multi-platform live-status board

## Screenshots

Live UI captures (2026-11-09; the live status shown is a snapshot of
that moment):

![Desktop](docs/images/desktop.png)

![Mobile](docs/images/mobile.png)

A monitoring board for VTubers across YouTube, Twitch and Bilibili:
a large curated roster grouped by agency (independent streamers are a
first-class group), an ON AIR strip for whoever is live right now, and
one shared filter model (search / platform / agency / game / category)
that applies identically to the roster and the live stage.

This repository open-sources the **implementation method**. The owner's
roster and screening state live in a private archive; the detection
techniques, preview strategy and curation discipline described here are
the reusable part.

## The interesting problems

**Live detection is adversarial.** YouTube channel live pages, fetched
logged-out, frequently return a bot-check variant with the player data
stripped out. A naive parser reads "no fields" as "not live" and
silently kills most of the board. The fix is dual-form parsing: use
player data when present; in the check variant, fall back to the
viewer-count / like anchors that remain intact in the page; when
neither form yields anchors, record *unknown* and retry — a parse
failure must never be written down as "offline".

**Previews differ per platform, and are labelled honestly.**
Embedded playback failed on the owner's real device, so cards use
preview imagery instead: Twitch serves real 1280×720 frames
(auto-refreshed); YouTube offers no true live frame above 159×90, so
cards show the current stream cover, labelled as a cover, not a live
frame; Bilibili exposes a room keyframe when live.

**Curation is an audit, not a vibe.** Roster growth is done by
cross-checking each agency's official member list person by person
(official count / rostered / added / skipped-with-reason), and channel
links are audited by loading each one and matching channel name,
handle and avatar against the card — an audit like this caught
impersonator and placeholder channels that a link-checker would have
passed.

See [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) for the data
model, refresh cycle, filter semantics and mobile scrolling lessons.

## Reference code

The [`reference/`](reference/) folder contains a reference
implementation of the core mechanisms, written from the documented
method (the production app runs on a hosted platform whose source is
not exportable).
