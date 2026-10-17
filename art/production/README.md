# Act 1 production assets

Latest horror revision: see **HORROR-ASSETS.md** for real reference uploads,
36-frame boss,32-frame sword, skeleton/ash sequences, foundry, painted mechanism
parts, clean9-slice UI frame and the ChatGPT-generated ruined stall. Exact prompt
archives: GEMINI-HORROR-PROMPTS.json and CHATGPT-STALL-PROMPT.txt. The older Braced
poses described below are replaced in the active game by boss-motion.png.

Style: slightly pixelated, restrained painted pixel clusters, limited shading,
readable silhouettes. No hyperrealism. The original hero and world paintings
remain the style reference.

- `public/art/production/ui-atlas.png`: 4×4 themed UI pack.
- `mara-stall.png`: matched closed/open stall variants.
- `boss-atlas.png`: Five-Hand and Braced Shadow, four poses each, including
  front-facing cinematic poses. These are pose changes, not full frame-by-frame
  animation sheets.
- `npc-mara.png`, `npc-tomas.png`, `npc-nia.png`: distinct survivor strips,
  four frames per person, registered to a 96×112 frame and bottom foot anchor.

UI/stall/boss sheets were generated with the built-in image tool and revised
to the user's pixel style. Full descriptions are in GENERATION-PROMPTS.json.

Survivors use **the latest Gemini revision the user selected**, response
`f3d85695067ca21d` in their signed-in art conversation, replacing the first
`ef464c2dd4751eff` response. The selected source is survivors-source.jpg.
SHA256: E96550AAAA1A83068DF2E4AF631F5FC899A0ED73D4C43F15ED58AC7361DD1601.
SURVIVORS-PROMPT.txt retains the description and user's style correction.
The older survivor image is not loaded or shipped.

`tools/import_survivors.py` removes the green key/JPEG spill and registers the
selected frames without smoothing. Rerun it after an explicitly approved source
replacement. Runtime imports are in Boot.js / productionAssets.js / Npc.js.

Audio is separate: public/audio/LICENSES.md includes each creator, release page,
CC0 dedication and conversion. No live asset generation is needed while playing.
