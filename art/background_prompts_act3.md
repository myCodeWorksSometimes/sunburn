# Act 3 — The Clock Tower: art (whole-background approach)

**One image per area, the whole area at once.** Each of the three Act 3 areas is
a single complete painting: the scenery *and* the stone ledges, stairs, galleries,
bell frames and arches Rowan climbs on. There are no separate prop pieces like Act
2. Wherever there is **empty space through which the far distance should be seen**
(open sky, windows, arches, gaps between rooftops) the painting is **flat pure
green #00FF00**. I key the green out and the game's own sky and distant skyline
scroll slowly behind it: that is the parallax depth.

So you generate **6 images**: 3 areas × dark/restored.

| File (`.png` or `.jpg`) | Area | World span |
|---|---|---|
| `bg_a3_courtyard_dark` / `_restored` | Tower courtyard (outside, foot of the tower) | 13600–15200 |
| `bg_a3_mechanisms_dark` / `_restored` | Bell mechanisms (inside, lower floors) | 15200–16900 |
| `bg_a3_landing_dark` / `_restored` | Upper landing and the view (inside, top) | 16900–18600 |

## The layers

| Layer | Moves | What | Who makes it |
|---|---|---|---|
| Sky | almost fixed | star field (night) / warm sky (restored) | done |
| Skyline | 25% of Rowan's speed | distant spires and rooftops | done |
| **Area painting** | **with Rowan (100%)** | everything in this file: walls, tower, ledges, stairs, bells, arches | **you** |
| Game-drawn | with Rowan | Rowan, Eli, enemies, the Bell Warden, fires, the Old Road door and lever, the window bars, glows, labels | game |

The painting moves exactly with Rowan, so **anything Rowan stands on can be
painted** and lines up with where he walks. Green holes show the two far layers
moving more slowly behind, which gives the depth.

## What happens here (so the art fits)

Rowan reaches the courtyard at the foot of the clock tower and hears two taps
from a barred window high up: his little brother Eli is alive, trapped in a frozen
moment at the top. Rowan releases the Old Road gate, goes home for the hearth's
last ember, then comes back and climbs: one bell in the courtyard, one in the
mechanisms, one on the upper landing. Ringing all three breaks the wards of the
Bell Warden, a creature of corruption and clock machinery. After the fight a
stair rises to the gallery where Eli waits. Then the brothers walk out to the
open arches and look down over the village: "You can see our house."

---

## Rules for every image

1. **16:9, 1920×1080.** One image covers one whole area, edge to edge. **No
   green margins at the left and right edges** (unlike Act 2): the three areas
   butt directly against each other.
2. **Strict side view** at standing height, like a 2D platformer level. No
   perspective floor, no 3/4 view, no top-down. Floors, ledges and stair treads
   are seen exactly side-on: **flat horizontal tops**.
3. **The ground line is flat and straight, 62% down: y 670.** It runs unbroken
   across the whole image. Everything stands on it. Below it, plain dark
   foundation stone (the game draws its own walking strip there).
4. **Scale:** Rowan is **127 px tall** in these images (courtyard) and **120 px**
   (mechanisms, landing). Every height below is given in "Rowans" and in pixels.
   Doors are about 1.3 Rowans tall.
5. **Green #00FF00** is flat, solid and hard-edged: no glow, no gradient, no
   green tint or shadow cast on it. Use it **only where the far distance shows
   through**: sky above walls and roofs, window openings, open arches. Solid
   walls, ceilings and floors are painted, never green.
6. **Placement:** put the walkable parts **where the tables below say**: x and y
   are pixels in the 1920×1080 image. Close is fine (±20 px). After delivery I
   measure each image and fine-tune the game to match it.
7. **Keep these spots free of painted detail** (plain floor and plain wall
   behind): the fire spots, the Old Road door, the enemy patrol floors. The game
   draws its moving things there and they must read clearly.
8. **No characters, creatures, text, letters, signs, labels, UI or watermark.**
   No Eli in the window, no Warden, no fires, no doors that open.
9. **Style:** attach `Lantern Bearer in the Ruined Keep.png`,
   `Campfire in the Ruined Village.png`, `public/sprites/hero_walk.png` (Rowan,
   for scale) and `assets/backgrounds/bg_a1_square_dark.jpg` (or `_restored`):
   the square's bell tower sets the stonework. Same detailed hand-painted pixel
   art as Acts 1 and 2.

### Dark and restored

