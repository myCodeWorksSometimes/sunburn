# What is changed — cumulative iteration history

## 18 October 2026 — full-map scenery joins and grounded movement

- Rebuilt outdoor scenery from complete architectural sections separated by open
  alleys/vegetation. Removed clipped/mirrored house halves at region edges and
  stopped Act2 playable architecture drifting independently of the ground.
- Fixed repeating transparent ground/cliff samples and a one-pixel texture seam.
  Continuous irregular cobbles, coherent banks and underground shadow replace
  abrupt cliff chunks. Matched tower courtyard floor to collision without moving
  its upper ledges; blended the approach's paving rather than overlapping houses.
- Added wooden supports to treehouse treads, full masonry beneath final Eli stairs,
  supplied stone passages for Old Road doors, and map-end collision matching full
  Rowan frame bounds. Removed decorative court slabs/banners covering the fountain.
  Reused supplied pixel assets; story, save, boss tuning and route rules preserved.
-46 tests/build pass.50 overlapping day/night-state views inspected across17470px;
  40 real ground crossing checks plus actual treehouse/courtyard/final stair jumps
  pass. Invulnerable/unlocked fixtures isolate geometry, not natural campaign
  acceptance. Terminal walls and map verified with real input. Detailed evidence
  and limitations are in TEST-LOG. Human full campaign/artwork judgment remain.
- Canonical http://127.0.0.1:4176/ frozen build index-m7zl5Hdr.js. Earlier post-bridge
  implementation33a5401 is already pushed and in shared H:/projects/gameDev;
  this iteration's publication/shared verification follows in STATUS.

Keep this file cumulative. Each completed prompt adds a dated iteration with
implemented work, validation and remaining limits. Preserve prior entries.

## 18 October 2026 — post-bridge route, painted crossings and safe test codes

- Repaired the camp painting registration: fire8120 and gap8400–8720 now match
  its pit/walkway rather than cutting through the houses. Reused the supplied
  rope/timber/bank/river painting for crossings, aligned the deck to collision,
  removed duplicate source skyline/flat water panels, added a cold night layer
  and locally masked healthy layer. Act2 floors use irregular painted cobbles.
- Swing forward traversal now genuinely uses the moving seat. Its return deck
  unlocks only after crossing, and its fire lasts26s to allow a missed swing cycle.
- Fixed map crash after a completed voice: destroyed WebAudioSound was retained
  and paused through a null manager. Fixed switching sections during a boss intro
  accessing destroyed cameras; fixed New Adventure retaining destroyed Eli.
- Added typed `afaqisasleep` and nine section presets plus `afaqback`. Normal
  state/save is preserved, including prefix cancellation/timeout and New Adventure
  from a test run. H and automatic stalled-player guidance show the next physical
  fire/ledge/wheel/door with a destination marker. Journal text stays in its frame.
-43 Node tests and production build pass. Actual connected inputs prove far bank
  → camp → moving swing → treehouse → canal → Eli's window → Old Road → home
  ember → cellar/Old Road → all three bell climbs. A recorded run checkpoint at
  the third bell continued with a real sword fight, lantern retrieval, stairs,
  ember transfer, view, refuge, walk home and playable response through Credits.
  This is two connected route checks with a checkpoint resume, not a claim of
  uninterrupted fresh-game acceptance. No enemy health or invulnerability was
  forced in the successful route. Full human difficulty/listening remain open.
- Production checks cover completed-voice maps at each preset, home/drop maps,
  prefix cancel/timeout, normal save/back, automatic help,960px map/journal/satchel,
  and isolated restart. POST-BRIDGE.md lists codes, route and focused human checks.
  Final bundle: index-CBTY2-o_.js. Canonical4176 refreshed to this frozen build;
  stale demo/dev listeners stopped. Publication/shared-checkout details: STATUS.

## 18 October 2026 — published feedback build verification (previous iteration)

- Implementation0e15a1b is published on GitHub main. Shared H:/projects/gameDev
  fast-forwarded cleanly; its37/37 tests pass and production bundle matches
  index-Dq6Q7rvH.js. Existing Syncthing/zip files and unrelated draft are untouched.
- Canonical http://127.0.0.1:4176/ serves that frozen build. Title/Enter smoke,
  physical boss damage/two-sword-hit defeat and corrected tower dialogue/read
  passed on the canonical port. Temporary4177/5173 servers are stopped.
