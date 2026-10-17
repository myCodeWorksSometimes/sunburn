# Narrative script — Light the past. Bring him home.

Latest user scope replaces the earlier shelter finale below with original chapter
identity and complete Acts 2/3. Current sequence/dialogue triggers are implemented
in src/world/Chapters.js and Hearth.js; ACTS-IMPLEMENTATION.md records the revised
story: Playground evidence → home ember → canal → Clock Tower bells/guardian →
rescue → home coda. Preserve the meteor/local-daylight canon.

Working script for the competition build. Read CANON.md first. This is a proposed
original story designed for the available mechanics and deadline; its emotional
effect must be tested with people, not assumed from the writing.

## The dramatic question

Rowan wants to find Eli and return to the life they had. The lantern gives him
small, playable pieces of that life: grass, daylight, ordinary sounds, a room
without a collapsed roof. He gradually learns that the remembered world is a
route to someone who needs him now. At the hearth, he chooses to stop replaying
one safe memory and use its ember to rescue his brother.

The loss is access to a living reconstruction of home, not his affection or his
own memories. The ending does not punish him for loving the past. It lets that
love become an action in the present.

## What happened, in order

1. Before impact, Rowan and Eli lived in the village. Their grandfather's lantern
   and hearth were familiar household objects, not a newly discovered weapon.
2. Eli planned to play near the square. Rowan had promised to take him up the
   clock tower, but kept putting it off. Their family signal was two knocks:
   “Are you there?” A reply meant someone was close enough to help.
3. A meteor struck. Its corruption arrested the world's natural cycle and spread
   shadow through places and people. Rowan survived in the cellar.
4. Eli headed toward the camp shelter, stopping to lead others away from danger.
   He was caught at the edge of a collapsing pocket of healthy time.
5. Rowan wakes in the corrupted night. The lantern can awaken old fires, which
   temporarily restore the healthy world they remember.
6. The camp's ordinary warmth keeps Eli's tether from disappearing, but does not
   complete his return. A hearth that remembers him can supply an anchor.
7. Rowan spends the home's last memory ember to give Eli a stable present. Other
   fires still work; corruption still exists. The brothers can face it together.

Do not imply Rowan caused the disaster by neglecting a promise. His regret is
recognisable, but the meteor is not cosmic punishment. Eli is resourceful and
caring; his actions should be visible rather than explained in a long monologue.

## Motifs with explicit payoffs

| Motif | Establish | Develop | Pay off |
|---|---|---|---|
| Two knocks | Eli taps doorframe before leaving | Echo taps before helping at shelter path | Upright shadow taps; Rowan answers, identifying Eli |
| Red ball | Eli's small possession in opening/echo | Left at the square when he chooses to help | Visible beside the real Eli; optional final kick, no collectible quest |
| “Later” | Rowan postpones the tower visit | Hearth memory repeats it while player can take ember | Present Rowan says “I'm coming now” and acts |
| Restored daylight | First home/yard ignition | Bridge becomes green, whole and alive | Finale daylight fades but Eli stays |
| The stopped clock | Tower hands remain still in corruption | Ticking resumes only during local restoration | World still damaged at the end; rescue is real despite it |

Make the two taps audible and visibly animated/ captioned. A muted player must
still recognise the signal. The clock is a distant landmark and sound motif;
do not make reaching its interior an unfulfilled promise in the objective UI.

## Beat-by-beat implementation

The quoted lines below are the default final text. Speaker labels belong in the
caption data, not painted into assets. Store beat IDs separately from dialogue
indices so editing a line does not break saved progression.

### S00 — last ordinary afternoon

Trigger: new game; skippable opening, approximately 10–15 seconds maximum.

Show Eli with the ball and two taps on the doorframe. Use an existing healthy
image or a brief in-engine composition. A streak crosses the sky; impact, then
cut to cellar darkness. Omit the old sun-explosion shot. Daylight before impact
is correct and makes its loss comprehensible.

- Eli: “The tower today?”
- Rowan: “After work. I promise.”
- Eli: “I'll be by the square.”

