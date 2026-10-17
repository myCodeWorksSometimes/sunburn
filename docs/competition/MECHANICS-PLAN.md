# Survival mechanics — plan before implementation

Requested during core verification on 17 October 2026. This extends G4 with
explicit combat, inventory/resource limits and campfire interaction tests.
CANON and the connected-world/rescue story remain the design foundation.

Implementation status: this pass is implemented and agent-verified, including a
fresh production title-to-credits survival run. See [TEST-LOG.md](TEST-LOG.md) for
actual controls, boundary fixtures, results and remaining human playtest needs.

## Core decisions and limits

| Mechanic | Starting values | Recovery / rule |
|---|---|---|
| Health | 3 / 3 | Enemy contact removes 1; 1.4s damage immunity and knockback prevent instant multi-hit deaths. Falling still retries at the checkpoint. |
| Flame | 100 / 100 | Restoration costs 25 on successful ignition; lantern sweep costs 20. Walking and ordinary illumination have no passive drain. |
| Lantern sweep | F; 160px forward, 90px vertical tolerance | 0.15s anticipation, one strike, ~0.8s cooldown. Crawler takes two hits; first hit staggers it. Facing and distance matter. |
| Oil vial | 1 / 1; Q restores 35 flame | Consumed only if flame is below maximum. Rest refills one; no stacking above one, no item farming. |
| Story inventory | Lantern, cup and one unique hearth ember | Unique items cannot be duplicated, dropped, consumed as fuel or lost on death. I opens a paused inventory view. |
| Remember | E at a fire, 25 flame | Warming → active → warning → fading → 4s cooldown. Holding/spamming E cannot restart an active memory. |
| Rest | Hold R at any reachable fire for 2s | Kindle ordinary light, refill health/flame/oil, set an authored safe checkpoint. Does not activate daylight or replay story. One completion per key press. |

These are initial tuning values, not an entitlement to add a combat tree. A small
number of coherent, tested actions is the target. Keep the lantern's basic light
at zero flame so the player can still navigate. Even an unlit reachable fire can
be kindled by resting, so depleted oil/flame cannot block a required restoration.

Resting is deliberately repeatable checkpoint recovery. It grants no currency or
loot. It must not exceed resource caps or replay pickups. An active local memory
is cancelled by a completed rest, then its cooldown still applies. Ignite grants
no health/oil refill. A spent home memory can provide ordinary rest but can never
restore its old scene or create another quest ember.

Attack, rest and oil input cannot stack during another rooted action, death,
transition, inventory/pause, or final transfer. A damage interruption cancels the
pending attack/rest; a cancelled attack cannot deal a delayed ghost hit. No attack
ever targets Eli. Damage immunity and enemy stagger use simulation time and freeze
when paused. Existing completed encounters stay cleared to support backtracking.

## Introduce, practise, combine, pay off

| Area | Introduce / test | Pass condition |
|---|---|---|
| Home | Health/flame HUD, unique lantern, E versus deliberate R rest, I inventory | Lantern is unique; rest caps resources; story gates and ladder still work. |
| Yard | First restoration spends 25 flame; visible countdown; oil demonstration | E spam costs once, cannot extend active duration; oil never overfills or duplicates. |
| Lane | F sweep versus Crawler; height/evasion remain alternatives | Front/range hit only, two hits disperse, stagger and damage immunity are visible and reliable. |
| Square | Resource cost plus timed stairs; cup acquisition | Zero fuel has a recoverable fire; inventory pauses the timer; cup survives a fall/death and cannot be picked up twice. |
| Return/home | Recovery and permanent world changes | Rest does not restore spent home memory, duplicate ember or reset quest state; unique ember is separate from flame fuel. |
| Bridge | Commit to 9s crossing; conserve/recover fuel | No timer reset exploit, safe rest location, expiry/retry and permanent return walkway still work. |
| Shelter | Combine movement, sweep, safe circles and lamp costs | Enough recovery is available near each lamp; lamp flags remain unique; no resource/attack can harm Eli or consume his ember. |
| Transfer/coda | Story reward, clear input protection | No attacks/rest/oil during transfer; rescued Eli remains when daylight fades; credits and restart still work. |

## Implementation order

1. Resource/state methods and unit checks for caps, unique items and fuel costs.
2. HUD + paused inventory; then attack/damage/stagger using current sprites.
3. Rest/remember separation, four-second cooldown, oil and depletion recovery.
4. Area-specific prompts and the stage checks above.
5. Production end-to-end run with the new costs; update status/contracts/test log.

Keep the existing isolated demo snapshot unchanged during development. Provide a
new demo version after verification so the team can compare without mid-run reloads.

## Required abuse and boundary tests

- Repeated/held E: one activation and one fuel payment, no timer extension.
- Insufficient fuel: no animation/state change/negative fuel; rest/oil guidance shown.
- Repeated/held F: cooldown/cost enforced; hit front once, no rear/out-of-range hit.
- Cancel an attack by death/damage; no delayed damage after interruption.
- Contact overlapping several frames: one damage within the immunity interval.
- Full fuel Q does not consume oil; low fuel Q restores up to 100 and spends one.
- Held R completes once, caps health/flame/oil, never resets memory cooldown.
- Inventory/pause freeze health immunity, attack/rest/cooldown and memory clocks.
- Unique cup/ember remain after death/visits; final ember is never a fuel payment.
- At zero fuel and zero oil, reach a fire and recover without debug actions.
- Complete a fresh title-to-credits run, then restart with clean resource state.

## Reference principles

The official [Dark Souls description](https://en.bandainamcoent.eu/dark-souls/dark-souls)
describes bonfires as checkpoints that restore health/magic with consequences.
This build borrows the deliberate recovery stop; its already-cleared story
encounters remain cleared. No farming/repeated experience rewards are added.

[PlayStation's Hollow Knight/Silksong discussion](https://blog.playstation.com/?p=409375)
describes the tension of limited resources and recovery timing. Here the shared
flame budget creates an attack-versus-restoration decision, and recovery requires
a deliberate channel. Exact resource values and rules above are original tuning
choices for this short adventure, not copies of those games' balance.
