# Live implementation status

## Latest integration — Act 2 foundations, passage entry, Warden route and menus

- Grounded the supplied treehouse/canal buildings and removed the cropped canal roof join. Mill control now uses matching painted gear/handle art and animation instead of the bare placeholder ring.
- Old Road entry walks Rowan into the arch with collision disabled, then changes scenes. Removed the duplicate tiny door.
- Warden wards visibly block premature entry. Three bells plus the hearth ember release the encounter; Eli stairs/gallery require Warden victory. Added four-hit boss HUD, charge/opening instructions and context-sensitive route help.
- Pause tabs consistently route I/M/J; U mutes without stealing M from map. Controls Esc closes only the modal. New adventure now asks for confirmation and starts the prologue.
- Verification: 49/49 Node tests and production build pass (index-B9dQeUkC.js). Actual input verified canal steps/wheel/crossing, knocks, passage transition, three bells, four sword hits, lantern retrieval, Eli stair climb/rescue (2 HP), with no page errors. Full menu runtime audit is in progress; not claimed complete in this publication. Fresh full campaign and subjective art/audio judgment remain human acceptance.
- Trailer production is proceeding independently; no trailer binaries are committed. Previous history follows.

## Latest integration — 18 Oct, full-map scenery and footing

- Complete-building scenery islands replace cropped/overlapped house edges.
  All playable architecture moves at world speed; only distant skyline/sky
  parallax. Bridge/camp reuse complete arch/house/banks without joined halves.
- Repaired continuous ground: opaque paving/bank samples, mirrored repeat with
  no one-pixel transparent seam, irregular bottom and underground fade. Courtyard
  painted floor now matches560 while every existing elevated ledge stays aligned.
  Its approach blends paving only. Treehouse treads have wooden supports; Eli's
  final stairs have full masonry risers. Native stone Old Road passages replace
  flat mismatched doors. Removed court pillars that covered the fountain.
- Ground movement remains unchanged except invisible terminal walls at90/17405:
  Rowan stops with his complete painted frame on-screen, and the final view is
  reachable. No story, save schema, quest prerequisites or combat tuning changed.
-46/46 tests and production build pass.50 overlapping night/past screenshots
  cover17470px;40 real-input ground boundary walks pass; real treehouse/courtyard/
  Eli stair jumps pass. Fixtures unlock prerequisites/remove combat interference:
  these are visual/footing checks, not fresh-campaign or difficulty acceptance.
- Canonical http://127.0.0.1:4176/ serves frozen index-m7zl5Hdr.js,
  snapshot C:/Users/owner/AppData/Local/Temp/embers-playtest-BCvGSl, Node PID14732.
  Implementation a332155 is pushed to GitHub main; H:/projects/gameDev fast-forwarded
  safely and passes46/46 tests/build with the same index-m7zl5Hdr.js bundle.
  Canonical title/intro/map/satchel/test-jump smoke passed without page errors.
  Owned temporary4177 server stopped; only4176 remains among game demo/dev ports.
  No active implementation claims; preserve unrelated draft/.stfolder/zip files.

## Latest integration — 18 Oct, post-bridge completion

- Implemented: registered camp pit/crossing, painted bridge/deck/banks, cold night
  and radial past layers, irregular Act2 ground, true moving-seat swing forward
  route with26s memory and permanent return after crossing. No generated images.
- Map-after-voice crash fixed and reproduced before/after. Cheats interrupting a
  boss intro and New Adventure after rescued Eli also have lifecycle fixes.
- Type afaqisasleep for the far bank / Act2 approach; section presets through
  afaqending and afaqback preserve the normal save. H and automatic8s navigation
  help target the next physical action. Journal overflow fixed. POST-BRIDGE.md
  gives every code, route order and the human checklist.
-43 Node tests/build pass. Connected real movement/interactions verified after
  bridge through all three bells, including the actual return-home ember trip.
  A checkpoint of that run resumed to sword victory, lantern retrieval, Eli,
  view, refuge, home response and Credits. No endpoint-only substitute; no claim
  of an uninterrupted fresh-game/Act1 acceptance. TEST-LOG has exact scope.
