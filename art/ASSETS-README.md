# Art needed for the MVP — start here

**Game:** Embers of Before (repo: sunburn). **Story:** `docs/competition/CAMPAIGN.md`.
**Deadline:** 18 October, 09:30 Karachi time.

Right now Act 2 and Act 3 reuse Act 1's paintings, and Mara, Tomas and Nia are
tinted copies of Rowan and Eli. These files list exactly what to generate to fix
that, in priority order, with copy-paste prompts.

| File | What it covers | Images |
|---|---|---|
| [background_prompts_act2.md](background_prompts_act2.md) | Act 2 — The Playground: swings, treehouse, canal | 6 (3 dark + 3 restored) |
| [background_prompts_act3.md](background_prompts_act3.md) | Act 3 — The Clock Tower: courtyard, bell mechanisms, upper landing | 6 (3 dark + 3 restored) |
| [character_sprites.md](character_sprites.md) | Mara, Tomas, Nia; Bell Warden boss; optional Five-Hand | 8 required strips + optional |

## Priority order (if time runs out, stop from the bottom)

1. **Characters:** Mara, Tomas, Nia idle strips (they're on screen during the most important story scenes).
2. **Act 3 backgrounds** (courtyard first: it's where Eli is found).
3. **Act 2 backgrounds** (swings first).
4. **Bell Warden** boss strips.
5. Character talk/walk strips, then the optional items.

---

## How the game uses backgrounds (why the rules below exist)

- It's a **side-scroller**: one continuous world, the camera slides left to right.
  Each area ("region") is **1600–1700 px wide** in a 1280×720 game window.
- Each region gets **one complete painting** (sky included) scaled to the
  region's width. The dark version shows at night; when the player lights a fire,
  the **restored** version fades in on top. The two must line up exactly.
- The game draws its **own walkable ground strip** at a fixed height, plus its own
  fires, steps, doors, bells, ladders and the swing board. The painting is the
  scenery **behind** the play area.
- Neighbouring paintings are placed **edge to edge**. I'll overlap them by about
  150 px and blend the joint, so a close match is enough, but **matching ends
  are a big plus**: same ground height, same horizon, same sky colour, and any
  wall or building cut by the edge continues in the next image.

## Rules for every background

1. **Aspect 21:9, ultrawide** (2520×1080 or the model's 21:9 size). If your tool
   can't do 21:9, use 16:9 and say so — I'll adapt the scaling.
2. **Strict side view**, camera at standing height, like a 2D platformer level.
   No perspective floor, no 3/4 angle, no top-down.
3. **The walk line:** the ground people walk on is a **flat horizontal line 82%
   down from the top** (≈ y 885 of 1080), straight across the whole image. Below
   it, simple dark earth or stone (it's mostly hidden by the game's ground strip).
4. **Scale:** a standing adult is about **1/6 of the image height**; doors are a
   bit taller than that.
5. **Complete scene, sky included.** No green screen, no transparency.
6. **No characters, creatures, text, letters, signs with writing, UI or watermark.**
7. **Canon (important):** a **meteor** corrupted the world into endless night.
   - **Dark version:** deep indigo-violet night sky with faint stars and a low
     violet haze. **No sun, no moon, no eclipse, no cracked sun, no meteors in the
     sky.** Corruption shows as black thorny roots with cold violet cracks growing
     over stone and wood.
   - **Restored version:** the same place before the impact, a warm golden late
     afternoon with a normal sun low in the sky, blue sky, green grass and leaves,
     intact buildings.
8. **Leave gameplay objects out.** Don't paint seats on the swing, doors on the
   Old Road, bells, ladders, braziers or fire pits — the game draws those. Each
   scene below says which areas to keep clear.

## How to generate a pair (dark + restored) with matching ends

1. **Go in route order** (Act 2: swings → treehouse → canal; Act 3: courtyard →
   mechanisms → landing).
2. **Dark version first.** Attach: the style references listed in the file, plus
   **the previous region's dark image** (for the seam). Use the prompt and add the
   seam line it gives.
3. **Restored version.** Attach **this region's dark image** (for layout) and the
   **previous region's restored image** (for the seam). Use the restored prompt.
4. Check: overlay dark and restored at 50% — buildings, horizon and walk line
   should line up. Put the two images side by side with the previous region —
   the joint should look like one place.

## Rules for every character/boss sprite strip

1. **One animation per image**, frames in **one horizontal row**, equal-width
   cells, no gaps, no frame borders, no labels.
2. **Flat solid pure green background (#00FF00)**, hard edges, no glow or shadow
   on the green. (I remove it.) Real transparency is also fine.
3. All characters **face right**, same scale and same feet line in every frame.
4. Attach `public/sprites/hero_walk.png` (Rowan) and `public/art/eli-sheet.png`
   (Eli) as style and scale references.

## Delivering files

Put backgrounds in `assets/backgrounds/` and sprites in `assets/characters/`,
using the filenames given. Tell me when a batch lands — I'll process and wire it
in (keying, scaling, seams, animations).
