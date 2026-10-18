# Embers of Before

A 2D side-scrolling platformer made for a game jam (themes: **fire, shadows, time**).

A meteor corrupted the world, trapping it in endless night. Your little brother is missing.
Fire temporarily restores a local piece of the healthy world: daylight, green grass, intact
structures, and normal time. Follow his trail through those restored moments.

## Start implementation with 6.1 Sol

Open this `sunburn` folder as the project and use the prompt in [START-SOL.md](START-SOL.md).
[AGENTS.md](AGENTS.md) routes coding agents to the complete plan, current canon, execution
gates and progress log. Start with gameplay and the continuous world; use existing assets
and simple readable lighting, then polish art and atmosphere after the core is playable.

The current route completes the original chapter structure: **Prologue → Act 1:
The Ruined Village → Act 2: The Playground → Act 3: The Clock Tower → home epilogue**.
A 17470px continuous outdoor world connects restored crossings, a moving swing,
treehouse evidence, a return-home quest, canal mechanism, three bell relays and a
Bell Warden encounter. Rescue Eli and return to the family hearth to finish.
The original fixed scenes remain development references. Read the
[chapter walkthrough / human checklist](docs/competition/ACTS-IMPLEMENTATION.md),
[current status](docs/competition/STATUS.md) and [test evidence](docs/competition/TEST-LOG.md).

Built with [Phaser 4](https://phaser.io) and Vite.

## Run it

```bash
npm ci
npm run dev
```

Then open http://localhost:5173.

**Controls:** A/D or arrows move; Space jumps; W/S climb; E interacts/remembers;
F attacks: lantern sweep while carrying it, sword slash when drawn. X sets the
lantern down and draws the sword; press X within reach to retrieve it. Sword
attacks cost no flame, but the light stays where you put it. Retrieve the lantern
before climbing, remembering, resting or leaving. Q uses oil; I opens the paused satchel; M opens the map;
J opens the journal; hold R at a fire to rest; Escape pauses; Enter advances captions
or skips a short scene. Title Enter continues a saved run when present; N starts fresh.

Health is 3, flame is capped at 100, and one oil vial restores up to 35 flame.
Remembering costs 25 flame, a sweep costs 20, and ordinary walking/light never
drains fuel. Active memories cannot be restarted; ended memories cool for four
seconds. Resting for two seconds recovers supplies without duplicating quest items.
The [mechanics plan](docs/competition/MECHANICS-PLAN.md) describes the area-by-area design.

Act 1 horror revision: Mara is a dead memory at the toy stall. Remember the
refuge fire to meet Tomas and Nia, clear the abandoned foundry, align its gears,
set the brake and cross. Then return to the refuge, hold E to share the lantern,
and personally lead the family across the secured bridge. Stay close and carry
the lantern; a broken tether can be retried at the refuge. Their rescued state
persists after the memory expires. See [revision and human checks](docs/competition/ACT1-HORROR.md).

## Production and isolated playtest

```bash
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

To serve a frozen copy of the latest build while development continues, use an
unused port:

```bash
npm run demo -- 4176
```

Open http://127.0.0.1:4176/. The helper copies `dist/` to a temporary directory,
so subsequent edits/builds do not reload or change that playtest. Stop its process
when finished. If a demo is already running on the chosen port, open that demo or
choose another port. This is a local web build; it is not a standalone executable.
Progress autosaves in browser-local storage and survives reloads on the same
origin/profile. Continue resumes a safe checkpoint; temporary memories and partial
enemy damage reset. New game/restart clears the save. Different ports/machines
have independent saves. Gameplay still works if browser storage is unavailable.

### Post-bridge test runs

Type `afaqisasleep` in the focused game to start at the main bridge's far bank.
Type `afaqback` to return to the normal adventure; test runs preserve its save.
H requests a navigation hint. See [all codes and route](docs/competition/POST-BRIDGE.md).

### Dev shortcuts
- `?scene=Hearth` starts the current house; `?scene=World` starts the outdoors with a lantern.
- `?test` keeps the simulation active in background tabs for automated verification.
- `?scene=Home` / `Yard` / `A1Lane` / `A1Square` / `A1Bridge` / `A1Campfire` jumps to a scene.
  These are the original prototype scenes, not the current complete route.
- `?debug` shows collision boxes. T toggles the past only in the archived prototype scenes.

## Presentation assets and human playtest

Current complete-chapter demo: http://127.0.0.1:4176/ (a frozen snapshot while its local
server runs). Old demo servers on :4173/:4174/:4175 have been stopped. The default
`npm run demo` port is now 4176. Rebuild and restart that server when deliberately
refreshing the preview; source edits cannot change an already-running snapshot.

The [asset handoff](docs/competition/ASSET-HANDOFF.md) contains detailed prompts,
dimensions, animation cells, replacement filenames, and the extended human test
checklist. The user supplies future raster images through a dedicated model;
no more image-generation calls are authorised. Three earlier raster drafts are
integrated for preview. `public/art/manifest.json` routes replaceable art; switch
an SVG path to the delivered PNG path there. `node tools/build-presentation-assets.mjs`
rebuilds the original editable SVG props only; it does not generate raster images.

The new satchel supports mouse selection and left/right arrows. Short checks
cover UI, climb, sweep, recovery and restoration; the refreshed art has not had a
fresh complete human playthrough. See TEST-LOG for exact evidence.

## Parallel development and Git handoff

Each completed coding prompt must update the cumulative [WHAT_IS_CHANGED.md](WHAT_IS_CHANGED.md),
commit and push. Fetch and integrate teammate commits before pushing; never force-push.
Preserve the changelog's prior entries. Use STATUS/CONTRACTS for task ownership and interfaces.

## Project layout
- `src/` — game code (scenes, player, shadows, lighting, rewind system)
- `src/world/` — persistent run state, world layout and balance constants
- `tests/` — resource, progression and restoration boundary tests (`npm test`)
- `docs/competition/` — design, mechanics, current interfaces, status and QA evidence
- `assets/backgrounds/` — source background art (dark + restored versions)
- `public/bg/`, `public/sprites/` — game-ready images generated by the tools below
- `tools/process_backgrounds.py` — chroma-keys and resizes backgrounds → `public/bg/`
- `tools/extract_sprites.py` — cuts animation frames from the sprite sheets → `public/sprites/`
- `art/` — image-generation prompts