- PLAYTEST-FEEDBACK.md gives the six-stage human checklist. Extended fresh route,
  complete escort timing, subjective difficulty/voice delivery/music mix remain
  human playtests; this handoff does not claim those judgments passed.

## 18 October 2026 — cinematic echoes, moving bosses, voiced campaign and tap gait

- Replaced ground-covering dialogue/prompt boxes with measured compact upper
  captions and contextual controls. High platforms use a separate upper lane;
  dialogue and boss HUD suppress redundant prompt boxes. Restart clears HUD owner.
- Mara now drains to bones, holds the skeleton, collapses and blows away over8s.
  First nearby natural expiry is protected/skippable; pause freezes it. Offscreen,
  combat, rest, death and replacement do not force a camera takeover. Other echo
  replays also dissolve slowly; the stall remains ruined after restoration.
- Uploaded actual boss/hero sprites to the user-authorised ChatGPT asset chat;
  imported a reference-matched36-frame Five-Hand sheet including independent
  projectile frames. Kept the exact prompt/source and reproducible silhouette
  packing. Added visible idle, hand shuffle, leap, casting, hurt/rage states.
- Five-Hand leaps after8s of inactivity at card selection; first evade/retreat
  returns it to the perch. Second timeout removes cards and combines physical
  leaps and magic. Normal two-round card solution remains playable. Death resets
  the whole attempt; saved victory remains. Moving damage/VFX track the actor.
- Braced now takes damage in every phase/from either side, keeping its attacks,
  summons and tendrils. Defeat opens the barrier even before a first charge.
  Increased lever/brake interaction reach, added seized/aligned/locked feedback;
  actual A,A,B + hold brake + crossing passed.
- Added27 dedicated boss event edits,3 distinct original32s minor-key scores,
  Rowan impact/recoil animation,82 bundled synthetic dialogue reads and an Eli
  memory laugh. Boss voice overlap is bounded; music fades between encounters.
  All loops/clips follow pause/mute/volume/shutdown. These are synthetic reads,
  not claimed final emotional voice acting; listening judgment stays human-owned.
- Fixed tap-driven sliding: walk/climb frames advance by distance and retain
  their phase between releases. Repeated W climb and D walking taps passed.
- Rechecked Act2/3 critical interactions: real treehouse jumps, drawing/cup,
  mill ledge/wheel, permanent canal, three knocks, Old Road, unique hearth ember,
  three bells, Warden intro/four hits, Eli remaining after expiry, home-to-credits.
  Short independent fixtures/input sequences passed; no uninterrupted new-route
  playthrough or subjective difficulty/audio acceptance is claimed.
-37 Node tests + production build pass. Chrome1280×720/960×540 checks passed,
  with no page errors or failed assets. Full evidence: docs/competition/TEST-LOG.md.
  Human route/listening checklist: docs/competition/PLAYTEST-FEEDBACK.md.
- User released the previous Claude claim during integration. Corrected the
  TowerStory Mara/Tomas ember contradiction and regenerated its spoken line:
  Mara is only a memory; Eli answers, and their hearth still remembers him.
  Preserved Act3 paintings/geometry. Unrelated campaign draft and H: Syncthing/zip
  files are not part of this commit.

## 18 October 2026 — Act 1 horror combat, memories and pixel presentation

- Added X sword draw/retrieval and F sword combat. Rowan sets the lantern down;
  its light follows the physical dropped item. It falls when restored support
  disappears. Flame-free short slashes trade carried light for reach/risk; death
  and abyss recovery cannot lose the lantern. Retrieval also works after rescue.
- Act 1 creatures pursue faster, telegraph locked lunges, stagger and dissolve
  through actual animation frames. Braced Shadow has a separate painted foundry,
  protected intro, mist seals, steady fight camera, faster final-health charges,
  bounded offspring summons and a marked tendril strike against prolonged perching.
- Replaced Braced's four static poses with 36 frames, added 32 sword frames and
  three skeleton-to-ash sequences. Uploaded actual game reference sheets before
  Gemini revisions. ChatGPT generated the final ruined kiosk after Gemini's limit.
- Mara is a dead stall echo, no living duplicate at refuge. Healthy/ruined stall
  follows the local memory pocket. Tomas/Nia require an explicit lantern escort
  across the secured bridge; rescued state persists. They settle clear of the
  campfire and clear its danger; unanchored echoes collapse when memory fades.
- Gave the foundry more approach/arena space without shifting Acts 2/3. Registered
  the arch at native scale, replaced square stair columns with scaffold supports,
  painted the supply ledge and added a distant moving shadow silhouette.