- Canonical demo http://127.0.0.1:4176/ now serves index-CBTY2-o_.js from frozen
  snapshot C:/Users/owner/AppData/Local/Temp/embers-playtest-cWb8SG, Node PID9984.
  Final painted-layer/physical main+camp crossing/map check passes. Production
  code/map/save/960px checks pass. Source changes cannot mutate the snapshot.
  Owned4177/4178/4179/5173 servers stopped at that handoff. Published as33a5401;
  shared H:/projects/gameDev fast-forwarded before the full-map revision above.
- Codex implementation claim released at publication; previous Claude claim
  released by user. Preserve unrelated draft and H: .stfolder/backgrounds.zip. Full campaign,
  escort timing, subjective visuals/difficulty/audio remain human acceptance.

## Latest handoff — 18 Oct, cinematic/boss/voice/tap feedback revision

- Implemented: clear-ground compact captions/context prompts, adaptive gallery
  layout, eight-second protected Mara bones→ash→wind farewell, retained slow echo
  replays, distance-driven walk/climb frames across quick taps, Rowan recoil/audio.
- Five-Hand has36 generated/reference-matched frames: idle/shuffle/leap/cast/
  hurt-rage/projectile. First8s inactivity triggers leap/evade/return; second
  abandons cards and combines physical/magic attacks. Both card and sword paths
  defeat it; saved exit persists. Braced accepts damage in every phase/from both
  sides without changing its AI; early kill still opens the barrier.
-27 dedicated boss event clips,3 original dramatic32s scores,82 bundled synthetic
  dialogue reads + Eli memory laugh. Six loops and temporary clips obey settings,
  pause/mute/shutdown. Synthetic delivery needs human listening, not claimed final
  performed acting. Credits/provenance and reproducible import/build tools updated.
- Gear reach38, readable seized/aligned/locked feedback. Actual AAB/brake/cross
  passed. Act2/3 short interaction checks reach Credits: treehouse jumps, drawing/
  cup, canal wheel, three knocks, Old Road, hearth ember, three bells, Warden,
  Eli remaining after expiry and the playable home answer. Human full route,
  escort timing, difficulty and listening remain unperformed by the agent.
-37 Node tests + production build pass. Chrome1280×720/960×540 checks passed
  without page/asset errors. TEST-LOG.md records scope/evidence and harness fixes.
  Longer human checklist: PLAYTEST-FEEDBACK.md. No full uninterrupted new-route
  acceptance or award/readiness guarantee is claimed.
- Canonical demo http://127.0.0.1:4176/ ; index-Dq6Q7rvH.js;
  snapshot C:/Users/owner/AppData/Local/Temp/embers-playtest-rCZWB4, Node PID3960.
  Source edits cannot mutate this copy. Temporary :4177 is stopped at publication.
- User explicitly released the earlier Claude claim for this integration while
  that developer is inactive. Corrected TowerStory's old Mara/Tomas ember line:
  Mara is only a memory; Eli answers, and their hearth still remembers him. Its
  actual voiced line plays. Act3 paintings/coordinates are preserved.
- Integrator editing claim released at publication. Respect new teammate edits/
  claims on resumption. Unrelated campaign draft and H: .stfolder/backgrounds.zip
  stay untouched. Publication/shared-tree confirmation is in Git and TEST-LOG.
- Implementation0e15a1b is on origin/main. Shared H:/projects/gameDev cleanly
  fast-forwarded,37/37 tests and identical index-Dq6Q7rvH build verified. Canonical
  Title/Enter plus physical boss/corrected story smoke passed; only4176 listens
  among4176/4177/5173. Current handoff changes are documentation only.
- Run: npm ci (first setup), npm run dev -- --host 127.0.0.1. Release: npm test,
  npm run build, npm run demo. WHAT_IS_CHANGED.md retains all previous iterations.

## Latest handoff — 18 Oct, Act 1 horror/combat and pixel UI

- Implemented: physical dropped lantern/X sword/F slashes, faster animated
  ferals, dedicated painted foundry with boss intro/seals/charge/summons/tendrils,
  painted rotating gears/pivoting controls, memory-bound stall/Mara skeleton/ash,
  explicit Tomas/Nia escort and saved living outcome, grounded civilian activity,
  distant giant, unstable visual memory edge, recorded horror/boss soundscape.
