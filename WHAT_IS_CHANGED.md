# What is changed — cumulative iteration history

Keep this file cumulative. Each completed prompt adds a dated iteration with
implemented work, validation and remaining limits. Preserve prior entries.

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
