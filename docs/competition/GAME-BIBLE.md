# Embers of Before — game and story bible

Latest chapter scope is implemented in ACTS-IMPLEMENTATION.md: original Prologue
and Ruined Village, Playground Act 2, newly authored Clock Tower Act 3, then home
coda. The five-beat shelter structure below is retained as earlier design history;
CANON's latest revision and current STATUS take precedence. No further asset generation.

Read [CANON.md](CANON.md) for the latest user-approved world rules and
[NARRATIVE-SCRIPT.md](NARRATIVE-SCRIPT.md) for the definitive working scene script.
The implementation order is [EXECUTION.md](EXECUTION.md): gameplay first, final
art and cinematic lighting after the complete core is playable.

**Later user-requested mechanics update:** [MECHANICS-PLAN.md](MECHANICS-PLAN.md)
supersedes the older one-contact-death/optional-sweep proposals below. The implemented
build has 3 health, 100 flame, F sweep, limited oil, I inventory, deliberate R rest,
25-flame restoration and a 4s ended-memory cooldown. Story beats remain unchanged.

## Experience and design rules

The player should feel vulnerable in the present, briefly relieved when a place remembers sunlight, and increasingly determined to reach the brother. Every location should offer a new use or consequence of fire. Avoid a sequence of identical “press E and run right” rooms.

Three design pillars:

1. **A place remembers.** Ignition changes scenery, sound, geometry, and an echo together.
2. **You learn the way home.** Landmarks and shortcuts make the return journey understandable and different.
3. **Rescue is something you do.** The final interaction gives the lantern's stored warmth to the brother; the conclusion follows the player's action.

Target first play: 10–15 minutes; experienced replay: 6–9 minutes. These are playtest targets, not a demand to add filler. A coherent eight-minute submission is preferable to stretching the experience.

## Story rules

The meteor's corruption interrupted the village's next moment and trapped the world in endless night. Some people were caught between the last ordinary afternoon and the dark present. An old hearth flame retains a short memory of what it illuminated. The lantern wakes those memories, temporarily restoring a local region's daylight, green grass, intact structures and normal passage of time. When restoration fades, corrupted night returns. The sun itself has not shattered.

This is **local restoration to a fixed remembered state**, not unrestricted time travel. The player does not rewind their own inputs or undo arbitrary history. Memories show recorded actions and cannot answer questions. Restored geometry eventually fades; physical actions in the present, such as lowering a ladder or opening a gate, persist.

Distinguish two silhouettes clearly:

- **Ash creatures** are animal-like manifestations of the meteor's corruption: crawling, distorted, predatory. They scatter in strong restorative flame.
- **A tethered person** is upright, recognisable, and non-hostile. The brother has two small warm points of light and his familiar two-tap gesture. He never uses the enemy animation or attack cue.

A saved hearth ember can anchor one tethered person to the present. Taking it ends the home's repeatable memory. This exchange is taught through one brief memory before the ending; it should not appear as a surprise rule in the final cutscene.

## Characters

| Character | Design and personality | Dramatic purpose | Production treatment |
|---|---|---|---|
| Rowan, older brother, early twenties | Existing dark cloak, lantern, travel boots; protective, practical, habitually says “later” | Moves from chasing an ideal past to helping someone alive now | Reuse hero sheets; no portrait or new combat rig required |
| Eli, younger brother, about eight | Small silhouette, red ball, uneven scarf; curious, stubborn, taps twice to ask “are you there?” | Has agency: he stopped to guide frightened neighbours toward shelter instead of simply being lost | Reuse existing brother sprite; scarf is optional; two taps can be conveyed by animation hold and sound |
| Grandfather, absent | Known through the lantern and one sentence remembered at the hearth | Establishes the rule that warmth can be passed on | No actor, portrait, or voiced exposition required |
| The Gatherer | A larger ash creature with slower movement and a clear lunge | Final obstacle to bringing Eli into the present | Optional scaled version of the shadow, distinct posture and timing; no new boss sheet |

