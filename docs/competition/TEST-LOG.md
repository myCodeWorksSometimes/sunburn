# Test evidence

## Implementation evidence — 17 October 2026

Tester: current Codex integrator, Windows 10, Node 24.14.0, npm 11.9.0,
Playwright using installed Chrome 155.0.8059.80, 1280×720, localhost:5173.
Browser plugin not available; regular Playwright fallback used. Bundled Playwright's
expected Chromium revision was absent; installed Chrome used without installing dependencies.

- G0: `npm ci` passed (17 packages, audit found 0 vulnerabilities). Early build/dev
  attempts before installation finished failed due to missing Vite; after install,
  baseline `npm run build` passed. Normal bundle-size warning only.
- G0 runtime: existing `?scene=Yard&test` rendered; D moved; held Space jumped
  (feet 449.7, vertical velocity -425); test-positioned at brazier then E ignited
  restoration; directly invoked death to check lifecycle, safe respawn passed.
  These are baseline checks with explicit test setup, not a full playthrough.
- G1 build passed after new modules/World registration.
- G1 runtime: new World width 8200; walked from yard across lane to x4091 in Square,
  camera scroll ~3532, then walked left and jumped garden gap to x687 in the same
  World scene. No runtime page errors. An intentionally mistimed first garden
  jump fell and recovered at the safe entry, confirming fall retry.
- That was the first intermediate checkpoint; the completed core and survival pass are recorded below.

## Completed core and survival pass — production verification

Environment: Windows 10, Node 24.14.0, npm 11.9.0, installed Chrome 155.0.8059.80
through bundled Playwright. Browser plugin not available. Main viewport 1280×720;
secondary cold-load check 960×540. Production served at 127.0.0.1:4173. Source is
the local working tree over 7c81e97, not a new Git commit. Final tested survival
bundle: `dist/assets/index-BCGtDd5M.js`.

Commands: `npm test` passed all **8 tests**; `npm run build` passed. Standard
Phaser bundle-size advisory remains (~1.45MB JS, ~382KB gzip); no build errors.
`git diff --check` was also used during implementation; final handoff check follows.

### Full route, actual controls, no progression injection

Fresh Title → skipped Intro → Hearth. Walk to lantern, climb, restore home,
leave into World. Ignite Yard, cross garden, rest/remember at Lane, defeat Crawler
with two F sweeps. Restore Square, jump three steps, collect cup. Walk back through
the same map, jump the garden gap, enter Home. Hold R to recover, remember, hold E
to take the hearth ember, descend, warm latch and use shortcut. Restore and cross
Bridge, secure permanent return. Rest at Camp, remember, ignite three shelter lamps,
evade the final Crawler using a jump, use oil, hold E to rescue Eli. Press F during
protected transfer (no cost/attack), then walk left with Eli into Credits.

Result: **completed=true, rescuedEli=true, deaths=0, health=3, flame=35, oil=0**.
Both encounters cleared, all three lamp flags true, spent hearth/shortcut/return
walkway persisted. No page errors, console warnings or failed requests during
this fresh survival run. All movement and progression in this run used keys;
edge-case fixtures described next are separate from this result.

### Area checks and explicit edge-case fixtures

