# Integration contracts

Status: expanded original Acts 1–3 are implemented and checked through short
production interactions. No uninterrupted new full run is claimed. Browser-local
autosave is implemented; the original module proposals and earlier interfaces
below are supplemented/superseded by this current chapter contract.

## Bridge works contract (17 October 2026, latest)

- **World shift:** every world x position ≥ 5300 moved +600 (bridge region width
  1650 → 2250, WORLD_WIDTH 18000 → 18600, save cap follows). Fire durations were
  not touched. Older coordinates quoted below this section predate the shift.
- Code: `src/world/BridgeWorks.js` (`buildBridgeWorks`, `tickBridgeWorks`). Layout
  `BRIDGE_WORKS {arenaMin 5340, arenaMax 5690, elite 5420, crate [5600,5680] at
  y485, barrier 5700, leverA 5750, leverB 5805, brake 5865, bigGear, smallGear}`.
  Bridge fire/spawn now 5970, BRIDGE_GAP 6080–6640.
- Braced Shadow: pseudo-enemy `braced-shadow` (restoration-immune). States idle →
  windup 1.3s (direction locked) → charge 360px/s → stunned 2.6s if it reaches the
  barrier line (first impact breaks the barrier) / recover 0.9s otherwise. Only
  sweeps from behind while stunned hurt it; 2 hits. Contact damage only while
  charging on the ground. Death resets it (and an unbroken-defeat barrier).
- Gears: big/small quarter-turn counters start 2/1; lever A +1 both, lever B +1
  small, only while the bridge region is restored. Brake (hold 600ms) requires
  both at 0 → `setBridgeBrake()` (requires `clearedEncounters['braced-shadow']`).
- Surfaces accept `requires` (extra condition on top of restored time). The
  bridge deck requires `bridgeBrakeSet`. Save migration: a crossed bridge ⇒ elite
  cleared and brake set.
- Story IDs: `braced-barrier`, `braced-defeated`, `bridge-gears-memory`,
  `bridge-brake`; Tomas's hearth talk adds two lines about the works.
- Fix: a Five-Hand already defeated when the scene builds stays `defeated`.

## Five-Hand contract (17 October 2026)

- Code: `src/world/FiveHand.js` (`buildFiveHand(scene)`), called after
  `buildAct1Story`. Layout `FIVE_HAND {body 4850, slots[5] 4595–4795, cardY 410,
  arenaStart 4560}`; the market exit gate moved to `MARA_STALL.exitGate` 4830.
- State: `freeMara()` no longer opens the exit. `defeatFiveHand()` (requires
  `maraFreed`) sets `villageGateOpen` and `clearedEncounters['five-hand']`. A save
  with the exit already open counts Five-Hand as defeated. Goal after Mara is
  freed: "defeat Five-Hand at the market exit".
- Fight states: waiting → observe (1.8s, face up) → flipdown → shuffle (swaps
  `[[1,3],[0,2]]` at 950ms, then `[[0,4],[1,2],[3,1]]` at 750ms) → select (E under
  a slot; interactions `five-hand-card-0..4`) → reveal → window (4.2s, knot hit by
  the normal lantern sweep) or punish (900ms ground warning, 650ms sweep, one
  `combat.damage`). Missed window/punish restart the same round. Two hits win.
  Walking 320px left of the arena or dying resets to waiting.
- It is registered in `scene.enemies` as a pseudo-enemy (`restorationImmune`,
  `touches()` false) so `CombatSystem.sweep` reaches it. Emits
  `five-hand:defeated`. Story IDs: `five-hand-wake`, `five-hand-defeated`.
- Mara stays in her stall until the win, then walks off; the refuge Mara appears
  when she leaves or when Rowan passes the exit.

## Campaign ending contract (17 October 2026)

- After `rescue()`: no dialogue (story `rescue` completed silently). A permanent
  viewing ledge (x 17670–17940, y 380, shown after the rescue) triggers
  `view-platform` at x > 17760. The crown's Old Road door (16500) now travels to
  World `oldRoadWest` (refuge) instead of the Hearth. Near Nia after the rescue,
  `nia-eli` plays once. Goals: arches → refuge → "Walk home together" (Hearth).
- On any World build after the rescue, Eli (`s.brother`) starts beside Rowan.
  In the Hearth, Eli spawns at Rowan's floor and follows him between floors.
- Ending: hold E at the hearth → caption, then "… tap, tap …"; notice "E: tap
  twice back"; E sets `completed`, emits `game:completed {endingId:'three-acts-home'}`
  and goes to Credits after 3.8s.

## Campaign route reorder contract (17 October 2026)

- Order: playground cup → canal (no ember needed) → tower courtyard: Eli at the
  inspection window, three knocks, Old Road release → Old Road to the refuge →
  market → home: take the ember → cellar passage to the market → Old Road back
  to the tower → bells → Warden → rescue.