Names are proposed and can be changed globally before script lock. Keep character references consistent across captions, menu, trailer, and credits. The existing hero appears adult, so do not rewrite him as a small child without replacing the art.

## Complete story, delivered through play

### 1. “Before dark” — home and yard, 0–2 minutes

A short skippable opening: Eli asks about their promised tower visit, then takes his red ball toward the square. Two knocks on the doorframe. A meteor streaks across the sky and strikes; corruption brings darkness. Rowan wakes in the cellar and lights the lantern. Use the exact dialogue in NARRATIVE-SCRIPT.md.

The first candle restores the upstairs room for roughly twelve seconds. Eli's echo runs toward the door. A photo establishes their promised visit to the tower without stopping play. Rowan says, “The room remembers.”

Gameplay teaches movement, one jump, ignition, and the distinction between a memory and a person. Reach player control within roughly 15 seconds for the default intro; skipping goes directly to control.

### 2. “He stopped here” — lane and square, 2–5 minutes

The moving camera reveals the ruined village and distant clock tower. The first shadow crouches, signals its approach, then follows. The player uses height and a brazier to get through.

At the square, Eli's echo stops, looks back, and points toward the shelter path. His recorded line: “This way. Stay by the light.” Other villagers need not be animated; footsteps and a door closing imply them. Rowan realises Eli was helping people.

The square fire restores the steps. At the landing, a small metal ember cup can be collected using the existing item-inspection presentation. Its inscription establishes the rule: “A hearth remembers its own. Its last ember can call them home.” The cup points Rowan back to the hearth. UI objective: **Bring an ember from home.**

### 3. “One last look” — return through the same village, 5–8 minutes

The player walks left through familiar places. The earlier blocked descent is now traversable; a lowered ladder or gate remains open. Previously cleared shadows stay cleared. A changed echo or one new dormant encounter is enough; do not repopulate every corridor.

At home, lighting the candle again shows a quieter memory: Eli waiting by the doorway, tapping twice. Rowan's remembered answer: “Later. I promise.” Taking the ember is a deliberate held interaction, labelled **Take the hearth ember — this memory will fade**. No moral-choice menu or hidden ending score.

The player takes the ember. The golden house fades to its ruined present, and this candle can no longer restore it. Rowan says, “I'm coming now.” The lantern becomes slightly warmer. The ember does not drain during ordinary walking: this avoids a return-trip softlock.

An ember-reactive latch inside the cellar opens a short passage back to the square. Show the latch on the first visit so the shortcut feels like recognition rather than an arbitrary teleport. Use a doorway and a brief transition, with a matching tunnel sign/shape at both ends. Home's ordinary front door remains usable.

### 4. “Across” — bridge and campfire, 8–11 minutes

The bridge is the signature moment. Ignite the brazier; the broken deck rebuilds, the sound of the ruined river reverses into a bell, and Eli's echo runs ahead. A slight camera lead reveals the far bank. The player crosses while the memory fades behind them.

On the far bank, lowering a permanent rope walkway creates a safe return route. This is required, not optional decoration: a time-limited bridge must never imprison a player who walks back later.

Near the campfire, the small upright shadow taps twice. Rowan: “Eli?” The figure repeats the gesture. Music drops out. The player can approach without attack. A short camera hold reveals the shared lantern motif, then returns control.

### 5. “Not before. Here.” — playable rescue, 11–13 minutes

Three small ritual lamps surround the campfire, all on readable, safe ground. The player's hearth ember powers them without consuming inventory charges. Lighting each lamp anchors part of Eli's outline. The same E-to-light action used throughout becomes the rescue mechanic.

Mandatory version: one existing shadow approaches from a clearly visible side during the middle lamp. The player can retreat into the lit circle or use a nearby brazier. Optional version: the Gatherer performs two slow, telegraphed sweeps between lamps. No health bar or damage sponge.

