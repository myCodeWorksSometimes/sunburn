# Embers of Before — trailer

`trailer/embers-of-before-trailer.mp4` · 1280×720, 30 fps, H.264 + AAC · 2:54 (2:05 of gameplay).

Built by `trailer/tools/rec.mjs` (records scripted gameplay from Chrome over the
DevTools protocol, from a production build served on :4190) and
`trailer/tools/build.py` (ffmpeg edit: story cards, act cards, clips, end card,
music). Music is the game's own CC0 soundscape (`public/audio/score.ogg`) with the
CC0 boss layer (`bossbed.ogg`) under the fights; see `public/audio/LICENSES.md`.

## Structure

| Time | Section |
|---|---|
| 0:00–0:32 | Story: the ordinary village → the meteor → endless night → Eli at the swings → "fire remembers" → title |
| 0:32–2:40 | Gameplay (about 2 minutes): Act I lane, Five-Hand, bridge; Act II swing, treehouse, canal; Act III knock, bells, Warden, rescue and the view |
| 2:40–2:50 | "Find him before the last ember fades." → title |

Story captions:

1. Before the meteor, every afternoon was ordinary.
2. Then the sky fell.
3. Corruption swallowed the village. The night never ended.
4. My little brother Eli was at the swings. He never came home.
5. But fire remembers. Light it, and the world returns... for a moment.

## Synopsis (for the description)

**Short:** A meteor has trapped the world in endless night. Rowan carries a
lantern whose fire can briefly bring back the world as it was, and he has one
night to find his little brother before the last ember fades.

**Full:** *Embers of Before* is a 2D side-scrolling adventure about memory, fire
and finding your way home. A meteor struck the village and corrupted it: the sky
went black and stayed black, and shadow creatures took the streets. When it hit,
Rowan's nine-year-old brother Eli was at the playground. He never came home.
Rowan sets out with a lantern. Light a fire, and the place around it remembers
the moment before the impact for a few precious seconds: daylight, green grass,
whole bridges, working machines. Walkways come back, swings move again, and
stairs rebuild themselves. Then the memory fades and the night returns. Across
the village, the playground and the old clock tower, Rowan frees Mara from her
market stall and faces the card-throwing Five-Hand. He learns from Tomas at the
Bridge Refuge how a trapped person can be brought back, and follows Eli's trail
through a treehouse and along the canal road. At the tower he hears three knocks
answer his own. Eli is alive, frozen in a broken moment high above the courtyard.
Saving him means taking the last ember from the family hearth back home, ringing
three bells in remembered time, and defeating the Bell Warden.

## Optional Gemini stills for the story cards

The story cards reuse existing paintings (the meteor and title paintings are
cropped to hide the old broken sun). To replace them, generate 16:9 (1920×1080)
images with these prompts, attach `Lantern Bearer in the Ruined Keep.png` and
`Campfire in the Ruined Village.png` for style, save them in `public/bg/` under the
same names as the card sources in `build.py`, and run `python trailer/tools/build.py`.

1. **The impact:** *Detailed hand-painted pixel art, 2D side view. A small
   medieval village at dusk with a gothic clock tower; a single huge meteor
   streaks down from the upper left and strikes beyond the rooftops, a violet
   shockwave and black thorny corruption roots spreading from the impact. The sun
   is normal and setting behind clouds (not broken, not black). No people, no text.*
2. **Endless night:** *Same village after the impact, endless night: no sun, no
   moon, slate, plum and charcoal, black thorny roots with cold violet cracks over
   roofs and streets, a single warm lantern glow in one cottage window. No people,
   no text.*
3. **The empty swing:** *A playground at night after the meteor, one wooden swing
   still moving on its ropes, a small red ball in the ash, violet haze, black
   corruption roots. Close, intimate, melancholic. No people, no text.*
4. **Fire remembers:** *A boy's hand holding up an old brass lantern in the dark;
   around its flame the world is restored in a circle of warm golden afternoon
   light: green grass, flowers, a clean cobbled lane, while beyond the circle
   everything is corrupted night. No face visible, no text.*