- **Dark version first.** Night after the meteor: slate, plum and charcoal, faint
  violet haze, black thorny corruption roots with cold violet cracks over stone,
  wood and brass. **No sun, moon, eclipse, cracked sun or meteors.**
- **Restored version:** attach the dark image and ask for the **same composition,
  same walls, same ledges at the same height and position**, on a warm golden late
  afternoon before the meteor. The game crossfades one into the other, so
  overlaid at 50% they must line up. The green areas stay in the same places.
- **The ledges and stairs marked "remembered only"** can be walked on only in the
  restored past. In the **dark** version paint them **crumbled**: broken edges,
  missing stones, wrapped in roots, clearly unsafe, but in the same place and at
  the same height. In the **restored** version they are whole and solid.

### Copy-paste blocks

**Dark block:**
> 2D side-scrolling platformer level art, one complete wide scene, detailed hand-painted pixel art matching the attached references, strict flat side view at standing height, 1920×1080. A flat straight ground line exactly 62% down the image. Wherever open sky or far distance would be visible (above walls and roofs, through windows and open arches) the image is flat solid pure green #00FF00 with hard edges, no glow and no shadows on the green. Endless night after a meteor corrupted the world: slate, plum and charcoal colours, faint violet haze, black thorny corruption roots with cold violet cracks over stone, wood and brass. No sun, no moon, no meteors. No characters, no creatures, no text.

**Restored block** (attach the dark image):
> The exact same scene as the attached image: same composition, same walls, same ledges, stairs and floors in the same positions and at the same heights, same green #00FF00 areas in the same places. But on a warm golden late afternoon before the meteor: warm sunlight from the right, clean warm stone, polished brass and bronze, intact woodwork, no corruption roots, every ledge and stair whole and solid. Same pixel-art style. No characters, no text.

---

## How the three areas join

The areas sit edge to edge with no gap, so each joint falls on **solid stone**:

| Joint | Left image's right edge | Right image's left edge |
|---|---|---|
| Canal → courtyard | (Act 2 canal, separate) | Outer courtyard wall, below green sky (the game blends here) |
| Courtyard → mechanisms | The tower's **great doorway**: its left jamb at x 1760, open doorway (dark inside) to x 1880, a thick stone pier x 1880–1920 | A thick stone pier x 0–60, plain interior wall behind |
| Mechanisms → landing | A thick stone pier x 1860–1920, floor to top | A thick stone pier x 0–60, floor to top |
| Landing → end of the world | A solid stone wall x 1860–1920 | — |

Use the **same pier** (same stone, same width, plain, floor to top) at each
interior joint so the two pieces meet on stone. I overlap the joint by a few
pixels.

---

## A3-1 · Tower courtyard — `bg_a3_courtyard_dark` / `_restored`

Outside, at night. The **left fifth** is the courtyard's outer wall with the arched
Old Road gateway, open sky (green) above it. From about x 420 rightwards the
**clock tower's façade** fills the image and rises out of the top: a high barred
inspection window, a buttress with two stone ledges climbing to a bell, open
flagstones, and the tower's great doorway at the right edge.

| What | x (image px) | y (image px) | Size | Notes |
|---|---|---|---|---|
| Ground line | full width | 670 | — | flat, unbroken |
| Outer wall, sky above | 0–420 | wall top ~ 430 | 2 Rowans tall | **green above the wall** |
| Old Road gateway (empty stone arch) | 120–240 | opening 500–670 | arch 1.3 Rowans tall | paint the stone arch with a **plain dark opening**; the game draws the barred door and its lever at x 100 |
| Fire spot | 270–330 | floor | — | keep clear |
| Inspection window (stone surround) | 500–630 | opening 260–410 | opening 1 × 1.2 Rowans | deep **dark empty opening** (no bars, no figure); the game draws the bars and Eli |
| Ledge 1, *remembered only* | 612–744 | top 598 | 0.6 Rowan high | stone block against the buttress, flat top |
| Ledge 2, *remembered only* | 768–1020 | top 526 | 1.1 Rowans high | wider stone ledge, flat top |
| Bell 1 | hangs over x 912 | bell rim ~ 360 | bell 0.6 Rowan tall | a small bronze bell under a stone or iron bracket on the tower wall, **above** ledge 2 (Rowan stands under it) |
| Open flagstones (crawler patrol) | 1236–1836 | floor | — | plain floor, plain wall behind |
| Tower's great doorway | jamb 1760, opening 1760–1880 | opening top ~ 440 | 1.8 Rowans tall | tall arched doorway, dark inside; pier 1880–1920 |