When all three lamps are lit, the player holds E near Eli to transfer the ember. The attacks stop when the transfer commits. The lantern's memory-gold leaves the hero and fills Eli; a small ordinary flame remains for visibility. Restored daylight fades; Eli remains solid in the corrupted night. The corruption persists elsewhere and other restorative fires still work. This is a rescue, not an unexplained cure for the world.

Eli: “Is it still night?” Rowan: “Yes.” Eli: “Then stay close.” Rowan: “I will.”

For a brief playable coda, Eli follows Rowan toward the permanent return path. After crossing a clearly marked end trigger together, pull back slightly to show two figures and one little light. Credits. The world remains internally coherent; the story is complete. Optional “Explore” may restore a pre-finale checkpoint, but must not undo completion silently.

## Dialogue implementation budget

Aim for fewer than 35 short caption lines in the entire game. Dialogue never covers a jump landing or hides an enemy tell. Hold or reveal the whole caption immediately on a dialogue advance action; avoid forcing the player to wait for long typewriter effects. Story events trigger once per run, except a deliberately replayable memory. A skipped scene must apply its final state exactly once.

Essential lines are the two knocks, “The room remembers,” “I'm coming now,” and the final exchange. Everything else can be cut before those.

## Continuous world layout

```text
                    [Home interior / hearth]
                       | front door
                       v                 \ ember-opened cellar shortcut
   [Yard] <====> [Lane] <====> [Square / steps] <====> [Bridge] <====> [Camp / Eli]
                                   ^
                                   | shortcut arrival

   One continuous outdoor WorldScene, with physical connectors between regions.
   Home is an interior; the shortcut is a labelled doorway connection.
```

All double arrows represent traversable space in both directions, not a level-selection menu. The square's raised landing needs a return descent/ramp. The bridge's temporary deck needs a permanent alternative unlocked on the far side. Any objective gate explains its requirement and leaves a safe turn-around area.

| Region | New experience | Return-trip change | Reuse |
|---|---|---|---|
| Home | First memory, family connection | Last ember taken; shortcut unlocked | Existing cutaway and items |
| Yard | First horizon reveal and movement | Safe familiar route; no repeated tutorial | Existing art, crater, brazier |
| Lane | Read and avoid a pursuer | Open gate/ladder and cleared threat | Existing crates and shadow |
| Square | Restore stairs, learn ember rule | Shortcut hub; clear objective cue | Existing fountain and tower landing |
| Bridge | Timed restoration set piece | Permanent return walkway | Existing paired bridge paintings |
| Camp | Recognise Eli and perform rescue | End of story, brief walking coda | Existing campfire, brother sprite |

Pace each traversal with sightline, action, and release. Avoid uniform enemy spacing or interactions every few metres. One safe pause after an intense section makes the next danger feel stronger.

## Player abilities and combat

Keep vulnerability. A large combat system would consume animation and tuning time while weakening the light-and-time hook.

| Action | Input | Exact intended behaviour | Priority |
|---|---|---|---|
| Move / jump / climb | A/D or arrows; Space; W/S | Existing movement, plus ~100ms coyote time and ~120ms jump buffer; tune by playtest | Must |
| Ignite / interact | E | Light nearby fire or use the single highest-priority interaction; ignition cannot double-trigger | Must |
| Carry hearth ember | Story acquisition | Persistent boolean; does not decay or prevent ordinary fire use | Must |
| Shelter in light | Position | Lit safe-zone centre rejects creature contact; boundary visually marked | Must for finale |
| Flame pulse | F | Optional short forward burst: ~150px reach, 0.18s startup, ~0.2s active, 0.3s recovery, 4s cooldown; disperses Crawlers and interrupts Gatherer | Optional |
| Pause | Escape | Pause gameplay clocks, enemies, memory timer, and non-UI audio; resume reliably | Must |

These numbers are tuning starting points. Flame pulse does not consume the quest ember, does not repair bridges, and cannot hurt Eli. No ammo, skill tree, sword combos, or stamina system tonight. If the pulse cannot be finished cleanly, fires and evasion provide all counters.

