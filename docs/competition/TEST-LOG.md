# Test evidence

## Latest — 18 October 2026, Act 1 horror revision

Tester: Codex integrator, Windows / installed Chrome, production snapshots on
127.0.0.1:4177. Browser plugin not available; regular bundled Playwright used.
Only short fixtures/input sequences; extended runs remain human-owned.

- `npm test`: 33/33 pass. New coverage includes resource-free sword attacks,
  attack guards, fixed drop position/retrieval reach, reset, rescued-family save
  and recovery of a dropped lantern after Eli's rescue. Audio tests include the
  third boss loop in pause/mute ownership. `npm run build` passes; standard
  Phaser bundle-size warning remains. Release bundle: index-DiDMO2Gy.js.
- Actual X/F: sword texture/state loaded; two recovery-window counters reduced a
  feral from2→1→0 with flame100 unchanged. Moving away left light/drop behind;
  distant X refused, nearby X retrieved. Drawing during an incoming lunge is
  vulnerable, not an automatic interrupt. A lantern placed on a y500 restored
  tread fell to560 when it expired, and remained retrievable. Actual death reset
  returned the lantern, removed its body/collider and cleared sword mode.
- Boss: protected intro reached zoom1.7 with frozen player/gameplay clock. A real
  Space jump landed on the y485 ledge as the charge hit the barrier; sword back
  counter reduced health3→2, one hit used. A summon wave produced two living
  offspring. Final-hit fixture cleared minions/encounter/seals. These checks do
  not certify a complete three-opening human fight or sustained spawn balance.
  The ledge tendril locked x6925; actual D movement to6998 avoided its686ms
  damage window while the marked point still correctly registered a hit.
- Painted mechanism: actual E sampled handle rotation during motion; large and
  small gears rotated oppositely. A,A,B aligned both marks; held E set brake and
  enabled deck. A separate crossing fixture started with the defeated boss/brake
  flags, ignited the fire with E, walked across to x8157 at feet560, then walked
  back to x7444 after expiry with the permanent deck still enabled.
- Refuge: E lit the memory; both echoes appeared. Held E started escort, actual D
  moved their followers. An independent far-bank endpoint fixture anchored both
  and wrote refugeesRescued=true to storage. No complete timed escort is claimed.
  Restored saved-family fixture placed homes8020/8300, no camp Crawler, nearest
  interaction camp-fire; actual E successfully restored that fire.
- Market: restored Mara visible; expiry hid her, healthy alpha0, ruined kiosk
  loaded, echo-motion frame2 (clothed skeleton) visible with drifting particles.
  Runtime circle/physics boundary tests pass. Cosmetic flicker comfort remains
  human judgement.
- UI: actual I/M opened satchel/map; all three audio loops paused. Screenshots at
 1280×720 and960×540 inspected. Explicit HUD resource/objective rectangles fit
  safe bounds; narrow Fire map label fits. Pixelify font loaded locally. Two-line
  captions have separate padding from prompts and the interior resource HUD.
- Final short production sessions had no page errors or failed assets. Early dev
  hot-reloads briefly preceded completion of the boss audio file; this did not
  reproduce after the completed build. An initial HUD assertion was corrected
  to serialize Rectangle right/bottom getters; corrected bounds passed.

Evidence outside Git: %TEMP%/embers-final-market-past.png,
embers-final-market-expiry.png, embers-final-satchel-1280.png,
embers-final-satchel-960.png, embers-final-map-fitted.png. Short test scripts:
embers-horror-final-qa.cjs, embers-horror-ui-qa.cjs, embers-horror-edge-qa.cjs,
embers-horror-lash-qa.cjs. Longer human checklist: ACT1-HORROR.md.

Remaining: uninterrupted new Act1 route, all boss cycles/difficulty, whole escort
and retry timing, full campaign/second-machine playthrough, speaker/headphone mix
and subjective horror/art acceptance. Teammate-owned Act3 lore line is flagged,
not claimed repaired.

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