**Dark prompt:**
> [Dark block] The courtyard at the foot of a huge gothic clock tower. Left fifth: the courtyard's low outer wall with an empty stone arched gateway onto an old road, its opening plain and dark; above the wall, flat green #00FF00 sky. From a fifth of the way in, the clock tower's stone façade fills the rest of the image and rises out of the top. High on the tower wall, a stone-framed inspection window with a deep dark empty opening. Below and right of it, a stone buttress with two flat-topped stone ledges stepping up to the right, crumbled and wrapped in corruption roots, and above the higher ledge a small cracked bronze bell hanging from an iron bracket on the wall. Then open cracked flagstones in front of plain tower wall, a few abandoned bundles and crates against the wall, dark iron lanterns. At the right edge, the tower's tall arched main doorway, dark inside, and a plain thick stone pier at the very edge. Corruption roots climb the tower.

**Restored prompt:**
> [Restored block] + *"Flower pots along the outer wall, lanterns lit, a market awning folded against the tower, the inspection window's stone clean, the bell polished bronze, the two ledges solid dressed stone, the great doorway open onto warm light."*

---

## A3-2 · Bell mechanisms — `bg_a3_mechanisms_dark` / `_restored`

Inside the tower's lower floors. Solid back wall, floor and ceiling beams;
the **only green is the narrow gothic windows** high in the back wall (the night
or the golden sky shows through them). Stone steps climb to a bell platform in
the middle; the right half is an open machine floor.

| What | x (image px) | y (image px) | Size | Notes |
|---|---|---|---|---|
| Ground line | full width | 670 | — | stone floor, flat |
| Left pier | 0–60 | floor to top | — | joint with the courtyard |
| Fire spot | 220–280 | floor | — | keep clear |
| Step 1, *remembered only* | 565–689 | top 602 | 0.6 Rowan high | |
| Step 2, *remembered only* | 700–825 | top 534 | 1.1 Rowans high | |
| Bell platform, *remembered only* | 836–1084 | top 467 | 1.7 Rowans high | broad stone or timber platform, flat top |
| Bell 2 | hangs over x 971 | bell rim ~ 300 | bell 0.7 Rowan tall | bronze bell in a heavy wooden frame or from a beam above the platform |
| Open machine floor (pouncer patrol) | 1220–1785 | floor | — | plain floor; gears and chains on the wall **behind**, nothing standing on the floor |
| Gothic windows (**green**) | 2–4 of them, anywhere 100–1800 | 80–360 | tall and narrow | the green openings |
| Right pier | 1860–1920 | floor to top | — | joint with the landing |

**Dark prompt:**
> [Dark block] Interior of a clock tower's lower floors: a solid stone back wall, floor and dark wooden ceiling beams, no sky except through three tall narrow gothic windows high in the back wall, which are flat green #00FF00. Enormous stopped brass and iron gears fill the back wall, a heavy stone counterweight hangs frozen on thick chains. Left of centre, three flat-topped stone steps rise to the right to a broad flat bell platform, the steps crumbled and wrapped in roots; above the platform a cracked bronze bell hangs in a heavy wooden frame. Right half: an open stone floor with machinery only on the wall behind it. Corruption roots crack through the walls and wrap the gears. Plain thick stone piers at the far left and far right edges.

**Restored prompt:**
> [Restored block] + *"The machinery polished and turning, warm afternoon light slanting from the windows in dusty beams across the back wall, brass gleaming, the counterweight mid-swing, ropes taut, oil cans and a tidy workbench against the wall, the steps solid dressed stone, the bell bright bronze."*

---

## A3-3 · Upper landing and the view — `bg_a3_landing_dark` / `_restored`

The top of the tower. A wide stone floor where the Bell Warden fights, a ledge with
the third bell, the great bell and the back of the clock face up in the rafters,
and on the right a **high gallery** in front of **tall open arches** looking out
over the village.

