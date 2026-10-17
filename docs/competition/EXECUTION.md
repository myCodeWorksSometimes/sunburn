# Execution gates — gameplay first

Latest scope: the user requested original chapter identity and complete Acts 2/3,
superseding the earlier shelter-ending route below. The extension is implemented;
use ACTS-IMPLEMENTATION.md and STATUS for current acceptance and remaining human
checks. Final image generation remains with the user. Each completed prompt must
update cumulative WHAT_IS_CHANGED.md and commit/push after integrating remote edits.

This is the active implementation order. Read CANON.md and STATUS.md before work.
The original T00–T15 packets remain useful task descriptions; the gates below
control sequencing. Start with the earliest unfinished dependency. A single Sol
session can work sequentially as integrator; the four-person table is a division
of human responsibility, not a requirement to wait for unavailable workers.

The user expanded G4 with [MECHANICS-PLAN.md](MECHANICS-PLAN.md). Its area-by-area
checks now cover health, attack, flame/oil limits, paused inventory, campfire spam
and depletion recovery. Consult STATUS/TEST-LOG for completed agent checks; do not
repeat a finished implementation from scratch. Human playtesting and G5 art remain.

## G0 — establish a runnable baseline (T00)

1. Inspect Git status, package.json, current entry scenes and any new changes.
2. Run `npm ci`, then `npm run build` from the game repository. Record real results.
3. Launch locally and check movement, jump, ignition, death and old scene entry.
4. Record runtime access limitations honestly; fix installation/build blockers.
5. Write actual interface decisions to CONTRACTS.md as implementation begins.

Pass: build works, the baseline is understood, and any untested runtime behaviour
is recorded. Do not spend an hour documenting the old game or polishing its intro.

## G1 — prove the continuous world (T01, T03, movement part of T12)

Build `WorldScene` with a single player and physics world, translated local
geometry, safe connectors, wide camera bounds, zoom 1, and modest look-ahead.
First connect Yard–Lane–Square across more than 4000px, then Bridge–Camp. Keep the
existing Home interior and add its doorway connection when state support is ready.

Use flat shapes and region labels for missing terrain. Existing paintings are
optional scaffolding. The player must never collide with purely decorative art.
Do not spend time cutting perfect masks or generating panorama art yet.

Pass: walk every outdoor join both directions without scene cuts; camera travels
with the player; no blank bounds or dead-end reverse steps. Camera/feet/landing
areas are readable. Add jump buffer and coyote time if affordable after traversal.

## G2 — fire, time, progress and recovery (T02, T04, basic T11)

Implement session state, authored safe checkpoints, stable encounter/story IDs,
and Home↔World transitions. Restore only the fire's region: scenery state,
temporary geometry, usable time window, echo hook and creature reaction.

Functional lighting now: readable lantern radius; visibly lit safe areas; clear
corrupted-night versus restored-day states. Simple colour/sky changes and labels
are acceptable while testing. Do not confuse visual darkness masks with damage
rules. Use explicit gameplay zones for safety and restoration.

Use a minimal pause/continue/restart UI early so temporal behaviour can be tested.
Add basic danger and expiry feedback visually even before final sound exists.

Pass: pause freezes countdown; relight works; death cancels transient state;
checkpoint never needs expired geometry; collected flags survive visits/death;
bridge has a permanent return route; square can be traversed backwards.

## G3 — complete the adventure (T05, T06, T07, T08)

Implement the required story beats in NARRATIVE-SCRIPT.md with existing sprites,
short captions and placeholder props. Add readable Crawler behaviour. Implement
ember cup, return to Home, spent hearth memory, cellar shortcut, bridge, three
finale lamps, non-hostile Eli, ember transfer and playable coda/credits.

The script's effect descriptions are presentation intentions, not blockers to a
working beat. A simple dissolve and caption are sufficient before G5. Revise
the intro captions now and omit the obsolete sun-explosion shot; new art can wait.

Pass: a new game reaches credits through actual play. No debug teleport required.
The intended route includes a return journey. No lost quest ember, repeated
mandatory cutscene, attack during final transfer, or “coming soon” ending.

## G4 — playable-core verification (core parts of T14)

Exercise the full matrix in TECHNICAL-PLAN.md. Prioritise movement, readable enemy
anticipation, timer fairness, reverse traversal and reliable checkpoint/reset.
Test pause at expiry, death during ignition, transition after pickup, and restart
after completion. Fix P0/P1 issues before cosmetics. Ask a teammate to play fresh;
record their result separately from agent-run checks. Do not pretend they played.

Pass: an actual start-to-credits runtime run plus targeted edge-case checks,
production build success, and documented limitations. If runtime tools are
unavailable, mark “implemented, runtime verification pending” and provide exact
human test steps; do not mark G4 verified based only on compilation.

The default START-SOL prompt requests work through this gate. Its final report
must say exactly what works, what was tested, what remains, and how to run it.

## G5 — presentation pass (T09, T10, remaining T11/T12)

After core gameplay works: align paired art, cover connectors, add parallax and
foregrounds, refine daylight restoration boundaries, correct legacy sky imagery,
polish ignition/expiry and final transfer, complete audio/mix and caption layout.
Camera zoom only after lighting transforms are correct. Never hide threats under
fog, foreground, darkness or subtitles. Use the art/audio budgets in PRODUCTION.

Audio sourcing and rough foreground preparation may happen in parallel earlier,
but must not distract the integrator from G1–G4 or change unproven geometry.

Pass: the same gameplay remains reliable under final presentation, including at
ordinary laptop brightness. Capture the bridge hook early for the trailer.

## G6 — release, trailer and submission (remaining T14, T15)

Test production output on the actual demo machine and a second machine if
available. Verify offline launch method, font/media availability, controls,
credits and the exact event format. Follow PRODUCTION's release checklist.
Human owns final upload/submission unless directly authorised otherwise.

## Deadline adjustment

Check current Pakistan time at the start. The original schedule is a target, not
a recurring timer. If behind, cut optional enemies/pulse/zoom/extra art first.
Preserve continuous movement, fire restoration, backtracking, ending and release.
Do not “simplify” back to isolated stationary stages. If the deadline has passed,
report it accurately and continue the user's requested local development unless
they redirect; do not claim the competition deadline can still be met.