| Area / mechanic | Actions and observed result |
|---|---|
| Home | Lantern unique; ascent/descent, first memory and front door worked. Short 300ms ember hold did not commit; full 1s hold committed once. |
| Yard / campfire spam | Three rapid E presses produced one memory and flame 100→75. Active time was not extended. Held R completed once and capped health 3/flame 100/oil 1; rest cancelled the memory and started its 4s cooldown. |
| Depletion | With explicit fixture flame=19, F and E both rejected without animation, negative fuel or memory activation. From flame=0/oil=0, a reachable unlit fire recovered supplies through actual held R. |
| Oil | Q at full flame kept the vial. At lower flame it capped fuel at 100 and consumed exactly one. Q during inventory did not queue a refill. |
| Lane / attack | Held F produced one strike/cost: flame 100→80, enemy health 2→1. Advancing and a second strike dispersed it, flame 60. Rear and out-of-range strikes left enemy at 2. Cancelling windup by damage prevented a delayed hit. |
| Health | An overlapping attacking Crawler reduced health 3→2 once over a 550ms observation, with immunity remaining. A fixture at health 1 then took damage: retry restored health 3/flame 100/oil 1 while cup and hearth ember remained. |
| Rest interruption | A direct damage fixture at an unlit fire interrupted the R channel: health 2, flame 0, oil 0, resting=false. Holding R onward did not auto-restart. A lit-fire damage probe was correctly protected by the safe zone. |
| Square / inventory | Restored steps reached heights 500→440→380; cup collected once. Inventory paused the countdown. In the full survival run, fight + restoration left flame 10 with oil 1, demonstrating the intended recovery decision. |
| Paused combat | Opened I during sweep windup. Attack elapsed 102.17ms, cooldown 697.83ms, enemy health 2 and immunity stayed exactly unchanged while inventory remained open. Resume executed the pending strike once; extra F/Q presses in inventory caused no additional spend. |
| Return / home | Cup and cleared encounter survived return. Hearth sacrifice kept its ember separate from generic fuel. Rest at an already spent hearth recovered resources while memory remained idle and the unique ember stayed present. |
| Bridge | Restored bridge usable only after warmup. Crossing committed permanent return; waited for expiry and walked back safely. Separate fixture waited mid-bridge until natural expiry: fall retried at x5190 with bridge collision disabled and quest items retained. |
| Reverse seams | Walked Yard/Lane/Square both ways. Separate fixture with the permanent walkway walked from Camp x6870 back to Square x4562, covering remaining reverse joins. No scene cut or runtime error. |
| Shelter / limits | Full run entered with recovered resources; camp memory + three lamps consumed flame down to 0, oil remained 1 and the unique hearth ember remained true. Q restored 35, then final transfer consumed the unique ember only. |
| Rescue | F during transfer did not spend the 35 flame. Eli remained alpha=1 when memory alpha returned to 0 and the scene returned to night. Companion coda reached Credits. |
| Pause | In the original core check, a 30s pause preserved memory remaining 8551.53ms, scene time 5087.6ms and player x5190 exactly. Repeated ignition/expiry then produced two ready events and one live echo, not duplicate listeners/echoes. |

Targeted fixtures use explicit player positions, state values or a direct damage
call to reach interruption/boundary cases. They are not represented as unassisted
playthroughs or human tests.

### Regressions found and fixed

- Cancellation during active restoration could refresh collision before clearing
  memory state. Fixed order; unit and runtime checks confirm invisible temporary
  bridge/steps disable immediately on death/replacement.
- An interrupted ignition could retain an animation completion callback. Action
  cancellation now removes it. Death during ignition, warmup and active memory
  returned safely without a delayed activation; quest items persisted.
- Second-run Intro could reuse Home's cached `front` entry. Intro now passes
  `{spawnId:'cellar'}` explicitly. Seeded stale-entry regression and actual
  post-credits restart both returned x900/feet650 with clean run/resources.
- Final-transfer hint could be overwritten by generic interaction UI. Dedicated
  transfer prompt now remains visible; Enter skip follows the same commit path.
- E pressed during R channel could be buffered; input is consumed before protected
  UI branches. Runtime probe pressed E mid-rest and ended with memory idle/fuel100.
- Intro's darkness veil had transparent fill rather than initial object alpha;
  corrected and the unskipped ~14s introduction reached Hearth normally.
- Initial favicon 404s were identified and removed with a local SVG. Subsequent
  production checks had no console warnings or failed requests.

One automation attempt timed out while a rebuild was replacing the served build;
it was not counted as a pass. Browser was restarted after the build completed and
the checks rerun. A separate earlier harness waited for a walking coordinate past
the coda trigger; the game had already reached Credits, which was inspected and
confirmed. Later full runs waited on Credits directly.

### Offline/local and viewport checks