- Code: `src/world/TowerStory.js` (`buildTowerStory`, `tickTowerStory`,
  `towerMemory`) called from Chapters.js. Layout: `TOWER_WINDOW {x, y, knock}`,
  `OLD_ROAD_EAST {door, release}`; spawns `oldRoadWest` (4935) and `oldRoadEast`
  (13160).
- State: `eliFound` (`findEli()`), `oldRoadOpen` (`openOldRoad()` requires
  `eliFound`). `takeHearthEmber()` now requires `hasEmberCup` **and** `eliFound`.
  decodeSave migration: holding/spent ember or a rescue ⇒ `eliFound` and
  `oldRoadOpen`. Goals: canal → "tapping at the tower window" → "release the Old
  Road gate" → (scene Hearth) "go home through the market…" → bells.
- Story IDs: `eli-taps`, `eli-found`, `old-road-open`, `eli-step`, `eli-pulled`;
  the crown's arrival line is now `eli-landing`.
- Interactions: `eli-window` (three knocks, freezes Rowan ~3s), `eli-window-talk`,
  `old-road-release` (hold 700ms), `old-road-east` and `old-road-west` (travel via
  `goTo('World', spawnId)`). Removed: `playground-passage`. The playground gate at
  11450 opens on `hasDrawing`. Cellar latch (Hearth) now leads to World `shortcut`
  (market, x 3410) instead of the playground.
- Drawing/cup text no longer has an inscription; the hearth rule comes from Tomas.

## Campaign Act 1 contract (17 October 2026)

- Story source: CAMPAIGN.md Scenes 4 and 6. Code in `src/world/Act1Story.js`
  (`buildAct1Story(scene, gate)`, `tickAct1Story(scene, delta)`), called from
  Chapters.js. NPCs in `src/entities/Npc.js` (`new Npc(scene, 'mara'|'tomas'|'nia',
  x, y, {visible})`, `walkTo(x, {hide, speed})`, `tick(delta, player)`). Placeholder
  looks: tinted hero_idle for Mara/Tomas, tinted `brother` for Nia, with name labels.
- Layout: `MARA_STALL {x1, x2, roof, shutter, release, exitGate}` and
  `REFUGE {oldRoad, nia, hearth, tomas, mara, barrier}` in layout.js. New spawn
  `refuge` (x 5075). Bridge fire and `bridge` spawn moved to x 5370 to make room.
  The stall roof (y 385) is a permanent timber surface reachable only from the
  square's restored steps (jump height ≈120px; roof is 175px above ground).
- State (WorldState, schema version 3 unchanged): `maraFreed`, `heardNia`,
  `heardTomas`. `freeMara()` also sets `villageGateOpen` (market exit) until
  Five-Hand exists; `hearNia()` requires `maraFreed`; `hearTomas()` requires
  `heardNia`. Each returns false when repeated. decodeSave migration: an open
  market implies `maraFreed`; a crossed bridge implies both refuge flags.
- Story IDs: `mara-knock`, `mara-freed`, `refuge-reunion`, `refuge-hearth`
  (journal entries in Pause.js). `village-latch` is retired; old saves keep it
  harmlessly.
- Interactions: `mara-shutter` (knock), `mara-release` (hold 600ms on the roof),
  `old-road-west`, `refuge-hearth-look`, `talk-nia`, `talk-tomas`, `talk-mara`.
  The refuge hearth is a fire with `spent: () => true`: rest and checkpoint work,
  restoration does not. The market exit gate sits at x 4780 (was 4990).
- Ordering rule: until `heardTomas` (and while the bridge is uncrossed) Rowan is
  held at `REFUGE.barrier`, outside the bridge fire's interaction range.

## Acts 1–3 contract (previous iteration)

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

## 18 October 2026 — Parallax backdrop

- `src/presentation/Backdrop.js`: `buildBackdrop(scene, REGIONS)` → `{ sky, skyPast, skyline, skylinePast, paintings }`;
  `paintings.get(regionId)` = `{ x, y, scale, art, dark, past }` on the `PAINTING_SPEED` (0.7) layer.
  `onPainting(backdrop, regionId, px, py)` maps painting pixels to layer coordinates (use scrollFactor `PAINTING_SPEED`).
  `tickBackdrop` runs from `World.tick`; `World.setMemoryVisual` records `restoredView`.
- Region `art` is the wanted key; `fallback` + `paintGround` describe the borrowed painting until `bg_${art}_dark` exists.
  New art: walk line at 62% of the image height.
- `public/bg/manifest.json` (written by `tools/process_backgrounds.py`) lists every background; Boot loads them all.
- Region `continues: true`: when this region and the previous both use their own art, the painting is placed at `prev.x + prev.width * 0.65` with `prev.scale` (OVERLAP 0.35, matching `tools/make_continuation.py` and the processor).

## Act 1 presentation / Card Court contract — 18 October 2026

