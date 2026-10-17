# Asset production handoff — Embers of Before

> **17 October 2026 — campaign MVP art:** the backgrounds for Acts 2 and 3 and
> the sprites for Mara, Tomas, Nia and the Bell Warden are specified in
> `art/ASSETS-README.md` (with `background_prompts_act2.md`,
> `background_prompts_act3.md`, `character_sprites.md`). Those use complete
> 16:9 paintings with matching edges, one per world region. The prop
> and tile briefs below still apply.

Gameplay revision: the cup/drawing now belong to the Act 2 playground treehouse;
the rescue is at the Act 3 clock tower. Earlier square/shelter location references
below describe the prior build. Asset dimensions/filenames remain valid. Gameplay
completion currently takes priority; no further coding-agent image generation.

Latest direction: the human will generate images with a dedicated model. **Do not
make further image-generation calls.** Keep the current detailed pixel-inspired
gothic art direction. No stage or art-style migration is needed. This document
specifies the missing/replacement artwork, not new game mechanics.

Three raster drafts were generated before that instruction: `eli-sheet.png`,
`rowan-climb-sheet.png`, `stone-ground.png`. They are integrated for preview, not
claimed as final approved art. Original supplied hero/enemy/fire sheets remain.
Twelve editable SVG props were authored before the instruction; they provide
working integration and can be replaced with the PNGs specified below.

## Delivery and installation

- Put files in `public/art/`. Preserve source originals in your own source folder.
- Runtime paths live in `public/art/manifest.json`; change `.svg` to `.png` there
  when a painted replacement arrives. Keys must stay unchanged. No scene edit is
  needed for those replacements. Then run `npm run build`.
- `eli-sheet.png` has **six columns, one row**; `rowan-climb-sheet.png` has
  **four columns, one row**. Both need actual alpha. The loader automatically
  crops alpha bounds and packs them into stable actor cells. Do not include text,
  frame borders, registration marks, a checkerboard or a painted black background.
- World locations and collisions are fixed. Ground is y=560 in a 1280×720 game;
  stairs top at y=500, 440, 380; home floors at y=430 and 650. Artwork must follow
  those lines. No new ledges, holes or ladders that imply unimplemented traversal.
- Native UI text remains code. Never generate inventory labels into an image.
- Keep original filenames stable when replacing an integrated raster; dimensions
  below are preferred. Character strips can be proportionally larger if their
  row/column count and alpha are correct. Props need the listed aspect ratio.

## Style lock — prepend to every prompt

> Finished production artwork for a cinematic side-scrolling dark fantasy game,
> Embers of Before. Detailed hand-painted pixel art matching the supplied adult
> lantern-bearer sprite and ruined medieval bridge references. Restrained hard
> edges and clustered pixels; no smooth vector gradients on characters, no anime,
> no toy-like chibi proportions, no photorealistic 3D, no modern equipment.
> Charcoal navy outlines, muted slate and plum shadows, worn umber leather and
> restrained brass highlights. Amber fire is the warm focal point. Restored life
> uses natural sage and warm daylight, never neon green. Side-on gameplay view,
> camera level, consistent pixel density. No text, logos, UI, watermark or scenery
> inside a transparent prop/sprite. Transparent means real alpha, not black or a
> checkerboard painted behind the subject.

Use these actual references: `public/sprites/hero_walk.png` for Rowan identity;
`public/bg/bg_a1_bridge_dark.png` and its restored pair for world/material style;
`public/sprites/fire_burning.png` for flame palette. Send them to the model as
reference images, not as instructions to reproduce the whole sheet.

## First batch — highest impact

### 01. Eli idle/run/gesture strip — replace `eli-sheet.png`

**Export:** transparent PNG, 2172×724 recommended, six equal 362×724 cells in one
horizontal row. No padding between cells. All characters face right. Each cell
contains exactly one full child; equal scale, same boot baseline. Rendered child
height is 76px, compared with Rowan's 106px. Keep readable head/hands at that size.

> Eli is nine, with tousled tawny brown hair, a recognisable small face in profile,
> a faded blue-grey knee-length tunic, worn brown trousers, small dark boots and a
> short muted red scarf. No lantern, weapon, armour or backpack. He is a human boy,
> never a crawling creature. Cell 1: neutral standing, hands relaxed. Cell 2: left
> foot forward, right arm forward. Cell 3: passing stride, feet close. Cell 4:
> right foot forward, left arm forward. Cell 5: opposite passing stride. Cell 6:
> standing, chin slightly lifted, right hand near chest as if answering two gentle
> knocks. Same identity, costume and proportions throughout. Cloth movement is
> subtle; no exaggerated cape that obscures his silhouette. Consistent head and
> boot baseline, clear separation at every cell boundary, actual alpha.

**Runtime:** idle 0/0/5/0 at 2fps; run 1/2/3/4 at 9fps. Tether and echo colour,
transparency, glow and fade are applied in code. Do not bake a ghost treatment or
golden outline into the normal boy. Final rescue reuses the same boy opaque.