No narrator explains the cosmology. The first dark exterior and restoration
demonstrate it. Skipping puts the player safely in Home with control and without
duplicating timers; no inventory item is granted by the cutscene.

### S01 — wake and recover the lantern

Trigger: first controllable Home entry. Objective: **Find Eli.** Nearby lantern
prompt: **Light the lantern**. Keep tutorial input text separate from dialogue.

- Rowan: “Eli?”
- Rowan, after taking lantern: “Grandpa's lantern. Still warm.”

Player movement starts immediately. Add one short movement/climb instruction
only where required; no queue of lore text before the first useful action.

### S02 — the room remembers

Trigger: first home memory ignition, after the restored state is usable.

Roof repairs; window admits remembered daylight; green leaves move outside. The
brother's echo taps twice and takes the ball toward the door. It never collides
with the player. The player can move during this discovery.

- Rowan: “The room... it's before the impact.”
- Rowan: “Eli. He went outside.”

When it fades, briefly show the phrase **The memory fades** next to the timer.
Do not call restored sunlight merely a lantern glow. Commit `home-first-memory`
once and open the front-door route. Repeated ignition may show the echo without
repeating the tutorial or reopening a completed caption queue.

### S03 — night with no morning

Trigger: first safe exterior sightline in Yard. Camera moves with Rowan to reveal
the dark sky and distant clock tower. No new cutscene or input lock is needed.

- Rowan: “The clock's stopped.”

The next brazier restores sunlight, grass, and ordinary ambient motion. The
clock/bird/water cues communicate time returning. On expiry all four return to
the corrupted treatment. Let the player learn the contrast through interaction.

### S04 — a readable threat

Trigger: first Crawler encounter. Objective stays **Follow Eli through the village**.

Use the enemy's anticipation and light boundary, not a long warning monologue.
Tutorial: **Get to the brazier. E: ignite.** Cleared encounter remains cleared.
On revisit, no repeated surprise spawn behind the player.

### S05 — he chose to help

Trigger: first Square restoration. Eli's echo starts toward the camp, stops at
offscreen distress/footsteps, puts down the ball, and gestures toward the shelter.
Use the existing small sprite; gesture can be a turn and held pose.

- Echo Eli: “This way. Stay by the light.”
- Rowan: “He stopped for them.”

Place the ball at an intentional world location as a visual clue, not a required
inventory puzzle. The player sees a choice Eli made. The echoed footsteps do not
require building extra NPCs or contradict the small cast budget.

### S06 — the hearth rule

Trigger: interact with the ember cup on the restored Square landing. The cup
carries a simple engraved hearth symbol matching the one in Home. Present its
inscription through the existing item caption, without requiring a new portrait.

- Inscription: “A hearth remembers its own. Its last ember can call them home.”
- Rowan: “Our hearth. It remembers him.”

Objective becomes **Take an ember from the hearth at home**. The camera briefly
frames the return direction, then follows normally. The item is persistent and
the return descent is available. The hint identifies a concrete destination;
players do not need to infer an invisible inventory recipe.

### S07 — a different journey through the same place

Trigger: return through Lane/Yard with the cup. The world stays spatially identical.
Cleared threats remain cleared. Opened gates and geometry persist.

One optional environmental clue can change: a remembered healthy doorstep was
occupied on the outward trip but is now empty when restored, because that echo
has finished its authored path. Do not invent a new alternate timeline mechanic.

No mandatory dialogue here. Let backtracking, recognition and a shorter route
carry the beat. Avoid padding the return with multiple respawned enemies.

### S08 — one last look at home

Trigger: return to Home with cup, before hearth is spent. Restore the house once
more. Eli's memory waits at the door rather than running immediately. Two taps.

- Echo Eli: “You'll come this time?”
- Echo Rowan: “Later. I promise.”

Present-day Rowan stands inside the memory. Prompt: **Hold E: take the last ember**.
Supporting text: **This home's memory will fade.** Hold about 0.8–1.0 seconds,
cancel on release; the action is not automatically triggered by walking past.