Cold browser context blocked every request outside 127.0.0.1. Title, Intro and
Hearth loaded and responded with **zero external attempts and zero page errors**.
All fonts/media used by the game were available locally. This simulates no Internet
while retaining the required local HTTP server; it is not a `file://` launch test.
At 960×540 the canvas bounds were exactly x0/y0/width960/height540, and the objective
status was correct. Desktop keyboard input is the target; no touch/controller QA.

Restart from completed game cleared flags/resources and started in the cellar:
health3/flame100/oil1, no lantern/cup/ember, no lamps/cleared encounters.

Screenshots were captured outside the repository in the tool temporary directory
(production credits, restored bridge, rescue and 960px viewport). Fresh human
difficulty, navigation, comprehension and audio listening checks remain pending.

Document link checks are not gameplay evidence.

## Entry template

```text
Date/time and timezone:
Tester / agent or human:
Gate/task:
Commit or local-diff description:
Machine / OS / browser or runtime:
Launch/build command:
Starting state and exact actions:
Expected result:
Observed result:
Pass / fail / not tested:
Evidence path (if captured):
Issue owner and retest:
```

## Required core cases

These checked core cases record the earlier G4/survival build's evidence. They
do not claim a fresh complete run after the later presentation changes; see the
dated G5 entry below for that build's intentionally short checks.

- [x] Baseline dependency install and production build.
- [x] Walk all outdoor connectors left and right without scene transitions.
- [x] Actual jumps/landings and restored steps exercised (fine tuning still needs human feel tests).
- [x] Restore one region: daylight/greenery cue, solid route, echo and expiry.
- [x] Other regions remain corrupted; remote regions are not restored.
- [x] Relight twice; no duplicate ready/echo events in the exercised flow.
- [x] Pause during restoration; remaining time does not decrease while paused.
- [x] Interruption and natural expiry recovery exercised; pure fade-state cancellation tests pass.
- [x] Cup, ember, shortcut and completed story survive Home/World transitions.
- [x] Bridge expiry and reverse crossing remain recoverable from either bank.
- [x] Spent home memory never blocks leaving the house.
- [x] Eli is a separate non-hostile sprite, outside attack targets; post-transfer survival exercised.
- [x] Final transfer protection and idempotent resource/quest commits exercised.
- [x] Start-to-credits route succeeds without debug actions.
- [x] Restart after completion succeeds without stale state.
- [x] Production launch with external network blocked uses available local assets.
- [ ] Fresh human player completes without coaching (record actual person/result).

Leave unchecked cases unclaimed. If interactive tooling is unavailable, provide
these steps to a teammate and record the limitation rather than inventing a pass.

## 17 October 2026 — G5 presentation integration / external art handoff

Scope: short smoke/interaction checks only, as explicitly requested by the user.
No extended completion/difficulty/feel run was performed in this pass. The three
new raster images are drafts created before the user prohibited further image
generation; subsequent work was integration and detailed model briefs only.

Environment: installed Chrome155 via bundled Playwright, Windows, local production
build. **Browser plugin not available**, so used regular Playwright; no new browser
dependency installed. Viewports1280×720 and960×540. Flow under test: production
entry → gameplay / inventory controls → readable updated art and unchanged state.

Builds: initial presentation CYqHxJ2b, caption/water corrections BQtWKjCB, final
frozen preview **index-aLYy3ywX.js**. `npm run build` passed; standard bundle-size
warning only. `npm test`: eight passing. `git diff --check`: no whitespace errors
(Git reports LF→CRLF normalization on textures.js, not a test failure).

