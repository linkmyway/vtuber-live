# VTuber Live — a multi-platform live-status board

## 中文说明

女性人格 VTuber 实时监控看板的实现方法开源版：上百位主播、三平台、按社团分组的实时状态墙是怎么做的。

- 实现文档：[`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md)（双形态直播检测、三平台预览策略、名册策展与链接审计、统一筛选谓词）
- 参考代码：[`reference/`](reference/)（YouTube 双形态解析器、全板统一筛选与热门游戏聚合；`npm install && npm run typecheck` 可直接验）
- 本仓只有方法与脱敏说明；真实名册与直播数据不在本仓（存放在私有存档仓）

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
