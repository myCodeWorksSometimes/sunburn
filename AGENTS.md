# Embers of Before — coding-agent instructions

## Git handoff requirement — latest user instruction

After each completed user prompt, commit and push the implemented iteration to
GitHub. Maintain a cumulative root WHAT_IS_CHANGED.md describing the iteration,
verification and limitations, retaining previous iteration history. Fetch before
pushing and integrate parallel teammate commits carefully; never force-push or
discard their work. The user explicitly authorises these commits/pushes. Do not
push an unfinished broken milestone merely because another message arrived while
the current requested implementation is still in progress.

## Start here

This folder is the game repository. Read `START-SOL.md`, then the files it lists.
For an implementation request, execute the first unfinished gate in
`docs/competition/EXECUTION.md`; do not respond with another plan instead of code.
For a documentation-only request, update documentation without starting gameplay work.

## Latest game decisions

- The meteor struck and corrupted the world; corruption traps it in endless night.
- Fire temporarily restores a local region to its healthy pre-impact state:
  daylight, green grass, intact structures, ordinary life, and normal time.
- When restoration expires, the region returns to corrupted night. There is no
  natural day/night cycle in the corrupted present. Do not destroy the sun in lore.
- The player travels through one continuous outdoor world with a moving camera,
  can turn around, and can revisit persistent changes. Home may be an interior.
- Build and test the complete gameplay first using existing assets/placeholders.
  Basic visibility, functional light zones, time-state cues, and camera framing
  are gameplay requirements now. Final art, shaders and cinematic lighting come later.
- Deadline: 2026-10-18 09:30 Asia/Karachi. Four humans; only three comfortable with AI.

The user adopted `docs/competition/CAMPAIGN.md` (17 October 2026) as the target
story and gameplay design: Rowan, Eli, and Mara/Tomas/Nia's family; Five-Hand and
the Bell Warden; the Old Road. Its "MVP status" section lists what is still missing.

`docs/competition/CANON.md` is the current design authority. Earlier prototype
captions, art prompts, and filenames may still describe a shattered sun. They are
legacy material, not permission to contradict the latest user-approved premise.
Direct user instructions take precedence over this file and the design documents.

The user subsequently requested attack/inventory/health/flame limits. Read
`docs/competition/MECHANICS-PLAN.md`: implemented tuning is 3 health, 100 flame,
20-flame directional sweep (F), 25-flame remembering (E), one oil vial (Q),
paused inventory (I), and a deliberate 2s rest (R). Ended memories cool for 4s;
active memories cannot be restarted. Rest is intentionally repeatable recovery,
with capped supplies and no quest-item duplication. This supersedes older
single-contact death / optional sweep proposals in the initial bible.

## Implementation constraints

Keep JavaScript, Phaser 4.2.1, Vite and the lockfile unless a demonstrated blocker
requires a targeted change. No 3D-engine migration, broad dependency upgrade,
procedural open world, combat skill tree, or art replacement during core work.
Reuse the existing movement, sprites, fires, collision and echo work where sound.
Use stable object IDs, session state outside scene create(), safe checkpoints,
and explicit death/pause/transition reset policies. No temporary bridge softlocks.

Inspect current source and git status before editing. Other teammates may be
working: do not revert their changes or edit a task marked active for someone else.
The A/B/C ownership table is a recommended human division, not a requirement to
wait for imaginary teammates. A single-agent integrator may implement unclaimed
dependencies sequentially. Record actual ownership in STATUS.md. Do not launch
parallel agents or chats just because three human roles are described.

## Execution and evidence

Baseline: `npm ci`, `npm run build`, then a real local run. Use `npm run dev --
--host 127.0.0.1` for development; use the production build for release checks.
Inspect package.json before using these commands if it has changed.

After a meaningful task, build and perform its acceptance checks. Test pure state
logic when useful; do not substitute a build or a screenshot for an interaction
test. Mark unavailable or unperformed tests honestly and continue independent
work. Use the project's existing test setup if one has since been added.

Update `docs/competition/STATUS.md` with actual progress, current ownership,
next action, commands/results, blockers and runtime limitations. Record evidence
in `docs/competition/TEST-LOG.md`. Do not mark a gate verified without its checks.
Keep interface changes in `docs/competition/CONTRACTS.md` so the next session can
resume. Continue through the requested gates without asking routine permission.

Keep working source and assets intact. No force pushes, destructive resets,
publishing, upload, or submission without direct user authorisation. Local code
changes, dependency installation from the lockfile, tests and builds are expected
when the user starts implementation. Do not claim a win or completed human QA.
