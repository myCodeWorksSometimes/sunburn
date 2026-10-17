# Start development with GPT-6.1 Sol

Latest handoff: the current main route implements Prologue + original Act 1 +
Act 2 (Playground) + newly authored Act 3 (Clock Tower) + home ending. Read STATUS,
CANON's latest revision and ACTS-IMPLEMENTATION before the older launch prompt
below. Do not revert to the previous five-beat shelter ending or start asset
generation. The user now requires cumulative WHAT_IS_CHANGED.md plus commit/push
after each completed prompt; fetch and integrate parallel teammate commits first.

Open this `sunburn` directory as the project. The parent `vcGameDev` directory also
has a routing AGENTS.md, but commands and game changes belong in this repository.

## Copy this prompt into a new 6.1 Sol chat

```text
Implement the gameplay-first build of Embers of Before in this repository.
Read AGENTS.md and START-SOL.md, then follow the required reading and execution
order. Treat docs/competition/CANON.md as the latest design decisions.

Begin with the first unfinished gate in docs/competition/EXECUTION.md. Establish
the baseline, then immediately build the continuous greybox world and travelling
camera. Continue sequentially through G4: a complete playable adventure with
backtracking, fire restoration, persistent progress, readable enemies, and rescue
ending. Implement and test; do not stop at another proposal or after only planning.

Reuse existing assets and simple placeholders. Fire restores daylight, greenery,
structures and normal time locally; the meteor-corrupted present remains trapped
in night. Final art, atmospheric lighting and optional combat wait until the core
works. Keep functional illumination and readable time-state cues during gameplay.

Respect other people's edits and active task claims. If no teammates have claimed
work, act as the integrator and implement dependencies yourself. Keep STATUS.md,
CONTRACTS.md and TEST-LOG.md accurate so another session can resume. Build and test
each meaningful milestone; report any runtime test you could not perform. Keep
progress updates concise. Finish with run instructions and what is actually playable.
```

Select GPT-6.1 Sol in the app; high reasoning is a reasonable starting choice for
world/state work if available. The prompt does not itself switch models or launch
another chat. This handoff does not create an automation or a background worker.

## Required reading, once at the start

1. [Latest canon](docs/competition/CANON.md) — meteor, corrupted night, restorative daylight.
   Also read [survival mechanics](docs/competition/MECHANICS-PLAN.md), requested later by the user: health, flame, attack, inventory and campfire rules.
2. [Current status](docs/competition/STATUS.md) — what actually exists and what remains.
3. [Execution gates](docs/competition/EXECUTION.md) — the actionable development order.
4. [Overview](docs/competition/START-HERE.md) and [game bible](docs/competition/GAME-BIBLE.md).
5. [Narrative script](docs/competition/NARRATIVE-SCRIPT.md) — exact beats and their triggers.
6. [Technical plan](docs/competition/TECHNICAL-PLAN.md) and [contracts](docs/competition/CONTRACTS.md).
7. [Production](docs/competition/PRODUCTION.md) and [task packets](docs/competition/SOL-TASKS.md).
8. Inspect the real source before changing it. Documents describe intended behaviour;
   they do not prove the current code implements it.

Do not spend the session rewriting these plans. Correct specific contradictions
as discovered, then implement the next bounded task. On resumption, reread status,
contracts, the active gate and recent Git changes rather than starting from scratch.

## Development order

**G0 baseline → G1 world/camera → G2 fire/time/state → G3 complete story/encounters
→ G4 playable-core verification → G5 final presentation → G6 release/trailer.**

The launch prompt authorises core implementation through G4. G5/G6 are documented
next steps, not reasons to add polish before the core is ready. Human submission
and final upload remain with the team. Do not halt at G1 merely because a smaller
task packet says “T01 only”; that packet bounds one implementation step inside the
broader G0–G4 request.

## Repository map

```text
sunburn/
  AGENTS.md                 automatically discoverable project instructions
  START-SOL.md              this launch prompt and reading map
  README.md                 current prototype run instructions
  docs/competition/
    CANON.md                latest accepted rules; supersedes old lore
    EXECUTION.md            ordered implementation gates and acceptance checks
    STATUS.md               live progress / ownership / exact next action
    CONTRACTS.md            agreed module and event interfaces
    TEST-LOG.md             honest verification evidence
    NARRATIVE-SCRIPT.md     story beats, dialogue, cinematic and skip rules
    START-HERE.md           production overview
    GAME-BIBLE.md           mechanics, characters, enemies, story and world
    TECHNICAL-PLAN.md       engineering detail
    PRODUCTION.md           team schedule, art/audio, trailer and submission
    SOL-TASKS.md            small implementation packets
  src/                      existing game code; planned systems are not yet built
  public/                   current runtime sprites/backgrounds
  assets/                   source art
  art/                      legacy art briefs; consult CANON before reuse
  tools/                    current asset-processing scripts
```

AGENTS.md is the supported repository instruction mechanism; see the
[official documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
The explicit reading map ensures the larger design documents are also opened.
