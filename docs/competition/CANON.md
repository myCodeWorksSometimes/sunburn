# Canon — latest user-approved world rules

## Latest story revision — adopted campaign (17 October 2026)

The user adopted **CAMPAIGN.md** as the target story and gameplay design. Where it
disagrees with older text in this file, NARRATIVE-SCRIPT.md or ACTS-IMPLEMENTATION.md,
CAMPAIGN.md wins. The meteor/local-restoration canon below is unchanged.

What this adds or changes:

- **Cast:** Rowan, Eli (now **nine**), and one family Eli helped: **Mara** (market
  toy-and-game stall), her partner **Tomas** (bridge keeper) and their daughter
  **Nia** (six, Eli's friend). No other named characters are required.
- **What happened to Eli:** he was at the playground at impact, led younger children
  to the market gathering point and on to the clock-tower shelter, then rang the
  tower bell to draw shadows away while the children escaped by the **Old Road**.
  He is trapped **alive** in a fractured moment on the tower's upper landing.
- **Shadows are creatures of corruption, separate from the villagers.** Defeating
  one never kills a person. (Replaces any earlier idea that shadows were townsfolk.)
- **Recordings vs. the living:** recorded people (echoes) cannot respond to new
  actions; living survivors can. Eli answering **three** knocks with three proves
  he is alive.
- **The hearth rule** is learned from Tomas and Mara (she spent their household
  hearth's ember to bring Tomas back), not from an inscription. The ember cup is a
  practical heatproof carrier Eli used, with no magic of its own.
- **Places:** Home → Market → Bridge Refuge → Broken Bridge → Playground → Canal →
  Clock Tower, plus the Old Road linking the tower courtyard to the Bridge Refuge.
  CAMPAIGN.md maps each place onto the existing 18,000px world regions.
- **Bosses:** Five-Hand (market card-tracking boss) and the Bell Warden (tower).
  One elite: the Braced Shadow at the bridge works.
- **Ending:** after the rescue the brothers share the promised view from the tower
  ("You can see our house."), return home and sit by the ordinary hearth. Eli taps
  twice; the player answers. The world stays dark.

## Earlier scope revision — original chapters, complete Acts 2 and 3

The user now requests the original chapter identity: Prologue (Home / Yard),
Act 1 — The Ruined Village, Act 2 — The Playground, then a complete Act 3.
Act 2 was only named in the original repo; Act 3 was undefined. The implemented
continuation is Act 3 — The Clock Tower, paying off Rowan's promise. This
supersedes the earlier five-beat shelter-ending structure, not the meteor canon.
The outdoor world remains continuous and bidirectional. The cup and family
drawing are found in the playground treehouse; the hearth return follows that
discovery. The final lamps/guardian/rescue occur at the clock tower. The brothers
return home for the ending. No further asset generation; reuse current art.
See ACTS-IMPLEMENTATION.md for functionality and acceptance order.

Updated 17 October 2026 after the user's clarification. This file supersedes
earlier design prose that says the sun exploded, that fire only illuminates, or
that restored regions must remain dark. Direct later user instructions win.

## The world

**A meteor struck the world and corrupted it. The corrupted world is trapped in
endless night. Fire restores a local piece of the world to its original healthy
state: daylight, green grass, intact structures, life, and the normal passage of
time. When that restoration fades, corruption takes hold again.**

The sun has not shattered. This is a supernatural corruption caused by impact,
not a claim that real meteor dust permanently stops planetary rotation. Characters
do not need a scientific lecture or an origin myth for every creature.

There is no ordinary automatic sunrise in the corrupted present. Warm firelight
alone is distinct from restoration: an ordinary lantern illuminates; an awakened
memory fire restores. Restorative fires are special remnants of the old world,
ignited using the inherited lantern. The playable region is a temporary pocket
of the healthy pre-impact world, not merely an orange colour filter.

## Restoration and time

- The player's movement and decisions continue while the region is restored.
- Past geometry becomes traversable and selected recorded actions become visible.
- Daylight and living colour return to that region for the duration.
- The exterior corrupted world remains dark; restoration never silently turns the
  whole outdoor map into day or clears distant encounters.
- A location recalls an authored pre-impact moment. The game does not simulate a
  full 24-hour healthy cycle during a 9–20 second restoration window. Normal time
  can be communicated through moving water, a ticking clock, birds and wind.
- Echoes are records. The present-day tethered brother is a different, non-hostile
  entity. He is never a creature the player must attack.
- Restored objects fade back with the memory. Deliberate physical changes made in
  the present and explicitly anchored story outcomes persist.

Daylight/greenery in a pre-impact memory is correct. A natural sunrise after the
rescue, a permanently repaired sun, or a full-world cure is outside this story.

## Story invariants

The older brother searches for the younger after the impact. The younger helped
others find shelter and became tethered to a fading place in time. The hearth's
last memory ember can anchor him into the present. Taking it permanently spends
the home's replayable memory; it does not erase the brothers' personal memories,
burn a human soul, or destroy the house physically.

The ending rescues Eli, not the whole world. Other restorative fires can still
bring temporary daylight. Ordinary flame can still light the lantern. The quest
ember is unique, cannot be lost/spent in combat, and has no travel fuel timer.
The final sequence must show Eli remaining when the restored background fades.

Names Rowan/Eli and the detailed script are proposed creative choices, now the
working production default unless the user changes them. No outcome is guaranteed
to win an award; judge the script by clarity, emotional payoff and playtest response.

## Gameplay and production invariants

One continuous outdoor environment with travelling camera and bidirectional
traversal. Home is a permissible doorway interior. State survives visits and
death according to the technical plan. No return-route or quest-item softlocks.

Work gameplay-first, with existing art or readable placeholders. Build basic
light radius/safe zones, distinguish day/restoration from night/corruption, and
keep the camera useful immediately. Final art/shaders/lighting polish follows a
complete playable core. Add simple sound feedback early; finish the mix later.

## Known legacy material to reconcile

- `src/scenes/Intro.js` says “Then the sun broke.” Replace during G3 with the
  meteor-impact opening and updated script.
- `cut_02_sun_breaks`, dark sky/title art and some art briefs depict a damaged sun.
  Asset names can remain as compatibility keys. Do not show contradictory imagery
  in the release: omit the obsolete shot or use existing impact footage/neutral
  dark sky first; mask or replace the offending sky detail during G5 if needed.
- Golden restored backgrounds remain useful. Register them to playable geometry.
- The prototype's clock tower was a future destination. In the competition build
  it is a landmark and family promise, not an unimplemented required final level.
- Design documents are plans. The current source still needs the G0–G4 migration.
