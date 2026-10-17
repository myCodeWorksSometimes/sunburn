# Background Asset List — Act 2: The Playground

Working title: **Sunburn**
Attach these reference images to every generation:
- `Campfire in the Ruined Village.png` and `Lantern Bearer in the Ruined Keep.png` (the original style)
- `assets/backgrounds/cut_01_before.jpg` (shows the playground from the house: swings, slide, benches, low fence)
- `assets/backgrounds/bg_a1_campfire_restored.jpg` (the swing set visible past the rope bridge, so Act 2 matches it)

---

## What happens in Act 2 (so the art fits the gameplay)

The rope bridge from the Act 1 campfire leads into the town park, where the brother went to play. It's the emotional middle of the game:
1. **Park gate:** arrive. The playground is wrecked, with meteor craters, bent metal and ash.
2. **Swings & slide:** in the past, the swings work and launch you across a crater.
3. **Merry-go-round & seesaw:** a spinning platform and a seesaw that flings you up, both only in the past.
4. **Sandbox & monkey bars:** you find **his red ball** in the sand. A **small shadow** appears at the edge of your light and runs away.
5. **The old oak lookout:** the flashback. In the past you see him on the swings when the sky cracks, and he runs toward the **clock tower**. Exit leads to Act 3.

**Moving playground equipment is NOT painted into the backgrounds.** The swings, merry-go-round top and seesaw plank are separate prop images (section P below) so they can move in-game. The backgrounds only show the fixed frames and posts.

---

## Rules (same as before, plus fixes for what went wrong last time)

1. **Two versions of every playable scene, same layout:** `_dark` (present, ruined, red eclipsed sky) and `_restored` (the past, golden afternoon). Generate the dark one first, then give it back to Gemini as the reference with the restored prompt.
2. **Strictly flat side view.** Like a 2D platformer level, no perspective or 3/4 angle on the ground. (The Act 1 campfire dark came out in perspective, which made it hard to line up.)
3. **No characters, no creatures, no shadow monsters, no text, no letters, no signs with writing, no watermark.**
4. **Green screen:** anywhere the sky would show, fill with **perfectly flat solid #00FF00**. No glow, no gradient, no haze bleeding into the green, hard edges against it.
5. **Size:** 1920×1080 (16:9).
6. **Ground line:** the main walkable ground meets the **left and right edges at about 75% down** (≈ y 810 of 1080). Solid dark earth/stone below it down to the bottom edge.
7. **Same camera zoom as Act 1:** a person would be about 1/7 of the image height.
8. **File naming:** use the names below and put them in `assets/backgrounds/` (props in `assets/props/`).

---

## Shared style block (paste at the start of every prompt)

> Detailed 16-bit style pixel art, 2D side-scrolling platformer background, strictly flat orthographic side view with no perspective, dark gothic post-apocalyptic fantasy town park, crumbling stone, rusted iron and weathered wood, dead trees, ash and meteor craters, muted deep blues, purples and charcoal, warm orange firelight as the only strong accent, faint haze, crisp readable silhouettes. Match the art style, palette and detail level of the attached reference images. No characters, no creatures, no text, no letters, no UI. Every area where sky would be visible is perfectly flat solid pure green #00FF00 with hard edges and no glow.

## Restored style block (use instead, with the dark image as reference)

> Same exact composition, layout, camera and object positions as the reference image, but shown BEFORE the disaster: warm golden late-afternoon sunlight, buildings and equipment intact and freshly painted in faded primary colours, green grass, wildflowers, leafy trees, clean sand, peaceful and nostalgic mood. Same 16-bit pixel art style, same flat side view. No characters, no text. Sky areas remain perfectly flat solid pure green #00FF00.

---

# SCENES

### 01 · `bg_a2_gate_dark.png` [GREEN] — Park gate
Arrival screen. The Act 1 rope bridge ends at the left edge. First look at the ruined park. One brazier checkpoint.
> [style block] LEFT edge: the end of a rope-and-plank bridge anchored to a rocky cliff edge, landing onto solid ground. LEFT-CENTER: a tall wrought-iron park gate in a stone arch, one gate door hanging off its hinge, ivy and dead vines, a blank weathered wooden board on the arch (no writing). CENTER: a cracked cobbled path into the park, a toppled park bench, a broken iron lamp post bent sideways, a small meteor crater with faint glowing embers. RIGHT: low broken iron fence, dead hedges, and in the distance the top of a swing set frame. An unlit iron brazier on a stone plinth just inside the gate. Ground meets the left and right edges at about 75% down.

### 02 · `bg_a2_gate_restored.png` [GREEN]
> [restored block] Same gate scene. Gate intact and painted black with gold tips, the board on the arch freshly painted (still no writing), lamp post upright with a glass lantern, bench upright, neat hedges and flower beds, the crater replaced by a smooth path, the rope bridge on the left in good repair. Brazier lit.