On completion the room's healthy state drains into the lantern. Ordinary physical
objects remain ruined. Commit `hasHearthEmber` and `homeMemorySpent` atomically.

- Present Rowan: “I'm coming now.”

The player keeps moving; no confirmation menu or alternate-ending score. If this
short presentation is skipped, the committed inventory and world state are the
same. If interrupted before committing, the player can try again. The spent fire
still permits enough ordinary illumination to leave.

### S09 — the shortcut

Trigger: use the matching hearth-symbol latch in the cellar with the ember.
Prompt: **Warm the latch**. One interaction opens it permanently. It does not
consume the ember. The tunnel door leads to a visible matching exit at Square.

Objective: **Reach the shelter beyond the bridge**. This shortcut rewards knowing
the world and reduces repeated walking. No explanatory dialogue required.

### S10 — the world comes back

Trigger: Bridge ignition. Strongest theme-combination and trailer moment.

The deck becomes whole, greenery returns, daylight fills this remembered region,
water/clock sounds resume, and Eli's echo crosses. Nearby ash creatures disperse.
Useful timer starts after the route is usable. Camera reveals the destination
without zooming away from the player's feet or consuming their crossing time.

- Rowan: “Hold together. Just a little longer.”

On reaching the far bank, secure the permanent return walkway. Show its physical
change clearly. The healthy bridge may fade afterward without trapping the player.

### S11 — recognition

Trigger: enter Camp's safe approach. An upright, small shadow waits beside the
red ball. It taps twice. Subtitle/symbol also conveys the taps. Nearby fire keeps
its outline from disappearing. This entity has no attack/contact-damage component.

- Rowan: “Eli?”

Rowan answers with two taps on the lantern, as a tiny animation/sound beat. Eli
leans toward it. Objective: **Light the shelter lamps**. Avoid an explanatory
speech about souls or a fake hostile encounter with the brother.

### S12 — anchor him

Trigger: player ignites each of the three lamps. Use existing ignite interaction
and clear, persistent lamp states. Each lamp makes Eli more stable. Only one
simple, telegraphed hostile encounter interrupts the middle step. Lit safe areas
have real gameplay protection, not only visual halos.

- Eli, after second lamp: “I heard you.”
- Rowan: “Stay with me.”

After third lamp, prompt **Hold E: give the hearth ember**. Final transfer uses the
same deliberate hold pattern as taking the ember. Lock hostile damage when the
transfer commits. The ordinary lantern can retain a small normal flame; its unique
memory ember is spent. Do not strand the coda in unreadable total darkness.

### S13 — the present

Trigger: transfer completes. The restored day and healthy surroundings fade back
into corrupted night. Eli remains physically present. Hold this contrast briefly;
it is the visual proof of success. No global sunrise, repaired sun or new villain.

- Eli: “Is it still night?”
- Rowan: “Yes.”
- Eli: “Then stay close.”
- Rowan: “I will.”

Objective: **Go home together**. Eli follows a short safe route toward the return
walkway. No escort-health system, companion pathfinding challenge or final ambush.
Use simple bounded following on flat ground; crossing the coda end trigger with
both characters completes the game. Credits after the player has moved with Eli.

## Failure, skipping and replay

Keep committed story flags on death. Retry encounters without repeating long
dialogue. Do not remove the ember from state until rescue commits. Completion
and skip handlers must be idempotent. Preserve final lamp progress across a retry
so players do not grind a cutscene. A new game explicitly clears all story state.

Story subtitles are optional to skip but readable by default. Essential goals
remain in a concise objective display after the caption clears. Avoid timed jumps
while the player must read. Do not start a danger clock underneath an input lock.

## Story acceptance test

Ask a fresh player, after finishing: What did the meteor do? What does fire restore?
Why did you return home? How did you recognise Eli? What did the ember cost? What
changed at the end? If answers are unclear, improve the associated visual/action
beat before adding lore text. The emotional payoff depends on understandable play.
