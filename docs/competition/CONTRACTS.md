# Integration contracts

Status: expanded original Acts 1–3 are implemented and checked through short
production interactions. No uninterrupted new full run is claimed. Browser-local
autosave is implemented; the original module proposals and earlier interfaces
below are supplemented/superseded by this current chapter contract.

## Current Acts 1–3 contract (latest)

- Canon: CANON's latest chapter revision and ACTS-IMPLEMENTATION supersede the
  earlier five-beat shelter ending. Route is Title → Intro → Hearth ↔ World →
  Hearth epilogue → Credits; original A1 scenes are development references only.
- Layout: WORLD_WIDTH=18000, eleven contiguous REGIONS carrying act/name/art/
  paintGround; GAPS lists five holes; SPAWNS includes playground, swingBank,
  treehouse, passage, canal, canalBank, courtyard, mechanisms, crown. RELAYS
  exports the three stable tower-relay IDs, positions and floor heights.
- Chapters.js owns buildChapters/tickChapters/memoryChapter. World owns common
  floor/art/camera setup and delegates chapter interactions, enemies and puzzle
  rendering. Surface interfaces are unchanged; moving swing updates its static
  body and carries a grounded player. Return crossings persist in WorldState.
- New state: villageGateOpen, campReturnOpen, swingReturnOpen, canalGateOpen,
  canalReturnOpen, hasDrawing, maxXReached. findDrawing() atomically grants the
  unique drawing/cup; ringRelay(id) validates the ID and protected ember; relayCount
  counts only configured relays. rescue() requires all relays AND bell-warden
  cleared, then consumes only the quest ember. Home interaction sets completed.
- goal getter returns {text,scene,x,y}; Adventure.getGoal() provides interior
  hearth/return overrides. HUD and map consume the same target; out-of-order bell
  visits target the actual remaining relay. Existing objective getter returns text.
- litFinaleLamps is a retained internal field name, now keyed by tower-relay-1/2/3.
  Shelter lamps, square cup and early shelter ending are no longer the main route.
- Crawler accepts kind=crawler|pouncer|warden. Pouncer/warden lunges lock facing
  during anticipation. Warden has four health, ignores ordinary restoration,
  and cannot be damaged before all relays; it never auto-clears on a bypass.
- SAVE_KEY=embers-before-three-acts-v1, schema version3. decodeSave validates
  safe scene/spawn IDs, supply caps and stable IDs; readSave/resumeSession/
  saveSession tolerate unavailable storage. Autosave occurs at transitions,
  objective updates, pause and periodic simulation ticks. Continue restores safe
  checkpoint and flags, not current position/memory/partial enemy damage.
- newSession clears the browser save; Title Enter continues when available, N
  begins fresh. Completed saves are not offered as Continue. Origin/profile
  isolation means localhost ports/machines do not share saves.
- Pause receives {owner,inventory,map,journal}. M/J pause map/journal, I is five
  inventory cards, Esc pause has resume/mute/restart. Timers/physics freeze.
- Completion event is game:completed {endingId:'three-acts-home'} at the home coda.
  The earlier rescue event alone no longer completes the game.

## Earlier core interfaces retained for reference

## Required boundaries

| Component | Owns | Does not own |
|---|---|---|
| World/session state | Persistent flags, stable IDs, checkpoint IDs | Phaser sprites, active tweens or sounds |
| WorldScene | Geometry, player, region activation, world transitions | Authoring every story line inline |
| Memory system | Local restoration phase, affected objects, clock | Global daylight or remote enemy clearance |
| Story/encounter modules | Triggers, beats, quests and encounter setup | Recreating the player/physics world |
| Camera director | Follow and bounded scripted framing | Progression state or combat damage |
| Audio director | Cues, ambience, mix, pause/mute | Quest completion or timing rules |

## Record the implemented contract here

- State: `src/world/WorldState.js` exports `WorldState`, `getSession(scene)`, `newSession(scene)`.
- Lifetime: `scene.registry.get('worldState')`; explicit New game/Pause restart replaces it.
- Regions: `yard`, `lane`, `square`, `bridge`, `camp`; interior memory region `home`, scene `Hearth`.
- Spawns/geometry: `src/world/layout.js` exports `SPAWNS`, `REGIONS`, `GROUND`, `BRIDGE_GAP`, `WORLD_WIDTH`; home spawns are in Hearth. Ground is 560 outdoors, width 8200. Checkpoints store scene + authored spawn ID.
- Coordinate helper: `worldPoint(origin, point)` adds the origin once. The tested flat layout is authored in World; the presentation pass preserves all surface endpoints and heights.
- Memory: `new MemorySystem(scene)`, `activate(fire) -> boolean`, `canActivate(fire)`, `cancel(reason)`, `update(deltaMs)`, `isRestored(regionId)`, getters `usable`, fields `phase`, `remaining`, `alpha`, `fire`, `cooldowns`.
- Memory calls scene hooks `setMemoryVisual(regionId, alpha)`, `onMemoryReady(fire)`, `onMemoryEnded(fire, reason)`. Cancellation clears logical state before refreshing collision. One active region; ended memories cool for 4000 simulation ms.
- Base scene: `Adventure.setup(width, spawn)`, `addSurface(...)`, `addFire(data)`, `addInteract(data)`, `story(id, ...lines)`, `echo(points)`, `goTo(sceneKey, spawnId)`, `isSafe(x, feet)`, `nearFire()`.
- Interactions: `{id,x,floor,label,when,use,range?,priority?,hold?}`; priority first, then proximity. E hold uses simulation time and must begin with a fresh press. R rest is a separate 2000ms channel; one completion per press. No queued E action after rest/transfer.
- Protection: `dead`, `leaving`, `player.acting/frozen`, `transferRemaining`, `invulnerable`, `run.rescuedEli`; CombatSystem validates damage and action requests. Pause stops the owning scene including physics/clock/tweens and manual delta updates.
- Story: `run.completeStory(id) -> boolean`; `story()` commits once, replaces captions and emits an event. Pickups and rescue are explicit idempotent state operations.
- Transitions: current main route is `Title → Intro → Hearth ↔ World → Credits`. `goTo(key, spawnId)` cancels transient memory/actions and calls `scene.start(key, {spawnId})`. Intro always starts Hearth with `spawnId:'cellar'`, preventing stale entry data on a second run.
- Camera: in Adventure.update; horizontal clamped eased follow/look-ahead, fixed vertical view, zoom 1. No separate CameraDirector yet.
- Audio: AudioCues owns small original synthesized cues and the registry `muted` setting. No external sound assets, music, looping ambience or final mix yet. Scene shutdown cancels echo tweens/actions and destroys per-scene lighting.

