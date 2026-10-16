# Background Asset List — Prologue + Act 1

Working title: **Embers of Before** (placeholder)
Reference images to attach to every generation: `Campfire in the Ruined Village.png`, `Lantern Bearer in the Ruined Keep.png`

---

## How to generate (read first)

1. **Every playable scene needs TWO versions with the SAME composition:**
   - `_dark` = present day, ruined, eclipsed red sun (like the reference images)
   - `_restored` = the past, a few minutes before the disaster: warm golden afternoon, intact buildings, green grass
   The game crossfades between them when a fire is lit, so buildings, ground and platforms must be in the **same place** in both.
   **Generate the dark one first, then feed it back in as the input/reference image** with the restored prompt ("same exact composition and layout, but...").

2. **No characters, no enemies, no text, no UI, no watermark** in any background. Sprites come separately.

3. **Size:** 1920×1080 (16:9). If your tool can't, use the closest 16:9 size; we'll scale it.

4. **Layers:** the game uses parallax, so the sky, distant skyline and playable scenes are separate images.
   - Images marked **[GREEN]** must have the empty/sky area filled with **flat pure green (#00FF00)** so we can cut it out. If the tool won't do flat green, give it to me anyway and I'll mask it.

5. **Ground line rule (important):** in every playable scene, the main walkable ground meets the **left and right edges at about 75% down the image** (≈ y 810 of 1080). That's how screens join up side by side. Below the ground is solid dark stone/earth down to the bottom edge.

6. **File naming:** use the filenames below and put them in `assets/backgrounds/`.

---

## Shared style block (paste at the start of every prompt)

> Detailed 16-bit style pixel art, 2D side-scrolling platformer background, flat orthographic side view (no perspective tilt), dark gothic post-apocalyptic fantasy village, crumbling stone and timber buildings overgrown with ivy and dead vines, muted deep blues, purples and charcoal, warm orange firelight as the only strong accent, atmospheric haze, crisp readable silhouettes. Match the art style, palette and detail level of the attached reference images. No characters, no creatures, no text, no UI.

## Restored style block (use instead, together with the dark image as reference)

> Same exact composition, layout, camera and building positions as the reference image, but shown BEFORE the disaster: warm golden late-afternoon sunlight, clear blue sky with soft clouds and a normal bright yellow sun, buildings intact and lived-in, clean stone, green grass, wildflowers, healthy leafy trees, colorful cloth banners, flower boxes, peaceful and nostalgic mood. Same 16-bit pixel art style. No characters, no text.

---

# SHARED LAYERS (used across the whole game)

### 01 · `bg_sky_dark.png` — Sky, present day
Furthest layer, barely moves. Visible behind everything.
> [style block] Full-frame sky only, no ground, no buildings. Dark night-like sky of purple-black and charcoal clouds. Upper right third: a huge cracked, dead red-black sun with a fiery crimson corona and burning fractures, glowing ember fragments drifting away from it. Red light bleeding into the clouds around it, fading to deep indigo toward the left. Faint falling meteor streaks in the far distance.

### 02 · `bg_sky_restored.png` — Sky, the past
> [restored block] Full-frame sky only, no ground, no buildings. Warm late-afternoon sky, soft blue at top fading to gold and peach near the horizon, fluffy clouds lit orange from below, a normal bright sun in the upper right third in the same position as the dead sun in the reference.

### 03 · `bg_skyline_dark.png` [GREEN] — Distant city + clock tower
Middle-distance silhouette layer, slow parallax. **The clock tower is the player's goal for the whole game, so it must be clearly visible.**
> [style block] Wide distant skyline silhouette on a flat pure green (#00FF00) background. Gothic spires and ruined cathedral towers, a tall gothic CLOCK TOWER with a large round clock face slightly right of center (the tallest structure), a long ruined stone aqueduct with arches on the right, dead leafless trees, faint dim-red rim light from the dead sun on the right edges. Dark desaturated purples and blacks, low detail, hazy, clearly far away. Everything below the skyline is solid dark silhouette down to the bottom 20% of the image.

### 04 · `bg_skyline_restored.png` [GREEN] — Distant city, the past
> [restored block] Same skyline silhouette and layout on flat pure green (#00FF00): gothic spires, the tall clock tower with its clock face lit by golden sun, the aqueduct intact with all arches whole, leafy green trees, hazy blue atmospheric distance.

### 05 · `fg_silhouettes_dark.png` [GREEN] — Foreground frame (optional, nice to have)
Very close layer in front of the player, fast parallax, adds depth.
> [style block] Foreground silhouettes on a flat pure green (#00FF00) background: near-black broken fence posts, crooked grave crosses, dead thorny branches and tall dead grass along the BOTTOM edge only, a gnarled dead tree branch reaching in from the top-left corner. Mostly empty green in the middle. Almost pure black with very slight purple rim light.

### 06 · `fg_silhouettes_restored.png` [GREEN]
> [restored block] Same foreground shapes on flat pure green (#00FF00), but as leafy green bushes, intact white picket fence, flowers and tall green grass along the bottom; leafy branch in the top-left corner.

---

# MENU + CUTSCENES

### 07 · `bg_title_screen.png` — Title / main menu
Full composited image (no green).
> [style block] Wide cinematic view from a hill: in the foreground left, a small ruined two-story stone cottage with a single warm candle glowing in a window. A dirt path winds right through a ruined village down toward a distant gothic city dominated by a tall clock tower. Sky dominated by the huge cracked red-black dead sun with a fiery corona. Leave the upper-left third darker and simpler for the game title text. Lonely, hopeful, melancholic.

### 08 · `cut_01_before.png` — Cutscene: the normal day
> [restored block] Wide view of a peaceful village on a sunny golden afternoon from the doorway of a cozy cottage: a dirt path leading toward a small park playground with swings in the middle distance, a gothic clock tower far behind. A child's red ball lying on the path. Warm and safe.

### 09 · `cut_02_sun_breaks.png` — Cutscene: the sun explodes
> [style block, but bright daylight colors at the edges] Same village view as the reference, the sun in the sky violently cracking apart, glowing red fractures splitting it, the sky turning from blue to blood red in a wave from the sun outward, long shadows stretching across the village, birds fleeing.

### 10 · `cut_03_meteors.png` — Cutscene: meteors fall
> [style block] The same village under a blood-red sky, dozens of burning meteors raining down trailing fire and smoke, one striking near the clock tower, roofs exploding, dust and embers filling the air. Chaotic and terrifying, but no people visible.

---

# PROLOGUE — HOME (~3 min)

Story: the protagonist was down in the cellar when the meteors hit and survived there. They wake in the dark, climb up, find a lantern, light the candle by the family photo → rewind shows the brother's echo running out the front door. Follow him outside.

### 11 · `bg_p1_home_dark.png` — House interior, present (cutaway)
**This is basically the Lantern Bearer reference, regenerated clean without characters.** Full composited image (it's an interior, no sky layer needed except through gaps).
> [style block] Side-view cutaway of a ruined two-story stone cottage, exactly like the attached Lantern Bearer reference. UPPER FLOOR (the main walkable floor at about 60% down the image): arched wooden front door on the far LEFT wall, tall wooden bookshelf with jars and a skull, a child's crayon drawing pinned on the wall showing two stick-figure kids holding hands under a sun, a wooden table with an unlit candle and a framed photo of two brothers, a boarded-up window with a torn red banner with a sun symbol, an open treasure chest, a fallen teddy bear on the floor on the right. Collapsed roof with broken rafters and cobwebs, dim red sky glimpsed through holes. LOWER FLOOR (cellar, bottom of image): a wooden ladder in the center-left connecting cellar to upper floor, shelves of jars, crates, a small table with one candle, hanging chains, an arched doorway and iron bars on the right. Very dark, cold blue-black shadows, only faint light.

### 12 · `bg_p1_home_restored.png` — House interior, the past
> [restored block] Same cutaway cottage, same layout. Roof intact with clean wooden beams, warm sunlight streaming through an open, unboarded window, the red sun banner clean and bright, the crayon drawing bright and colorful, the candle lit, the photo frame clean, teddy bear sitting neatly on a small bed or chair, potted plants, a rug on the floor, cellar tidy with full shelves of preserves. Cozy family home.

### 13 · `bg_p2_yard_dark.png` [GREEN] — Front yard → path out
Exiting the front door. First outdoor screen, first jump, first glimpse of a shadow in the distance. Ends on the right leading toward the village.
> [style block] Outdoor scene on flat pure green (#00FF00) where the sky would be. LEFT edge: the stone outer wall and arched front door of the cottage. Ground: a cracked dirt garden yard with a broken wooden picket fence, a dead vegetable garden, a toppled wheelbarrow, a fallen well bucket. Center: a small meteor crater gap in the ground (a jump), with faint glowing embers at its bottom. A crooked dead tree with a rope swing whose rope has snapped. RIGHT side: a broken garden gate opening onto a dirt path leading on. A small unlit iron brazier on a stone post near the gate (checkpoint fire). Ground meets left and right edges at about 75% down the image.

### 14 · `bg_p2_yard_restored.png` [GREEN]
> [restored block] Same yard and layout on flat pure green (#00FF00). Intact white picket fence, a thriving vegetable garden, the wheelbarrow upright full of flowers, the tree leafy and green with an intact rope swing, no crater (the ground is whole, flat grass), the garden gate open and painted, the brazier lit with a cheerful small flame.

---

# ACT 1 — THE RUINED VILLAGE (~7 min)

Four connected screens, played left to right. All [GREEN] above the skyline so the shared sky + skyline show through. Ground meets left/right edges at ~75% height on every screen.

### 15 · `bg_a1_lane_dark.png` [GREEN] — Village lane
Dark only, lantern-light exploration, first real shadows. A small brazier checkpoint at the end.
> [style block] Narrow cobblestone village lane on flat pure green (#00FF00) where the sky would be. Ruined two-story timber houses on both sides in the background with broken windows and collapsed roofs. Raised platforms to climb: a collapsed cart and stacked crates on the left, a broken stone stair leading up to a second-story wooden balcony in the middle (a higher route), dangling lanterns on ropes strung between houses, unlit. A rickety wooden signpost pointing right. A small unlit iron brazier on the right edge. Ground meets the left and right edges at about 75% down the image.

### 16 · `bg_a1_lane_restored.png` [GREEN]
> [restored block] Same lane and layout on flat pure green. Houses intact with flower boxes and shutters, the cart upright and loaded with apples, the stone stair whole, the balcony intact with hanging laundry, lanterns strung between houses, colorful bunting, brazier lit.

### 17 · `bg_a1_square_dark.png` [GREEN] — Market square
Wider open area, more shadows, first BIG puzzle. The fountain bonfire is the fire here. While restored, the market stall awnings and the intact bell tower stairs let you climb higher.
> [style block] Village market square on flat pure green (#00FF00) where the sky would be. Center: a cracked dry stone fountain with a large unlit bonfire pile of broken wood in its basin. Left: collapsed market stalls with torn ragged awnings and smashed crates. Right: a small half-collapsed stone bell tower whose wooden staircase has broken away halfway up, leaving a gap. Torn red banners with a sun symbol hanging from poles. A dried well. Rubble piles. Ground meets left and right edges at about 75% down.

### 18 · `bg_a1_square_restored.png` [GREEN]
> [restored block] Same square and layout on flat pure green. The fountain flowing with clear water and the bonfire burning warmly, market stalls intact with striped colorful awnings (stretched taut like trampolines) and baskets of bread and fruit, the bell tower whole with a complete wooden staircase to the top and a bronze bell, bright clean sun banners, the well with a bucket.

### 19 · `bg_a1_bridge_dark.png` [GREEN] — The broken bridge
**The signature rewind moment:** a brazier on the left bank; light it and the bridge rebuilds for a limited time. Run across before it crumbles.
> [style block] A river crossing on flat pure green (#00FF00) where the sky would be. Left bank: solid stone ground with a ruined stone archway and an unlit iron brazier. Center: a long wooden plank bridge on wooden stilts over a dark river, most of the bridge COLLAPSED, only a few broken posts and dangling planks remain with large gaps, a torn rope railing. The river below is dark with blood-red reflections of the dead sun. Right bank: solid ground with ruined houses and a path continuing right. Ground on both banks meets the left and right edges at about 75% down.

### 20 · `bg_a1_bridge_restored.png` [GREEN]
> [restored block] Same river crossing and layout on flat pure green. The wooden bridge fully intact, plank walkway level with both banks, rope railing, little lanterns on the posts. Clear blue-green river reflecting golden sunlight, reeds and lily pads along the banks. Brazier lit.

### 21 · `bg_a1_campfire_dark.png` [GREEN] — The village campfire (end of Act 1)
**This is the Campfire reference, regenerated clean.** The big fire of the act. Lighting it triggers the longest rewind and an echo of the brother running toward the park/playground (to the right). Exit right leads to the Playground.
> [style block] Exactly like the attached Campfire in the Ruined Village reference, on flat pure green (#00FF00) where the sky would be. Left: a ruined two-story stone house with an arched door on a raised ledge, a gnarled dead tree. Center: an open flat stone plateau with an unlit campfire ring of logs and stones, a tall wooden post with a hanging torn red banner with a sun symbol and a hanging lantern. Behind it a broken crumbling stone wall. Right: a crooked leaning wooden telegraph pole with sagging wires, and a long rickety wooden walkway leading off the right edge toward distant ruins. Ground meets the left and right edges at about 75% down.

### 22 · `bg_a1_campfire_restored.png` [GREEN]
> [restored block] Same layout on flat pure green. The stone house intact with a tiled roof and window lights, the tree full of leaves, the campfire burning brightly with a ring of log benches around it, the banner bright, the lantern lit, the stone wall whole with climbing roses, the telegraph pole straight, the wooden walkway solid with a painted sign pointing right reading nothing (blank sign) and a glimpse of a playground's swing set far on the right.

---

## Checklist

| # | File | Type | Green? |
|---|---|---|---|
| 01 | bg_sky_dark | Shared sky | — |
| 02 | bg_sky_restored | Shared sky | — |
| 03 | bg_skyline_dark | Shared parallax | ✅ |
| 04 | bg_skyline_restored | Shared parallax | ✅ |
| 05 | fg_silhouettes_dark | Foreground (optional) | ✅ |
| 06 | fg_silhouettes_restored | Foreground (optional) | ✅ |
| 07 | bg_title_screen | Menu | — |
| 08 | cut_01_before | Cutscene | — |
| 09 | cut_02_sun_breaks | Cutscene | — |
| 10 | cut_03_meteors | Cutscene | — |
| 11 | bg_p1_home_dark | Prologue | — |
| 12 | bg_p1_home_restored | Prologue | — |
| 13 | bg_p2_yard_dark | Prologue | ✅ |
| 14 | bg_p2_yard_restored | Prologue | ✅ |
| 15 | bg_a1_lane_dark | Act 1 | ✅ |
| 16 | bg_a1_lane_restored | Act 1 | ✅ |
| 17 | bg_a1_square_dark | Act 1 | ✅ |
| 18 | bg_a1_square_restored | Act 1 | ✅ |
| 19 | bg_a1_bridge_dark | Act 1 | ✅ |
| 20 | bg_a1_bridge_restored | Act 1 | ✅ |
| 21 | bg_a1_campfire_dark | Act 1 | ✅ |
| 22 | bg_a1_campfire_restored | Act 1 | ✅ |

**Priority if short on time:** 01, 03, 11, 12, 13, 15, 19, 20, 21, 22. The rest can be placeholders at first.
