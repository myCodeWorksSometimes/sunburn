# Art needed for the MVP — start here

**Game:** Embers of Before (repo: sunburn). **Story:** `docs/competition/CAMPAIGN.md`.
**Deadline:** 18 October, 09:30 Karachi time.

Right now Act 2 and Act 3 reuse Act 1's paintings, and Mara, Tomas and Nia are
tinted copies of Rowan and Eli. New paintings show up in the game as soon as they
are processed (`python tools/process_backgrounds.py`): no code change needed. These files list exactly what to generate to fix
that, in priority order, with copy-paste prompts.

| File | What it covers | Images |
|---|---|---|
| [background_prompts_act2.md](background_prompts_act2.md) | Act 2 — The Playground, **new green-layer approach**: backgrounds, foreground props, front silhouettes, all on #00FF00 (supersedes the rules below for Act 2) | 6 backgrounds + 14 props (+2 optional) |
| [background_prompts_act3.md](background_prompts_act3.md) | Act 3 — The Clock Tower: courtyard, bell mechanisms, upper landing | 6 (3 dark + 3 restored) |
| [character_sprites.md](character_sprites.md) | Mara, Tomas, Nia; Bell Warden boss; optional Five-Hand | 8 required strips + optional |

## Priority order (if time runs out, stop from the bottom)

1. **Characters:** Mara, Tomas, Nia idle strips (they're on screen during the most important story scenes).
2. **Act 3 backgrounds** (courtyard first: it's where Eli is found).
3. **Act 2 backgrounds** (swings first).
4. **Bell Warden** boss strips.
5. Character talk/walk strips, then the optional items.

---

## How the game uses backgrounds (layers, since 18 Oct)

It's a **side-scroller** in a 1280×720 window. The world is drawn as layers that
slide at different speeds as Rowan walks:

| Layer | Speed | What | Status |
|---|---|---|---|
| Sky | fixed | star field (night) / `bg_sky_restored` (day) | done |
| Skyline | 25% | `bg_skyline_*`: distant spires and the clock tower | done |
| **Region painting** | 70% | one 16:9 scene per area, **sky keyed out** | Act 1 done, **Act 2/3 needed** |
| Ground strip | 100% | the stone ground Rowan walks on (game-drawn tile) | done (art optional) |
| Props | 100% | stall, steps, swing, gears, doors, bells — anything Rowan touches | game-drawn (art optional) |

What this means for paintings:

- The painting moves **slower than Rowan**, so nothing in it lines up with
  gameplay. **Never paint holes, steps, ledges or platforms the player must use**:
  the crater, the canal gap, the steps up to the bells are drawn by the game in
  front. The painting is pure scenery.
- Within an act, each painting is **generated as a continuation of the previous
  one** (`tools/make_continuation.py`, steps in the Act 2 file), so the joints
  are exact. Between acts the game fades one painting into the next.
- The **sky above the rooftops is flat pure green #00FF00**, like the Act 1
  paintings: the game's own sky and skyline (with the clock tower) show through
  and give the depth. Interiors have no sky, so no green there.

## Rules for every background

1. **Aspect 16:9, 1920×1080.** Don't go wider.
2. **Strict side view**, camera at standing height, like a 2D platformer level.
   No perspective floor, no 3/4 angle, no top-down.
3. **The walk line:** a **flat horizontal ground line 62% down** (≈ y 670 of
   1080), straight and unbroken across the whole image. Below it, plain dark
   earth or stone (the game covers it).
4. **Scale:** a standing adult is about **1/8 of the image height** (≈ 130 px);
   doors a bit taller.
5. **Sky = flat pure green #00FF00** (hard edge against rooftops and trees, no
   glow). Clouds, sun and stars come from the game's sky layer. Interior scenes:
   no sky at all.
6. **No characters, creatures, text, letters, signs with writing, UI or watermark.**
7. **Canon (important):** a **meteor** corrupted the world into endless night.
   - **Dark version:** night colours, slate, plum and charcoal, faint violet haze
     on distant shapes. **No sun, moon, eclipse, cracked sun or meteors.**
     Corruption = black thorny roots with cold violet cracks over stone and wood.
   - **Restored version:** the same place before the impact, warm golden late
     afternoon light, green grass and leaves, intact and cared-for buildings.
8. **No gameplay objects:** no holes in the ground, usable steps, swing seats,
   doors on the Old Road, bells, ladders, braziers or fire pits.

## How to generate a pair (dark + restored)

1. **Dark version first.** Attach the style references listed in the act's file
   and (optionally) the previous region's dark image for a matching look.
2. **Restored version:** attach **this region's dark image** and ask for the same
   composition. Check by overlaying at 50%: buildings and the walk line should
   line up (the game fades one into the other).

## Optional layer art (only after the paintings and characters)

All on flat #00FF00, side view, same pixel style; filenames go in
`assets/backgrounds/`. The game already draws placeholders for all of these.

| File | What | Size |
|---|---|---|
| `ground_cobble_dark` / `_restored` | A tileable strip of village cobbles: the top edge is the walk surface, ~25% of the height; below it, earth and foundation stones. Left and right edges must tile. Restored: grass tufts along the top edge. | 1920×540 |
| `prop_market_stall_dark` / `_restored` | Mara's market stall, front-on side view: wooden counter, shuttered front, a sloped plank roof Rowan can stand on. About 2 adult heights tall, 2.2 wide. | 1080×1080 |
| `prop_bell_dark` / `_restored` | One bronze bell in a small wooden frame (used three times). Dark: cracked, roots. | 1080×1080 |
| `prop_waterwheel_dark` / `_restored` | Just the wheel, round, side view, nothing behind it (the game spins it). | 1080×1080 |
| `prop_swing_dark` / `_restored` | One swing seat with two chains hanging straight down. | 1080×1080 |
| `fg_roots` | A strip of black thorny root silhouettes for the very front (slides past fastest). | 1920×540 |

## Rules for every character/boss sprite strip

1. **One animation per image, at most 16:9** (1920×1080). Up to **5 frames in
   one row**; **6 frames as two rows of 3**. Equal-size cells, no gaps, no frame
   borders, no labels.
2. **Flat solid pure green background (#00FF00)**, hard edges, no glow or shadow
   on the green. (I remove it.) Real transparency is also fine.
3. All characters **face right**, same scale and same feet line in every frame.
4. Attach `public/sprites/hero_walk.png` (Rowan) and `public/art/eli-sheet.png`
   (Eli) as style and scale references.

## Delivering files

Put backgrounds in `assets/backgrounds/` and sprites in `assets/characters/`,
using the filenames given. Tell me when a batch lands — I'll process and wire it
in (keying, scaling, seams, animations).