## Survival and inventory

- `src/world/balance.js` exports immutable `BALANCE`: health 3, flame 100, oil 1,
  oil refill 35, remember cost 25, sweep cost 20, range 160, strike windup 150ms,
  cooldown 800ms, rest 2000ms, memory cooldown 4000ms, damage immunity 1400ms.
- WorldState: `spendFlame(amount) -> boolean`, `useOil() -> boolean`, `recover()`,
  `takeDamage(amount=1) -> remainingHealth`. These never spend/drop the unique quest ember.
- `CombatSystem(scene)`: `sweep() -> boolean`, `damage(sourceX) -> boolean`,
  `update(deltaMs)`, `cancel()`. Strike occurs once after windup and checks facing,
  horizontal range and height. Interruption removes a pending strike.
- `Crawler`: `tick(deltaMs)`, `hit(direction)`, `disperse()`, `resetEncounter()`,
  `touches(player)`. Health 2; stagger 650ms; attacks deal one player health.
- `Pause` receives `{owner,inventory}`. I opens a paused satchel with unique item
  counts and one oil slot; I/Esc closes it. Esc pause provides resume/mute/restart.
- Scene shutdown owns sprite/tween/listener cleanup. Run state stores only plain
  progress/resource values; normal death restores supplies and preserves quest flags.

## Presentation / external asset delivery

- Latest user instruction: no further image generation by the coding agent. The
  user will use a dedicated image model; briefs and export specs are in ASSET-HANDOFF.md.
- `public/art/manifest.json` maps stable texture keys to local SVG/PNG paths. Boot
  loads this manifest before the presentation assets. Existing hero/shadow/fire
  animation sheets and their manifest remain unchanged.
- `createPresentationTextures(scene)` packs generated source strips by their
  alpha bounds into normalized `brother` (six 96×96 frames, visible height 76) and
  `hero_climb` (four 155×110 frames, visible height 106). Six / four columns are
  mandatory; filenames can be replaced without altering collisions.
- The three raster images produced before the no-generation direction are
  integrated drafts, not approved final art. Twelve original SVG props have
  editable source in tools/build-presentation-assets.mjs. PNG replacements only
  require changing their extension/path in the manifest.
- `surfaceArt(scene,x1,x2,y,options)` returns `{block,edge}` containers, replacing
  grey rectangles. `Adventure.addSurface` keeps `{zone,block,edge,...}` and the same
  32px top-only Arcade collider. Only the existing restored/permanent flags enable it.
- World splits permanent floor visuals/colliders at region boundaries so living
  grass only appears inside the restored region. Bridge rails share its surface
  container: visible exactly when the deck's collision is enabled.
- `terrainLife` entries `{regionId,growth}` follow memory alpha; cropped source
  paintings are background dressing, and new texture edges mark the playable floor.
- `Pause` inventory owns four item cards, mouse/arrow selection and contextual
  descriptions. It still pauses the owning scene, changes no inventory/resources,
  and closes with I/Esc. Counts derive directly from WorldState.
- New animation keys: `brother-idle`, `hero-climb`, `hero-sweep`. Sweep currently
  reuses supplied light poses; strike remains 150ms / cooldown 800ms. Bursts,
  ignition sparks and dissolve animations are presentation only.
- Interior captions use y212 to expose the cellar y650 walk line. Outdoor
  captions retain y650; all essential HUD/prompt elements are above darkness.

## Emitted event payloads

```js
// Plain data and stable IDs, emitted on the owning scene.events.
'fire:ignited'     // { fireId, regionId, x, y }
'memory:ready'     // { fireId, regionId, durationMs }
'memory:ending'    // { fireId, regionId, remainingMs }
'memory:ended'     // { fireId, regionId, reason }
'region:entered'   // { regionId, fromRegionId }
'story:completed'  // { storyId }
'player:died'      // { checkpointId, reason }
'player:respawned' // { checkpointId }
'game:paused'     // {}
'game:resumed'    // {}
'game:completed'  // { endingId: 'rescue' }
```

Fire/memory/player/region/pause events may repeat; story completion is once per
story ID per run. `game:completed` emits at the coda trigger. Listeners attached
by later presentation modules must be cleaned up on shutdown. Current audio is
called directly rather than subscribed through a separate event dispatcher.
