# What is changed — cumulative iteration history

Keep this file cumulative. Each completed prompt adds a dated iteration with
implemented work, validation and remaining limits. Preserve prior entries.

## 17 October 2026 — Act 3 ending completed and played end to end

### Implemented (CAMPAIGN.md Scene 14)

- The rescue moment is silent: the daylight fades and Eli stays.
- A viewing platform beside the upper landing: "You can see our house." / "Yes."
- The Old Road now takes the brothers back to the Bridge Refuge, where Nia sees
  Eli ("You rang the bell. We heard it, and we ran."). Mara sends them home.
- At home: sit by the hearth, Eli taps twice, the player answers with E, credits.
- Eli follows Rowan on arrival in any area and between the floors at home.

### Verification and limits

- `npm test` 18 passing (1 new). `npm run build` passed.
- Browser run with real key events from the tower courtyard (state set to "ember
  in hand") to the credits: court fire → ledges → bell 1; Crawler defeated with
  sweeps; rest; mechanisms fire → three steps → bell 2; Pouncer defeated; crown
  fire → bell 3 → Warden woke; Warden defeated in 4 sweeps (one oil); steps → hold
  E with Eli → rescue; viewing platform lines; Old Road → refuge (Eli beside
  Rowan); Nia's lines; market passage → home; ladder (Eli followed); sit → taps →
  E → Credits.
- In that run the old "ACT 1" banner cut off Nia's lines because the test skipped
  Acts 1–2; replaying with it cleared showed all lines. Not a real-play issue.
- Not done: a full run from New game; Act 3 art (still reused); Five-Hand.

## 17 October 2026 — MVP art briefs (documentation only)

- Audit: Acts 2 and 3 reuse Act 1 paintings (playground = garden, treehouse =
  campfire, canal = bridge, tower = square/lane); Mara/Tomas/Nia are tinted
  placeholders; no Five-Hand art. `assets/backgrounds.zip` only backs up Act 1.
- Rewrote `art/background_prompts_act2.md` (the old one described five screens,
  a shattered sun and an older story). New files: `art/ASSETS-README.md`
  (overview, priorities, rules), `art/background_prompts_act3.md`,
  `art/character_sprites.md` (Mara, Tomas, Nia, Bell Warden; optional Five-Hand
  and Braced Shadow).
- Backgrounds are now specified as complete 21:9 side-view paintings, one per
  region (dark + restored), with the walk line at 82% height, gameplay positions
  given as percentages, and edges that continue into the neighbouring region.
- No code changed. Integration (scaling to region width, edge blending) happens
  when the art arrives.

## 17 October 2026 — campaign route reorder: three knocks and the Old Road

### Gameplay implemented (CAMPAIGN.md Scenes 8–11)

- **New order:** playground → canal → tower courtyard (find Eli) → Old Road to
  the refuge → market → home for the ember → cellar passage to the market → Old
  Road back to the tower → bells, Warden and rescue as before.
- **Three knocks (Scene 10):** two taps come from a lit lattice window high on
  the tower. Rowan taps three; Eli answers three ("That's too many."), proving he
  is alive. He explains he rang the bell to draw the shadows away; Rowan connects
  it to Tomas and decides to fetch the ember. Restoring the courtyard lets Eli
  step forward until the daylight fades and pulls him back.
- **Old Road:** a release beside its east door in the courtyard opens it; the
  doors at the tower and the refuge now travel both ways.
- **The ember waits for Eli:** the hearth ember can only be taken after Eli is
  found. The canal wheel and the playground exit no longer need it. The
  playground "passage home" is gone; the cellar passage now leads to the market.
- Drawing/cup text updated (no inscription). Objectives and journal entries
  follow the new order. Old saves that already hold the ember migrate safely.

### Verification and limits

- `npm test` 17 passing (2 new; 6 older tests updated for the new ember rule).
  `npm run build` passed (`index-qf6IFrgi.js`).
- Browser checks with real key events: canal bank → window taps → three knocks →
  Old Road release → travel to refuge; home: restore hearth → take ember →
  ladder → cellar latch → market → refuge door → Old Road → courtyard (bell 1
  objective); courtyard restoration: Eli steps and is pulled back. Details in
  TEST-LOG.
- Not checked in this pass: ringing the bells and the Warden (unchanged code;
  my scripted jump onto the bell ledges missed), a full new-game run, the long
  walk home on foot (Rowan was placed near the front door to save time).

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