## 17 October 2026 — Five-Hand

`npm test` 18 passing; build passed. Browser (Vite dev, `?test`, 1280×720, real
key events), state "Mara freed": objective "defeat Five-Hand"; approaching the
arena starts the fight (`observe` → `shuffle` → `select`). Round 1: E under the
lantern slot → `window` → F from x 4760 → hit 1, round 2 starts. Wrong pick →
`punish`, ground warning, sweep dealt one damage (script moved only after the
warning). Round 2 correct → hit 2 → `defeated`, `villageGateOpen` and
`clearedEncounters['five-hand']` set, objective "follow Mara to the Bridge
Refuge", reunion played on arrival. Separate run: health 1 + wrong pick → death →
respawn at the square, fight back to `waiting` with 0 hits; then win and run
ahead → stall Mara hidden, refuge Mara shown.

## 17 October 2026 — Bridge works (Braced Shadow, gears)

`npm test` 19 passing; build passed (`index-DDBhTDzn.js`). The app window was
hidden (page throttled to ~2fps), so the browser test stopped Phaser's loop and
stepped `game.step()` at 16.67ms per frame from the script, dispatching real key
events between steps. Results: front sweep → "Its braced front turns the light
aside", health 2/2; windup → charge west, Rowan at 5250 untouched, elite stopped
at 5340 in `recover`; moved to 5550 past it; windup with chargeDir +1; jumped to
the crate (feet 464); elite stunned at 5658 (barrier broken, story played);
dropped to 5590, two sweeps → defeated, objective → gears. Levers before
restoring: "seized". Restored, A, A, B, hold brake → `bridgeBrakeSet`, deck
enabled. Separate run from "brake set": Five-Hand stays `defeated`; rest at the
bridge fire → flame 100; relight → deck enabled; walked to 6723 (feet 560),
`bridgeReturnOpen`, walkway notice, objective → campfire.

## 18 October 2026 — Parallax backdrop

- `npm test`: 19/19 pass. `npm run build`: pass.
- Browser (`?scene=World&test`, teleport by script): x 2600 lane, x 3150 lane→square seam (soft, skyline visible
  through keyed sky), x 4000 square (clock face in tower opening), x 6000 bridge dark and with `setMemoryVisual('bridge', 1)`
  (restored sky, skyline and painting). Not replayed: full route.

## 18 October 2026 — Act 2 playthrough and swing-carry fix

- `npm test`: 19/19 pass. `npm run build`: pass.
- Browser (dev server, `?test`): save with Act 1 complete, checkpoint `playground`;
  Title → Continue. All movement by dispatched key events, no teleports.
- **Bug found:** riding the swing, Rowan moved ~1.8× the board's distance
  (board 9810→9864, Rowan 9852→9949) and slid off its right edge into the crater.
  Cause: the carry moved both sprite and body; Arcade's postUpdate copies the
  body's displacement onto the sprite again. Fixed in `Chapters.js` (body only).
- After fix: E at swing fire (flame 100→75) → jumped onto board (feet 500) →
  offset to board centre constant at 49px for the whole ride → jumped to far bank;
  `swingReturnOpen`, checkpoint `swingBank`, objective → treehouse.
- Treehouse: E at fire → steps 500 → 440 → deck 380 → E took drawing + cup;
  objective → canal. Playground Pouncer killed with sweeps, no damage taken.
- Canal: exit rubble passed with drawing; rested at canal fire (R, flame 10→100);
  E → lower ledge 487 → upper ledge 439 → hold E on wheel → `canalGateOpen` →
  crossed to x12957; `canalReturnOpen`, checkpoint `canalBank`, objective → Act 3.
- Backtrack after all memories faded: crossed canal westward and stood at x9967
  (inside swing gap) on feet 560 — permanent crossings hold. No console errors.