| What | x (image px) | y (image px) | Size | Notes |
|---|---|---|---|---|
| Ground line | full width | 670 | — | stone floor, flat |
| Left pier | 0–60 | floor to top | — | joint with the mechanisms |
| Old Road door spot + fire spot | 170–290 | floor | — | plain wall and floor; the game draws a door and a fire here |
| Ledge 3, *remembered only* | 452–655 | top 602 | 0.6 Rowan high | low stone ledge, flat top |
| Bell 3 | hangs over x 542 | bell rim ~ 400 | bell 0.7 Rowan tall | from a beam or bracket above the ledge |
| Warden arena | 655–1276 | floor | — | **wide open floor**, plain wall behind (the Warden is 2 Rowans tall and must read clearly) |
| Stair space | 1016–1276 | below 467 | — | **leave empty**: plain wall. The game raises a stair here after the fight |
| High gallery | 1288–1852 | top 467 | 1.7 Rowans high | stone gallery floor with a flat top, on arches or a solid wall below; a low balustrade along its **back** edge only, nothing on the front edge |
| Great bell and clock face back | left two thirds, 60–1200 | above ~ 300 | — | the cracked great bell in the rafters, the clock face's back with frozen hands |
| Tall open arches (the view) | 1300–1850 | from 467 up to ~ 90 | 3 arches | through the arches: **the village far below** in the lower part, **green #00FF00 sky** above the horizon |
| Right wall | 1860–1920 | floor to top | — | end of the world |

**The view through the arches** (lower part of the arch openings, below the
horizon at ~ y 330): the village seen far below and small, rooftops, the canal, a
big tree in a playground and **one small cottage at the edge of town**. Dark:
dark roofs, a single lit window in the cottage. Restored: red roofs, striped market
awnings, the sparkling canal, the playground's green tree, smoke rising from the
cottage chimney. **Above the horizon it is flat green.**

**Dark prompt:**
> [Dark block] Interior of the top of a clock tower: solid stone walls and floor, heavy dark timber rafters. Upper left two thirds: a great cracked bronze bell hangs in the rafters wrapped in corruption roots, beside the huge back of the clock face with its hands frozen. Low on the left, a short flat-topped stone ledge, crumbled and rooted, with a small bronze bell hanging above it. The middle is a wide open stone floor in front of a plain wall. On the right, a high stone gallery with a flat top about a third of the image height above the floor, a balustrade along its back edge, and behind it three tall open gothic arches looking out and down over a small dark village far below: rooftops, a canal, a big tree, one cottage with a single lit window; above the village's horizon the arches show flat solid green #00FF00. Plain thick stone wall at the far left and far right edges.

**Restored prompt:**
> [Restored block] + *"The great bell polished bronze, the clock's hands turning, the ledge solid, sunlight pouring through the arches across the floor, and through the arches the whole village in golden light below: red roofs, striped market awnings, the sparkling canal, the playground's big green tree, the little cottage with smoke rising from its chimney. Above the horizon the arches stay flat green #00FF00."*

---

## Checking an image before sending it

- Ground line straight and at 62% (y 670)? Ledge and gallery tops flat?
- Green only where the far distance shows, pure and hard-edged? No green at the
  outer edges except sky above the courtyard's outer wall?
- Fire spots, door spot, enemy floors and the stair space plain?
- No figures, no text, no sun or moon?
- Restored overlaid on dark at 50%: walls, ledges and arches line up?

## Checklist (in order)

| Priority | Files | Why |
|---|---|---|
| 1 | `bg_a3_courtyard_dark` / `_restored` | Eli is found here; the first thing seen in Act 3 |
| 2 | `bg_a3_landing_dark` / `_restored` | the boss fight, the rescue and the view |
| 3 | `bg_a3_mechanisms_dark` / `_restored` | |

Drop the files into `newart/` or `assets/backgrounds/` with these names and tell
me. I'll key out the green, place each painting at full speed over its area,
measure the ledges, bells, window and arches, and move the game's walkable
surfaces and props to match.

## Game wiring when the art lands (for the developer)

- Act 3 paintings move at **1.0** (with the world), not on the 0.7 painting
  layer: scale `W / 1920` (1600 → 0.833, 1700 → 0.885), left edge at the region's
  x, ground line y 670 → world y 560. Image → world:
  `x = regionX + px × W/1920`, `y = 560 − (670 − py) × W/1920`.
- Remove `continues: true` from the tower regions; the continuation seeds are
  not used for Act 3.
- The game-drawn placeholder ledges, steps and window frame go invisible
  (surfaces stay); the lantern "bells" become glows at the painted bells.
- Surfaces now: courtyard 14110–14220 @500, 14240–14450 @440 (bell 14360);
  window (14070, 290); Old Road door 13750, lever 13685; mechanisms steps
  15700–15810 @500, 15820–15930 @440, 15940–16160 @380 (bell 16060); landing
  ledge 17300–17480 @500 (bell 17380), Warden 17480–18030, final steps from
  17800, gallery and viewing platform @380 to 18540, Eli at 18200.
