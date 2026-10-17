# Production, art, testing, and submission

Latest execution priority: follow [EXECUTION.md](EXECUTION.md). Prove the complete
gameplay with existing art and readable placeholders before spending core coding
time on final art, shaders or lighting polish. C can prepare assets/audio in
parallel; they must follow the proven geometry and [CANON.md](CANON.md).

## Deadline and operating rules

Deadline: **Sunday 18 October 2026, 9:30 AM Pakistan time**. Plan from approximately 3:00 PM on 17 October. Schedule is a target, not a claim about how quickly the team can implement features. If starting later, remove stretch work rather than moving submission preparation into the final minutes.

One human is the integrator. Work in separate branches/checkouts on each teammate's machine. Do not allow three AI sessions to edit the same checkout or shared core files concurrently. Each task ends in a small reviewable diff, a working build, and a specific playtest. Keep the last playable build available throughout.

Everyone should use the same baseline commit and dependency lockfile. Do not update dependencies tonight unless a verified blocker requires it. The required product is a working local game; a web build served locally is acceptable under the user's stated platform preference. A standalone executable is optional and should not cause an engine migration.

## Four human roles

| Person | Primary deliverables | Files / authority | Typical AI use |
|---|---|---|---|
| A — strongest coder, integrator | Continuous world, camera, state, home transitions, builds | Core scenes, layout, state, memory, lighting; final merge authority | 6.1 Sol for narrow systems tasks; personally play every integration |
| B — gameplay and story | Region interactions, enemy tells, story, finale | Content files, creature behaviours, encounter modules | 6.1 Sol implements one encounter/beat at a time |
| C — presentation and sound | Reusable connectors/foreground, audio, UI readability, asset manifest | Audio/assets and presentation modules; coordinate Boot edits with A | AI-assisted asset preparation and code, with human visual/audio review |
| D — producer, tester, trailer editor | Rules check, task tracking, fresh playtests, capture, edit, upload | Test log, trailer project, release checklist; no core-code dependency | Can use AI for captions/checklists but mainly runs and evaluates the game |

Person D is crucial: a fresh human playing the latest build catches navigation and comprehension failures that a coding agent will miss. D records actual reproduction steps, not just “this feels wrong.” Rotate one rested person through the final packaging and upload check; do not make the entire team unavailable at once.

## Clock-based execution plan

All times Pakistan time; the date rolls over after midnight.

| Time | A | B | C | D | Gate |
|---|---|---|---|---|---|
| 15:00–15:30, Oct 17 | Baseline run/build; lock contracts | Read bible; trim dialogue; mark existing hooks | Inventory reusable art/audio needs | Confirm submission rules; run baseline; start issue list | Baseline build saved; roles agreed |
| 15:30–17:30 | Wide greybox World, player and camera | Enemy tells module; story data | Layer/connector samples; sound selection or recording | Test movement and bridge readability; make trailer storyboard | Walk Yard–Lane–Square both ways continuously |
| 17:30–19:30 | All outdoor regions, connectors, persistent flags | Home ember and finale modules against contract | Integrate existing art, foreground and first sounds | Test return journey and annotate dead ends | Continuous complete geography; Home round trip works |
| 19:30–21:30 | Local memory and safe return walkway; integrate story | Finish rescue and coda; final encounter | Audio states, caption/UI clarity | Run first full start-to-credits playtest | Complete game, even with rough art |
| 21:30–23:00 | Fix movement/softlocks; integrate approved camera beats | Tune enemies and remove repetitive dialogue | Polish bridge and final light transfer | Capture first usable footage; fresh player test | Strong hook and comprehensible ending |
| 23:00–00:00 | Build and regression | Content fixes only | Audio mix and art seams | Rough-cut trailer | **Feature freeze at midnight** |
| 00:00–02:00, Oct 18 | High-impact bug fixes | QA and fixes in owned files | Final media/audio fixes | Edit trailer; second fresh player | Stable candidate, recorded issues ranked |
| 02:00–04:00 | Package production build and launch instructions | Verify progression/restart | Check offline assets and credits | Trailer export; test on second machine | **Release candidate by 04:00** |
| 04:00–06:00 | Only release blockers | Independent completion run | Check mix on speakers/headphones | Final capture/export and upload preparation | No new content; checksum/version recorded |
| 06:00–07:30 | Build owner available | Backup verifier | Backup media owner | Submit build/trailer; inspect upload | **Aim to submit by 07:30** |
| 07:30–09:30 | Buffer for real submission failures | Stand by | Stand by | Verify links/files and confirmation | Deadline buffer, not feature time |

Breaks and short rest periods rotate around each role's gate. This is already an aggressive schedule. If the 19:30 geography gate slips, B stops new enemy work and helps fix traversal. If the 21:30 complete-game gate slips, C stops cosmetic work and helps D test the critical path.

