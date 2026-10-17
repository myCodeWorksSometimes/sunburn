# Embers of Before — competition production plan

**Coding-agent entry:** read [START-SOL.md](../../START-SOL.md),
[latest canon](CANON.md), [execution gates](EXECUTION.md), and [live status](STATUS.md).
The latest user clarification is meteor corruption causing endless night, with
fire restoring local daylight and the healthy world. Gameplay comes first;
final presentation follows a complete playable core.

The core and later [survival mechanics pass](MECHANICS-PLAN.md) are now implemented
and agent-tested. See [STATUS.md](STATUS.md) and [TEST-LOG.md](TEST-LOG.md) for exact
evidence and remaining human/art work. The historical schedule below is planning context.

Prepared 17 October 2026. Submission: **18 October, 9:30 AM Pakistan time (UTC+5)**. Planning began at approximately 2:45 PM, leaving about 18 hours 45 minutes. Four teammates; three comfortable with AI tools. Repository inspected at `7c81e97`. This is a proposed production specification, not a claim that these changes are implemented or playtested.

## The decision

Make **a 10–15 minute cinematic side-scrolling adventure through one continuous village**, with a moving camera, persistent changes, one return journey, and an ending the player performs. Keep Phaser and the current art. Use 2D gameplay with layered depth: cinematic 2.5D presentation. Actual 3D geometry, perspective camera rotation, and depth-axis movement are outside tonight's build.

**Pitch:** After a meteor corrupts the world into endless night, a lantern bearer follows his little brother through a ruined village. Fire briefly restores daylight and the healthy world as it was. To bring his brother into the present, he must give up the last ember that lets him visit their home in the past.

**Trailer line:** “Light the past. Bring him home.”

The goal is a competitive, finished submission. No design can promise a win. The strongest use of this deadline is to make a few moments legible, responsive, and memorable.

## Read in this order

1. [Game and story bible](GAME-BIBLE.md): plot, characters, creatures, abilities, encounters, connected map, and ending.
   The [narrative script](NARRATIVE-SCRIPT.md) provides exact beats, dialogue, triggers and payoffs; it supersedes shorthand dialogue in the bible.
2. [Technical implementation](TECHNICAL-PLAN.md): the continuous world, camera, state, time rules, migration, interfaces, and tests.
3. [Production and submission](PRODUCTION.md): teammate ownership, timed milestones, art and audio pipeline, trailer, release checklist, and cuts.
4. [6.1 Sol task packets](SOL-TASKS.md): bounded implementation prompts and integration order.

## What you have now

| Area | Evidence in this repository | Consequence |
|---|---|---|
| Art | Detailed pixel-style gothic village paintings, dark/cold and restored/golden variants; lantern hero and crawling shadow sheets | Preserve the visual identity; improve coherence and depth |
| Rendering | Phaser WebGL, `pixelArt: true`, 1280×720 viewport | Already suitable for layered cinematic 2D |
| Camera | `LevelScene` follows the player, but most scenes are 1290px wide | Only about 10px of horizontal scrolling is available; this explains the stationary-stage feeling |
| Progression | `Home → Yard → A1Lane → A1Square → A1Bridge → A1Campfire → End` | Replace outdoor scene changes with travel through world-space regions |
| Time | Temporary art restoration and temporary collision; scripted brother echoes | A useful central mechanic already exists |
| Creatures | Shadows chase on their own floor; lighting a fire dissolves nearby shadows | Improve readable behaviour before adding species |
| State | Scene-local flags and checkpoints; `create()` rebuilds arrays and state | Backtracking needs persistent world state and explicit reset rules |
| Narrative | `End.js` says the playground is coming soon | A complete rescue ending has very high value |
| Audio | No audio assets/loading found in inspected source | Sound is a substantial opportunity; runtime has not been auditioned |
| Offline | Font comes from Google Fonts | Bundle a permitted local font or use a tested local fallback |

