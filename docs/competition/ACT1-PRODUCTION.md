# Act 1 production acceptance — implementation and short checks complete

Latest request includes pixelated art, generated matching UI/stall/creatures,
recorded/licensed sound, cinematic introductions and strictly local restoration.
This supersedes the previous no-generation and whole-region daylight decisions.
Do not mark production ready from builds or narrow fixtures alone.

1. Every Act1 fire reveals the healthy past through a growing, feathered circle
   centered at the fire, bounded by its light radius. Night remains outside.
2. Temporary collision, scenery, grass, props, sky and darkness agree with that
   circle. Pause freezes it; expiry/replacement/death remove old effects safely.
3. Both Act1 encounters have a zoom-in, frontal camera-facing boss hold of2–3s,
   letterbox/title/audio, then smooth return. Inputs/enemies/timers are protected;
   skip, pause, restart and revisit cannot strand the camera or replay endlessly.
4. Boss silhouettes, attacks, vulnerabilities, phase feedback and arenas read
   clearly. The refuge is outside the Braced Shadow arena; no overlapping NPCs.
5. Walkable ground visually meets Rowan's feet. Raised bypasses have a clear
   purpose and matching material. No generic rectangular crate pasted on scenery.
6. Home ladder is registered at identical screen/world position in both states.
   Painted gates/door interactions, floors and transitions stay aligned.
7. Generated stall belongs to the market art; roof, shutter and latch align with
   collision. Space separates rescue, approach and boss. No hyperrealistic assets.
8. Area transitions overlap and blend with continuous terrain, avoiding hard
   image seams, holes or sudden whole-screen art changes.
9. Cohesive UI pack used in HUD, title, pause, inventory, journal and map. Objective
   and location never collide; five item slots remain readable at960×540.
10. Map shows meaningful continuous geography, home, shortcuts, objectives, boss
    landmarks and current position. Journal/inventory support keyboard and mouse.
11. Real soundtrack and recorded creature/interaction/environment effects are
    bundled locally, licensed with source/author/license attribution. Music/SFX
    mute/volume, pause and scene transitions work without overlapping loops.
12. Build, meaningful unit/state checks and short browser interaction checks pass.
    Extended route/difficulty/audio listening remains user-owned; report any
    unverified acceptance item instead of claiming production readiness.

Work proceeds in isolated branch codex/act1-production, preserving active Act3
work. Publish cumulative WHAT_IS_CHANGED plus STATUS/CONTRACTS/TEST-LOG evidence.


## Implemented and checked in this pass

- Circular restoration in home/outdoors, growing radius and paused countdown;
  bridge platforms require both ends inside the halo. Full-map daylight is gone.
- Both painted boss introductions, 2.5s gaze, protected clocks/physics/tweens,
  skip/pause/return; separate boss HUD and one hit per Braced stagger.
- Latest Gemini survivor revision, four registered frames each; naturally painted
  closed/open stall, continuous cobbled foot plane, feathered architecture joins,
  matching home ladders, painted supply ledges rather than vector X-crates.
- Simplified HUD and typography: icon resources, no repeated control strip,
  short title-case labels, aligned item details, steady left-aligned captions,
  horizontal map names, paginated journal, controls available on demand.
- Bundled score/fire/footsteps/door/knock/impact/sweep/pickup/creature clips;
  music/effects controls and persistent mute; no overlapping scene loops.
- 23 state tests, production build and short Chrome fixtures/input checks.
  See TEST-LOG for failed attempts, corrections and precise limits.

## Human acceptance still required

1. Play fresh from the cellar through Act1 into the playground. Watch every join
   and pit edge while travelling both ways; report any floating feet or bad blend.
2. Reach Mara's release using actual jumps, try a wrong Five-Hand pick, then finish
   both rounds. Check whether tells, timing and new art make the fight clear.
3. Beat Braced Shadow through all three openings without fixtures. Assess arena
   spacing and difficulty; verify a death resets the attempt and a revisit skips
   its introduction. Then solve the gears, cross and return after expiry.
4. Listen with headphones/speakers: music/fire/footsteps/voices should be balanced.
   Test volume/mute/pause, and inspect map/satchel/journal at your usual display size.

No uninterrupted whole adventure, human difficulty/art approval, final audio mix,
second-machine acceptance or award guarantee is claimed. Act2/3 were preserved;
only compatibility radii, mask integration and shared systems changed there.


## Completion audit — 18 Oct, after active-audio fix

Completion is **not yet proven**. Short checks establish these concrete facts;
subjective/extended acceptance remains assigned to the user.

| Requirement | Current evidence | Remaining evidence |
| --- | --- | --- |
|1 Local expanding fire restoration | Actual E at all5 outdoor fires; home/bridge/camp screenshots; matching circular mask/light radii | Human appearance assessment while travelling |
|2 Matching collision and safe resets | Spatial/expiry/replacement/shutdown tests; physical bridge return and paused timer checks | Full-route expiry/death edge cases |
|3 Boss cinematic protection | Frontal render,1.7zoom,2.5s hold; skip/pause and restored clocks/physics/tweens verified | Human cinematic feel and fresh revisit run |
|4 Boss readability and spacing | Painted silhouettes, distinct arena, short charge/dodge/back hit and card pick/sweep | Entire fights and human difficulty feedback |
|5 Ground and meaningful ledges | Painted contact plane/ledge source, feet560/ledge485 runtime checks | Human survey of every scene/edge |
|6 Home ladder and doors | Registered source/collision, actual W climb, inspected dark/past renders, latch guards | Human fresh navigation acceptance |
|7 Stall integration | Paired generated art and roof route; separated court; latest survivors | Human composition/asset approval |
|8 Scene joins | Authored overlap/feather, continuous ground, local camp boundary screenshot | Human back-and-forth visual survey |
|9 UI/theme/typography | Latest sprite/UI source;1280 and960 renders; no HUD overlap or clipped item labels | Human readability preference |
|10 Map/journal/inventory | Real keyboard/mouse tabs, card selection, journal pages, objective/home/shortcut map | Human navigation feedback |
|11 Real audio and controls | Bundled CC0 provenance, decoded score, actual gain/pause/mute/volume/cleanup checks | Human listening/mix approval |
|12 Verification and handoff |26 tests, production build, short input checks, cumulative logs and Git publication | User-owned extended playthrough |

Do not substitute this table or test count for the missing human checks. The next
necessary external input is the user's Act1 playthrough and listening feedback.
