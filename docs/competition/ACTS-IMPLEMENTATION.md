# Complete original chapters — gameplay execution

Latest user request (17 October): use original acts, implement Acts 2 and 3,
finish story and gameplay, give live implementation updates, do not focus on art.
No image generation. No active teammate claims; current integrator owns this pass.
Long playthroughs remain human-owned per earlier user testing instructions.

## Bounded complete feature set

| Chapter | Route / actions | Persistent reward |
|---|---|---|
| Prologue | Cellar lantern, ladder, home memory, yard | Lantern; tutorial story |
| Act 1: The Ruined Village | Lane Crawler; square's restored stairs and bell latch; 9s bridge; village campfire and second timed walkway | Village gate, safe return crossings; route to playground |
| Act 2: The Playground | Restored swing crossing; Pouncer; treehouse steps; Eli's drawing + ember cup; home-return passage; hearth ember; canal sluice puzzle | Drawing/cup, spent hearth, shortcut, canal gate |
| Act 3: The Clock Tower | Three restoration/bell relays at different heights; Warden with wards removed by relays; tower ascent; protected ember transfer | Warden cleared, Eli anchored, return route |
| Home coda | Eli follows; old road passage home; sit at ordinary hearth together | Completed ending / credits |

Existing health3/flame100/oil1, directional sweep, rest, cooldowns, checkpoints,
inventory, pause and enemy safety rules stay. Add a pauseable M map and J journal,
clear objective location/direction, local autosave and Continue. Save quest state
and safe checkpoint, not temporary bridge geometry or current attack timers.
Restart starts a clean run. Invalid/blocked storage must not crash gameplay.

## Execution and checks

1. Chapter state/layout and tests: contiguous world, idempotent puzzle gates,
   protected ember, rescue requires all relays and guardian defeat, validated saves.
2. Act 1 changes, Act 2 puzzle route and return shortcut. Build; short runtime
   fixtures with real interaction keys for gates, memory and moving platform.
3. Act 3 relays, guardian, rescue, home coda. Build; short encounter / interaction
   tests including failure/pause and resource recovery.
4. Map/journal/inventory/Continue, objective hints and production smoke tests.
5. Refresh only the canonical :4176 frozen demo; document exact tested bundle and
   supply a human start-to-credits checklist. Do not claim an uninterrupted new
   playthrough or polished final art when only fixtures have been exercised.

## Story

Eli ran toward the playground before the impact. Rowan follows recorded fragments
through the ruined village. At the playground, a memory reveals that Eli led other
children toward the clock tower's shelter. His drawing shows the tower visit Rowan
kept postponing. A cup in the treehouse explains how a family hearth anchors a
person caught in corrupted time. Rowan returns for its last ember, choosing his
living brother over replaying home. The canal road leads to the stopped tower.
Three bells restore enough ordinary time to expose the guardian. Rowan defeats
it and finds Eli at the upper landing. The ember anchors him into the present.
Night returns; Eli remains. They take the old road home and sit by ordinary fire.
No world cure, no shattered sun, no imaginary original Act 3 script claimed.

## Human extended acceptance route (current build)

1. New game → cellar lantern → ladder → upstairs memory → leave home. Check M/J
   and I, health/flame, E cost and R recovery. Skip intro if desired.
2. Travel right: lane enemy, square fire, three jumps, E bell latch. Continue to
   bridge fire, timed bridge, campfire and second timed walkway. Test one expiry/retry.
3. Playground: restore swing, jump onto its moving board and jump to far bank.
   Nighttime return boardwalk should remain once the far bank is reached.
4. Treehouse: restore and jump three ledges; take drawing/cup. Survive or evade
   Pouncer; use door labelled PASSAGE HOME. Climb to hearth, restore, hold E to
   take ember, descend and use cellar passage back to playground.
5. Canal: pass roots, restore, climb two ledges, hold E at wheel; cross to tower.
   Return crossing should stay available. Reload and Continue at a safe checkpoint.
6. Tower: restore each of the three regions; climb to each numbered bell and
   hold E. Warden should be protected until all three bells are rung. Rest/refill
   before the fight; dodge its warning/lunge or use four directional sweeps.
7. Climb the final three permanent steps, hold E beside Eli. Try F/Q during the
   transfer; quest ember is protected. Eli stays visible after night returns.
8. Walk left with Eli to OLD ROAD HOME, E. Walk to the family hearth and hold E
   to finish. Credits → new game/restart must reset all chapter/quest flags.

Also assess navigation without coaching, reverse seams, pacing, brightness/audio,
and the build on another machine. Report landmark, inputs, expectation and actual
result. These are pending human checks, not claimed as completed by this checklist.
