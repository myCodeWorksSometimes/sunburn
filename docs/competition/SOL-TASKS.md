# 6.1 Sol development pipeline and task packets

For one ready-to-paste startup prompt, use [START-SOL.md](../../START-SOL.md).
[EXECUTION.md](EXECUTION.md) now defines the gameplay-first sequence; the packets
below are bounded substeps, not reasons to stop the broader G0–G4 implementation.
Read [CANON.md](CANON.md) for the meteor/night/daylight-restoration clarification.

## How the team should use Sol

Use **GPT-6.1 Sol**, as requested. The [official model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol) describes coding and tool use; the recommendations below are practical project workflow choices. They do not guarantee a working game without review.

Choose high reasoning for the world/state migration and hard lifecycle bugs; medium for bounded content/audio wiring if the app exposes those options. The START-SOL prompt starts an explicit sequence of small tasks with checks and persistent status. Focus on one bounded implementation task at a time, even when the conversation continues through several gates. Sol can edit code, inspect art, and help run tests; actual image/audio production still needs the appropriate tools and human consistency checks.

Use separate human-owned branches such as `codex/world`, `codex/story-encounters`, and `codex/presentation`. A integrates small commits into the shared working version. A branch containing unreviewed AI output is not a milestone. B and C should not merge each other's work into core files independently.

Before each task: identify owned files, dependencies, expected player-visible behaviour, what must remain compatible, and a measurable acceptance test. After each task: inspect diff, run build, perform the stated playtest, then merge. A defect gets a reproduction prompt, not a broad “make everything better” request.

## Common prompt header

Paste this before a selected packet, adjusting paths for the teammate's checkout:

```text
We are finishing Embers of Before for 18 October 2026 at 09:30 Pakistan time.
Read docs/competition/START-HERE.md and only the relevant sections of the
technical/game bible for this task. Work on the task below, not the whole game.

Preserve the installed Phaser/Vite stack and existing art identity. Other people
are working in this repository. Do not revert their changes. Edit only your
assigned files; if integration needs another owner's file, provide the smallest
specific requested change and coordinate it with the integrator.

Inspect the current code before implementing. Keep a playable build. Use stable
IDs and explicit reset rules. Do not add dependencies or generate new assets
unless necessary for the assigned task. Do not claim runtime testing from a
successful build alone. Report changed files, build result, actual playtests,
known limitations, and remaining integration steps. Do not publish or upload.
```

## Ordered backlog

Estimates are rough focused-human implementation/review time, with uncertainty. Several presentation tasks run concurrently with core work; do not sum them as one serial schedule. Must-have tasks depend on integration and playtesting, not merely code generation.

| ID | Task | Owner | Depends on | Estimate | Acceptance |
|---|---|---|---|---|---|
| T00 | Baseline run/build and task contracts | A + D | None | 20–30m | Known playable baseline and initial defect log |
| T01 | Wide greybox World and camera | A | T00 | 60–100m | Walk Yard–Lane–Square both ways without a scene cut |
| T02 | Persistent state and Home entry/exit | A | T01 | 45–75m | Item/flag survives World–Home–World and death |
| T03 | All world regions and safe connectors | A | T01 | 60–90m | Six locations accessible, reversible terrain |
| T04 | Region-local memory and checkpoint safety | A | T02, T03 | 60–100m | Expiry/death/relight cannot trap or desynchronise |
| T05 | Story data and short captions | B | T00 contract | 45–60m | Story beats registered once, skip-safe |
| T06 | Improved Crawler | B | T00 contract | 45–75m | Telegraph, bounded chase, safe-light counter |
| T07 | Hearth return and shortcut | B, A integration | T02, T04, T05 | 45–75m | Required round trip completes without lost flags |
| T08 | Finale, ember transfer, coda | B, A integration | T04–T07 | 60–100m | Playable rescue reaches credits |
| T09 | Connector art and depth layers | C | T01 layout contract | 90–150m | No black seams/false platforms during camera travel |
| T10 | AudioDirector and sound pack | C | T00 event contract | 90–150m | Cues work, loops don't stack, mute/pause works |
| T11 | Pause/UI and reduced effects | A + C integration | T04, T10 | 30–60m | Timers freeze and resume; captions remain readable |
| T12 | Movement tuning and camera set pieces | A | T03, T04 | 30–60m | Buffered jumps; camera returns control safely |
| T13 | Optional pulse / second creature | B | Complete T08 playtest | 45–90m | Adds clarity/variety without a new failure mode |
| T14 | Full regression, balancing and offline packaging | All, A release | T01–T12 | 120m+ | Second-machine start-to-credits completion |
| T15 | Trailer edit and submission | D + C | Capture after T04/T09 | 120–180m | Actual footage, verified export/upload |

If estimates overrun, use the cut order in PRODUCTION.md. Never let T13 block T14 or T15.

## Packet 1 — continuous world, first proof