### 03 · `bg_a2_swings_dark.png` [GREEN] — Swings & slide
**Puzzle:** a wide crater splits the screen. In the past, the swing works and launches you over it. The swing SEATS AND CHAINS are a separate prop: paint only the **empty swing frame**.
> [style block] LEFT: solid ground with a large rusted A-frame swing set frame (two tall slanted legs on each side and a top bar), **no seats and no chains hanging from it**, just the empty bar. CENTER: a wide deep meteor crater splitting the ground, about one third of the image wide, jagged edges, faint embers glowing at the bottom, charred earth. RIGHT: solid ground continuing, a tall metal slide that has collapsed — its ladder snapped and the chute fallen diagonally into the dirt. A sandy patch covered in ash. An unlit small brazier on a post on the left side near the swing set. Ground meets the left and right edges at about 75% down.

### 04 · `bg_a2_swings_restored.png` [GREEN]
> [restored block] Same layout. The swing frame painted red and clean (still **no seats or chains**, empty top bar). The crater is still there but shallower and grassy at the edges (it's a sunken dip in the park, the swing is how kids jump it). The slide is standing upright and whole, painted yellow, with a straight ladder up its back and a shiny chute. Brazier lit.

### 05 · `bg_a2_carousel_dark.png` [GREEN] — Merry-go-round & seesaw
**Puzzle:** a high ledge on the right. In the past, the merry-go-round spins (moving platform) and the seesaw flings you up. Paint only the **base/hub** of the merry-go-round and the **pivot stand** of the seesaw; the spinning top and the plank are props.
> [style block] LEFT: a low round stone-and-iron base of a merry-go-round, only the hub and central pole, with the top platform missing (no disc on top). CENTER: a small iron seesaw pivot stand on the ground, **no plank on it**. RIGHT: a raised earth-and-stone ledge about one fifth of the image height above the ground, with a broken wooden fence along its top and a dead tree, reachable only from high up. Scattered debris, a fallen park sign post with a blank board, ash. An unlit brazier on the left near the merry-go-round. Ground meets the left edge at about 75% down; the right edge is the top of the raised ledge.

### 06 · `bg_a2_carousel_restored.png` [GREEN]
> [restored block] Same layout. The merry-go-round hub and pole painted in faded blue and white (still no top disc), the seesaw stand painted green (still no plank), the raised ledge on the right grassy with an intact white fence and a leafy tree, flower beds. Brazier lit.

### 07 · `bg_a2_sandbox_dark.png` [GREEN] — Sandbox & monkey bars
**Story beat:** you find his red ball here, and the small shadow (your brother) first appears. Monkey bars cross a gap; in the dark they're snapped.
> [style block] LEFT: a large wooden sandbox frame filled with grey ash-covered sand, a toy bucket and spade half buried, a little sandcastle crumbled. CENTER: a set of iron monkey bars spanning a gap between two raised wooden platforms, the bars **snapped in the middle**, the broken halves hanging down, a pit below. RIGHT: a small wooden playhouse with a pointed roof, half burned, its little door hanging open, a broken window. Dead bushes. Ground meets the left and right edges at about 75% down.

### 08 · `bg_a2_sandbox_restored.png` [GREEN]
> [restored block] Same layout. Clean golden sand with a neat little sandcastle, bucket and spade, the monkey bars whole and painted orange spanning the gap between the two platforms, the playhouse freshly painted with a red roof, flower box and curtains, open door. Flowering bushes.

### 09 · `bg_a2_oak_dark.png` [GREEN] — The old oak lookout (end of Act 2)
**The flashback.** A huge oak on a small hill at the edge of the park, with a view across to the clock tower. The big fire of the act is a bonfire ring under the tree. Exit on the right leads toward the clock tower (Act 3).
> [style block] CENTER-LEFT: an enormous dead oak tree on a gentle grassy hill, gnarled bare branches spreading across the top of the image, a rope swing hanging from one branch with its seat missing (only frayed rope), carved initials on the trunk as simple shapes (no letters). Under the tree: a stone ring with a pile of logs for a large bonfire, unlit. RIGHT: the hill slopes down to a path leading off the right edge, with a broken stone wall and a rusted iron lamp post. Through the gap on the right, far in the distance, the gothic CLOCK TOWER is clearly visible, large and dark, lit faintly red from behind. Ground meets the left and right edges at about 75% down.

### 10 · `bg_a2_oak_restored.png` [GREEN]
> [restored block] Same layout. The oak is huge and full of green leaves with dappled light, the rope swing intact with a wooden seat, a picnic blanket under the tree near the bonfire ring (bonfire lit, cheerful), the stone wall whole, the lamp post upright. The clock tower in the distance glowing golden in the sunlight, its clock face clearly visible.

---

# PROPS (moving parts, separate images)

Props go on a **flat solid #00FF00 background**, **one object per image, centered, nothing else**, same side view and pixel style, sized so the object fills about 60% of the image. Make a dark and a restored version of each, the same shape and size.

### P1 · `prop_swing_seat_dark.png` / `prop_swing_seat_restored.png`
> [style block, on green] A single playground swing hanging straight down: two long chains and a flat seat at the bottom, side view. Dark: rusted chains with a broken link, cracked grey plank seat. Restored: shiny chains, red painted seat.

### P2 · `prop_carousel_top_dark.png` / `prop_carousel_top_restored.png`
> [style block, on green] A merry-go-round top platform seen from the side: a flat round disc (appears as a wide thin oval slab) with low hand rails, no base or pole. Dark: rusted, dented, missing panels. Restored: painted in blue and white wedge stripes, clean rails.

### P3 · `prop_seesaw_plank_dark.png` / `prop_seesaw_plank_restored.png`
> [style block, on green] A long straight seesaw plank lying perfectly horizontal, side view, with a handle near each end, no stand. Dark: cracked grey wood, rusted handles. Restored: painted green wood, bright handles.

### P4 · `prop_monkey_bars_restored.png`
> [restored block, on green] A straight section of playground monkey bars seen from the side: a horizontal ladder of orange-painted iron rungs between two long rails, no supports. (The dark version is painted into the background as the snapped bars.)

### P5 · `prop_red_ball.png`
> [style block, on green] A child's small red rubber ball with a pale stripe, slightly scuffed, side view. Also as a second image on the same green, a larger close-up version of the ball for the inspection pop-up.

---

# CUTSCENE STILLS

Full images (no green), 1920×1080, same pixel style. These can include **the brother**, a small boy of about seven with messy blond hair, a blue shirt and brown shorts, seen from the side.

### C1 · `cut_04_swings_crack.png` — The flashback
> Detailed 16-bit pixel art, side view. A golden afternoon in a town park playground. A small boy with messy blond hair, blue shirt and brown shorts swings high on a red swing, laughing, his red ball in the grass below. Behind him, the sun in the sky has just started to crack with glowing red fractures, the edge of the sky beginning to turn red. Gothic clock tower in the distance. Peaceful about to turn terrifying.

### C2 · `cut_05_runs_to_tower.png` — He runs
> Detailed 16-bit pixel art, side view. The same park, now under a blood-red sky with a cracked dark sun and the first meteors streaking down. The small blond boy is running away from the empty swing toward the distant gothic clock tower, leaving his red ball behind in the sand. Long dramatic shadows. No other people.

### C3 · `cut_06_small_shadow.png` — The small shadow (optional)
> Detailed 16-bit pixel art, side view, dark ruined playground at night under a red eclipsed sun. At the edge of a circle of warm lantern light, a small child-sized shadow figure with two faint glowing eyes peeks out from behind the burnt playhouse, timid, not threatening. No other characters visible.

---

## Checklist

| # | File | Type | Green? |
|---|---|---|---|
| 01 | bg_a2_gate_dark | Scene | ✅ |
| 02 | bg_a2_gate_restored | Scene | ✅ |
| 03 | bg_a2_swings_dark | Scene | ✅ |
| 04 | bg_a2_swings_restored | Scene | ✅ |
| 05 | bg_a2_carousel_dark | Scene | ✅ |
| 06 | bg_a2_carousel_restored | Scene | ✅ |
| 07 | bg_a2_sandbox_dark | Scene | ✅ |
| 08 | bg_a2_sandbox_restored | Scene | ✅ |
| 09 | bg_a2_oak_dark | Scene | ✅ |
| 10 | bg_a2_oak_restored | Scene | ✅ |
| P1 | prop_swing_seat_dark / _restored | Prop | ✅ |
| P2 | prop_carousel_top_dark / _restored | Prop | ✅ |
| P3 | prop_seesaw_plank_dark / _restored | Prop | ✅ |
| P4 | prop_monkey_bars_restored | Prop | ✅ |
| P5 | prop_red_ball (+ close-up) | Prop | ✅ |
| C1 | cut_04_swings_crack | Cutscene | — |
| C2 | cut_05_runs_to_tower | Cutscene | — |
| C3 | cut_06_small_shadow | Cutscene (optional) | — |

**Priority if short on time:** 03, 04, 09, 10, P1, C1, C2. Those cover the swing puzzle and the flashback, the two moments that matter most.

The shared sky and skyline layers from Act 1 are reused, so they don't need generating again.
