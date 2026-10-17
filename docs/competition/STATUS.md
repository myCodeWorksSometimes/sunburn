# Live implementation status

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

## Active scope — 18 Oct, Act 3 art wiring (Claude)
Owns Act 3 whole-area paintings: `tools/import_act3.py`, `bg_a3_*` assets, Act 3 region
widths/coordinates (`A3`, RELAYS, tower fires/spawns, window, Old Road east) in layout,
Act 3 blocks of Chapters/TowerStory/WorldState goals, whole-painting placement in
Backdrop/World. Act 3 areas are now 1290px each (world ends at 17470).


## Completed scope — 18 Oct, Act 1 cohesion and production (Codex)
Claims released after publication. See latest handoff, ACT1-PRODUCTION and TEST-LOG.