| Check | Observed result |
|---|---|
| Identity / nonblank / overlay | Correct title “Embers of Before”; one visible game canvas; zero Vite error overlays. Normal Title→Intro→Enter skip→Hearth verified on final snapshot. |
| Loader and console | No page errors, console warnings/errors or failed requests in the exercised flows. PNG, SVG and manifest assets load locally. |
| Interior / climb | Actual W hold from cellar fixture at440,650 showed hero-climb at feet565; reached upper floor y430. New caption position exposes lantern/feet. |
| Inventory | I opens/pauses; arrow-right selection changed card0→1; final snapshot selected protected ember card2. Mouse click selected oil card3; Esc resumed World and stopped Pause. I also closes and resumes. Owned/unowned fixtures show correct counts and descriptions; extended usability remains human-owned. |
| Sweep | Actual F against positioned lane Crawler: first hit health1 and flame80; second hit cleared it and flame60. New burst/arc displayed; no triangle placeholder. |
| Rest | Actual R held2.15s at bridge fire with health1/flame0/oil0 returned health3/flame100/oil1. |
| Remember / bridge visibility | Actual E ignition cost25; bridge surface art and collision both enabled. Satchel pause kept remaining8833.65ms exactly unchanged across0.9s wait. |
| Cancellation | Fixture cancel disabled both bridge art and collider; restored square fixture enabled all three stone step surfaces. |
| Local visuals | Screenshots show cold night vs bounded warm/day sky, living grass, textured floor and stair tops, bridge rails, distinct cup/lantern and Eli. Other region remained night in bridge view. |
| Small viewport | At960×540, framed satchel fits and arrow selection responds. No touch/controller claim. |

Fixtures positioned actors/set progress to inspect individual areas quickly; these
are not evidence of a new uninterrupted playthrough. A first square screenshot
placed the player on a step during warmup; it fell before collision activated,
as designed. The screenshot verifies scenery, not a new traversal pass.

Visual issue found/fixed: bottom captions hid cellar pickups/feet. Hearth now
uses the upper y212 caption band; outdoor subtitles retain their lower band.
Daylight sky was also limited to the walk-line height with separate bridge water,
avoiding a flat pale fill beneath the deck. Standard large bundle remains a known
build warning, not a loading failure.

Evidence (outside repository):
- C:/Users/owner/AppData/Local/Temp/embers-polish-title.png
- C:/Users/owner/AppData/Local/Temp/embers-polish-square.png
- C:/Users/owner/AppData/Local/Temp/embers-polish-shelter.png
- C:/Users/owner/AppData/Local/Temp/embers-polish-inventory.png
- C:/Users/owner/AppData/Local/Temp/embers-polish-inventory-small.png

Final isolated demo: http://127.0.0.1:4176/; snapshot
C:/Users/owner/AppData/Local/Temp/embers-playtest-yET2cU, process3912.
Confirmed bundle index-aLYy3ywX.js, normal launch/skip and inventory on that
snapshot. Older4174/4175 playtest processes were preserved.

**Human-owned remaining checks:** complete fresh route, all seams both ways,
cup/home/shortcut round trip, natural bridge expiry/retry/permanent return,
shelter lamp/rescue/coda, second run, art seams/brightness and audio listening.
Use the eight-step checklist in ASSET-HANDOFF.md. Final painted replacements,
approval and competition-source disclosures remain pending; G5 is not marked fully verified.

## 17 October 2026 — original chapters completed (Acts 2 / 3 extension)

Request: complete the original acts and functionality with existing assets;
provide progress updates; human retains extended/complex testing. Additional
instruction: commit/push completed iterations and retain cumulative WHAT_IS_CHANGED.md.

Baseline: eight prior state tests/build passed before extension. Current suite:
**13 passing**. Production build passed, final bundle **index-BMOqQZEt.js**.
Standard large-bundle warning only. `git diff --check` passed (LF/CRLF normalization
notice on textures.js). No new dependencies or images generated in this pass.

Environment: Windows, installed Chrome155 via bundled Playwright. Browser plugin
not available, so regular Playwright used. Production preview :5173, main viewport
1280×720, inventory at960×540. Earlier frozen :4176 held unchanged during work.

Flow under test: individual chapter fixtures → real interaction/movement keys →
persistent puzzle/reward or ending state. These are short separate sequences,
**not** one uninterrupted full playthrough.