- Imported painted rotating gears, separate pivoting lever/brake parts and clean
  pixel 9-slice UI. Bundled Pixelify Sans/OFL locally; corrected HUD padding,
  caption/prompt separation, inventory spacing and narrow map labels.
- Added fire-edge breathing/brief memory instability with stable colliders and
  a short ignition shock. Replaced melodic score with recorded horror ambience,
  boss tension layer, new creature/metal/memory cues and wet creature footsteps.
  Audio pause/mute/volume/cleanup remains owned and tested. CC0 provenance retained.
- Verification: 33 Node tests + production build. Short Chrome inputs/fixtures
  checked sword counters, physical lantern recovery, boss intro/charge counter/
  summons, gear handles/AAB/brake, timed bridge + expired return, escort start/
  endpoint save, skeleton expiry, campfire access and 1280/960 UI/audio pause.
  Complete fresh route, full escort/fight difficulty and listening remain human QA.
- Known integration follow-up: teammate-owned TowerStory.js retains one old
  Mara/Tomas ember sentence; exact correction is documented in ACT1-HORROR.md.
  No edits were made to that owner's Act 3 geometry, paintings or story module.
- Run `npm ci` then `npm run dev -- --host 127.0.0.1`, or build and `npm run demo`.
  Canonical frozen demo remains http://127.0.0.1:4176/; the handoff records its
  refreshed bundle. Prompt/source register: art/production/HORROR-ASSETS.md.
- Shared-checkout verification: H:/projects/gameDev fast-forwarded to publication,
  33 tests pass, identical index-DiDMO2Gy build; unrelated files preserved.
  Canonical Title/start smoke passed; temporary demo servers are stopped.

## 18 October 2026 — active sound controls and survivor label audit

- Fixed already-playing creature/foley clips continuing through pause/mute.
  AudioCues now owns temporary clips as well as loops; pause/resume, mute,
  effects-volume changes and scene cleanup apply to active recordings.
- Aligned survivor names to each character's visible height instead of the shared
  padded sprite frame; Nia no longer has a label floating far above her head.
  Names use the same title-case, higher-resolution typography as the other UI.
- Canonical demo refreshed to index-CZ5iGwVk.js; actual Esc/M menu controls
  verified against an active creature recording. H: synchronized to publication.
- Verification:26/26 tests, production build, short Chrome audio/gain lifecycle
  checks, survivor-label screenshot and actual E at all five outdoor fires.
  Each fire cost25 and matched restoration/light radius; points outside stayed
  corrupted. Human playthrough/difficulty/mix approval is still required.

## 18 October 2026 — Act 1 presentation, local restoration and typography

- Replaced whole-region restoration with a 1.2s expanding, feathered circle.
  Artwork, greenery, sky/daylight and temporary collision share its world-space
  bounds. Platforms require both ends inside; persistent return paths remain.
- Added protected 0.7s zoom / 2.5s frontal boss gaze / 0.7s return sequences,
  letterbox, name and recorded roar, with skip/pause/revisit handling. Separate
  painted Five-Hand/Braced poses and health/status displays; Braced takes three
  openings, one hit per stagger, in an arena beyond the spaced-out refuge.
- Added pixel-art UI, paired painted stall, natural cobbled walking plane,
  feathered scene joins, painted supply ledges and registered home ladder.
- Imported the LATEST user-selected Gemini Mara/Tomas/Nia revision, not the first
  sheet. Removed green, aligned feet and added walking frames. Prompts, selected
  source SHA and reproducible extraction live in art/production/.
- Simplified typography and UI: short labels, higher-resolution text, clear serif
  headings, left-aligned item details/dialogue, fixed caption width, no permanent
  control strip or redundant resource prose. Map labels are horizontal; journal
  has pages; controls are available on demand. Five satchel slots remain.
- Added local CC0 ambient score, fire/footsteps/door/knock/impact/pickup/sweep and
  creature recordings. Separate persistent volume/mute controls; scene changes
  destroy old loops. Credits/source/license details in public/audio/LICENSES.md.
- Updated moved Act1 objectives/echoes and compatibility radii for later crossings;
  preserved teammate Act3 geometry, paintings, story and integration.
- Verification: 23 Node tests and production build; short Chrome input/fixture
  checks for ladder, radial warmup/pause, boss intros/skip, Five-Hand pick+sweep,
  Braced charge/dodge/back hit, real gear puzzle/bridge/return, audio lifecycle,
  fresh title flow and menus at 1280x720 / 960x540. TEST-LOG records corrections.
