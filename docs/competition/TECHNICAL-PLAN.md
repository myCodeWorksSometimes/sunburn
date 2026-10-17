# Technical implementation plan

Use [EXECUTION.md](EXECUTION.md) for implementation order and [CANON.md](CANON.md)
for current world rules. First prove gameplay with existing assets/placeholders.
Functional light/safe zones and clear restored-day/corrupted-night states belong
in the core; final asset production, shaders and lighting polish belong after G4.

## Architecture decision

Keep the installed Phaser/Vite project and JavaScript. Build **one outdoor `WorldScene`** with one player, one physics world, one travelling camera, and region-owned content. Keep `Home` as an interior. Keep the existing old scenes available only as development references until the new route passes acceptance; remove them from the release route when integration is complete.

Do not make the world by running the old scenes invisibly side by side. Do not stretch their finished paintings horizontally. Do not rewrite the game into an ECS, streaming engine, TypeScript codebase, or 3D renderer tonight.

Phaser supports camera follow/bounds and scroll-factor parallax; these are the existing mechanisms to extend. See [camera docs](https://docs.phaser.io/phaser/concepts/cameras) and [components](https://docs.phaser.io/phaser/concepts/gameobjects/components). Verify APIs with installed 4.2.1 and a live smoke test before committing to unfamiliar effects.

## First prove the world

At present, `LevelScene.create()` sets the camera bounds to each level's width, normally 1290px. The viewport is 1280px. This is the main structural reason the game looks like fixed screens even though `startFollow()` is called.

The first prototype should contain only existing hero movement, grey collision shapes, and Yard–Lane–Square laid out across more than 4,000px. Start walking left and right, with no scene transitions. Extend to all five outdoor regions only after this works. Test the physical connectors before adding scenery.

Conceptual placement, subject to actual collision alignment:

| Region | Approximate world origin X | Existing paint width | Connector to next |
|---|---:|---:|---|
| Yard | 0 | ~1290 | 320–480px garden path |
| Lane | 1650 | ~1290 | 320–480px ruined street |
| Square | 3300 | ~1290 | ~400px rising/falling approach |
| Bridge | 5000 | ~1290 | ~400px bank approach |
| Camp | 6700 | ~1290 | End boundary beyond rescue/coda space |

Final coordinates come from the greybox, not this table. Existing ground heights differ (Yard ~508, Lane ~555, Square ~545/landing 355, Bridge ~410, Camp ~545). Connect those actual elevations with tested ramps/steps. Check the reverse route as carefully as the forward route. Keep the playable lane in a consistent vertical band so the camera can remain vertically stable.

## Suggested modules and ownership

| Module | Responsibility | Human owner |
|---|---|---|
| `src/scenes/World.js` | Outdoor lifecycle, player/physics, region dispatch, exits | A: integrator |
| `src/world/layout.js` | World origins, geometry, connectors, spawn points | A |
| `src/world/WorldState.js` | Persistent IDs, checkpoints, progression | A |
| `src/world/regions.js` | Content definitions: fires, encounters, story IDs | B: gameplay/story |
| `src/systems/MemorySystem.js` | Local restoration lifecycle and safe collision changes | A |
| `src/systems/CameraDirector.js` | Follow, look-ahead, bounded set pieces | A |
| `src/systems/AudioDirector.js` | Music/ambience, cues, mute and volume | C: presentation/audio |
| `src/content/story.js` | Short caption lines, echo paths, one-shot events | B |
| `src/entities/Shadow.js` | Enemy state/tells, pursuit limits, optional variant | B |
| `src/systems/Lighting.js` | Correct camera transforms and visibility | A |
| `public/audio/`, foreground assets, credits manifest | Approved production media | C |
| QA evidence, trailer project, submission checklist | Human playtests and delivery | D |

Names are proposed, not existing APIs. A owns integration points in `main.js`, `Boot.js`, `LevelScene.js`, and `Home.js`. B/C deliver modules and request a small integration patch; they do not edit A's core files concurrently. Split responsibilities further only when an actual bottleneck appears.

## Minimum integration contract

Agree these shapes before parallel coding. Adapt to code conventions once; do not change the interface independently in three branches.

```js
// Persist plain data, never Phaser objects.
worldState = {
  version: 1,
  checkpoint: { scene: 'World', spawnId: 'yard-entry' },
  hasLantern: false,
  hasEmberCup: false,
  hasHearthEmber: false,
  homeMemorySpent: false,
  shortcutOpen: false,
  bridgeReturnOpen: false,
  rescuedEli: false,
  completedStory: {},     // stable event ID -> true
  clearedEncounters: {},  // stable encounter ID -> true
  litFinaleLamps: {},     // stable lamp ID -> true
};

// Region geometry is authored locally; the loader adds origin exactly once.
region = {
  id: 'lane', origin: { x: 1650, y: 0 },
  bounds: { width: 1290, height: 720 },
  platforms: [], ramps: [], walls: [],
  fires: [], encounters: [], storyTriggers: [],
};
```

Public operations: `worldState.setFlag(id, value)`, `worldState.completeStory(id)`, `worldState.clearEncounter(id)`, `worldState.setCheckpoint(spawnId)`, `memory.activate(fireId)`, `memory.cancel(reason)`, `camera.playBeat(beatId)`, `audio.playCue(cueId)`, `audio.setRegion(regionId)`. Exact signatures must be written down in the implementation before B/C consume them.

Emit a small agreed event set: `fire:ignited`, `memory:ready`, `memory:ending`, `memory:ended`, `player:died`, `player:respawned`, `region:entered`, `story:completed`, `game:paused`, `game:resumed`, `game:completed`. Payloads use stable IDs. Audio and presentation observe these events; they do not change progression state.

## Persistent world and reset policy

World state lives outside any one playable scene, via the game registry or a shared session object. A scene transition must not create a new session. “New game” explicitly creates it.

| State | Walk away and return | Die / retry | Reload browser or app |
|---|---|---|---|
| Open shortcut, permanent walkway | Keep | Keep | Keep only if optional save implemented |
| Collected cup and hearth ember | Keep | Keep | Same |
| Spent home memory | Keep | Keep | Same |
| Story beat completion | Keep | Keep; do not replay long captions | Same |
| Cleared encounter | Keep after victory commit | Keep committed victories | Same |
| Active enemy position / windup | Suspend or reset safely outside view | Reset active encounter to authored start | Reset |
| Temporary restoration | Uses active simulation clock | Cancel and return to safe present geometry | Reset |
| Finale lamp progress | Keep within encounter/run | Keep lit lamps, reset threats | Optional save |

Store a progress flag when an action completes, not when the player merely enters the trigger. In-memory persistence is required. Local storage is optional and must use a versioned schema, validation, a clean-new-game option, and safe fallback on invalid data. Do not save partial attack/tween objects or arbitrary player coordinates.

Checkpoints are authored **safe present-state ground points** beside fires. The current code sets the checkpoint from the player's feet during ignition; replace this where restored surfaces could disappear. On death: freeze input, cancel encounter/cinematic callbacks, resolve temporary memory, reset relevant enemies, place the player safely, clear input edges, then resume. Never respawn on a temporary bridge.

## Local time restoration

Current `startRewind()` crossfades the entire scene's images and dissolves shadows within 700px. That is manageable for a one-screen scene but wrong for a large world. Each fire must identify its memory region and affected objects.

Minimum system states: `idle → warming → active → warning → fading → cooldown → idle`.

- Warming: about 0.7–1.2 seconds; show ignition and restoration. Gate attack damage if player control is held.
- Active: start the advertised useful timer when restored collision becomes usable, not at the beginning of a long flash.
- Warning: last three seconds, distinct sound and a readable icon/bar change; optional gentle edge shimmer.
- Fading: scenery returns; collision changes at a documented state boundary. Keep all affected visuals and geometry driven by the same scalar/state.
- Cooldown: brief relight delay, visually indicated. Never force a long wait after failure.

Only one active restoration at a time tonight. A new activation cleanly completes or cancels the previous one before starting. Nearby ordinary safe light remains functional independently. Region-limited restoration must not alter remote ladders, clear offscreen enemies, or replay every brother echo. Daylight and greenery belong to the restored region; the shared global sky must not turn unrelated regions into day. Prototype with a region-bounded daylight layer or simple bounded colour cue, then polish the boundary later. Normal healthy time is represented by an authored remembered moment and resumed ambient motion, not a full 24-hour simulation.

Pause freezes the simulation clock and the countdown. Leaving the visible region should not restart its timer; the world remains one scene. Entering Home cancels the outdoor temporary restoration while preserving permanent progress. Decide this explicitly and show the current fire fading before transition if visible.

Avoid true physics rewind/history buffers. All restored structures have authored present and past states. Use an animated reveal for art, then enable known collision. A world-space wavefront reveal is optional; a clean region crossfade is the fallback.

## Backtracking safety rules

1. Every temporary route has a safe near-side waiting area and a known recovery point.
2. The bridge's far-bank interaction opens a permanent physical return walkway. If the player reaches the far bank, commit this automatically or make it unavoidable.
3. Square stairs have a permanent descent and a way to relight from the lower side. No one-way exit wall traps a returning player.
4. The spent home candle never gates leaving Home. Its ordinary illumination can remain while its memory is unavailable.
5. The quest ember cannot be spent on attacks, extinguished by a creature, or lost on death.
6. Direction changes and re-entry do not retrigger tutorials, pursuit spawns, or opening cutscenes.
7. The shortcut has identifiable endpoints and safe entry coordinates. After using it, the player must know where they are.

## Camera and 2.5D treatment

Start with horizontal follow at zoom 1. A modest dead zone (around 20% of the viewport width), eased look-ahead of 100–160px, and stable vertical framing are initial tuning values. Direction reversal eases the look-ahead over roughly 0.2–0.35 seconds. Clamp both look-ahead and cinematic targets to the world bounds.

Do not attach fixed-size screen masks to an assumed camera position. `Lighting.js` currently computes `(worldPosition - camera.scroll) / RES`, which does not account for arbitrary zoom/rotation. Keep zoom locked at 1 until A implements and tests the appropriate world-to-screen transform, radius scaling, viewport alignment, and UI exclusion. Cinematic zoom is a stretch effect after that test passes. No camera rotation tonight.

Suggested parallax factors: sky 0.05–0.12; skyline 0.2–0.35; distant architecture 0.5–0.75; playable geometry 1; foreground 1.08–1.18. These are tuning ranges. A scroll factor affects drawing, not collision. Keep collision-bearing objects at factor 1. Place global layers in a coordinate scheme that covers the entire camera range; isolated local layers need carefully calculated anchors to avoid sliding away from their region.

Do not add fake parallax to an image containing the same bridge the player walks on. Separate decorative/background portions from solid geometry. If there is no time to cut a clean mask, leave the painting on the gameplay plane and add depth with the skyline, fog, and foreground.

Camera beats have a start, maximum duration, skip path, and guaranteed return to player follow. They cannot remove input during a timed jump. They cannot show hazards before they are actually active or hide an approaching attack.

## Art assembly and collision

Reuse existing scene paintings as world sections at native intended scale. Cover joins with **short authored connectors**, not stretched images: stone paths, walls, arches, vegetation, fog, and foreground posts. A masked seam can look natural; mismatched ground levels cannot.

Existing restored images use manual transforms in several scenes. Those values are evidence of alignment workarounds, not proof of a runtime bug. For every collision-bearing feature, overlay both states and inspect alignment before using it in a camera pan. Cut the bridge deck or stair silhouette into a separate registered asset if required. No geometry may appear to move sideways while its collision stays fixed.

Use shared sky/skyline rather than rendering the same distant tower five times. Crop redundant silhouettes out of region paintings only when the result is visually clean. Prioritise actual camera compositions over individual source-image beauty.

## Lifecycle and bugs to audit during migration

- Explicitly reset transient `dead`, `leaving`, `acting`, one-shot timers, and camera state on scene entry; existing scene subclasses have several lifecycle flags to review.
- Remove update listeners used by echoes on completion **and** shutdown/cancel; avoid multiple callbacks after a restart.
- Cancel animation-complete handlers before replacing an action; E spam must not stack ignition callbacks.
- Release region-owned particles, lights, sounds, and textures exactly once on shutdown.
- Suppress physics/interaction damage while paused, dead, in protected cutscenes, or during the final transfer.
- Draw timer and subtitles in screen space; world travel must not move the UI.
- Bind each encounter to patrol limits; no enemy walks through a house wall chasing the player across the whole world.
- Avoid a `create()` reset of persistent state when moving between Home and World.
- Check the declared `?test` behaviour against actual pause/visibility behaviour; do not rely on a comment as a test result.

## Verification and performance gates

Run `npm ci` and `npm run build` on the baseline before changes. For unfamiliar Phaser APIs, first implement a small visible spike. Automated tests are useful for pure world-state transitions, coordinate translation, save validation, and memory-state cancellation; visual movement and feel require actual play.

Mandatory test sequence:

1. New game → control → first ignition → walk through all outdoor joins in both directions.
2. Relight a fire twice; leave and return; no duplicated captions, particles, or enemies.
3. Collect cup, return home, take ember, use shortcut; flags survive both transitions and death.
4. Cross bridge; immediately turn back; wait for expiry on each side; all outcomes recover.
5. Die during warning, ignition, enemy windup, and just after a checkpoint.
6. Pause for 30 seconds during a memory; resume with the same remaining time.
7. Skip opening and finale cinematics; correct state, follow, input, and ending remain.
8. Complete rescue; restart; complete again without accumulated listeners or stale flags.
9. Launch production output with network disconnected; verify font, audio, assets, controls.
10. Two fresh players complete from the release menu without coaching.

Target 60fps on the actual judge/demo laptop, no sustained dips below 45 during the bridge and finale; adjust to measured hardware. Keep a small cap on simultaneous particle emitters and lights, deactivate far-away effects, and avoid per-frame asset creation. Load the small world upfront if memory allows. Streaming is unnecessary unless measurement proves otherwise. Watch texture memory because paired full-size paintings expand substantially in GPU memory.

Do not call a passing production build a gameplay test. Record browser/OS, tested commit, completion time, failures, and observed performance in the release checklist.