| Runtime check | Observed result |
|---|---|
| World/loader | Width18000, eleven regions, forty floor/platform surfaces, six enemies (Crawler/Pouncer/Warden variants). No missing requests/page errors in final checks. |
| Village latch | Actual E at restored square top opened villageGateOpen and disabled blocking gate. |
| Camp crossing | From campfire, actual ignition and six-second D traversal crossed second timed walkway; x8246, feet560, campReturnOpen true, checkpoint playground. |
| Moving swing | Actual jump from x9135 landed on moving board at y500; immediate second jump reached x9540/y560 and enabled permanent return boardwalk. A separate earlier idle between tool calls expired the memory, fell and recovered at the safe playground checkpoint as expected. |
| Treehouse | Actual three jumps landed y500→440→380, then E granted unique drawing/cup. |
| Home exchange | Playground passage entered Hearth; actual E restoration and held E took ember/spent home memory; cellar E returned to x11100 in playground. |
| Canal | Restored upper wheel + held E set canalGateOpen, retained bridge collision and removed tower gate. |
| Relays | Actual E fires and held E at all three bell locations gave counts1→2→3, fuel75→50→25. Warden remained alive/dormant through first two and woke after third. Ordinary restoration did not clear it. |
| Pause | M held remaining20769.15ms exactly constant across0.5s wait; map/journal open/close worked. |
| Warden | Visible windup eye; actual jump avoided lunge with health3. Four F sweeps gave health3→2→1→0 and fuel80→60→40→20; cleared encounter persisted. Positioned actors between attacks for isolated reach checks. |
| Continue | Browser save contained drawing, ember, relays, gates, cleared Warden and safe crown checkpoint. Reload/title Enter rebuilt World atx16500 with state intact and final steps enabled. |
| Final ascent / rescue | Actual three jumps landed y500→440→380. Held E began transfer; F/Q during transfer did not spend resources. Rescue committed once, quest ember consumed, Eli alpha1 after memory cancelled/night returned. |
| Home coda | Actual A walk to old-road door, E→Hearth, D to hearth and held E reached Credits; completed=true, rescued=true. |
| Fresh run | Credits/reload then N→Intro→quick Enter skip→Hearth reset lantern/drawing/relays/completion and spawned cellar900,650. |
| Inventory / viewport | Five cards loaded; at960×540 no clipping/overlay. Drawing and updated cup description included. |
| Pouncer | At windup completion, attack direction -1; moving player to other side did not retarget; x10843→10744 while direction stayed -1. |

Transition investigation: one combined script timed out. An attempted repair
passed a boolean into Phaser4's camera callback argument and caused _onUpdate.call
errors. Inspected installed Camera.js/type definitions, removed the invalid
argument and rebuilt. Subsequent Continue, fresh-start/skip, rescue and coda tests
passed with zero page errors, console warnings/errors or failed requests. That
intermediate broken bundle is not the final candidate. Final identity checks:
title Embers of Before, one game canvas, no Vite overlay, meaningful rendered map/
inventory/world/credits and responding controls.

Evidence outside repo: embers-acts-inventory.png, embers-acts-rescue.png and
embers-acts-ending.png in C:/Users/owner/AppData/Local/Temp/. The map screenshot
embers-three-acts-map.png was captured after closing the map and is a world view,
so it is not used to claim map screenshot evidence; map itself was visually
inspected in the initial runtime tool image.

Remaining human checks: complete new-game route without fixtures/coaching; all
seams/optional backtracking; natural expiry/retry of every new crossing; death
during each quest action; longer save/resume/restart; Warden difficulty; visibility,
audio, second-machine release. Follow ACTS-IMPLEMENTATION's eight-step checklist.
These are not marked passed by this agent.

Final demo handoff: :4176 refreshed from final bundle index-BMOqQZEt.js, snapshot
C:/Users/owner/AppData/Local/Temp/embers-playtest-kxhzmY, Node process11964.
HTTP200 confirmed; final cold Title→Enter→Intro→skip→Hearth→M map check passed
with zero page errors. Evidence: C:/Users/owner/AppData/Local/Temp/embers-final-acts-map.png.
An initial request during the snapshot-copy/startup briefly refused connection;
the server then reported ready. Two over-tight final verification calls timed
out; the bounded 30s cold smoke check completed successfully. Preview5173 was
stopped; only4176 remains listening among project demo/test ports. No additional
gameplay changes occurred after the final production build.

