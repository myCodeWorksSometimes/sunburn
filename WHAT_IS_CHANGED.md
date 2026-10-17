# What is changed — cumulative iteration history

Keep this file cumulative. Each completed prompt adds a dated iteration with
implemented work, validation and remaining limits. Preserve prior entries.

## 17 October 2026 — campaign Act 1: Mara's stall and the Bridge Refuge

### Gameplay implemented (CAMPAIGN.md Scenes 4 and 6)

- **Mara's stall (market):** knocking draws Rowan to a shuttered stall. Mara
  explains the release is on the roof. Restoring the market fire brings back the
  remembered steps, which now lead onto the stall roof (unreachable otherwise).
  Holding E on the release opens the shutter permanently; Mara tells Rowan that
  Eli took the little ones toward the bridge, then leaves for the refuge. The
  market memory shows a recorded Eli at her card counter. Replaces the old
  "bell latch". Until Five-Hand exists, freeing Mara clears the market exit.
- **Bridge Refuge (near bank of the bridge):** Nia, Tomas and Mara by a spent
  household hearth (rest works, restoration doesn't), and the Old Road's barred
  west gate. Arriving plays the reunion and Nia's account once. Rowan must talk
  to Tomas (the hearth rule) before reaching the bridge fire. Repeat talk lines
  for each of them. The bridge fire moved right (x 5370) to make room.
- **New NPC type** with placeholder looks (tinted hero for Mara/Tomas, tinted Eli
  for Nia) and name labels. No new art generated.
- Objectives, journal entries and the region name ("Bridge Refuge") updated.
  Older saves migrate (open market ⇒ Mara freed; crossed bridge ⇒ refuge heard).

### Verification and limits

- `npm test` 15 passing (2 new). `npm run build` passed (`index-06UoOXUN.js`).
- Browser checks with real key events: knock → restore → climb → release →
  Mara freed → reunion → barrier → Tomas → rest → bridge crossing; save, reload
  and Continue at the refuge; restart clears the new flags. No console errors.
  Details in TEST-LOG.
- Not done: Five-Hand, Braced Shadow, gears, route reorder, three knocks. No
  uninterrupted new-game playthrough. NPCs are placeholders until sprites exist.

## 17 October 2026 — campaign story adopted (documentation only)

### What changed

- The user adopted the campaign draft as the target story and gameplay. Added it
  as `docs/competition/CAMPAIGN.md`, marked **Adopted**.
- Added two sections to CAMPAIGN.md:
  - **Integration with the current build:** maps every campaign place onto the
    existing 18,000px world regions (Market = `square`, Bridge Refuge = `bridge`
    west bank, Old Road = tower courtyard ↔ refuge, inspection window above
    `tower-court`, etc.), places Mara, Tomas and Nia, lists the new story flags,
    and describes the route-order change (Eli is found before the ember trip).
  - **MVP status:** scene-by-scene audit of what the build already does and what
    the MVP still needs.
- CANON.md: new top section with the adopted cast (Eli is now nine), Eli's
  evacuation story, shadows as corruption creatures (not villagers), the hearth
  rule learned from Tomas and Mara, the two bosses, the elite and the ending.
- NARRATIVE-SCRIPT.md and ACTS-IMPLEMENTATION.md: notes that CAMPAIGN.md
  supersedes their story beats. AGENTS.md: points agents at CAMPAIGN.md.
- STATUS.md: next action updated to the MVP gaps.

### Verification and limits

- Documentation only. No game code, assets or tests changed; nothing to build or
  run for this entry.
- The current build still plays the previous story order (ember before finding
  Eli). Mara, Tomas, Nia, Five-Hand, the refuge scene, the three-knocks scene and
  the Braced Shadow are not implemented yet, and the three new characters have no
  art.
- Committed and pushed together with the Act 1 iteration below.

## 17 October 2026 — complete original Acts 1–3 and Git collaboration handoff

### Gameplay implemented

- Restored the original chapter identity: Prologue (Home/Yard), Act 1 **The
  Ruined Village**, Act 2 **The Playground**, Act 3 **The Clock Tower**.
  The original repo only implemented Prologue/Act 1 and named Act 2; Act 3 is
  newly authored, completing the promised tower visit and brother-rescue story.
- Expanded the continuous outdoor world from 8200 to 18000px, five to eleven
  regions, while retaining movement, travelling camera and backtracking.
- Act 1: market-square restored-step bell latch opens the village road; retain
  broken bridge and add the original campfire's timed walkway to the playground.
- Act 2: physically moving restored swing platform; permanent return boardwalk;
  treehouse steps and unique drawing/ember-cup pickup; passage home; protected
  last hearth ember; return passage to playground; canal wheel and secured crossing.
- Act 3: three distinct-height bell relays break the Warden's wards; four-hit
  Bell Warden with clear anticipation and faster low-health lunges; final steps
  remain available after defeat; ember transfer protects resources/input; Eli
  remains after restoration fades and follows Rowan home through the old road.
- Added the actual home coda: both brothers return to the hearth; held interaction
  completes the story and reaches credits. The corrupted world remains in night.
- Added Pouncers with telegraphed, locked-direction lunges; reused existing enemy
  sheets rather than generating assets.

### Supporting features

- M world map and J journal, both pause simulation. Improved objective direction
  and location hints; five-card I inventory includes Eli's drawing.
- Browser-local autosave and Title Continue. Validated/versioned saves retain
  safe checkpoints, quest items, gates, defeated encounters and bell relays.
  New game/restart clears saved progression. Blocked storage is nonfatal.
- Maintained health3/flame100/oil1, F directional sweep, Q refill, deliberate R
  rest, E restoration and cooldowns. Quest ember remains separate from fuel.
- Added the user-required Git workflow to AGENTS.md: cumulative changelog and
  commit/push after completed prompts; fetch/integrate teammate edits, no force push.

### Verification and limits

- `npm test`: **13 passing**. `npm run build`: passed, bundle
  `index-BMOqQZEt.js`; standard large-bundle warning only.
- Installed Chrome through Playwright: short real-key tests exercised village
  latch, camp crossing, both swing jumps, three treehouse jumps, pickup, hearth
  exchange, shortcut, canal wheel, all relays, timer pause, guardian dodge/defeat,
  Continue, final stair jumps, protected rescue, follower return and home credits.
- Fresh New game/intro skip, five-card inventory at 960×540 and locked-direction
  Pouncer checks passed without final app/loader errors.
- A transition test timed out; diagnosis caught an invalid camera callback
  argument during repair. Checked installed Phaser 4 API, removed the argument,
  and retested Continue and fresh start successfully. See TEST-LOG for evidence.
- No new uninterrupted full playthrough claimed. Human extended route/difficulty,
  reverse traversal, audio/brightness and second-machine checks remain.
- No new image generation; reused current art. Final painted assets and release
  packaging/trailer remain separate work.

This first push of the working tree also includes the earlier local iterations
below; they had not previously been committed/pushed by this session.

## Earlier local iteration — demo cleanup and asset-model handoff

- Canonical stable demo on :4176; stopped stale :4173/:4174/:4175 servers.
  Temporary demo folders remain unserved; an automatic cleanup review rejected
  recursive deletion. No source/assets were deleted by that rejected command.
- Detailed external-model asset prompts, frame counts, dimensions, style
  references and replacement manifest in docs/competition/ASSET-HANDOFF.md.
- User prohibited further image generation; that instruction remains active.

## Earlier local iteration — presentation integration

- Textured stone/timber surfaces replaced grey collision blocks; cropped supplied
  paintings, local grass/daylight, bridge rails/water and modest parallax.
- Framed HUD, readable health/flame, selectable paused satchel and distinct
  lantern/cup/oil/ember props. Interior captions moved above the cellar play line.
- Eli/climb sheets and stone tile were generated as three drafts BEFORE the
  no-generation instruction; twelve editable SVG props were also authored then.
- Existing hero/fire/enemy/burst/dissolve animations reused and wired into effects.
- Build, eight then-current state tests and short Chrome checks passed. Final art
  approval and human presentation testing were left pending.

## Earlier local iteration — gameplay and survival core

- Downloaded/inspected original commit7c81e97; established npm install/build/runtime
  baseline. Added meteor-corruption canon and implementation/production documents.
- Replaced stationary main-route screens with an 8200px continuous world, moving
  camera, house visits, persistent quest/checkpoint state and local restoration.
- Added home ember exchange, safe bridge return, shelter rescue and credits.
  That shelter-ending route is superseded by this iteration's original Acts 1–3.
- Added health/flame/oil limits, directional sweep, paused inventory, rest recovery,
  input guards and memory cooldowns. Prior uninterrupted core/survival runs and
  resource edge checks are recorded in TEST-LOG; they apply to their earlier builds.

## Original GitHub baseline — 7c81e97

- Supplied Phaser/Vite prototype: opening, Home and Yard Prologue, four separate
  Act 1 screens (lane, square, bridge, campfire), and Act 2 coming-soon end card.
- Existing source art and sprite sheets retained throughout development.
