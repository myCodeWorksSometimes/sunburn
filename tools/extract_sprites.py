"""Cut animation frames out of the AI sprite sheets.

Each sheet has a flat dark-grey background with text labels on the left.
For every animation row we key out the background (flood fill from the
outside, so dark pixels inside a sprite survive), split the row into frames
by empty columns, align frames on a shared bottom-centre baseline and save a
horizontal strip to public/sprites/<name>.png plus public/sprites/sprites.json.

Usage: python tools/extract_sprites.py [--preview DIR]
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, "public", "sprites")

HERO = "Gemini_Generated_Image_bmhi8obmhi8obmhi (1).jpg"
SHADOW = "Gemini_Generated_Image_bmhi8obmhi8obmhi.jpg"
FIRE = "Gemini_Generated_Image_bmhi8obmhi8obmhi (2).jpg"
FX = "Gemini_Generated_Image_gq23v2gq23v2gq23.jpg"
ITEMS = "Gemini_Generated_Image_gq23v2gq23v2gq23 (2).jpg"
UI = "Gemini_Generated_Image_gq23v2gq23v2gq23 (3).jpg"

# Coordinates are in the 2000px-wide preview space; S converts to source pixels.
S = 2752 / 2000

# name: (sheet, (y0, y1), (x0, x1), scale, options)
# "frames" picks which split frames to keep; "dark" keys by darkness instead of
# background colour (for sheets with scenery painted behind the sprites).
HERO_OPTS = {"blobs": True, "halo": True, "group": "hero"}
SHADOW_OPTS = {"dark": True, "blobs": True, "group": "shadow"}
ANIMS = {
    "hero_idle": (HERO, (30, 196), (540, 1960), 0.5, HERO_OPTS),
    "hero_walk": (HERO, (212, 382), (540, 1960), 0.5, HERO_OPTS),
    "hero_jump": (HERO, (396, 566), (540, 1960), 0.5, HERO_OPTS),
    "hero_interact": (HERO, (578, 746), (540, 1960), 0.5, HERO_OPTS),
    "hero_light": (HERO, (752, 922), (540, 1960), 0.5, HERO_OPTS),
    "hero_death": (HERO, (928, 1100), (540, 1960), 0.5, HERO_OPTS),
    "shadow_idle": (SHADOW, (50, 238), (500, 1960), 0.5, {**SHADOW_OPTS, "cells": [(540, 790), (830, 1060), (1120, 1360), (1400, 1640)]}),
    "shadow_move": (SHADOW, (285, 440), (560, 1960), 0.5, {**SHADOW_OPTS, "cells": [(600, 880), (900, 1210), (1280, 1560), (1610, 1920)]}),
    "shadow_hurt": (SHADOW, (690, 885), (560, 1960), 0.5, SHADOW_OPTS),
    "shadow_dissolve": (SHADOW, (890, 1100), (560, 1960), 0.5, SHADOW_OPTS),
    # Campfire: rows with scenery painted behind them are separated with GrabCut.
    "fire_unlit": (FIRE, (70, 205), (330, 1960), 0.45, {"grabcut": True, "group": "fire", "cells": [(355, 555), (625, 825)]}),
    "fire_ignite": (FIRE, (262, 412), (330, 1960), 0.45, {"grabcut": True, "group": "fire", "cells": [(355, 555), (625, 825), (900, 1100), (1170, 1370), (1445, 1645), (1715, 1915)]}),
    "fire_burning": (FIRE, (425, 640), (330, 1960), 0.45, {"grabcut": True, "group": "fire", "cells": [(345, 565), (615, 835), (890, 1110), (1160, 1380), (1435, 1655)]}),
    "fire_fading": (FIRE, (650, 835), (330, 1960), 0.45, {"group": "fire", "blobs": True, "cells": [(362, 565), (615, 835), (890, 1110), (1160, 1380), (1435, 1655), (1705, 1925)]}),
    "fx_burst": (FX, (40, 260), (540, 1960), 0.6, {"cells": [(560, 690), (800, 980), (1050, 1320), (1370, 1620), (1680, 1910)]}),
    "fx_embers": (FX, (300, 540), (540, 1960), 0.6, {"cells": [(550, 700), (810, 970), (1090, 1270), (1410, 1590), (1710, 1890)]}),
    "fx_dissolve": (FX, (840, 1100), (520, 1960), 0.6, {"cells": [(540, 710), (810, 980), (1070, 1300), (1390, 1610), (1690, 1910)]}),
}

# Single images: name: (sheet, (x0, y0, x1, y1), scale)
SINGLES = {
    "ui_key_e": (UI, (560, 70, 715, 220), 0.4),
    "ui_eye": (UI, (1270, 870, 1490, 1050), 0.4),
    "ui_spark": (UI, (570, 890, 715, 1035), 0.4),
    "item_drawing": (ITEMS, (1520, 160, 1820, 400), 0.8),
    "item_photo": (ITEMS, (1530, 425, 1810, 660), 0.8),
    "item_teddy": (ITEMS, (1570, 670, 1745, 890), 0.8),
    "ui_timer_full": (UI, (470, 300, 800, 460), 0.8),
    "ui_timer_empty": (UI, (1580, 370, 1900, 460), 0.8),
}


def bg_color(a):
    border = np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3)])
    return np.median(border, axis=0)


def sprite_mask(crop, bg, threshold=20, dark=False):
    """True where a pixel belongs to a sprite (background flood-filled away)."""
    a = crop.astype(np.float32)
    if dark:
        # Scenery behind the sprite: keep only very dark or bright/saturated pixels.
        lum = a.mean(axis=2)
        sat = a.max(axis=2) - a.min(axis=2)
        fg = (lum < 24) | ((lum > 170) & (sat < 60))
    else:
        dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
        fg = dist > threshold
    m = Image.fromarray(np.where(fg, 0, 255).astype(np.uint8), "L")
    w, h = m.size
    # Pad so the flood fill can reach around everything from one corner.
    pad = Image.new("L", (w + 2, h + 2), 255)
    pad.paste(m, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)
    outside = np.asarray(pad)[1:-1, 1:-1] == 128
    return ~outside


def split_frames(mask, min_gap=14, min_width=12):
    cols = mask.sum(axis=0) > 2
    frames, start, gap = [], None, 0
    for x, on in enumerate(cols):
        if on:
            if start is None:
                start = x
            gap = 0
            end = x
        elif start is not None:
            gap += 1
            if gap >= min_gap:
                if end - start >= min_width:
                    frames.append((start, end + 1))
                start = None
    if start is not None and end - start >= min_width:
        frames.append((start, end + 1))
    return frames


def grabcut(cell):
    """Foreground mask for a sprite sitting on painted scenery."""
    h, w = cell.shape[:2]
    gc = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    gc[4:h - 2, 8:w - 8] = cv2.GC_PR_FGD
    gc[:3, :] = gc[:, :4] = gc[:, -4:] = cv2.GC_BGD
    a = cell.astype(np.int32)
    lum = a.mean(axis=2)
    gc[(a[..., 0] > 200) & (a[..., 1] > 120)] = cv2.GC_FGD  # flames
    bgr = np.ascontiguousarray(cell[..., ::-1]).astype(np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(bgr, gc, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    m = (gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)
    return keep_big_blobs(m, 0.2)


def keep_big_blobs(mask, keep_ratio=0.06):
    """Remove specks and scenery fragments: keep blobs at least keep_ratio of the largest."""
    lab = Image.fromarray(mask.astype(np.uint8) * 255, "L")
    arr = np.asarray(lab).copy()
    blobs = []
    label = 1
    work = Image.fromarray(arr).copy()
    while True:
        a = np.asarray(work)
        ys, xs = np.nonzero(a == 255)
        if len(ys) == 0 or label > 250:
            break
        ImageDraw.floodfill(work, (int(xs[0]), int(ys[0])), label)
        a = np.asarray(work)
        blobs.append((label, int((a == label).sum())))
        label += 1
    if not blobs:
        return mask
    a = np.asarray(work)
    biggest = max(n for _, n in blobs)
    keep = [l for l, n in blobs if n >= biggest * keep_ratio]
    return np.isin(a, keep)


def cut(img, box, dark=False, threshold=20):
    a = np.asarray(img.convert("RGB"))
    x0, y0, x1, y1 = [round(v * S) for v in box]
    crop = a[y0:y1, x0:x1]
    bg = bg_color(a)
    mask = sprite_mask(crop, bg, threshold=threshold, dark=dark)
    return crop, mask


def to_rgba(crop, mask, alpha=None):
    if alpha is None:
        alpha = mask.astype(np.float32)
    return Image.fromarray(np.dstack([crop, (alpha * mask * 255).astype(np.uint8)]), "RGBA")


def halo_alpha(crop, mask, bg, radius=46):
    """Soften the painted lantern glow: faint pixels near the flame become see-through."""
    a = crop.astype(np.float32)
    flame = (a[..., 0] > 235) & (a[..., 1] > 185) & (a[..., 2] < 170) & mask
    alpha = np.ones(mask.shape, np.float32)
    if flame.sum() < 12:
        return alpha
    ys, xs = np.nonzero(flame)
    cy, cx = ys.mean(), xs.mean()
    yy, xx = np.mgrid[0:mask.shape[0], 0:mask.shape[1]]
    near = (yy - cy) ** 2 + (xx - cx) ** 2 < radius ** 2
    dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
    lum = a.mean(axis=2)
    glow = near & (dist < 70) & (lum > bg.mean() - 2)
    alpha[glow] = np.clip((dist[glow] - 20) / 110, 0, 0.45)
    return alpha


def cut_frames(sheet, yr, xr, opts, cache):
    img = cache.setdefault(sheet, Image.open(os.path.join(ROOT, sheet)))
    crop, mask = cut(img, (xr[0], yr[0], xr[1], yr[1]), opts.get("dark", False), opts.get("threshold", 20))
    if "cells" in opts:
        spans = [(round((c0 - xr[0]) * S), round((c1 - xr[0]) * S)) for c0, c1 in opts["cells"]]
    else:
        spans = split_frames(mask, min_width=40)
    if opts.get("grabcut"):
        mask = np.zeros_like(mask)
        for fx0, fx1 in spans:
            mask[:, fx0:fx1] = grabcut(crop[:, fx0:fx1])
    frames = []
    for fx0, fx1 in spans:
        m = mask[:, fx0:fx1]
        if opts.get("blobs"):
            m = keep_big_blobs(m)
        if not m.any():
            continue
        rows = np.where(m.any(axis=1))[0]
        fy0, fy1 = rows[0], rows[-1] + 1
        c = crop[fy0:fy1, fx0:fx1]
        alpha = halo_alpha(c, m[fy0:fy1], bg_color(np.asarray(img.convert("RGB")))) if opts.get("halo") else None
        frames.append(to_rgba(c, m[fy0:fy1], alpha))
    return frames


def save_strip(name, frames, scale, fw, fh):
    """Frames share one size (per group) so swapping animations never shifts the sprite."""
    strip = Image.new("RGBA", (fw * len(frames), fh), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        strip.alpha_composite(f, (i * fw + (fw - f.width) // 2, fh - f.height))
    w, h = round(strip.width * scale), round(strip.height * scale)
    fw_s = round(fw * scale)
    strip = strip.resize((fw_s * len(frames), h), Image.LANCZOS)
    strip.save(os.path.join(DST, name + ".png"))
    return {"frameWidth": fw_s, "frameHeight": h, "frames": len(frames)}


def build_single(name, sheet, box, scale, cache):
    img = cache.setdefault(sheet, Image.open(os.path.join(ROOT, sheet)))
    crop, mask = cut(img, box)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    out = to_rgba(crop, mask).crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))
    out = out.resize((round(out.width * scale), round(out.height * scale)), Image.LANCZOS)
    out.save(os.path.join(DST, name + ".png"))
    return {"width": out.width, "height": out.height}


def main():
    os.makedirs(DST, exist_ok=True)
    cache, meta = {}, {"anims": {}, "images": {}}
    cuts = {name: cut_frames(sheet, yr, xr, opts, cache) for name, (sheet, yr, xr, scale, opts) in ANIMS.items()}
    sizes = {}
    for name, (_, _, _, _, opts) in ANIMS.items():
        g = opts.get("group", name)
        fw, fh = sizes.get(g, (0, 0))
        sizes[g] = (max(fw, *(f.width for f in cuts[name])), max(fh, *(f.height for f in cuts[name])))
    for name, (_, _, _, scale, opts) in ANIMS.items():
        fw, fh = sizes[opts.get("group", name)]
        meta["anims"][name] = save_strip(name, cuts[name], scale, fw, fh)
        print(name, meta["anims"][name])
    for name, (sheet, box, scale) in SINGLES.items():
        meta["images"][name] = build_single(name, sheet, box, scale, cache)
        print(name, meta["images"][name])
    with open(os.path.join(DST, "sprites.json"), "w") as f:
        json.dump(meta, f, indent=2)

    if "--preview" in sys.argv:
        out = sys.argv[sys.argv.index("--preview") + 1]
        for name in list(ANIMS) + list(SINGLES):
            im = Image.open(os.path.join(DST, name + ".png"))
            bg = Image.new("RGBA", im.size, (255, 0, 255, 255))
            bg.alpha_composite(im)
            bg.convert("RGB").save(os.path.join(out, name + "_prev.png"))


if __name__ == "__main__":
    main()
