# Horror revision asset register — 18 October 2026

Actual reference uploads, not filenames alone, were supplied to the signed-in
Gemini conversation. Its original references were supplemented with hero_idle,
hero_walk, shadow_idle, shadow_move, survivors-source, village lane/bridge and
mara-stall. The revised Braced sheet is the version generated AFTER those uploads.

Exact visible prompt bodies: GEMINI-HORROR-PROMPTS.json. The failed final Gemini
stall request is retained there but is NOT a generated source. Gemini hit its
image limit. The user authorised the open ChatGPT tab as the fallback; its actual
style/reference prompt is CHATGPT-STALL-PROMPT.txt. The stall, village and hero
images were uploaded there before generation.

| Runtime asset | Inspected generated source / packing |
| --- | --- |
| boss-motion.png | boss-motion-source.jpg; 6 columns × 6 rows, idle/scream/charge/summon/stagger/death; 36 frames of 256×256 |
| sword-motion.png | sword-motion-source.jpg; model returned EIGHT columns, not the requested six; 4 action rows, 32 frames of 155×110, idle/walk/slash/draw |
| echo-motion.png | echo-motion-source.jpg; 6 columns, rows registered at source y0/211/420/end; Mara/Tomas/Nia living→skull→skeleton→collapse→ash→empty; 96×112 frames, character heights 98/102/70 |
| foundry.png | foundry-source.jpg; 1024×572 painting, walk line y450; uniform scale, keyed sky, feathered outer edges |
| gear-large/small, lever-base/handle, brake-base/handle, machine-plate, supply-ledge | machinery-source.jpg; eight inspected unequal cell bounds, individually cropped; centered gear pivots and separate lever handles |
| ui-frame.png | ui-frame-source.jpg; clean border, keyed/cropped then nearest-neighbour 320×96; 16px horizontal /12px vertical 9-slice margins |
| stall-ruined.png | stall-ruined-source.png; ChatGPT result matching the supplied open kiosk, keyed/cropped, no substitute drawn rectangle |

Sources are byte-preserved downloads. Runtime imports remove green/JPEG spill,
register baselines and use nearest-neighbour resizing. Reproduction:
tools/import_horror.py and tools/import_horror_scenery.py. Their bounds are for
these inspected sources; do not run blindly on a different model result.

Gemini conversation: https://gemini.google.com/u/1/app/f7f535590d27ea25?pli=1
ChatGPT stall: https://chatgpt.com/c/6ad400ca-c1b4-83e8-9504-90c93567b08c

UI font: Pixelify Sans, Google Fonts / The Pixelify Sans Project Authors,
bundled locally with SIL Open Font License in public/fonts/OFL.txt. No network
font or generation service is needed at runtime. Audio has separate provenance
in public/audio/LICENSES.md.
