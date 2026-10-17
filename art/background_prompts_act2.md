# Act 2 — The Playground: region paintings

Read [ASSETS-README.md](ASSETS-README.md) first. Short version: each painting is
**scenery on a slower layer behind the play area**. Flat unbroken ground at 62%
down, **sky flat green #00FF00**, no holes, steps or gameplay objects. The game
draws the crater, the swing, the treehouse ladder steps and the canal gap itself.

**Attach to every generation** (style references): `Lantern Bearer in the Ruined
Keep.png`, `Campfire in the Ruined Village.png`, and
`assets/backgrounds/bg_a1_campfire_dark.jpg` (dark) or `bg_a1_campfire_restored.jpg`
(restored): Act 2 starts right after the village campfire and should look like the
same village.

## What happens here (so the art fits)

Rowan crosses from the village campfire into the town playground, where Eli was
when the meteor struck. The playground fire makes an old swing move and he rides
it over a crater. In the treehouse he finds Eli's drawing and ember cup, then
follows the canal road toward the clock tower.

## Shared blocks

**Dark block** (start of every dark prompt):
> Side-scrolling 2D game background layer, 16:9 (1920×1080), detailed hand-painted pixel art matching the attached references. Strict flat side view at standing height, no perspective floor. The ground is a flat, straight, unbroken horizontal line 62% down from the top across the whole image, plain dark earth and stone below it. A standing adult would be about one eighth of the image height. The sky is a flat solid pure green #00FF00 with hard edges against rooftops and trees, no clouds, no glow. Endless night after a meteor corrupted the world: night colours, slate, plum and charcoal, faint violet haze on distant shapes. Black thorny corruption roots with cold violet cracks creep over wood, iron and stone. Warm amber only where noted. No characters, no creatures, no text, no UI.

**Restored block** (start of every restored prompt; attach this region's dark image):
> Same exact composition, camera, walk line and object positions as the attached dark image, shown on a warm golden late afternoon before the meteor: warm sunlight from the right, green grass and leafy trees, wildflowers, freshly painted wood and iron, everything intact and cared for, peaceful and nostalgic. No corruption roots. The sky stays a flat solid pure green #00FF00. Same pixel-art style. No characters, no text.

## Making the three paintings join (do this, it's what fixes the seams)

The three Act 2 paintings are **one continuous street cut into three**. Each
next painting is generated **as a continuation** of the one before, so the
joint is the same pixels, not two different pictures blended.

1. **Swings dark** → normal generation (prompt below). Save as
   `assets/backgrounds/bg_a2_swings_dark.png`.
2. **Swings restored** → attach the swings dark image + the restored prompt.
3. Run `python tools/make_continuation.py bg_a2_swings_dark`. It writes
   `assets/backgrounds/seeds/seed_after_bg_a2_swings_dark.png`: the right 35%
   of the swings painting on the left of a blank white canvas.
4. **Treehouse dark** → attach that seed canvas and say:
   > Extend this image to the right to fill the white area. Keep the left part exactly as it is, pixel for pixel, and continue the same scene seamlessly: same ground line, same lighting, same style. [then the treehouse dark prompt]
5. **Treehouse restored** → run `make_continuation.py bg_a2_swings_restored`,
   attach that seed **and** the treehouse dark image (for layout), same wording
   with the restored prompt.
6. **Canal** → same again, continuing from the treehouse images.

If the generator changes the kept part a little, that's fine: the processor
pastes the original pixels back over it and fades into the new part. If it
refuses to keep the canvas, tell me and I'll cut the joint by hand.

---

## A2-1 · `bg_a2_swings_dark` / `bg_a2_swings_restored` — The playground

**Dark prompt:**
> [Dark block] A ruined town playground at night, seen from the side. Left: the end of an old rope-and-plank footbridge resting on a rocky bank. A collapsed metal slide, a toppled bench, a sandpit covered in grey ash, a low broken iron fence. Centre-right, standing back from the path, a tall rusted A-frame swing set with broken chains hanging. Dead hedges, bent lamp posts, a few dead trees, a low wall with a gap on the far right.

**Restored prompt:**
> [Restored block] The same playground: the slide upright and painted yellow, the bench upright, clean sand, flower beds, a trimmed hedge, an intact iron fence, the swing set painted red with its seats, glowing lamp posts, the footbridge in good repair.

## A2-2 · `bg_a2_treehouse_dark` / `bg_a2_treehouse_restored` — The treehouse

**Dark prompt:**
> [Dark block] The back of the same playground, dominated by an enormous dead oak tree on the left half with a small wooden treehouse built into its branches, its door hanging open and its rope ladder snapped. A burnt wooden playhouse, a broken climbing frame, toys half buried in ash. Right half: a path between dead bushes and a crumbling low stone wall, a small service gate, rubble and fallen timber piled against it.

**Restored prompt:**
> [Restored block] The same tree in full green leaf with dappled sunlight, the treehouse freshly painted with a red roof, bunting strung from the branches, the rope ladder whole, the playhouse painted, toys tidy, flowering bushes, the service gate open and clear.

## A2-3 · `bg_a2_canal_dark` / `bg_a2_canal_restored` — The canal road

**Dark prompt:**
> [Dark block] An old town canal road at night. Left: a stone mill building with a large wooden waterwheel, stopped and choked with corruption roots. Behind the road, a long stone-banked canal runs parallel to the ground line with dark still water, a little footbridge with broken planks, iron railings and leaning houses along the far bank. Right: the road continues between houses toward the massive stone base of a clock tower, which rises out of the top of the frame on the far right.

**Restored prompt:**
> [Restored block] The mill freshly whitewashed, the waterwheel turning with bright water spilling from its paddles, the canal full of clear flowing water, flower boxes on the houses, the railings painted, the clock tower's stone base clean and warm in the sunlight.

---

## Checklist

| # | File | Required |
|---|---|---|
| A2-1 | bg_a2_swings_dark / _restored | ✅ do first |
| A2-2 | bg_a2_treehouse_dark / _restored | ✅ |
| A2-3 | bg_a2_canal_dark / _restored | ✅ |

Optional props (swing seat, waterwheel) are listed in [ASSETS-README.md](ASSETS-README.md).