- Not covered: arriving from Act 1 by keys, death mid-Act 2, human difficulty.

## 18 October 2026 — Act 3 whole-area paintings wired in

- Art: six delivered images (`newimages/`) imported by `tools/import_act3.py` as
  `bg_a3_{courtyard,mechanisms,landing}_{dark,restored}`; keyed to 1290×720.
- Layout: Act 3 areas now 1290px each (13600 / 14890 / 16180, world ends 17470);
  paintings at full speed, feet line py 580 → world 560. Ledges, steps, bells and
  gallery measured on the restored paintings (only walkable in remembered time).
- `npm test` 19/19, build pass — also on an index-only snapshot (HEAD + these
  changes, without the parallel Act 1 agent's uncommitted edits).
- Browser, key events only (dev server, then static snapshot on :4190 because the
  parallel agent's edits kept hot-reloading the dev server):
  - Courtyard: Old Road door sits in the painted gateway, bars + Eli in the painted
    window. Fire → steps 495 → 410 → 300 → rang bell 1 (1/3).
  - Mechanisms: fire → treads 520 → 477 → platform 430 → rang bell 2 (2/3).
  - Landing: Pouncer killed; rest + fire → ledge 452 → rang bell 3; Warden woke.
  - Warden: four sweeps from the floor during its windups → defeated (took 1 hit).
    Stair treads appeared → 485 → 415 → gallery 345 → held E at Eli → rescued.
    Walked out along the gallery → "You can see our house." story fired.
  - Old Road door on the landing → refuge (oldRoadWest) with Eli following.
  - Fresh canal-bank save: knock at window → Eli found; lever → Old Road open;
    door → refuge.
- Not covered: a full keyboard run from Act 2 into Act 3, death and respawn
  inside Act 3, human difficulty. The Warden ignores Rowan while he is on the
  bell ledge (it only aggros on the same level) — unchanged behaviour.

## 18 October 2026 — Act 1 cohesion / short checks

- Isolated publication build index-4Rc27y5x.js and combined H: build
  index-BiOgdhbJ.js passed; both19/19 Node tests. Existing bundle-size warning.
  npm ci --no-audit --no-fund passed in isolated checkout.
- Browser plugin unavailable; bundled Playwright + installed Chrome,1280x720
  and960x540. Final demo: correct title/canvas, Title → N → Intro skip → Hearth,
  no page/console errors, failed requests or framework overlay.
- Home: dark/restored floors inspected; zero door-sprite overlays. W on painted
  ladder x410 reached feet430. Gate E at980 did not travel before the ember.
  Valid quest fixture then enabled gate travel to market hatch3410.
- Market: E costs25 flame (100→75). Actual movement/jump inputs reached
  x3376/feet500,3499/440,3618/380, then x3783/385. Hold E freed Mara.
- Five-Hand: actual movement between widened slots and body, E picks, F hits.
  Both rounds won; hits1→2, flame75→55→35,health3, exit and cleared flag set.
  Exposure windows were reachable; camera kept all cards and body visible.
- Found/fixed unfair trailing sweep damage when landing after a jump. New front
  hazard retest: wrong pick4, jump after anticipation, health3, invulnerability0,
  next observe state. No immunity fixture masked the dodge.
- Final garden: E restore → walk1161 → cancel memory → walk739,feet560.
  Return flag/deck/local save all true. Reload → Continue at490, flag/deck true.
- Bridge prerequisite fixture (Mara/Nia/Tomas,brake): E5970 → walk6714,feet560,
  returnOpen; cancel memory → walk6323,feet560, deck solid. Banks inspected.
- Inventory opened/closed at960x540; canvas fit, five item cards present.
- Harness limitations: one early navigation preceded server readiness and was
  retried. An initial bridge fixture omitted Tomas, causing a wait timeout;
  corrected fixture passed. Neither failed attempt was reported as a pass.
- Screenshots outside repo: C:/Users/owner/AppData/Local/Temp/act1-house-polished.png
  and act1-card-court-polished.png. Fixture/short-check evidence only.
- Not tested: fresh whole-Act1/uninterrupted adventure, human navigation/difficulty,
  audio listening, or Act2/3 acceptance. Extended testing remains with the user.
- Teammate Act3 arrived on GitHub during handoff. Rebased this Act1 commit,
  retaining both doc histories, Act1 registration and Act3 whole-painting placement.

- Final integration: rebased onto teammate commit a539169, resolved overlapping
  World/Backdrop changes and retained both changelog/test histories. Rebuilt
  merged publication: index-BiOgdhbJ.js, identical to the frozen demo;19/19 tests
  pass after the merge. No additional gameplay changes during resolution.


## 18 Oct 2026 — Act 1 production / latest Gemini / typography

Baseline: isolated codex/act1-production based on91bea18; shared H: source had
that published Act1 patch and active Claude Act3 ownership. No Act3 geometry or
story rewrite. Builds/tests run in the isolated game repository.

- npm test: **23/23 pass** (19 progression/resource/save tests plus4 spatial and
  shutdown tests). npm run build passes; existing large Phaser bundle warning.
- Home: actual W input atx410 climbed650→434.7 with dark ladder behind Rowan;
  dark/past screenshots confirm same ladder position. E at530 costs100→75;
  warmup sample alpha.361/radius169.7, then full470px circle, night outside.
  Inventory pause froze remaining memory time.
- Five-Hand: actual shuffle yielded[2,3,0,1,4]; E under4140 revealed lantern;
  actual D movement reached4715; F increased hits0→1 and round0→1, health intact.
  First-round exposure window remained reachable with the widened court.
- Braced intro:1.7 zoom, frontal pose, physics/clock paused and tweenScale0;
  2.5s hold plus approach/return. Esc menu froze cinematic elapsed. Natural finish
  and Enter skip restored zoom1, physics/clock false, tweenScale1, once-only flag.
- Braced combat fixture: idle at5740, player6020 on ground; actual Space on charge
  landed on485 supply ledge, health3. Boss hit6068 barrier and stunned facingright;
  actual F from behind reduced3→2, hitUsedtrue, flame100→80. Three full cycles
  without repositioning remain human difficulty testing.
- Bridge: prerequisite encounter-clear fixture, then actual E6350; halo800,
  flame100→75, deck initially disabled. Actual A/D/E inputs at6170/6230 turned
  leverA twice/B once; hold E6300 set brake and enabled deck with10.64s left.
  Actual D crossed to6940/feet560; return flag true. Cancel memory then actual A
  back to6369/feet560; permanent deck still solid.
- Latest Gemini response f3d85695067ca21d exported via signed-in browser. Selected
  source SHA E96550AAAA1A83068DF2E4AF631F5FC899A0ED73D4C43F15ED58AC7361DD1601.
  Visual check: three distinct survivors at5060/5205/5500; no duplicate Rowan.
- Music/fire decode and play. Score buffer56.5725s. Pause stopped both loops;
  mouse volume increment persisted. M mute worked. Two direct scene transitions
  with active memory left exactly audio-score/audio-fire loops and2 cameras.
- Fresh production Title→Enter→Intro skip→Hearth; I, arrow selection, mouse tabs,
  map, pause and on-demand C controls checked at1280x720 and960x540. No final page
  errors or console warnings. Typography screenshots inspected; five items fit.
- Earlier failed attempts: old650ms tests failed3 assertions until updated to the
  intended1200ms warmup constant. Immediate restart fixture moved an obsolete
  player and timed out; rerun after scene creation passed. Out-of-range Five-Hand
  intro could start before Braced in a fixture; bounded triggers and stopped the
  enemy update loop once an intro begins. One active-memory scene shutdown threw
  undefined body.enable; fixed logical-only shutdown and added regression test.
  A Vite reload raced a manual reload once; final checks used frozen production.

Evidence screenshots outside Git in C:/Users/owner/AppData/Local/Temp/:
production-home-dark-ladder.png, production-home-past-ladder.png,
production-braced-intro.png, production-refuge-latest.png,
production-satchel-final.png, production-type-960-final.png,
production-controls-960-final.png, gemini-survivors-latest-proof.png.

Limitations: independent short fixtures/input sequences, not a fresh uninterrupted
Act1 or full adventure. Full Braced difficulty, wrong-pick/second-round replay in
this art build, every seam under all camera positions, headphone mix and human
asset/typography approval remain human-owned. No recorded human QA was invented.

- Final canonical :4176 refresh: index-CFJLCN30.js, Title/Intro/Hearth and new survivor/satchel smoke check; zero page errors/warnings. Snapshot embers-playtest-Gl4NTI, process23900.

- Post-publication:054d58b pushed to origin/main without force. H: dirty paths were
  verified against the already-published91bea18 patch (plus the retained Act3
  comment and owned claim notes), backed up with a named limited-path stash, then
  fast-forwarded. No unknown teammate edits were stashed. H: npm test23/23 and
  build index-CFJLCN30.js pass. .stfolder and assets/backgrounds.zip remain untracked.
  Workspace sunburn fast-forwarded from3d4a82b; its untracked story draft remains.
  Temporary owned4177/5174 servers stopped; only canonical4176 remains listening.


## 18 Oct — final Act1 active-sound and label audit

Current baseline b066e52 was clean except the user's untracked story draft.
Worked in workspace sunburn on codex/act1-final-audit; preserved Act3 ownership.

Browser plugin not available; bundled Playwright + local Chrome used. Flow:
World → recorded creature cue → pause/mute/volume → resume → completion; then
survivor rendering and five fire interactions. Viewport1280x720, local frozen
preview :4177. Page title/URL and canvas render matched game; no framework overlay.

- Before fix on canonical CFJLCN30: after cue/pause/mute, settingMutedtrue but
  voiceStillPlayingtrue, voicePausedfalse, voiceMutedfalse. This was a real gap:
  only music/fire loops were controlled.
- After fix: active clip isPausedtrue / isPlayingfalse; config mute=true and
  volume=.13 aftereffects=.2. While resumed and muted, actual WebAudio mute gain0,
  volume gain.129999995, isPlayingtrue. Unmute preserves volume and playback.
  Complete released the clip from effects Map. No page errors/console warnings.
-26 Node tests pass, including3 meaningful active-sound lifecycle regressions.
  Production build passes (standard Phaser size warning), index-CZ5iGwVk.js.
- Survivor labels: Nia y478, Tomas446, Mara450, exactly12px above each painted head;
  image inspected at C:/Users/owner/AppData/Local/Temp/act1-audit-labels.png.
- Actual E input at yard/lane/square/bridge/camp fire after positioning each short
  fixture: fuel100→75 each; field/light radii720/720/720/800/720; centres exactly
  fire.x /515; point radius+10 outside returnedfalse; each actual past painting
  had the radial mask. Camp screenshot after real D travel to8550 shows healthy
  left scene fading into corrupted right, not a whole-screen swap:
  C:/Users/owner/AppData/Local/Temp/act1-audit-camp-circle.png.

Human-owned extended checks are still pending; no full route, difficulty judgment,
headphone mix or production approval was fabricated. See acceptance audit below.

- Publication97ad067 synchronized to H: without overwriting unrelated files.
  Canonical :4176 refreshed to CZ5iGwVk / embers-playtest-6I8iwN / PID12944.
  Actual Esc menu paused an active creature recording; M then Esc resumed it
  with actual mute gain0. Zero page errors/warnings. Temporary :4177 stopped.
  The user has been asked for the required Act1 playthrough/listening feedback;
  the completion audit explicitly remains unproven until that input arrives.