- Shared H:/projects/gameDev integration also passes23/23 tests and builds the
  same index-CFJLCN30.js. Workspace sunburn fast-forwarded while preserving its
  untracked story draft. Syncthing marker/archive files were left untouched.
- Stable demo remains http://127.0.0.1:4176/ after refresh. Full fresh Act1/adventure,
  all three Braced cycles without fixtures, human art/difficulty and audio mix
  approval remain user testing. This is a tested production pass, not a claimed
  competition win or completed human QA.

## 18 October 2026 — Act 1 cohesion and separate Five-Hand court

- Registered nearby Act1 paintings, kept distant parallax, exposed painted
  terrain/cliff edges and removed the foreground ground strip/duplicate floors.
- Aligned both home floors; use painted doors/ladder and the correct right-hand
  iron cellar gate. Market passage is a hatch; Old Road uses a supplied stone arch.
- Moved Mara's stall and step route west; framed a separate Card Court with130px
  card spacing (formerly50px), wider selection range and steady fight camera.
- Fixed wrong-card sweep: only its visible moving front damages, not the trail.
- Matched the garden pit and saved a permanent return boardwalk for backtracking.
- Build and19/19 tests pass in isolated publication and shared tree. Short Chrome
  checks passed roof/shutter, both boss rounds, wrong-card dodge, ladder/gate,
  garden return+Continue, bridge return and scaled inventory. Full human QA remains.
- Refreshed stable demo http://127.0.0.1:4176/ . Only owned Act1 changes/docs are
  published; teammate's separately committed Act3 work was preserved during rebase.
  No generated art in this iteration.

## 18 October 2026 — Act 3 built with the delivered paintings

- Six delivered Act 3 images (`newimages/`) are in the game as whole-area
  paintings that move with Rowan; green windows, arches and sky show the slow
  sky/skyline layers behind (`tools/import_act3.py`, `Backdrop.js`).
- Act 3 areas shrank to the paintings' width (1290px each); the world now ends at
  17470. Every Act 3 object moved onto its painted feature: Old Road door in the
  courtyard gateway, Eli behind the painted window, steps/ledges/platforms and
  bells as painted, Warden arena, the post-fight stair up to the painted gallery,
  Eli and the arches view (`layout.js` `A3`, Chapters, TowerStory, goals).
- Walkable geometry follows the restored paintings, since those surfaces only
  exist in remembered time; the dark versions differ a little and simply
  crossfade. Placeholder stone/frames are hidden when the art is present; rung
  bells glow at the painted bell.
- Verified in the browser: every Act 3 beat from the window knock to the road home.
  `npm test` 19 passing, build passed. Committed only Act 3 changes; the parallel
  Act 1 agent's uncommitted edits were left in the working tree.

## 18 October 2026 — shared-folder demo and implemented story audit

- Inspected `H:/projects/gameDev` without changing Syncthing files. Captured a
  hash-verified separate source/assets snapshot and built a frozen local demo at
  http://127.0.0.1:4176/ (bundle `index-BO8Vb2s6.js`); replaced the previously
  owned stale demo server. Future teammate edits do not mutate this playtest.
- Added `docs/competition/STORY-AUDIT-2026-10-18.md`: actual chapter-by-chapter
  story, comparison against earlier plans and adopted CAMPAIGN, and exact remaining
  script/mechanics gaps. No gameplay or art changed.
- Verification: isolated install/build passed; 19/19 Node tests passed; short
  Chrome check passed Title → Intro → Hearth, movement and inventory open/close,
  with no observed runtime/console/request errors. Full-route playthrough remains
  with the team; late-game conclusions in this audit come from source inspection.
- Published only these two documentation files from a separate checkout of the
  latest GitHub main, preserving the shared tree's uncommitted teammate work and
  all prior iteration history below.

## 18 October 2026 — Act 3 art brief: whole-background approach

- `art/background_prompts_act3.md` rewritten: each Act 3 area (courtyard,
  mechanisms, landing) is one complete 1920×1080 painting, dark + restored,
  including the ledges, steps, bell frames, gallery and arches Rowan uses.
  Flat #00FF00 only where the far sky/skyline shows through (sky over the outer
  wall, windows, the landing's arches above the village horizon).
- Paintings are meant to move with Rowan (100%), so walkable parts are placed by
  pixel tables derived from the current gameplay surfaces (ground y 670; image →
  world mapping included). Dark versions show "remembered only" ledges crumbled.