- UI uses a clean painted pixel 9-slice frame and bundled Pixelify Sans/OFL.
  Fixed HUD safe insets, caption/prompt spacing, inventory and narrow map labels.
  Actual hero/shadow/village/stall references were uploaded before generation.
  Gemini produced the motion/environment/mechanism/UI assets; after its image
  limit, the user-authorised ChatGPT tab produced the final ruined kiosk.
- Tests: 33/33 Node tests and production build pass. Short Chrome checks passed
  sword counters/retrieval/death/temporary-support fall, boss intro/charge counter/
  summon wave/marked tendril dodge, AAB moving controls/brake, timed crossing and
  expired return, escort start/follow/endpoint save, skeleton expiry/campfire
  access, and 1280/960 HUD/satchel/map/audio pause. Details in TEST-LOG.md.
- Current frozen demo: http://127.0.0.1:4176/ ; bundle index-DiDMO2Gy.js;
  Node process12088. Snapshot: C:/Users/owner/AppData/Local/Temp/embers-playtest-vzv0Bl.
  Source edits/builds cannot mutate it. Temporary :4177 development/QA servers
  have been stopped; only :4176 remains served.
- Shared H:/projects/gameDev was fast-forwarded to the published implementation;
  its33 tests pass and its build matches index-DiDMO2Gy.js. Syncthing-related
  untracked files remain untouched. Workspace retains the unrelated draft.
- Ownership: Codex Act1 combat/presentation integration claim released at handoff.
  Other developer retains their Act3 claim. No Act3 coordinates, paintings or
  TowerStory source were changed. Unrelated CAMPAIGN-STORY-AND-MECHANICS-DRAFT.md
  and shared H: .stfolder/backgrounds.zip are preserved.
- Known teammate follow-up: TowerStory.js contains the old “Mara brought Tomas
  back with an ember” sentence. It conflicts with the new dead-Mara canon; exact
  proposed correction is in ACT1-HORROR.md for its owner. This is not certified
  fixed. The Act1/journal story uses the latest decision.
- Human acceptance still required: fresh uninterrupted Act1 run, complete boss
  fight and full escort/retry timing, navigation/visual judgement and headphone/
  speaker mix. Complete campaign/other machine QA remains human-owned. Use the
  four checks in ACT1-HORROR.md. No award or production-readiness guarantee.
- Run: npm ci (first setup), npm run dev -- --host 127.0.0.1. Release: npm test,
  npm run build, npm run demo. Prompts, inspected packing and exact source files:
  art/production/HORROR-ASSETS.md; cumulative change history: WHAT_IS_CHANGED.md.

## Latest audit — 18 Oct, active audio and survivor labels

-26/26 tests and build pass. AudioCues now owns active one-shot clips, so pause,
 mute, effects-volume changes and shutdown apply immediately, not just to loops.
- Survivor labels use actual painted heights, with12px head clearance and
  title-case text; latest Gemini sprites remain unchanged.
- All five outdoor fire E interactions were checked in short fixtures. Each spent
  exactly25 flame, its visual/daylight radius matched, and an outside point stayed
  corrupted. Canonical :4176 now serves index-CZ5iGwVk.js from frozen snapshot
 C:/Users/owner/AppData/Local/Temp/embers-playtest-6I8iwN (process12944).
- No Act3 source edits. This focused audit claim covers only AudioCues, Npc and its
  tests/docs and is released at handoff. Earlier audits remain below for history.
- Remaining required input: the user's fresh Act1 route/difficulty, visual
  cohesion and listening feedback described in ACT1-PRODUCTION.md. These are
  explicitly human-owned; production acceptance remains unverified.

## Latest handoff — 18 Oct, Act 1 production pass

This section supersedes earlier no-generation/audio-placeholder/whole-region-day
notes retained below as historical evidence. Implementation is complete; short
checks pass. Human production acceptance is still pending, not certified.

- Current systems/art: circular restoration (1.2s expansion); home ladder/floors;
  natural walking plane and overlapping joins; painted stall; latest approved
  Gemini survivors; painted boss poses, protected intros and separate Braced arena.
- Minimal themed HUD/title/satchel/map/journal/pause UI, aligned typography,
  contextual controls; no permanent controls strip or repeated resource labels.