- Act1Presentation.js registers supplied home/yard/Act1 art; no bitmaps replaced.
  Nearby paintings scroll at1, distant layers retain parallax. Other acts keep
  their owners' placement policies. Solid terrain edges never fade to a hole.
- HOME anchors: upper floor430, cellar650, front175, cellar gate980, ladder410.
  Shortcut spawn915/650; existing cellar interaction/spawn IDs retained.
  Ember objective points to the iron gate. Painted doors/ladder supply visuals.
- surfaceArt returns empty visuals for indoor floors and registered Act1 ground,
  retaining bodies. Temporary stairs/bridges still draw readable surfaces.
- World.yardSurface spans780–1100: restored-only until x>1135, then permanently
  enabled by WorldState.yardReturnOpen. Existing boolean save validation preserves
  it. Old saves loaded east of the pit secure it on the first World tick.
- MARA_STALL:3630–3870,roof385,shutter3790,release3815,exit4830. Steps:
  3290–3400/y500,3405–3515/y440,3520–3640/y380. Square fire/checkpoint3250.
  Echo route follows the steps. Market passage3410 is a pavement hatch.
- FIVE_HAND:body4785,arenaStart4080,slots4140/4270/4400/4530/4660,cardY405;
  selection range38. Existing IDs, two rounds and4.2s exposure windows retained.
  Court subsection3970–4850. Optional Adventure.cameraFocusX=4440 frames the
  arena while Mara is freed, Rowan is in the court and Five-Hand is undefeated.
- Wrong pick:900ms tell,650ms sweep. Bright front damages within34px of its x
  and when feet are within34px of ground. The dim trailing area is harmless.


## Act 1 production interfaces — 18 Oct 2026

- MemorySystem WARMUP_MS=1200. activate normalizes/copies fire x/floor. Countdown
  starts after expansion; cooldown/resource rules unchanged. isRestored(region)
  remains a story-phase predicate; **isRestoredAt(region,x,y)** is the physical
  world-circle predicate, including across adjacent region boundaries. Use the
  latter for surfaces/enemies. fieldRadius / fieldContains live in RestorationField.
- RestorationField owns one world-space soft-disc external WebGL mask (Phaser4
  filters, not legacy setMask). regionVisuals entries must be actual filterable
  display objects. Act2 pairs now register their past image directly. Both surface
  endpoints must lie inside the field; permanent callbacks override expiry.
- lighting.restoredAreas now contains {x,y,radius,alpha}, not rectangular region
  bounds. Camera zoom is included in light projection. Ordinary fire halo remains
  distinct from the wider restorative illumination.
- BossIntroduction.play({id,name,subtitle,sprite,x,y,onComplete}) requires sprite
  pose(index). It freezes physics, scene clock, tweens and gameplay clocks while
  update(delta) animates the camera; Enter skips. completedStory['intro-'+id]
  prevents repeat intros. A separate screen camera keeps HUD/bars unscaled.
- Boss poses 0 front / 1 idle / 2 attack / 3 hurt or exposed. Braced has 3 health,
  one hit per stun; resetEncounter restores all 3. Five-Hand keeps two rounds;
  death fully resets the fight, retreat retains earned rounds. Clear flags persist.
- Act1 layout: refuge hearth5350, NPCs5060/5205/5500, arena5660..6090,
  barrier6110, gear levers6170/6230, brake6300, bridge fire6350 (800 radius,14s),
  bridge6460..6880, campfire8120 (720 radius,20s). Derive objectives from FIRES.
  Swing/treehouse radii1060/900 retain existing later-act platform reach.
- AudioCues owns exactly one score loop and one proximity fire loop per Adventure;
  shutdown destroys both. update(delta), cue(id), pause/resume, toggleMute and
  setVolume('music'|'effects',0..1). Local key embers-audio-v1 stores settings.
- Survivor strips use npc-mara/tomas/nia, 96x112 frames; feet are bottom registered.
  Latest Gemini source hash and regeneration instructions are in art/production.
- UI body uses high-resolution Trebuchet text; Georgia is reserved for headings.
  Consistent title-case labels, left alignment and restrained text density. Controls
  are on-demand in Pause (C), not a permanent HUD strip. Gameplay bindings unchanged.
- Shutdown cancellation clears logical memory without touching already-released
  bodies or mask textures. Ordinary death/expiry/replacement still refresh visuals.


## Active audio clip ownership — final Act1 audit

AudioCues.effects is a Map<Sound, baseGain>. playEffect(key,gain) registers cleanup
on complete/destroy; pause/resume and applySettings affect every owned clip.
setVolume('effects',value) updates in-flight clips without restarting them;
toggleMute applies immediately. Shutdown destroys both loops and all temporary
clips. Paused WebAudio nodes may not evaluate gain getters until reconnected;
currentConfig retains settings, which are applied when playback resumes.
Npc.visibleHeight is the registered painted height (98/102/70), independent of
its112px frame; name labels sit12px above the actual head line.