- Joints between areas fall on matching stone piers; spots for fires, the Old
  Road door, enemy patrols and the post-boss stair are kept plain.
- `art/ASSETS-README.md` points to the new approach. Docs only: no code, build
  or test change. Game wiring (full-speed placement, hiding placeholder ledges)
  follows when the art lands.

## 18 October 2026 — Act 2 playtested; swing ride fixed

- Played Act 2 end to end in the browser from a playground save: swing
  crossing, treehouse climb and drawing, Pouncer, canal ledges, sluice wheel,
  canal crossing, and backtracking over both permanent crossings.
- Fixed: Rowan slid off the moving swing because the carry moved him twice per
  frame (sprite and body both shifted; Arcade then copies the body's movement to
  the sprite). The carry now moves only the body (`src/world/Chapters.js`).
- `npm test` 19 passing, build passed. Details in TEST-LOG. Not covered:
  arriving from Act 1 by keys, death mid-act, human difficulty.

## 18 October 2026 — Delivered Act 2 source art committed

- `newart/` (25 delivered Gemini images, ~57 MB) is now tracked so
  `tools/import_act2.py` can re-stage Act 2 art from a fresh clone.
- `assets/backgrounds.zip` (39 MB) is left untracked: every file in it is
  already tracked under `assets/backgrounds/`.
- No code changes; no build or test run needed for this iteration.

## 18 October 2026 — Act 2 built with the delivered art

- `tools/import_act2.py` names the 25 delivered images in `newart/` and stages
  them in `assets/backgrounds/`; unusable dark versions (legacy broken sun,
  creature, blurred green) are replaced by night-graded copies of their restored
  image until regenerated. `process_backgrounds.py` keys the green, crops props
  to their outline (max 900px) and no longer stitches Act 2.
- `src/world/Act2Art.js` places the props on their gameplay spots with anchors
  measured in each image: crater under the swing gap, a 400px swing set whose
  legs stand on the crater lips (ropes now hang from its top bar), the plank
  seat on the moving swing board, the treehouse whose painted platform is the
  walkable deck (380, 10880–11250; drawing and cup moved onto it), rubble at the
  buried exit that becomes the old service arch once the drawing is found, the
  mill whose two stone blocks are the climbable ledges (487 and 439) up to the
  sluice wheel, and the canal channel. Dark and restored cross-fade when the
  region is remembered.
- Backgrounds use their own art with ground lines 0.68 / 0.73 / 0.72.
- Canal gap narrowed to 300px (12550–12850) to fit the canal art; still beyond
  Rowan's ~240px jump.
- Verified in the browser (teleport + memory activation): swings, treehouse,
  canal in dark and restored; Rowan stands on the treehouse deck (feet 380) and
  the mill's upper block (439); gate rubble/arch follow `hasDrawing`.
  `npm test` 19 passing, build passed. Not a full keyboard playthrough.

## 18 October 2026 — Act 2 art brief: green-layer approach

- `art/background_prompts_act2.md` rewritten at the user's request: every Act 2
  image is on flat #00FF00 so it keys out and overlaps cleanly. Three layers:
  backgrounds (scenery standing on a 62% ground line, green above, below and at
  both outer edges; 70% speed), foreground props placed exactly by the game
  (swing set, swing seat, crater, treehouse, rubble/gate, mill with ledges,
  canal; sizes in Rowan heights matching the gameplay surfaces), optional front
  silhouettes. Replaces the continuation workflow for Act 2.
- Game wiring for props and green-edged backgrounds follows when the art lands.

## 18 October 2026 — Exact joins for Act 2/3 paintings

- `tools/make_continuation.py <painting>` makes a 1920×1080 seed canvas with the
  painting's right 35% on the left and white elsewhere; the next painting is
  generated by extending it.
- `tools/process_backgrounds.py` pastes the previous painting's pixels back over
  a continued painting's left 35% (fading into the new part over 80px), in chain
  order (swings → treehouse → canal; courtyard → mechanisms → landing).
- The backdrop lays a continued painting exactly over its predecessor's right
  35% at the same scale (`continues: true` in REGIONS), with no feather.
- Act 2/3 briefs now describe the continuation workflow; Act 1 joins are left as
  they are until its art is redone.
- Verified: tool test on copies of Act 1 art (seed canvas correct, 3 paintings
  stitched in chain order); temporarily installed as Act 2 art in the browser,
  the swings→treehouse joint matched exactly; test art removed. `npm test` 19 passing.

