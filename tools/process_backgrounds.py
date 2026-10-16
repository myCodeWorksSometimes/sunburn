"""Chroma-key and resize the AI backgrounds for the game.

Reads assets/backgrounds/*.jpg, removes the flat green (#00FF00) on layered
images, scales everything to 720px tall and writes PNGs to public/bg/.

Usage: python tools/process_backgrounds.py
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "backgrounds")
DST = os.path.join(ROOT, "public", "bg")
HEIGHT = 720

# Images that use the green screen. Everything else is a full opaque frame.
KEYED_PREFIXES = ("bg_skyline_", "bg_p2_", "bg_a1_", "fg_")


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
    for name in sorted(os.listdir(SRC)):
        base, ext = os.path.splitext(name)
        if ext.lower() not in (".jpg", ".jpeg", ".png") or (only and base not in only):
            continue
        img = Image.open(os.path.join(SRC, name))
        if base.startswith(KEYED_PREFIXES):
            img = chroma_key(img)
        else:
            img = img.convert("RGB")
        w = round(img.width * HEIGHT / img.height)
        img = img.resize((w, HEIGHT), Image.LANCZOS)
        img.save(os.path.join(DST, base + ".png"), optimize=True)
        print(f"{base}: {w}x{HEIGHT}{' (keyed)' if img.mode == 'RGBA' else ''}")


if __name__ == "__main__":
    main()