- Real local CC0 score, fire, foley and creature clips, persistent music/effects
  volume/mute, scene-loop cleanup. Attribution: public/audio/LICENSES.md.
- Run: npm ci (first setup), npm run dev -- --host 127.0.0.1. Production:
  npm run build then npm run demo. Canonical frozen demo: http://127.0.0.1:4176/.
- Frozen demo: bundle index-CFJLCN30.js, snapshot C:/Users/owner/AppData/Local/Temp/embers-playtest-Gl4NTI, Node process23900. Source edits cannot reload it.
- Verification: 23 Node tests, build, short Chrome fixtures/input checks. See the
  newest TEST-LOG entry and ACT1-PRODUCTION.md for evidence and human test steps.
- Shared H:/projects/gameDev and this workspace sunburn are synchronized to the
  published implementation. H: test23/23 + build verified identical CFJLCN30 bundle.
  A named Git stash retains the already-published pre-production patch/owned claims
  as a backup; it is not pending teammate work. Unrelated files were preserved.
- Remaining: human fresh Act1 run, complete three-opening Braced fight, art/spacing
  judgment, audio listening/mix, longer whole-adventure/second-machine QA. No claim
  that later acts or an uninterrupted route were accepted in this iteration.
- Ownership: this Act1 integrator claim is released after publication. Preserve
  Claude's Act3 claim/geometry and any new teammate edits. Cumulative history is
  in WHAT_IS_CHANGED.md; asset descriptions/source selection in art/production/.


## Latest iteration — 18 October 2026: Act 1 cohesion

- Home/garden and Act 1 updated using supplied art; no image generation.
- Nearby paintings move at world speed; distant sky/skyline retain parallax.
  Painted ground/cliff bottoms remain visible; hidden colliders replace the
  foreground stone strip and duplicate indoor floors.
- Home floors registered at y430/y650; painted front door, ladder x410 and iron
  cellar gate x980 replace duplicate SVGs. Market shortcut is a pavement hatch.
- Mara's release is now x3815, reached by steps x3290/3405/3520. Five-Hand occupies
  the framed Card Court beyond the stall: cards130px apart, steady fight camera.
  Wrong-card sweep damages only at its visible moving front, not its faded trail.
- Garden pit matches painting (780–1100); crossing secures the saved return
  boardwalk (yardReturnOpen), preserving the later hearth journey.
- Build +19/19 tests pass for isolated publication and combined shared tree.
  Short Chrome checks passed steps/shutter, both boss rounds, wrong-card dodge,
  ladder/gate, bridge return, garden backtracking/save/Continue and scaled inventory.
- Frozen shared-tree demo: http://127.0.0.1:4176/ ; index-BiOgdhbJ.js;
  C:/Users/owner/AppData/Local/Temp/embers-playtest-RfLjeo; PID21596.
  Act3 was published by the teammate during handoff and is preserved by rebase.
  Before integration, the isolated Act1 build was index-4Rc27y5x.js.
- Act1 claim released. Other developer retains active Act3 claim. Next human
  check: fresh home → market → Card Court → bridge, then return home after
  restoration fades. Full-route/navigation/difficulty/audio checks remain human QA.

## Earlier core/campaign handoff (historical; latest status above)


Updated: 17 October 2026, complete original-chapter gameplay iteration.

## Current truth

- Current route: Title → Intro → Hearth ↔ continuous World → Hearth coda → Credits.
- Prologue and original Act 1 identity are retained. Act 2 is The Playground; newly authored Act 3 is The Clock Tower. Original GitHub had no playable Act 2 or Act 3 script.
- World is 18,000px across eleven regions. Existing art is reused; no new image generation in this iteration.
- Act 1: square bell latch, corruption gate, 9s bridge, campfire and second timed walkway.
- Act 2: moving restored swing crossing, treehouse jumps, drawing/cup pickup, home-return shortcut, protected hearth ember, canal wheel and persistent crossings.
- Act 3: three elevation/bell puzzles, warded four-hit Bell Warden, permanent final steps, protected rescue, Eli follower, old-road return and playable home ending.
- Crawler and fixed-direction Pouncer attacks; Warden has wards and faster low-health lunges. Existing health/flame/oil, sweep, rest, pause, cooldown and checkpoint rules retained.
- I inventory has five cards. M map and J journal pause gameplay; objective text includes direction and location. Browser-local autosave and Title Continue restore a safe checkpoint and persistent progress. N / Pause restart starts fresh.
- Thirteen Node tests and production build pass. Current production bundle: index-BMOqQZEt.js. Standard large-bundle warning remains.
- Short Chrome checks passed for each chapter's critical interactions, actual moving-swing / treehouse / final stair jumps, resource guards, guardian tell/dodge/four-hit defeat, save/continue, rescue and home-to-credits coda. Fresh start and scaled five-card inventory passed.
- These checks use independent fixtures and short input sequences. No fresh uninterrupted Prologue-to-credits run or human difficulty assessment is claimed for this build. Full route is human-owned per user instruction.

