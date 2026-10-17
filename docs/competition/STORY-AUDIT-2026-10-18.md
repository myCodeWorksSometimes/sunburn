# Story audit and isolated demo — 18 October 2026

## What was inspected

Read the live Syncthing repository at `H:/projects/gameDev`, then captured its
runtime source, public assets, tests and design documents into a separate temporary
folder. Hashes matched before/after capture and against the copied files.

- Capture: 18 October 2026, 01:34 Pakistan time (17 October 20:34 UTC).
- Shared-tree HEAD at inspection: `f839274`; it also contained uncommitted
  documentation/art-brief edits. No shared-tree files were edited or staged.
- Build source: `C:/Users/owner/AppData/Local/Temp/embers-h-demo-AHWf6h`.
- Frozen served build: `C:/Users/owner/AppData/Local/Temp/embers-playtest-ouFbLc`.
- Local demo: http://127.0.0.1:4176/ ; server PID at launch: 11220.
- Bundle: `index-BO8Vb2s6.js`.

The server serves an isolated production copy. Syncthing edits and subsequent
builds do not change it. Refresh the browser if the previous demo was open.
This localhost address works on this PC; it is not an internet deployment.
The previously owned stale demo process on this port was stopped and replaced.

## Story actually wired into the current route

1. **Prologue — Home.** Eli asks Rowan about their promised tower visit. Rowan
   postpones it until after work. A meteor strikes and daylight never returns.
   Rowan wakes in the cellar, takes Grandfather's lantern, climbs upstairs and
   restores the hearth. The remembered room and an Eli echo point him outside.
2. **Act 1 — The Ruined Village.** Rowan follows the lane to the market. He
   restores the steps to Mara's roof release and frees her from the shuttered
   stall. Five-Hand still blocks the exit: track the lantern card and expose its
   knot for two lantern hits. Mara rejoins Tomas and Nia at the Bridge Refuge.
   Nia says Eli led the children to the tower and rang its bell while they escaped
   along the Old Road; he did not return. Tomas explains that Mara brought him
   out of fractured time using their household hearth's ember, permanently
   spending its memory. Rowan defeats the Braced Shadow by baiting its charge
   into the barrier and striking its back, aligns linked gears in restored time,
   sets the brake, crosses the temporary bridge and reaches the playground.
3. **Act 2 — The Playground.** Restore and ride the moving swing; secure the
   return crossing; climb the restored treehouse to collect Eli's drawing and
   the practical ember cup. The drawing depicts the promised tower visit. The
   treehouse discovery opens the route past the buried exit. Restore the canal
   ledges and turn the sluice wheel to secure the crossing to the tower. The
   hearth ember is not required to reach the courtyard.
4. **Act 3 — The Clock Tower, discovery and return.** At the inspection window,
   Rowan asks Eli to copy three knocks. Eli responds: he is alive, rather than
   merely a recording. He explains that he rang the bell to draw shadows away
   from the children. Restoration briefly lets him move, then pulls him back.
   Rowan opens the Old Road from the tower side and returns via the refuge and
   market. Only now can he take the last hearth ember at home. Doing so spends
   the home's restoration permanently; ordinary warmth/rest remain available.
5. **Tower rescue and home coda.** Return with the protected ember. Three bells
   at different heights break the Bell Warden's wards. Four lantern hits defeat
   the Warden. Give Eli the ember: daylight fades, but Eli remains and follows
   Rowan. On the viewing platform he says, "You can see our house." Return via
   the Old Road, hear Nia acknowledge him, and walk home. Sit at the ordinary
   hearth; Eli taps twice and the player presses E to answer. Credits follow.
   The rescue brings Eli home; it does not cure the world's endless night.

This is one 18,600px outdoor world across eleven regions, with a home interior
and doorway shortcuts. Chapter labels do not mean stationary level screens.

## Comparison with earlier generated plans

- The early five-beat shelter ending is superseded. The implemented adventure
  uses Prologue, Ruined Village, Playground, Clock Tower and a playable home coda.