### 02. Rowan climb strip — replace `rowan-climb-sheet.png`

**Export:** transparent PNG, 2172×724 recommended, four equal 543×724 cells.
One complete adult per cell, same scale and baseline. Runtime packs into the
existing 155×110 actor cells with a 106px visible height; physics stays unchanged.

> Exactly the adult in hero_walk.png: dark shoulder-length hair, weathered red
> scarf/cape, dark brown medieval leather coat, trousers, heavy boots and small
> brass lantern secured at his belt. View is from behind, slightly three-quarter,
> while climbing an invisible ladder. Do not draw a ladder into the sheet.
> Four alternating climbing poses: left hand high/right knee lifted; passing
> reach; right hand high/left knee lifted; opposite passing reach. Hands and feet
> clearly reach different rungs. Stable torso size, no changing costume, no sword.
> Fit the whole body inside each cell with breathing room. Warm lantern reflection
> on his sleeve; preserve source proportions and detailed pixel material style.

### 03. Ground foundation tile — replace `stone-ground.png`

**Export:** opaque PNG, 1536×512 or 2172×724, aspect 3:1, left/right tile seamlessly.
The top edge is exactly the walkable edge. At runtime the texture is 180px tall
and about 540px wide; do not put sky or padding at its top.

> A side-on, horizontally seamless medieval village path foundation strip. Top
> fifteen percent is worn cobblestone paving with small chipped edges and a little
> dead moss. Beneath it, irregular dark slate blocks set into brown soil, roots
> following cracks, damp recesses, occasional tiny ochre mineral chips. Texture
> fills the canvas. Bottom fades naturally into deep navy earth, not a flat grey
> block. Straight continuous top edge; no raised boulders above it, stairs, people,
> props or perspective. Match the ruined bridge's material and pixel density.
> Left and right ends must meet without an obvious vertical joint.

Living grass is a separate runtime overlay, so do not bake vivid green grass into
the corrupted ground tile. The same tile is used under restored daylight.

## Second batch — replace individual props, one image per prompt

For each row prepend the style lock and use the detailed description below.
All are transparent PNG except timber. **Do not request an assorted contact sheet.**

| Runtime key / suggested file | Canvas | Visible composition and exact brief |
|---|---:|---|
| `item-lantern` / `item-lantern.png` | 192×240 | Full brass hand lantern, oval carrying loop, six-sided dark metal cage, amber glass, small white-hot flame. Worn and inherited, not a pristine magical jewel. Loop included inside canvas, base centred. Dark outline readable against daylight. No baked large glow halo. Rendered 38×48 in world, 65×78 in inventory. |
| `item-cup` / `item-cup.png` | 224×192 | Low, heavy, soot-darkened bronze ember cup, open elliptical rim, small side handle to right, footed base and a simple incised hearth diamond on its belly. Empty, no flame inside. Scratches and warm rim highlight distinguish it from oil. Rendered 44×38 in world. |
| `item-oil` / `item-oil.png` | 176×224 | Squat smoky glass oil vial, short neck, dark cork, one wire band, dark amber liquid visible in lower half, small worn cloth label with a painted DROPLET symbol only, no letters. Slight glass highlight on left; upright, base centred. |
| `item-ember` / `item-ember.png` | 192×224 | One living hearth ember, small dark charred wood fragment at its base, orange inner cracks and a compact gently rising golden flame with pale hot centre. Warm and precious, not a crystal, soul, screaming face or fireball. No huge blurry halo. Code handles glow and movement. |
| `health` / `health.png` | 80×88 | One small shield-shaped dark bronze medallion enclosing a warm coral flame, crisp border, simple legible silhouette at 28×31px. No numeric label or red cross. Empty/dim state is applied by code. |
| `ball-final` / `ball-final.png` | 80×80 | Small worn red leather child's ball, round, subtle stitched curved seams, muted red-brown shadow, one warm highlight. No emblem, face or text. Visible at 20×20. |
| `crate` / `crate.png` | 360×152 | Side-on wide wooden crate, EXACT flat horizontal top at canvas y=0. Width:height 180:76. Dark oak boards, diagonal cross braces, four black iron nail heads, chipped edges. No perspective top face that implies a false standable height, no shadow margin. Runtime top is y=485. |
| `door` / `door.png` | 208×332 | Narrow arched medieval doorway with full stone frame and dark oak door, brass latch right side, dark interior cracks. Ground-touching base at bottom edge, minimal transparent margin. No steps. Reused for home and cellar passage; code tints the latter. |
| `ladder` / `ladder.png` | 108×512 | Exactly vertical, side-on oak ladder, two rails and eleven evenly spaced rungs, worn pale rung edges, iron repair around one rail. Rails run to top and bottom image edges. Width 54, height 256 aspect; rendered46×220. No extra ladder, no wall behind. |
| `corruption` / `corruption.png` | 220×760 | Upright knot of black meteor-corrupted thorn roots, narrow impassable silhouette, three main twisted tendrils reaching upward, restrained cold violet fissures. Opaque readable centre, alpha around tendril edges; no monster face. Base bottom-centred; rendered86×350 at x4990. |
| `marker` / `marker.png` | 128×160 | A short weathered wooden wayfinding post with one right-pointing plank arrow, simple scratched pale arrow mark but no letters, moss-dark base. Whole prop in profile, bottom-centred, coherent old village construction. |
| `timber` / `timber.png` | 384×96 | OPAQUE horizontally seamless close-up strip of rough oak platform boards and supporting beam. Exact straight top edge at y0, long horizontal grain, black iron pegs, chipped gold-brown edge. No grass, transparent margin or perspective. Runtime repeats at192×48 for floors and bridge deck. |

