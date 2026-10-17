"""Chroma-key and resize the AI backgrounds for the game.

Reads assets/backgrounds/*.jpg, removes the flat green (#00FF00) on layered
images, scales everything to 720px tall and writes PNGs to public/bg/.

Usage: python tools/process_backgrounds.py
"""
import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "backgrounds")
DST = os.path.join(ROOT, "public", "bg")
HEIGHT = 720

# Paintings generated from a make_continuation.py canvas: their left OVERLAP
# is replaced by the previous painting's right edge, so the joint is exact.
OVERLAP = 0.35
CONTINUES = {
    f"bg_a2_{b}_{state}": f"bg_a2_{a}_{state}"
    for a, b in (("swings", "treehouse"), ("treehouse", "canal"))
    for state in ("dark", "restored")
}
CONTINUES.update({
    f"bg_a3_{b}_{state}": f"bg_a3_{a}_{state}"
    for a, b in (("courtyard", "mechanisms"), ("mechanisms", "landing"))
    for state in ("dark", "restored")
})


def stitch(img, prev):
    """Paste prev's right edge over img's left OVERLAP, fading into img."""
    a = np.asarray(img.convert("RGBA")).astype(np.float32)
    b = np.asarray(prev.convert("RGBA").resize((img.width, img.height), Image.LANCZOS)).astype(np.float32)
    keep = round(img.width * OVERLAP)
    ramp = min(80, keep // 3)
    t = np.clip((np.arange(keep) - (keep - ramp)) / ramp, 0, 1)[None, :, None]
    a[:, :keep] = b[:, img.width - keep:] * (1 - t) + a[:, :keep] * t
    return Image.fromarray(a.astype(np.uint8), "RGBA")


# Images that use the green screen. Everything else is a full opaque frame.
KEYED_PREFIXES = ("bg_skyline_", "bg_p2_", "bg_a1_", "bg_a2_", "bg_a3_", "fg_", "prop_")


def chroma_key(img):
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    # Fully keyed when strongly green and bright; soft edge below that.
    alpha = np.clip((110.0 - spill) / 50.0, 0.0, 1.0)
    alpha = np.where(g < 120, np.maximum(alpha, (120 - g) / 40.0), alpha)
    alpha = np.clip(alpha, 0.0, 1.0)
    # Despill: pull green down to the other channels where it dominates.
    cap = np.maximum(r, b) + 12
    g2 = np.where((spill > 20) & (alpha > 0), np.minimum(g, cap), g)
    out = np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def main():
    os.makedirs(DST, exist_ok=True)
    only = set(sys.argv[1:])
    names = [n for n in sorted(os.listdir(SRC)) if os.path.splitext(n)[1].lower() in (".jpg", ".jpeg", ".png")]
    # Continued paintings go after the ones they continue.
    def depth(base):
        return 1 + depth(CONTINUES[base]) if base in CONTINUES else 0
    names.sort(key=lambda n: depth(os.path.splitext(n)[0]))
    for name in names:
        base = os.path.splitext(name)[0]
        if only and base not in only:
            continue
        img = Image.open(os.path.join(SRC, name))
        if base.startswith(KEYED_PREFIXES):
            img = chroma_key(img)
        else:
            img = img.convert("RGB")
        w = round(img.width * HEIGHT / img.height)
        img = img.resize((w, HEIGHT), Image.LANCZOS)
        prev = os.path.join(DST, CONTINUES.get(base, "") + ".png")
        if base in CONTINUES and os.path.exists(prev):
            img = stitch(img, Image.open(prev))
        img.save(os.path.join(DST, base + ".png"), optimize=True)
        print(f"{base}: {w}x{HEIGHT}{' (keyed)' if img.mode == 'RGBA' else ''}{' (stitched)' if base in CONTINUES and os.path.exists(prev) else ''}")
    # The game loads every background listed here, so new art needs no code change.
    names = sorted(os.path.splitext(n)[0] for n in os.listdir(DST) if n.endswith(".png"))
    with open(os.path.join(DST, "manifest.json"), "w") as f:
        json.dump(names, f, indent=0)


if __name__ == "__main__":
    main()