- The first three-act implementation took the ember immediately after finding
  the cup. The adopted `CAMPAIGN.md` and current source instead find Eli alive
  first, then motivate the trip home through Tomas's experience and the Old Road.
- Mara/Tomas/Nia, Five-Hand, Braced Shadow, the bridge gears, three-knock proof,
  family reunion and answered final knocks are present in source, not just plans.
- The meteor, temporary local daylight/greenery/structures/time, protected unique
  ember, permanent cost to the hearth and Eli remaining after the fade all follow
  the later canon. There is no permanent global sunrise in the ending.

## Where the full campaign still differs

| Planned detail | Current implementation |
|---|---|
| Opening two-tap exchange and Eli leaving for the playground | Intro has no tap exchange and still says he will be by the square. |
| Home restoration creates stairs to release a physical front-door latch | The ladder is permanent; the door checks that the first hearth memory was seen. |
| The same departure recording repeats exactly on the hearth return | First home memory uses Rowan's observations; the return uses different Eli/Rowan lines, rather than replaying the intro verbatim. |
| Present-day evidence separated from pre-impact recordings | Family testimony supports the evacuation correctly, but treehouse material still labels evacuation-related shelter dialogue as an Eli echo. The timing/readability of this distinction needs reconciliation. |
| Hanging-sign distraction and optional Nia wooden-bird task | Not implemented. |
| Five-Hand slower-shuffle option | Two playable rounds exist; no slower-shuffle setting. |
| Canal waterwheel lift and persistent released ladder | Restored ledges, wheel interaction and persistent crossing instead. |
| Three tower machinery puzzles: lift, counterweight, released catwalk | Three elevated bell interactions and restored steps instead. |
| Bell Warden armour broken by a counterweight collision, jumpable shockwaves | Three bell wards, then a four-hit lunge boss that becomes faster at half health. No counterweight phase or shockwaves. |
| 25–30 minute first playthrough | Design target, not a measured duration for this snapshot. |

The emotional route is substantially implemented, but the full campaign's
mechanical set pieces and exact script continuity are not all implemented.
`CAMPAIGN.md`'s MVP table accepts several simpler variants; that does not make
them identical to the full scene descriptions. Older status paragraphs and
coordinate tables also lag the current 18,600px layout.

## Evidence and verification limits

Source reviewed: `Intro.js`, `Hearth.js`, `Act1Story.js`, `FiveHand.js`,
`BridgeWorks.js`, `TowerStory.js`, `Chapters.js`, `WorldState.js`, `layout.js`,
`Crawler.js`, plus the adopted campaign and canon.

- `npm ci --no-audit --no-fund`: passed in the isolated copy.
- `npm run build`: passed; existing large-bundle warning remains.
- `npm test`: 19/19 passed, including campaign ordering and persistence guards.
- Browser plugin not available; used installed Chrome through bundled Playwright.
- Chrome, 1280x720: correct title/canvas; Title → Intro → skip → Hearth; keyboard
  movement changed Rowan's x; I opened the five-card satchel with 3/3 health,
  100/100 flame and 1/1 oil; I returned to gameplay. No Vite overlay, console/page
  errors, warnings or failed requests were observed during this short check.
- Screenshot: `C:/Users/owner/AppData/Local/Temp/embers-h-demo-AHWf6h/demo-inventory.png`.
- No new uninterrupted full-route, combat-difficulty, audio-listening or human
  playthrough is claimed. Story/late-game observations here are source inspection,
  not fresh end-to-end runtime verification. Existing TEST-LOG evidence is prior
  work and should not be confused with this audit's own checks.

For human testing: use N on the title to start fresh if Continue shows an older
save. Confirm the family/boss/bridge route; swing/treehouse/canal traversal;
three-knock scene before the ember trip; permanently spent home memory; tower
bells/Warden/rescue; viewing platform, Nia's acknowledgement and final E response.

## Publication boundary

Only this audit and its cumulative WHAT_IS_CHANGED entry are published from a
separate checkout based on the latest GitHub main. The Syncthing tree and its
uncommitted teammate work are not included or modified. This is a documentation
and local demo iteration, with no gameplay or art changes.
