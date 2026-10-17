# Act 2 — The Playground: art (green-layer approach)

**Everything in this file is generated on flat pure green #00FF00.** Wherever
there is nothing (sky, empty space, the edges, around an object) it is green. I
cut the green out, so every image becomes a clean piece that sits on top of the
others and overlaps its neighbours without seams. There are no full rectangles
to blend any more.

## The layers

| Layer | Moves | What you generate | Files |
|---|---|---|---|
| Sky + skyline | slowest | nothing, already done | — |
| **Background** | 70% of Rowan's speed | the scenery of each area: houses, trees, walls | 3 areas × dark/restored = **6** |
| **Foreground** | with Rowan | the objects he walks on, past or uses: swing, crater, treehouse, mill wall, canal | **14** props (7 × dark/restored) |
| Front silhouettes | faster than Rowan | dark branches and grass right in front of the camera | 2 (optional) |

The ground Rowan walks on, fires, items, ladders and stepping stones are drawn by
the game: don't paint them.

## What happens here (so the art fits)

Rowan crosses from the village campfire into the town playground, where Eli was
when the meteor struck. The playground fire makes an old swing move and he rides
it over a crater. In the treehouse he finds Eli's drawing and ember cup, then
follows the canal road toward the clock tower.

## Rules for every image

1. **Flat solid pure green #00FF00** everywhere that isn't the subject: hard
   edges, no glow, no green tint or shadow cast onto the green, no gradient.
2. **Strict side view** at standing height, like a 2D platformer. No perspective,
   no 3/4 view, no top-down.
3. **Style:** attach `Lantern Bearer in the Ruined Keep.png`,
   `Campfire in the Ruined Village.png`, and `public/sprites/hero_walk.png`
   (Rowan, for scale). Same detailed hand-painted pixel art as Act 1.
4. **No characters, creatures, text, letters, UI or watermark.**
5. **Dark version:** night after the meteor, slate, plum and charcoal, faint
   violet haze on distant things, black thorny corruption roots with cold violet
   cracks. No sun, moon, eclipse or meteors.
6. **Restored version:** attach the dark image and ask for the **same object in
   the same position and size**, on a warm golden late afternoon before the
   meteor: green leaves, fresh paint, flowers, no corruption. Still on green.