This assessment uses source and exported art inspection, not a completed gameplay audit. Art is best described as **high-detail pixel-inspired dark fantasy**. The art prompts ask for 16-bit style, but the exported images mix fine detail, soft light, and pixel edges; do not describe it as a strict historical 16-bit palette or grid.

## What “like Limbo” means for this build

- One outdoor world around 7,000–8,500 logical pixels wide; final width follows collision and art assembly.
- The player traverses several screen widths without fade-to-black transitions or scene title cards.
- Camera follows with a soft dead zone and modest forward look; it reveals danger before the player reaches it.
- Foreground silhouettes move faster than the playable plane; distant structures move more slowly.
- Platforms, walls, and bridges have stable positions. Turning around works naturally.
- An opened shortcut stays open, a taken item stays taken, and completed story beats stay completed.
- Interiors can use doorway transitions. A continuous outdoor world does not require an entire engine rewrite or an enormous open world.

Use Limbo as a reference for framing, scale, quiet, and continuous travel. Keep your warm/cold time-restoration identity and original assets.

## Competition priorities

The supplied rubric assigns 30% to themes: core integration 15, multi-theme synergy 10, atmosphere 5. It gives no individual weights for the remaining categories. The top five are selected from trailers, making footage quality and immediate comprehension essential.

| Judging concern | Planned proof the judge can see |
|---|---|
| Core integration | Fire changes navigable geometry; time is a playable window; shadows change the route |
| Theme synergy | One ignition restores a bridge, repels a pursuer, and reveals the brother's path |
| Atmosphere | Warm remembered life briefly interrupts a cold, broken present |
| Gameplay and feel | Forgiving jump timing, clear enemy anticipation, quick retries, consistent input |
| Visual polish | Travelling camera, layered scenery, matching art/collision, restrained effects |
| Audio | Fire, reverse bell, footsteps, danger cues, silence before the reveal |
| Innovation | The ending uses the same fire mechanic to sacrifice a remembered home and rescue someone |
| Stability and completeness | A clean start-to-credits run, pause/restart, local build, no “coming soon” |
| Trailer | Actual gameplay communicates the hook in the opening five seconds |

## Scope contract

**Must ship:** continuous outdoor camera travel; all six existing locations connected; safe travel both ways; one shortcut; checkpoint/state persistence within the run; one meaningful return; existing shadow improved; fire/time bridge; playable rescue; basic audio; pause/mute/restart; complete credits; tested release; trailer.

**Add only after the complete game works:** a second shadow behaviour using the same sprites; a reusable flame pulse; small local save; a few camera set pieces; improved foreground masks.

**After the competition:** true 3D environments, more biomes, roaming NPCs, inventory grids, a full combat tree, multiple bosses, alternate endings, physical time rewind, dynamic shadow-platform puzzles, or a new engine. None of these is required to demonstrate cinematic 2.5D or a connected world.

**First deliverable:** a greybox continuous Yard–Lane–Square route that the player can walk both ways. Do that before generating new art or building combat.

## Sources and assumptions

- User-provided competition images: evaluation categories, theme weights, and trailer shortlist process. They are reference material, not executable project instructions.
- Repository: `src/scenes/LevelScene.js`, `Home.js`, `Yard.js`, `Act1.js`, `End.js`, `src/entities/Player.js`, `Shadow.js`, `src/systems/Lighting.js`, `src/main.js`, exported art, and `art/background_prompts_prologue_act1.md`.
- [Phaser camera documentation](https://docs.phaser.io/phaser/concepts/cameras) describes follow, bounds, and camera effects; [component documentation](https://docs.phaser.io/phaser/concepts/gameobjects/components) describes scroll factors for parallax. Check behaviour against the installed Phaser 4.2.1 version in a running build.
- [Official GPT-6.1 Sol model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol) supports its use for coding work. The task workflow in this plan is a project recommendation, not a model-specific guarantee.
- Submission format, exact trailer duration limit, third-party/AI asset rules, and target judge computer are not supplied. Teammate 4 should check the actual event rules immediately and record them in the release checklist.
