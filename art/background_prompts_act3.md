# Act 3 — The Clock Tower: backgrounds

Read [ASSETS-README.md](ASSETS-README.md) first (rules, how to make matching ends).

**Attach to every Act 3 generation** (style references):
`Lantern Bearer in the Ruined Keep.png`, `Campfire in the Ruined Village.png`,
`assets/backgrounds/bg_a1_square_dark.jpg` (dark) or `bg_a1_square_restored.jpg`
(restored) — the square's bell tower sets the stonework style. For the first
image also attach `bg_a2_canal_dark` / `_restored` (the courtyard continues
from the canal).

## What happens here (so the art fits)

Rowan reaches the tower courtyard and hears two taps from a barred window high on
the tower. Eli answers his three knocks: he's alive, trapped in a frozen moment on
the upper landing. Rowan opens the Old Road gate, goes home for the hearth's last
ember, comes back, and climbs the tower: three bell mechanisms at different
heights, then the Bell Warden, a large corruption creature on the upper landing.
After the rescue the brothers look out over the village: "You can see our house."

Both versions should feel like **one tall stone clock tower**: the courtyard at
its foot, the machinery inside, and the open bell landing near the top.

## Shared blocks

Use the **Dark block** and **Restored block** from
[background_prompts_act2.md](background_prompts_act2.md) unchanged. For the two
interior scenes, add to the dark block: *"Interior: no sky visible except
through windows and arches."*

---

## A3-1 · `bg_a3_courtyard_dark.jpg` / `bg_a3_courtyard_restored.jpg` — Tower courtyard

Region 1600 px wide. Gameplay positions, measured from the left edge:
- **0–3%:** a corruption barrier (the game draws it).
- **~5–10%:** the **Old Road gate**: an arched gap in the courtyard's left wall where an old road leads away. Paint the **archway in the wall only** — the game draws the door and its release lever in front.
- **~16%:** the courtyard fire — clear ground.
- **~25–33%, high up:** the **inspection window**. Keep a plain stretch of the tower's stone wall here, **about 40% of the image height above the walk line** — the game draws a barred window with Eli behind it. Directly below, at ground level, keep clear ground (Rowan knocks here).
- **~32–55%:** the game draws two stone ledges rising to **bell 1** (about 1/6 of the image height above the walk line). A wooden bell frame or support beam behind that spot is welcome, but **no bell**.
- **~65–95%:** open courtyard (a shadow patrols here).
- **100%:** the tower's main entrance — a tall arched doorway at the right edge leading inside (the next image is the interior).

**Dark prompt:**
> [Dark block] The courtyard at the foot of a huge gothic clock tower at night. The tower's stone wall fills the upper part of the left two thirds, rising out of frame, with a long plain stretch of wall high up about a quarter to a third of the way across. In the courtyard's left wall, an arched gateway onto an old road, its gate missing. Centre: cracked flagstones, a dry stone trough, an empty wooden bell frame on a low stone platform, iron lanterns hanging dark, stacked crates and abandoned bundles where people sheltered. Right: an open stretch of courtyard, then at the right edge the tower's tall arched main doorway, its door ajar and dark inside. Corruption roots climb the tower and spread across the flagstones. The left edge continues seamlessly from the attached canal image's right edge.

**Restored prompt:**
> [Restored block] The same courtyard before the meteor: clean warm stone, the clock face high on the tower showing a time with its hands moving, flower pots, lanterns lit, a market awning, the arched gateway onto the old road open and bright, the tower doorway open onto warm light. The left edge continues seamlessly from the attached restored canal image.

---

## A3-2 · `bg_a3_mechanisms_dark.jpg` / `bg_a3_mechanisms_restored.jpg` — Bell mechanisms (interior)

Region 1700 px wide. Gameplay positions:
- **0–5%:** the inside of the main doorway (continues from the courtyard's right edge).
- **~13%:** the mechanisms fire — clear floor.
- **29–56%:** the game draws three rising steps up to **bell 2** (about a quarter of the image height above the walk line, near 51%). Behind them, paint the **clockwork**: huge gears, a hanging counterweight on chains, a wooden catwalk. **No bell.**
- **~64–93%:** open floor (a pouncing shadow patrols here).
- **100%:** a stone staircase or arch leading up and to the right (toward the landing).

**Dark prompt:**
> [Dark block] Interior: no sky visible except through windows and arches. Inside the clock tower's lower floors at night. Enormous stopped brass and iron gears fill the back wall, a heavy stone counterweight hangs frozen on thick chains, wooden catwalks and a spiral of beams climb the walls. Narrow gothic windows show the violet night outside. Corruption roots have cracked through the floor and wrap the gears. Left edge: the inside of the tower's main doorway. Right edge: a broad stone stair rising up out of frame. A wide open stone floor along the walk line. The left edge continues seamlessly from the attached courtyard image's right edge.

**Restored prompt:**
> [Restored block] The same machinery polished and working, warm afternoon sunlight slanting through the windows in dusty beams, brass gleaming, the counterweight mid-swing, ropes taut, a tidy workbench and oil cans, no corruption. The left edge continues seamlessly from the attached restored courtyard image.

---

## A3-3 · `bg_a3_landing_dark.jpg` / `bg_a3_landing_restored.jpg` — Upper landing and view

Region 1700 px wide. This is the boss arena, the rescue and the final view.
- **~12%:** the landing fire, and the Old Road home door (both drawn by the game) — clear floor and plain wall.
- **24–34%:** a low platform the game draws, with **bell 3** on it (about 1/10 of the image height up). Keep clear.
- **34–67%:** the **Bell Warden's arena** — a wide open stone floor with good contrast for a large dark creature. No tall objects here.
- **53–80%:** the game draws final steps up to the **upper landing** where Eli waits (about a quarter of the image height above the walk line, near 76%).
- **Right third, behind Eli: the view.** Tall open arches looking out and down over the whole village far below — rooftops, the market, the canal, the playground's big tree, and one small cottage on the far edge of town (the brothers' home).

**Dark prompt:**
> [Dark block] Interior with open arches: the top of the clock tower at night. Left: the stair arriving from below, a plain stone wall and a small alcove. A great bronze bell hangs high in the rafters out of the way, cracked, wrapped in corruption roots; the huge back of the clock face fills part of the upper wall, its hands frozen. Centre: a wide open stone floor. Right third: a raised stone landing in front of tall open gothic arches that look out and down over the dark village far below, tiny distant fires glowing among the rooftops, the canal, a big tree in the playground, and one small cottage on the edge of town with a single lit window. The left edge continues seamlessly from the attached mechanisms image's right edge.

**Restored prompt:**
> [Restored block] The same landing before the meteor: the bell polished bronze, the clock's hands turning, sunlight pouring through the arches, and through them the whole village in golden afternoon light — red roofs, the market with striped awnings, the sparkling canal, the playground's big green tree, the little cottage at the edge of town with smoke rising from its chimney. The left edge continues seamlessly from the attached restored mechanisms image.

---

## Checklist

| # | File | Required |
|---|---|---|
| A3-1 | bg_a3_courtyard_dark / _restored | ✅ (do first — Eli is found here) |
| A3-2 | bg_a3_mechanisms_dark / _restored | ✅ |
| A3-3 | bg_a3_landing_dark / _restored | ✅ |