## 18 October 2026 — Parallax backgrounds and layered art briefs

### Presentation

- The World backdrop is now layered: fixed star-field sky (the legacy broken-sun
  sky image is no longer used), a looping skyline at 25% speed (the clock tower
  is visible through the paintings' keyed skies), and the region paintings on one
  70% layer. Paintings sit edge to edge in that layer, so the black gaps between
  regions are gone, and each fades into its neighbour over 220px. Restored
  paintings and the restored sky fade in per region as before.
- The square's clock face now rides on the painting layer so it stays in the
  painted tower.
- Act 2/3 regions name their own art (`bg_a2_*`, `bg_a3_*`) with the borrowed
  Act 1 painting as fallback. `tools/process_backgrounds.py` writes
  `public/bg/manifest.json`; Boot loads everything listed, so delivered art
  appears without code changes (walk line read at 62% of the image).
- Art briefs rewritten for layers: paintings are scenery only (sky flat green,
  flat unbroken ground, no holes or usable steps); optional ground strip, prop
  cutouts and a foreground root strip listed in `art/ASSETS-README.md`.

### Verification and limits

- `npm test` 19 passing. Build passed. Browser: lane→square and square→bridge
  seams blend, no gaps; bridge restored state shows restored sky, skyline and
  painting; clock face sits in the tower.
- Gameplay props (stall, steps, gears) are still code-drawn placeholders.

## 17 October 2026 — Bridge works: Braced Shadow and the gear puzzle

### Gameplay implemented (CAMPAIGN.md Scene 7)

- Made room: everything from the bridge fire onward moved 600px right, so the
  works sit between the refuge and the bridge.
- **Braced Shadow (elite):** an armoured front that turns sweeps aside and a long,
  readable charge. Bait it into the cracked barrier (dodge onto the crate or
  jump); the impact breaks the barrier and stuns it with its back open. Two hits
  to its back defeat it.
- **Gears:** restore the bridge fire; lever A turns both gears, lever B only the
  small one; line both marks up with the arrows, then hold E on the brake. The
  brake persists. The bridge deck now only returns once the brake is set.
- Tomas explains the works; journal entries and objectives follow the steps.
- Fixed: after reloading, a defeated Five-Hand kept running its fight invisibly.

### Verification and limits

- `npm test` 19 passing (1 new, 1 updated). Build passed.
- Browser, stepping the game clock from the script (the app window was hidden,
  which throttles the page): front sweep rejected; charge west dodged by
  retreating; slipped past during recovery; crate dodge; charge stunned at the
  barrier (barrier broke); two back hits → defeated; levers refused outside
  restored time; A, A, B then brake → `bridgeBrakeSet`; rest, relight, deck
  enabled, crossed, walkway notice, objective → campfire.
- Not checked: the rest of the world after the 600px shift by playing (positions
  were shifted mechanically; tests on regions/spawns/gaps pass).

## 17 October 2026 — Five-Hand boss (placeholder art) and 16:9 art briefs

### Gameplay implemented (CAMPAIGN.md Scene 5)

- Freeing Mara no longer clears the market exit: Five-Hand, a shadow rooted in
  her card counter, holds it. Mara waits in her stall and gives a hint.
- The fight: five cards face up with the lantern card, then face down and swapped
  in plain view (2 slow swaps, then 3 including a crossing). Stand under a card
  and press E. Right card: the knot is exposed for 4.2s for a lantern sweep (F).
  Wrong card: a 0.9s ground warning, then a hand sweep you can jump or back away
  from. Two hits win; the exit clears; Mara leaves for the refuge.
- Placeholder look: a large shadow behind a wooden counter, five cards and arms
  drawn in code.

### Art briefs

- All art briefs now respect a 16:9 maximum: backgrounds are 1920×1080 with the
  walk line at 62%; heights above the walk line recalculated; sprite sheets fit
  16:9 (six frames as two rows of three).

### Verification and limits

- `npm test` 18 passing (Act 1 test updated for Five-Hand). Build passed.
- Browser (real key events): fight starts on approach; correct pick → window →
  sweep hit; wrong pick → warning → hand sweep (hit taken because the script
  waited out the warning); round 2 → second hit → defeated, exit open, objective
  to the refuge, reunion triggered. Death mid-fight resets it to waiting at 0
  hits. Mara hands over to the refuge copy without a duplicate.
- Not done: a slower-shuffle accessibility option; final Five-Hand art.

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