## Current demo

Canonical link: http://127.0.0.1:4176/ . Refreshed and verified with bundle index-BMOqQZEt.js; fresh Title/Intro skip/Hearth/map smoke check passed with no page errors. Frozen snapshot: C:/Users/owner/AppData/Local/Temp/embers-playtest-kxhzmY, Node process11964. Development preview :5173 was stopped after checks. Only :4176 remains listening among the project's demo/test ports. Source edits do not mutate this snapshot. Old temporary copies remain unserved after an earlier automatic deletion rejection.

## Story target and MVP gaps (17 October 2026)

The user adopted `CAMPAIGN.md` as the target story. The build above implements
the earlier story order. MVP work, in order (details in CAMPAIGN.md → "MVP status"):

1. ~~Act 1 story spine~~ **Done 17 Oct** (Mara's stall, Bridge Refuge family, spent
   hearth, Old Road west gate; placeholder art). See TEST-LOG for checks.
2. ~~Route reorder~~ **Done 17 Oct** (three knocks, Old Road, ember after Eli).
3. ~~Five-Hand~~ **Done 17 Oct** (two rounds, placeholder art).
4. Small text fixes: ~~cup inscription, drawing text, viewing-platform line, Nia's
   acknowledgement~~ done 17 Oct; opening taps still to do.
5. ~~Braced Shadow and gears~~ **done 17 Oct**. If time allows: canal lift, Nia's bird, opening taps.

## Ownership / next action

Implementation and local checks are complete; the integrator releases core editing claims at this handoff. No other local active claims were observed. Next human action: use the frozen demo and the eight-step checklist in ACTS-IMPLEMENTATION.md, then report route/difficulty failures. Git publication is recorded by the repository commit history and the final handoff message; cumulative WHAT_IS_CHANGED.md describes this iteration and prior local work.

## Git handoff policy

User explicitly requires a commit/push after each completed prompt. Root WHAT_IS_CHANGED.md is cumulative and retains earlier local iteration history. Fetch before pushing; integrate parallel changes without force-pushing or reverting other people's work. The first push from this session also includes prior local core/polish/planning work that had never been pushed.

## Remaining limitations

- Final art/painted joins and audio mix remain; no new raster generation is authorised. Existing three raster drafts predate that instruction. User owns image delivery.
- Long fresh route, optional/reverse traversal, human navigation and difficulty, audio listening, second-machine/offline packaging and trailer remain human QA/release work.
- Browser local save is origin/profile specific; another port or machine has a separate save. Continue resumes a safe checkpoint, not mid-jump or in an active memory. No cloud save.
- Keyboard desktop controls; no touch/controller support or standalone executable packaging.
- Legacy Home/Yard/A1 scenes remain development references, outside the current main route.

Earlier baseline/core/polish evidence is retained chronologically in TEST-LOG.md; it does not certify the expanded build's full uninterrupted route.

## Historical claim — 18 Oct, Act 3 art wiring (Claude; released by user above)
Owns Act 3 whole-area paintings: `tools/import_act3.py`, `bg_a3_*` assets, Act 3 region
widths/coordinates (`A3`, RELAYS, tower fires/spawns, window, Old Road east) in layout,
Act 3 blocks of Chapters/TowerStory/WorldState goals, whole-painting placement in
Backdrop/World. Act 3 areas are now 1290px each (world ends at 17470).


## Completed scope — 18 Oct, Act 1 cohesion and production (Codex)
Claims released after publication. See latest handoff, ACT1-PRODUCTION and TEST-LOG.