Failure: existing single-contact death can remain if attacks are clearly signalled and checkpoints are close. Show contact feedback, then regain control at a safe checkpoint within roughly 1.5–2 seconds. Restore encounter setup consistently; never spawn inside an enemy or above expired geometry. No lives, item loss, or repeated long cutscenes.

## Creature roster and attacks

| Creature | Behaviour and attack | Tell and avoidance | Fire / time interaction | Scope |
|---|---|---|---|---|
| Ash Crawler | Ground patrol, then short chase; one contact attack, bounded to its encounter | Eyes brighten and body compresses for ~0.6s before pursuit; climb or jump past, retreat to light | Ignition disperses it; fixed past restoration does not resurrect a defeated encounter | Core; existing Shadow |
| Pouncer | Waits on a ledge or in rubble; locks a direction then makes one ~180px low lunge; ~1s recovery | Audible scrape plus visible crouch; move away from marked lane or jump; never retarget mid-lunge | Fire cancels windup; can be built with existing shadow frames and tweened translation | Add only after core works |
| Gatherer | Large, slow finale variant; alternates left and right approaches between ritual lamps | ~1s raised silhouette and low bell; safe lit circles remain obvious; maximum one active attack | Each lit lamp pushes it back; final transfer dissolves it | Optional replacement for ordinary final Crawler |
| Wick Moths | Hover near warm lights, then gather before a dive that briefly dims them | Cluster and wing buzz; move to another light | Feed on temporary memories, disperse from strong flare | After competition |
| Bell Warden | Large later-game guardian with timed ground waves | Visible bell windup, safe gaps between waves | Restoring the bell changes attack rhythm | After competition |

Optional creatures are design directions, not tonight's required asset list. Ship one excellent enemy if two are not readable. Never distinguish enemies only by colour. Use size, silhouette, motion, and sound together.

Creature state machine: `idle → notice → windup → attack → recovery → idle`, with `stunned` and `dispersing` interruptions. Hazards cannot damage during an unskippable cinematic or the final transfer. Do not create attacks that originate outside the camera's safe visible margin.

## Art direction: cinematic pixel fantasy

Keep the current dark stone, timber, lavender haze, ember orange, and restored gold. Select one exported scene and hero sheet as the style master. Match new elements to their apparent pixel size, silhouette contrast, and lighting direction. Avoid replacing everything with unrelated generated paintings.

Layer stack: corrupted night sky (local restored daylight during memory) → skyline/tower → haze → village architecture → walkable geometry and actors → sparse foreground branches/posts → particles → captions/UI. The tower remains a stable landmark; it should not repeat every screen or drift to the wrong side when the camera moves. Remove or mask the legacy shattered-sun imagery for the release.

Suggested palette anchors: charcoal `#11101B`, indigo `#242338`, fog `#68677B`, ember `#F59C45`, memory gold `#F5D28A`. Treat these as art-direction references, not mandatory recolouring of every asset.

Readable gameplay takes precedence over atmosphere. Feet and ground edges stay visible. Foreground occlusion must not cover landing areas or attacks. Light, effects, and subtitles must remain readable at ordinary laptop brightness.

## Cinematic moments worth building

1. Yard reveal: camera leads gently to reveal the corrupted sky and stopped clock tower; walking remains enabled. Ignition later reveals the healthy daylight contrast.
2. Bridge ignition: one warm expansion, reverse bell, rebuilding deck, brother echo; the useful timer begins when the route is usable.
3. Hearth farewell: locked shot for at most a few seconds, optional skip, memory drains from the room into the lantern.
4. Eli recognition: two knocks, near-silence, small camera emphasis, immediate return to control.
5. Transfer and coda: light passes between figures, world remains ruined, two figures walk away together.

Use brief framing changes rather than constant shake, flash, or letterboxing. Reduced-effects mode should disable strong flashes and shake. Essential information must survive with all decorative effects off.