Retain the supplied fire, hero, shadow and burst/dissolve sheets. They are actual
animated assets, not placeholders; generating a new enemy family tonight would
create unnecessary consistency and testing work.

## Optional third batch — only after the first two are accepted

### Purpose-made sweep animation

Current sweep uses the supplied lighting poses plus a flame burst/arc. For a
purpose-made animation, deliver `rowan-sweep-sheet.png`, transparent 930×110 with
six 155×110 cells. Same Rowan proportions, body centre x77.5, feet y110 in every
cell, facing right. Poses: settle weight; pull lantern inward; swing forward;
maximum extension; follow-through; settle back. No drawn long-range flame in the
sheet, so attack reach stays independently controlled. Lantern must remain visible.
This is **not auto-loaded**: ask the integrator to wire it and preserve the 150ms
strike/800ms cooldown. Do not silently change count, body size or origin.

### Background refresh, if the existing scenes still look too disconnected

Do not generate a new game layout. Request a separate painting for each existing
location, then derive its restored counterpart by EDITING the same image with
locked landmarks. All native painting exports 1290×720; transparent sky preferred.
Keep collision-critical props out. These replace existing files in `public/bg/`,
not `manifest.json`; ask for integration review before overwriting originals.

| Pair | Place and focal point | Old source ground line / rendering |
|---|---|---|
| `bg_p2_yard_dark/restored` | Small walled family garden, broken fence, bare fruit tree; past has intact fence and living leaves, no humans baked in. | y508, displayed offset +52; foreground stone supplies actual y560 walk line. |
| `bg_a1_lane_dark/restored` | Timber village street, abandoned shop arches and laundry lines; past roofs/window frames repaired, healthy creepers, subtle daylight. | y555, offset +5. Keep foreground crate OUT. |
| `bg_a1_square_dark/restored` | Clock tower and fountain behind the lane; face of clock clear, present frozen, past healthy stone/ivy. | y545, offset +15. Keep platform staircase and cup OUT; code draws them. |
| `bg_a1_bridge_dark/restored` | River gorge between ruined stone banks, distant village; present broken timbers, past intact architecture in the distance. | y410, offset +150. Keep the actual foreground bridge deck OUT; code owns gap5480–6040 at y560. |
| `bg_a1_campfire_dark/restored` | Shelter courtyard, low arches and abandoned blankets; remembered version cared for and sunlit, no people. | y545, offset +15. Keep three ritual lamps and Eli OUT. |

Background prompts: “No sun explosion, split sun, giant moon, apocalypse portal,
letters, characters, extra foreground ladders or false walkable paths.” The story
has meteor corruption and temporary LOCAL daylight, never a shattered sun or
permanent global sunrise. Do not make dark/past independently and hope they align.

## Acceptance before handing images back

1. Check real alpha on a checkerboard viewer; no baked checkerboard or black box.
2. Inspect both 100% and actual game size. Silhouette and flame must survive downscale.
3. For strips: verify exact cell count, no overlap, same clothing and baseline.
4. For ground/timber: repeat three times horizontally and inspect joints/top edge.
5. For paired scenes: overlay at50%; doors, buildings and horizon stay registered.
6. Return the files plus model/source details needed for final competition credits.
   The team still checks the event's actual AI-asset eligibility/disclosure rules.

## Human playtest after replacement

The automated checks for this presentation pass are deliberately short. Please:

1. Start fresh: find lantern, climb both directions, light home, leave and return.
2. Walk every region seam both ways. Report false floors, hidden gaps and any grey/empty patches with location/screenshot.
3. Fight the lane Crawler facing both ways; check windup, sweep readability, damage flashes and health/flame clarity.
4. Light square, open I, select every card with mouse/arrows, close I; confirm timer pauses and items/counts are correct.
5. Collect cup, return home, take ember and use cellar passage. Check no repeated pickup or memory after home is spent.
6. Let the bridge expire once, retry, cross, then return after night returns; deck and collision should agree.
7. Reach shelter, light all lamps, rescue Eli, walk left to credits. He should remain opaque when daylight fades.
8. Try a second complete run/restart and listen on speakers/headphones. Report pace, visibility and sound concerns.

For feedback include scene/landmark, action, expected result, actual result and
screenshot if useful. These long tests remain human-owned, not claimed complete.