## Cut rules that protect the core

1. Cut the optional flame pulse before cutting enemy tells.
2. Cut Pouncer/Gatherer variants before cutting the ending.
3. Cut cinematic zoom before cutting continuous follow and parallax.
4. Cut save-to-disk before cutting reliable session state and checkpoints.
5. Cut extra inspection objects before cutting the single meaningful return journey.
6. Cut voiced dialogue before cutting sound cues and readable captions.
7. Cut separate new locations before cutting a tested connected route.

If merging every outdoor painting is too slow, use three or four wider connected regions made from existing art, combine the lane with the square, and place the finale on the far bridge bank/camp area. Preserve continuous camera travel, an actual return route, hearth sacrifice, and rescue. A compact finished world remains faithful to the request.

Do not add a replacement full 3D engine, a generic open-world framework, generated quest systems, multiple endings, or new bosses after the gates have slipped.

## Art pipeline

### A. Lock a style reference and geometry

Use the existing dark bridge painting, its restored pair, and the hero sheet as the master reference set. Greybox terrain is the source of truth for playable surfaces. Create a simple annotation image with ground line, camera edge, interaction location, and no-occlusion areas before generating or painting new scenery.

### B. Build only the missing assets

| Asset | Quantity target | Technique | Priority |
|---|---:|---|---|
| Connector ground strips | 2–3 reusable variations | Crop/paint from existing stone and earth; tune edges to the greybox | Must |
| Foreground silhouettes | 3 reusable pieces | Fence/arch/branches from current palette; transparent edges | Must if time allows clean masks |
| Fog/haze | 1–2 small reusable textures | Simple authored gradients/noise; restrained alpha | Useful |
| Ember cup / held ember icon | 1 each or one shared icon | Small readable silhouette; existing glow behind it | Must; placeholder acceptable |
| Finale ritual lamps | 1 reused three times | Existing brazier/fire assets | Must |
| Eli present / tethered appearance | Existing sprite, two treatments | Warm translucent upright silhouette → normal sprite | Must |
| Permanent bridge return path | 1 small modular route | Rope/stone segments, with visible collision | Must |
| New enemy sheet | 0 | Reuse and improve existing shadow | Deliberate scope choice |
| Full new background | 0 initially | Existing art plus connectors | Deliberate scope choice |

### C. If using image generation

Use actual reference images and a fixed geometry guide. Ask for one required asset at a time with its intended scale, palette, light direction, and transparent/background specification. Example brief: “A short side-on stone path connector matching the supplied village art; walkable edge at the supplied guide line; charcoal stone, muted violet haze, restrained amber highlights; no characters, no text; preserve the exact endpoints.”

Do not ask a model to invent paired collision-critical scenes independently. Derive a restored version from the same geometry and inspect the pair overlaid. Do not accept mismatched landmarks, additional unintended ladders, inconsistent pixel density, baked-in UI, or animated characters baked into the background.

If two iterations do not produce usable game geometry, use a simple manually assembled connector. New art must improve the running composition, not merely look attractive as a standalone image.

### D. Export and inspect

Use consistent names, explicit dimensions, and transparent PNG for cutouts. Match frame origins and foot positions across animation sheets. Preserve source files. Test images at game scale, at both camera edges, in both time states, and while walking left. Check halos, mask spill, texture seams, and collision alignment.

Have C maintain an asset manifest: file, author/source, licence/permission, modifications, and whether disclosure is required by the actual competition rules. The supplied screenshots do not establish the event's asset policy; D verifies it.

## Audio pipeline

The minimum audio pack is small but complete:

- Footsteps: two or three variations; stop when airborne or paused.
- Lantern/fire ignition, looping crackle, memory expansion and fade warning.
- One reverse bell for restoration and one ordinary bell/soft resolve for the ending.
- Shadow notice, lunge/contact, and dispersal.
- Two gentle knocks for Eli's identifying motif.
- UI confirm, player failure, and quiet restart cue.
- Wind/ruin ambience, warm remembered ambience, and a short music bed or two compatible layers.

Prefer licensed existing sounds or original recordings over a new complex audio toolchain. Sound can be generated/recorded separately from Sol's coding work; the coding model is not a substitute for an audio renderer. Keep voice acting optional. Captions carry essential dialogue.

Implement a single AudioDirector. Crossfade present/past ambience from memory state; do not restart background music on every region boundary. Duck ambience gently during key lines. Pause/mute must handle loops without stacking them on resume. Unlock web audio on the first deliberate player input. Expose master volume and mute in pause.

Listening tests: laptop speakers at moderate volume, then headphones; no clipped ignition, inaudible warning, overlapping loops, or dialogue swallowed by ambience. Silence before the two knocks is an intentional contrast, not missing audio.

