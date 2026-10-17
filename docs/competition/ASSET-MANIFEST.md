# Runtime art provenance and replacement status

This is a production inventory, not an assertion about competition eligibility.
The human lead checks the actual event's source/AI disclosure rules.

| Files / source | Treatment | Current status |
|---|---|---|
| public/bg/*.png | Supplied repository art; rendered as cropped set dressing. Original source files preserved. | Reused; existing authorship/permissions remain with supplying team. |
| public/sprites/hero_*.png | Supplied Rowan idle/walk/jump/interact/light/death sheets. Existing light poses also drive sweep. | Reused, no pixel edits. |
| public/sprites/shadow_*.png | Supplied Crawler idle/move/hurt/dissolve. | Reused with animation/tint/fade. |
| public/sprites/fire_*.png and fx_*.png | Supplied fire and burst/dissolve sheets. | Reused; more existing frames now played. |
| public/sprites/item_photo.png, ui_eye.png | Supplied photograph and threat-eye artwork. | Reused at game scale. |
| public/art/eli-sheet.png | Built-in image-generation tool, supplied hero as style reference; six-frame source, 2172×724. | DRAFT, created before user prohibited further generation. Replace with human-delivered approved sheet. |
| public/art/rowan-climb-sheet.png | Built-in image-generation tool, supplied hero identity/style reference; four-frame source, 2172×724. | DRAFT, same timing/status as Eli. |
| public/art/stone-ground.png | Built-in image-generation tool, supplied ruined bridge as material/style reference; 2172×724. | DRAFT, same timing/status as Eli. |
| public/art/*.svg (12 files) | Original code-authored editable props/icons, source tools/build-presentation-assets.mjs. | Interim art created before latest direction; replacement PNG briefs supplied. Do not regenerate raster art. |
| src/presentation/ui.js | Code-native framing, palette, panel corners and typography; system fonts. | Integrated. No downloaded font dependency. |
| src/presentation/textures.js | Runtime character frame packing and procedural sky/grass gradients. | Integrated. Keeps actor dimensions/physics stable; original raster files intact. |
| src/textures.js | Original radial light/particle gradients plus supplied-sheet animation definitions. | Integrated; old procedural child placeholder removed. |

The title and credits use supplied art. Credits explicitly acknowledge additional
AI-assisted drafts and pending final asset review. Update credit wording and this
manifest when the human's approved images replace the drafts.

Do not create further generated images in this coding session. Detailed prompts,
frame layouts, dimensions and delivery paths: [ASSET-HANDOFF.md](ASSET-HANDOFF.md).
