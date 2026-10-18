# Bundled character dialogue

82 authored speaker/text reads plus one short Eli memory laugh. Generated locally
with installed Windows System.Speech voices; no cloned actor/celebrity voice,
franchise dialogue or external speech API. These are synthetic reads, not final
performed voice acting. Human listening is required, especially for the children.

| Character | Base voice | Rate / pitch ratio |
| --- | --- | --- |
| Rowan | Microsoft David Desktop | −1 / 0.96 |
| Eli | Microsoft Zira Desktop | +1 / 1.13 |
| Mara | Microsoft Zira Desktop | −1 / 0.95 |
| Tomas | Microsoft David Desktop | −2 / 0.85 |
| Nia | Microsoft Zira Desktop | 0 / 1.18 |

Echo/Recorded variants receive a restrained130ms echo. Child laugh is a short
synthetic “Ha. Ha ha.” read with a raised register; it is not a recording of a child.
Pitch processing compensates tempo, normalizes to −21 LUFS / −3 dBTP and exports
44.1kHz Ogg. Effects volume, mute, pause, caption changes and shutdown own playback.

manifest.json maps exact `speaker|text` to a stable SHA-derived filename. To
replace a performance, preserve its filename/key. Text edits require rebuilding
the manifest with `python tools/build_dialogue_voices.py` on Windows (System.Speech
and FFmpeg installed). Existing takes are retained; --force regenerates all.
No Python, Windows speech engine or network is required by the shipped game.