## 17 October 2026 — campaign Act 1 (Mara's stall, Bridge Refuge)

Build: `npm run build` passed, bundle `index-06UoOXUN.js` (standard large-bundle
warning only). `npm test`: **15 passing** (13 existing + 2 new: Act 1 ordering /
idempotence, save round trip and old-save migration).

Browser checks on the Vite dev server (`?test` keeps the loop running), 1280×720,
real key events dispatched to the page:

- Market: knocking notice near the stall; E at the shutter plays `mara-knock` and
  the objective changes to the roof release. Restored the square fire (E), jumped
  the three remembered steps (feet 478 → 423 → 363) onto the stall roof, held E at
  the release: Mara appears, `mara-freed` lines play, market exit tendrils clear,
  objective becomes "follow Mara to the Bridge Refuge".
- Refuge: entering plays the reunion once (`heardNia`). Walking right was held at
  the barrier with Tomas's notice. Talking to Tomas set `heardTomas` and freed the
  route. Rest (hold R 2s) at the spent refuge hearth restored flame 40→100 and
  health 2→3 and set checkpoint `refuge`; its prompt shows "This memory is spent."
  Lit the moved bridge fire (x 5370) and crossed; objective moved to the campfire.
- Save/Continue: set Mara/Nia progress, waited for autosave, reloaded the page,
  Title → Enter (Continue) resumed at `refuge` with flags and Mara beside Nia.
  Pause → Begin again cleared all three flags.
- Console: no errors during these runs.

Not checked: a full uninterrupted new-game route, the journal screen visually,
reverse traversal from the far bank, audio by ear, other machines. Placeholder
NPC art only.

## 17 October 2026 — campaign route reorder (three knocks, Old Road)

`npm test`: **17 passing** (route-order and old-save migration tests added; six
older tests now call `findEli()` before taking the ember, matching the new rule).
`npm run build` passed, bundle `index-qf6IFrgi.js`.

Browser (Vite dev, `?test`, 1280×720, real key events), progress set by script to
"canal crossed":
- Objective "someone is tapping at the tower window"; walking in plays the two
  taps. E at the window: three taps, Eli answers three, `eli-found` lines play,
  objective → Old Road release. Window is lit; Eli visible behind the bars.
- Held E at the release: gate opens, objective → "go home…". E at the Old Road
  door → arrived at the refuge (`oldRoadWest`, x 4935), checkpoint saved.
- Home (Rowan placed beside the front door to skip a ~20s walk): restored hearth
  shows "You'll come this time?", hold E took the ember, objective → cellar
  passage. Ladder down, latch → World market (x 3410); walked to the refuge door,
  Old Road → courtyard (x 13160), objective "back to the tower… ring bell 1".
- Courtyard restoration with Eli found: Eli steps forward; when the memory
  ended he was pulled back and `eli-pulled` played.
- Console: two errors from an intermediate hot-reload (a module saved before its
  dependency); no errors in later runs.

Not checked: bells/Warden/rescue in this pass (code unchanged), full new-game
route, walking home on foot.

## 17 October 2026 — Act 3 end to end (courtyard to credits)

`npm test` 18 passing; build passed. Browser (Vite dev, `?test`, 1280×720, real
key events), state set to "Eli found, Old Road open, ember in hand":
court fire, two ledge jumps (feet 483, 429), bell 1 → court Crawler defeated
(2 sweeps) → rest at mechanisms fire (flame 100) → light, three jumps (489, 435,
369), bell 2 → Pouncer defeated (health 3→2) → rest at crown fire → light, jump,
bell 3 ("The third bell breaks…"), Warden awake → Warden defeated in four sweeps
with one oil, health 3 → three jumps to Eli, hold E → `rescuedEli` → viewing
ledge: "You can see our house." / "Yes." → Old Road door → refuge (x 4935, Eli at
4875) → `nia-eli` lines (verified in full on a replay) → market passage → Hearth
cellar (Eli on Rowan's floor) → ladder (Eli followed to y 430) → hold E sit →
"… tap, tap …" + "E: tap twice back" → E → `completed` → Credits.