```text
Owner A. Implement T01 only. Own src/scenes/World.js, src/world/layout.js,
and the minimal scene-registration edits in main.js/Boot.js.

The current viewport is 1280px wide while most levels are 1290px wide. Build one
outdoor WorldScene wider than 4000px using greybox Yard, Lane, and Square geometry
translated from local to world coordinates. Keep one player/physics world and
one camera. Add physically traversable connectors both ways. Use zoom 1 and a
stable vertical frame. Add horizontal follow with restrained look-ahead.

Reuse Player. Preserve old scenes for comparison. Do not migrate story, add 3D,
generate art, or implement enemy variants in this task. Provide a development
entry to World and draw optional region/geometry bounds.

Acceptance: walk from the yard to the square and back without fades, stops,
teleports, camera blank space, or impossible reverse steps. Build succeeds.
Report the world bounds and any geometry that still needs content integration.
```

## Packet 2 — persistence and local restoration

```text
Owner A. Implement T02/T04 after T01 and the approved layout. Own WorldState,
MemorySystem, World integration, safe Home transitions, and necessary Lighting
fixes. Follow the state/reset table in TECHNICAL-PLAN.md.

Create stable IDs and a session object outside scene create(). Store inventory,
story completion, cleared encounters, shortcut, bridge return and safe checkpoint.
Temporary memory affects one authored region and its colliders only. Start the
useful countdown when the route becomes usable. Pause freezes it. Death cancels
temporary state and respawns on present-state safe ground. No save-to-disk yet.

Test World→Home→World; relight twice; die during fading; pause during countdown;
cross a timed bridge and walk back after expiry. Do not globally restore every
region or dissolve offscreen enemies. Document the public methods/events for B/C.
```

## Packet 3 — narrative return and finale

```text
Owner B. Own src/content/story.js and new encounter/story modules; coordinate
integration into World and Home with A. Read GAME-BIBLE.md. Implement the ember
cup at Square, required hearth return, spent-home-memory flag, shortcut unlock,
three ritual lamps, non-hostile Eli, final ember transfer, and walking coda.

Use existing sprites, props, captions and fire effects. Keep dialogue brief.
Tethered Eli must never use enemy contact damage. The quest ember cannot be spent
or lost. Cutscene skipping applies end state exactly once. Completed beats stay
completed after a visit or death. The finale must end in real credits, removing
the release route to the existing “coming soon” card.

Deliver each beat as a small testable module, using A's documented interfaces.
First make the ending work with simple effects. Do not add alternate endings,
new locations, voice generation, or a boss health system.
```

## Packet 4 — creature readability

```text
Owner B. Own Shadow.js and encounter configuration. Implement the core Crawler
with a visible/audible anticipation phase, bounded chase, recovery, clear contact
rules, and strong-fire dispersal. Use existing sheets. Keep player/quest state
out of the enemy object. Respect paused/dead/cinematic/final-transfer protection.

Acceptance: a first-time player can see the threat before contact, avoid it with
existing movement, and use the intended fire. It cannot hit from outside the
visible encounter or follow across the whole world. Defeat persists by encounter
ID. Repeated respawns do not duplicate sprites, trails, or listeners.

Only after the complete rescue build passes, consider the optional Pouncer or
Gatherer from GAME-BIBLE.md. Do not start both variants at once.
```

## Packet 5 — depth and audio

```text
Owner C. Own the approved foreground/connector assets, AudioDirector, audio files
and credits manifest. Read the layer and asset pipeline in PRODUCTION.md and
the camera constraints in TECHNICAL-PLAN.md. Coordinate loader/core edits with A.

Use existing art to cover world connectors. Preserve walkable surfaces on the
gameplay plane, add sparse foreground silhouettes and restrained haze. Inspect
both travel directions and both time states. Do not stretch scene paintings or
introduce duplicated distant towers. Keep zoom 1 unless A has fixed lighting.

Wire cues to the agreed event contract. Crossfade ambience on restoration,
add enemy tells and Eli's two knocks, and support pause/mute without stacking
loops. Use permitted local assets, including a local font or tested fallback.
Deliver source/licence information for new media. Test offline and at game scale.
```

## Packet 6 — release audit

```text
Test the current integrated release candidate, not an old development branch.
Do not add features. Read the verification matrix and release checklist.

Perform a complete fresh start-to-credits run and a separate aggressive test of
backtracking, timer expiry, repeated deaths, pause, skip, restart and offline
launch. Record the commit, machine, steps, and actual results. Build output alone
is not evidence that gameplay works. Rank defects by P0/P1/P2.

Fix only assigned defects with small patches, retest their reproduction, then
repeat the critical path if shared state or traversal changed. Produce accurate
launch instructions and list any unresolved limits. Preserve the previous
working candidate so the team can revert a bad integration without losing work.
```

## Human review loop

Every 60–90 minutes, A takes a small integration and D plays it. B and C provide the exact commit, owned files, dependencies, and any requested core hook. Keep one source of truth for task status: queued, implementing, needs integration, needs playtest, accepted. “AI finished” means needs review, not accepted.

When a regression appears, report the smallest reproducible path. Example: “New game; ignite Bridge; cross; lower return walkway; wait for expiry; walk left. Player falls at X. Expected permanent return collision.” This is substantially more useful than asking Sol to rewrite all movement.

Before feature freeze, checkpoint the accepted game. After freeze, restrict prompts to a named issue and a minimal patch. The last two hours protect submission, verification, and recovery time.