## Trailer: 45–60 second edit, subject to actual event limit

The supplied rubric says trailers determine the top-five shortlist. Start capturing as soon as the bridge sequence works; do not leave all capture until the final hour. Only show implemented gameplay as gameplay.

| Time | Actual footage | Purpose / optional text |
|---|---|---|
| 0–5s | Ruined bridge ignites and rebuilds under the travelling camera | Establish the hook immediately: “Light the past.” |
| 5–12s | Hero walks through layers; corrupted sky and stopped tower appear | Show a continuous world and atmosphere |
| 12–20s | Shadow notice, evasion, fire dispersal | Show danger, control, and fire interaction |
| 20–28s | Brother's echo runs over restored stairs/bridge | “Follow what remains.” |
| 28–36s | Return to the same home; ember transfers into lantern | Show a meaningful action and change of place |
| 36–46s | Short final encounter and glimpse of two warm eyes/two knocks | Emotional question; avoid spoiling the whole ending |
| 46–55s | Hero approaches the small figure; title and brief hold | “Embers of Before — Light the past. Bring him home.” |

Use legible text, short cuts, and real game sound. Do not spend the opening ten seconds on studio logos, exposition cards, or an empty title. If the game has no voice, the trailer does not need a narrator. Check its story is understandable when muted; check audio peaks when sound is on.

Capture at a stable resolution/framerate supported by the machine, preferably 1080p/60 if smooth, otherwise clean 720p/60 or 1080p/30. A stable video is better than inconsistent capture. Do not advertise unimplemented systems. Include only allowed logos/credits; follow event duration, codec, and file-size requirements.

## QA log format and targets

For each issue record: build commit, scene/coordinates, starting state, exact inputs, expected result, actual result, screenshot/video, severity, owner, retest result.

- P0: cannot launch, progress blocked, impossible return, missing ending, corrupted release. Fix first.
- P1: unreliable jump/attack, state reset, repeated story, invisible hazard, broken sound loop. Fix before cosmetics.
- P2: seam, small visual offset, minor caption polish. Fix only without destabilising P0/P1.

Fresh-player questions: “What does fire do?”, “Where are you going?”, “Why are you going home?”, “How did you recognise Eli?” Ask after play, not while coaching. If a player cannot answer, improve the relevant visual/action cue before adding explanatory paragraphs.

Targets to validate: first useful interaction within one minute; first theme-combination moment within two minutes; no unexplained dead end; most testers understand the next destination; retries do not replay a long introduction; finish without help; bridge and final transfer remain visually understandable in recorded footage.

## Packaging and release

Primary low-risk path: keep Phaser and ship the built web game with the event-approved hosting or local-serving method. A local browser game satisfies “can run locally”; double-clicking `index.html` is not a reliable launch method for fetched assets/modules. Document the actual tested method.

For a developer-machine demonstration, `npm ci`, `npm run build`, then `npm run preview -- --host 127.0.0.1` can serve the build, but this requires Node/dependencies. Do not present that as a self-contained executable. If judges need an offline folder that runs on a clean Windows machine, prove an approved local launcher/runtime or desktop wrapper early and test on that clean machine. Do not begin learning a new packager after 02:00.

If choosing a desktop wrapper, keep it as a packaging layer over the stable game, allocate a separate small spike before 19:30, and abandon it if install/launch introduces unresolved issues. Verify the exact target OS with D. No runtime network dependency for fonts, art, audio, or saves in the local submission.

Release bundle should include game/build, concise launch instructions, controls, credits/licences, the exact submitted trailer, and a release version/commit record. Do not include caches, credentials, or unnecessary `node_modules` unless the tested distribution method specifically requires bundled runtime dependencies. Keep the final upload archive and a second local copy.

### Final checklist

- [ ] Actual event rules recorded: deadline, timezone, asset eligibility, trailer length, upload format/platform.
- [ ] Production build launches on a second machine through the included instructions.
- [ ] Fresh start, pause, mute, failure/retry, completion, and new-game restart tested.
- [ ] Walk left/right across every outdoor seam without a scene cut.
- [ ] Hearth return, shortcut, bridge expiry, and far-bank return tested.
- [ ] No debug overlays, test shortcuts on menu, missing files, or “coming soon” ending.
- [ ] Offline media/font test passes for a local submission.
- [ ] Full run and trailer capture match the release commit, or any differences documented and corrected.
- [ ] Credits and asset permissions/disclosures match actual event rules.
- [ ] Trailer exported, watched beginning to end, audio checked, actual format limit checked.
- [ ] Upload downloaded/opened or otherwise verified; confirmation retained.

At 07:30, a submitted stable build is more valuable than an unsubmitted prettier one.