7. **Scale:** Rowan is **106 px tall** in the game. Every size below is given in
   "Rowans" (1 Rowan = one adult's height). Any resolution is fine as long as the
   proportions are right; 16:9 at most.

### Copy-paste blocks

**Dark block:**
> 2D side-scrolling game art, detailed hand-painted pixel art matching the attached references, strict flat side view, on a flat solid pure green #00FF00 background with hard edges and no shadows on the green. Endless night after a meteor corrupted the world: slate, plum and charcoal colours, black thorny corruption roots with cold violet cracks over wood, iron and stone. No characters, no creatures, no text.

**Restored block** (attach the dark image):
> Same object, same position, same size and same outline as the attached image, on the same flat pure green #00FF00 background, but on a warm golden late afternoon before the meteor: warm sunlight from the right, fresh paint, green leaves, flowers, everything intact and cared for. No corruption roots. Same pixel-art style. No characters, no text.

---

## 1 · Backgrounds (scenery, 70% speed)

16:9 (1920×1080). The **ground line is flat and straight, 62% down** (≈ y 670).
Everything **stands on** that line; **above** the scenery and **below** the ground
line is green. **Leave the outer ~8% at the left and right edges green** (let the
last house or tree end before the edge): neighbouring areas overlap there, so an
open gap of sky between them is exactly right. An adult would be **1/8 of the
image height**. No holes, steps or platforms: this layer is only scenery.

### `bg_a2_swings_dark` / `bg_a2_swings_restored` — The playground
> [Dark block] Wide background scenery of a ruined town playground's surroundings, standing on a flat straight ground line 62% down, with green above and below and the outer left and right edges green. Behind the play area: a low broken iron fence, dead hedges, a toppled bench, a collapsed metal slide, two bent lamp posts, a few dead trees and the backs of small houses. Medium detail, slightly hazy so the foreground reads in front.

Restored: [Restored block] + *"the fence intact and painted, trimmed green hedges, the slide upright and yellow, lamp posts lit, leafy trees, flower beds."*

### `bg_a2_treehouse_dark` / `bg_a2_treehouse_restored` — The back of the playground
> [Dark block] Wide background scenery at the back of the same playground, on a flat straight ground line 62% down, green above and below, outer edges green. A burnt wooden playhouse, a broken climbing frame, toys half buried in ash, dead bushes, a crumbling low stone wall, distant rooftops. No big tree (the treehouse tree is a separate image).

Restored: [Restored block] + *"the playhouse painted, the climbing frame whole, tidy toys, flowering bushes, bunting on the wall."*

### `bg_a2_canal_dark` / `bg_a2_canal_restored` — The canal road
> [Dark block] Wide background scenery of an old town canal road, on a flat straight ground line 62% down, green above and below, outer edges green. Leaning stone and timber houses with iron balconies along the far bank of a canal, a small arched stone footbridge in the distance, iron railings, on the right the massive stone base of a clock tower rising out of the top of the frame.

Restored: [Restored block] + *"flower boxes, the railings painted, bright water glinting, the clock tower's base clean and warm in the sunlight."*

---

## 2 · Foreground props (move with Rowan, placed exactly by the game)

One object per image, **filling most of the image** with a little green margin,
seen exactly from the side. Where the object meets the ground, draw it standing
on a **flat bottom edge** (no ground patch around it). I place each one on its
gameplay spot. Where Rowan stands on part of it, draw that top surface **flat
and clearly readable**.

| # | File (`_dark` / `_restored`) | Object | Size |
|---|---|---|---|
| 1 | `prop_a2_swingset` | A tall A-frame swing set, empty: two splayed legs each side and a top bar. **No seat, no chains** (the game swings its own). | 2.7 Rowans tall, 2 Rowans wide |
| 2 | `prop_a2_swing_seat` | One wooden plank swing seat, seen from the side, nothing above it. | 1.3 Rowans wide, thin |
| 3 | `prop_a2_crater` | A meteor crater **cross-section**: a deep pit with steep broken earth walls, roots and rubble, glowing embers far down (dark) / a grassy dip (restored). The two top corners are **flat** at the same height (they meet the walkable ground). | 3.5 Rowans wide, 2 Rowans deep |
| 4 | `prop_a2_treehouse` | A huge old oak with a small wooden treehouse on a **flat plank platform 1.7 Rowans above the ground**, platform about 2 Rowans wide, a little hut with a door on it. Trunk on the left of the platform. | 4 Rowans tall, 3.5 Rowans wide |
| 5 | `prop_a2_rubble` | A pile of rubble and fallen timber that blocks the path (dark); in the restored version, an open wooden service gate in a short wall. | 2 Rowans tall, 1.5 Rowans wide |
| 6 | `prop_a2_mill` | The side wall of a stone mill with two **flat stone ledges** stepping up to the right (0.6 and 1.1 Rowans high, each 1 Rowan wide) and a big wooden waterwheel against the wall above them. | 3 Rowans tall, 3 Rowans wide |
| 7 | `prop_a2_canal` | A canal **cross-section**: two stone banks with **flat tops at the same height**, dark still water low between them (dark) / clear flowing water (restored), broken footbridge planks hanging in (dark only). | 4.5 Rowans wide, 1.5 Rowans deep |

For each: [Dark block] + the object description; then the restored version from
it with the [Restored block].

---

## 3 · Front silhouettes (optional)

### `fg_a2_front_dark` / `fg_a2_front_restored`
> [Dark block] A 16:9 strip of near-black foreground silhouettes along the BOTTOM edge only: thorny branches, tall dead grass, a broken fence post, a few roots; one dead branch reaching in from the top-left corner. The middle of the image is empty green. Almost pure black with a faint violet rim light.

Restored: *"Same shapes on green as leafy bushes, flowers and tall green grass, a leafy branch in the top-left corner."*

---

## Checklist (in order)

| Priority | Files |
|---|---|
| 1 | `prop_a2_swingset`, `prop_a2_swing_seat`, `prop_a2_crater` (dark + restored) |
| 2 | `bg_a2_swings` (dark + restored) |
| 3 | `prop_a2_treehouse`, `prop_a2_rubble`, `bg_a2_treehouse` |
| 4 | `prop_a2_mill`, `prop_a2_canal`, `bg_a2_canal` |
| 5 | `fg_a2_front` (optional) |

Save everything in `assets/backgrounds/` with these names and tell me when a batch
is in. I'll key out the green, scale and place them, and check them in the game.

---

## Delivery status (18 Oct)

In the game: all three backgrounds, swing set, swing seat, crater, treehouse,
rubble/gate, mill, canal. The front silhouettes aren't used yet.

**Please regenerate these dark versions.** The delivered ones had the old red
broken sun, a creature, or blurred green, so the game uses a darkened copy of
the restored image for now:

- `bg_a2_swings_dark`
- `prop_a2_crater_dark`
- `prop_a2_swing_seat_dark` (never seen in play; low priority)
- `fg_a2_front_dark`

Drop new files into `newart/` or `assets/backgrounds/` with these names, then run
`python tools/process_backgrounds.py` (or tell me).
