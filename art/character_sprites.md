# Characters and bosses: sprite strips

Read [ASSETS-README.md](ASSETS-README.md) first (strip rules). Summary:

- **One animation per image**, frames in **one horizontal row**, equal-width
  cells, nothing between them, **no labels or frame borders**.
- **Flat solid pure green background (#00FF00)**, hard edges, no glow or ground
  shadow on the green. (Real transparency is also fine.)
- Everyone **faces right**, same scale and feet line in every frame.
- **Attach as references:** `public/sprites/hero_walk.png` (Rowan) and
  `public/art/eli-sheet.png` (Eli). Match their pixel style, palette, outline
  weight and level of detail.

**In-game heights** (so the sizes relate): Rowan 106 px, Eli 76 px. Mara about
98 px, Tomas about 106 px, Nia about 64 px (a head shorter than Eli). Make every
cell about **3× as tall as wide** with the figure filling ~85% of the height. The
size relationship between characters matters more than exact pixels.

## Style block (start of every character prompt)

> Side-scrolling 2D game character sprite strip, detailed hand-painted pixel art matching the attached Rowan and Eli sprite sheets exactly in style, outline, palette and proportions (realistic, not chibi, not anime). Medieval village clothing, worn and muted: umber, slate blue, plum, faded red. Character faces right, full body, side view at standing height. Frames in a single horizontal row of equal cells on a flat solid pure green #00FF00 background, no labels, no borders, no shadow, no other objects.

---

## Mara — market stall keeper, Eli's friend, Nia's mother

> Mara: a woman in her mid-thirties, warm and quick, dark auburn hair tied back under a faded headscarf, a long plum-brown dress with rolled sleeves, a patched canvas apron whose pocket shows the corner of a painted wooden playing card, a short woollen shawl, sturdy boots. Slightly dusty from being trapped in her stall.

| File | Frames | What each frame shows |
|---|---|---|
| `mara_idle.png` | 4 | Standing, gentle breathing; frame 3 she glances back over her shoulder; frame 4 settles. Hands clasped at her apron. |
| `mara_talk.png` | 3 | Talking: one hand lifts and gestures forward, open palm, then back to the apron. |
| `mara_walk.png` | 6 | Brisk walking cycle (she hurries to the refuge). |

## Tomas — the bridge keeper, Mara's partner

> Tomas: a broad man in his late thirties, short greying beard, close-cropped hair, a heavy weathered work coat with a leather tool belt and a coil of rope at his hip, rolled trousers, heavy boots. His left arm is in a cloth sling (he was hurt), so he stands with his weight on one leg. Kind, tired eyes.

| File | Frames | What each frame shows |
|---|---|---|
| `tomas_idle.png` | 4 | Standing with the sling, slow breathing; frame 3 shifts his weight. |
| `tomas_talk.png` | 3 | Talking: his free right hand points ahead (toward the bridge), then lowers. |

## Nia — six years old, Eli's friend

> Nia: a small girl of six, a head shorter than Eli, round face, dark curly hair in two short bunches tied with red thread, a faded mustard-yellow smock over a grey dress, brown leggings, little boots. She holds a small carved wooden bird in one hand. Shy but brave.

| File | Frames | What each frame shows |
|---|---|---|
| `nia_idle.png` | 4 | Standing, holding the wooden bird to her chest, small sway; frame 3 she looks up. |
| `nia_talk.png` | 2 | Frame 1 lifts her head to speak; frame 2 points with the bird toward the right (the tower). |

---

## Bell Warden — final boss (recommended)

The boss on the tower's upper landing. In game it is about **1.5× Rowan's
height** and wider. It charges, staggers when hit and dissolves when defeated.

> Bell Warden: a large hunched creature of meteor corruption fused with the clock tower's machinery. A body of black thorny roots and shadow with cold violet cracks glowing through it, a cracked bronze bell lodged in its chest like a ribcage, broken clock gears and chains tangled in its back and shoulders, two long arms ending in iron bell clappers, a narrow head with two pale glowing eyes. Menacing but readable: a clear silhouette against a stone floor. Same pixel-art style as the attached Rowan sheet and shadow creature sheet (`public/sprites/shadow_idle.png`). No text, no other characters.

Also attach `public/sprites/shadow_idle.png` so it reads as the same family as the other shadows.

| File | Frames | What each frame shows | Game state |
|---|---|---|---|
| `warden_idle.png` | 4 | Hunched, swaying, chains drifting, eyes pulsing. | idle |
| `warden_windup.png` | 3 | Rears back, arms raised, bell glowing — the clear warning before a charge. | windup |
| `warden_charge.png` | 4 | Lunging forward low, clappers swinging ahead. | attack |
| `warden_stagger.png` | 2 | Recoils from a hit, cracks flaring orange. | staggered / recovery |
| `warden_dissolve.png` | 4 | Breaks apart into roots and ash, the bell falling silent; last frame almost empty. | dispersing |

---

## Optional — only if everything above is done

### Five-Hand (first boss, not in the MVP build yet)

**Art style: flat 2D side-view pixel art like everything else — not pseudo-3D.**
The card game must still be readable from the side, so the cards are **held
upright and face the player**, not lying on the counter.

> Five-Hand: a mass of shadow and corruption roots tangled behind a wooden market card-game counter, seen strictly from the side like the rest of the game. Five long shadowy arms rise from it and hold their hands up in a row above the counter, each hand pinching the top of a large painted wooden playing card held flat toward the viewer, like a card dealer showing their cards. Two pale glowing eyes in the dark mass behind the counter. Flat 2D side-view pixel art matching the attached Rowan and shadow sheets, no perspective, no 3D rendering.

Generate the creature **without cards in its hands** (empty pinching hands in
the same row); the game draws the five cards separately so it can flip and swap
them:

`fivehand_idle.png` (4), `fivehand_sweep.png` (4, a telegraphed hand sweep),
`fivehand_hurt.png` (2), `fivehand_dissolve.png` (4). Plus two single cards on
green, upright and facing the viewer, about 2:3: `card_back.png` (painted wooden
card back, simple sun motif) and `card_lantern.png` (the card face with a
painted lantern).

### Bridge Braced Shadow (elite, not in the MVP build yet)

A shadow creature with a heavy armoured front of fused planks and iron, for the
bridge works. `braced_idle`, `braced_windup`, `braced_charge`, `braced_stunned`
(4/3/4/2). Skip unless there is spare time.

---

## Checklist

| Priority | File | Frames |
|---|---|---|
| 1 | mara_idle | 4 |
| 1 | tomas_idle | 4 |
| 1 | nia_idle | 4 |
| 2 | mara_talk, mara_walk | 3, 6 |
| 2 | tomas_talk, nia_talk | 3, 2 |
| 3 | warden_idle, warden_windup, warden_charge, warden_stagger, warden_dissolve | 4, 3, 4, 2, 4 |
| optional | Five-Hand set, card_back, card_lantern | — |
| optional | Braced Shadow set | — |
