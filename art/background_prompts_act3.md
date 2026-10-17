# Act 3 — The Clock Tower: region paintings

Read [ASSETS-README.md](ASSETS-README.md) first. Short version: each painting is
**scenery on a slower layer behind the play area**. Flat unbroken ground at 62%
down, no holes, steps or gameplay objects. The game draws the barred window with
Eli, the Old Road door and lever, the stone ledges, the three bells and the Bell
Warden itself.

**Attach to every generation** (style references): `Lantern Bearer in the Ruined
Keep.png`, `Campfire in the Ruined Village.png`, and
`assets/backgrounds/bg_a1_square_dark.jpg` (dark) or `bg_a1_square_restored.jpg`
(restored): the square's bell tower sets the stonework style.

## What happens here (so the art fits)

Rowan reaches the courtyard at the foot of the clock tower and hears two taps from
a barred window high up: Eli is alive, trapped in a frozen moment at the top.
Rowan opens the Old Road gate, goes home for the hearth's last ember, then climbs
the tower: three bell mechanisms, then the Bell Warden on the upper landing. After
the rescue the brothers look out over the village: "You can see our house."

## Shared blocks

Use the **Dark block** and **Restored block** from
[background_prompts_act2.md](background_prompts_act2.md) unchanged for the
courtyard. For the two interiors, replace the sky sentence with: *"Interior: no
sky at all; the back wall fills the image down to the floor."* (No green needed
there, except through the landing's open arches, which stay green.)

---

## A3-1 · `bg_a3_courtyard_dark` / `bg_a3_courtyard_restored` — Tower courtyard

**Dark prompt:**
> [Dark block] The courtyard at the foot of a huge gothic clock tower at night. The tower's stone wall fills the left two thirds and rises out of the top of the frame, with a plain stretch of stone wall high up. In the courtyard's left wall, an empty arched gateway onto an old road. Cracked flagstones, a dry stone trough, an empty wooden bell frame on a low stone platform, iron lanterns hanging dark, stacked crates and abandoned bundles where people sheltered. On the right, the tower's tall arched main doorway, its door ajar and dark inside. Corruption roots climb the tower and spread over the flagstones.

**Restored prompt:**
> [Restored block] The same courtyard before the meteor: clean warm stone, flower pots, lit lanterns, a market awning, the arched gateway onto the old road bright and open, the tower doorway open onto warm light.

## A3-2 · `bg_a3_mechanisms_dark` / `bg_a3_mechanisms_restored` — Bell mechanisms (interior)

**Dark prompt:**
> [Dark block, interior] Inside the clock tower's lower floors. Enormous stopped brass and iron gears fill the back wall, a heavy stone counterweight hangs frozen on thick chains, wooden catwalks and beams climb the walls, narrow gothic windows show violet night. Corruption roots have cracked through the floor and wrap the gears. A broad stone stair rises out of frame on the far right.

**Restored prompt:**
> [Restored block, interior] The same machinery polished and working, warm afternoon sunlight slanting through the windows in dusty beams, brass gleaming, the counterweight mid-swing, ropes taut, a tidy workbench and oil cans, no corruption.

## A3-3 · `bg_a3_landing_dark` / `bg_a3_landing_restored` — Upper landing and view

**Dark prompt:**
> [Dark block, interior] The top of the clock tower. Left: a plain stone wall and a small alcove. A great cracked bronze bell hangs high in the rafters wrapped in corruption roots, and the huge back of the clock face fills part of the upper wall, its hands frozen. A wide open stone floor. The right third opens into tall gothic arches looking out and down over the village far below: rooftops, a canal, a big tree in a playground, and one small cottage at the edge of town with a single lit window. Above the village, through the arches, the sky is flat green #00FF00.

**Restored prompt:**
> [Restored block, interior] The same landing before the meteor: the bell polished bronze, the clock's hands turning, sunlight pouring through the arches, the whole village in golden light below — red roofs, striped market awnings, the sparkling canal, the playground's big green tree, the little cottage with smoke rising from its chimney. Sky through the arches stays flat green #00FF00.

---

## Checklist

| # | File | Required |
|---|---|---|
| A3-1 | bg_a3_courtyard_dark / _restored | ✅ do first (Eli is found here) |
| A3-2 | bg_a3_mechanisms_dark / _restored | ✅ |
| A3-3 | bg_a3_landing_dark / _restored | ✅ |
