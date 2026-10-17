"""Name the Act 2 art delivered in newart/ and stage it in assets/backgrounds/.

Some dark versions came back unusable (legacy broken sun, creatures, blurred
green), so until they are regenerated their dark file is a night-graded copy of
the restored image (same outline, so the restore cross-fade lines up). Run
process_backgrounds.py afterwards.

Usage: python tools/import_act2.py
"""
import os
import shutil

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "newart")
DST = os.path.join(ROOT, "assets", "backgrounds")
G = "Gemini_Generated_Image_"

# name -> delivered file
DIRECT = {
    "bg_a2_swings_restored": "mar1ojmar1ojmar1 (7)",
    "bg_a2_treehouse_dark": "k93kjfk93kjfk93k (4)",
    "bg_a2_treehouse_restored": "k93kjfk93kjfk93k (5)",
    "bg_a2_canal_dark": "k93kjfk93kjfk93k (10)",
    "bg_a2_canal_restored": "k93kjfk93kjfk93k (11)",
    "prop_a2_swingset_dark": "mar1ojmar1ojmar1 (1)",
    "prop_a2_swingset_restored": "mar1ojmar1ojmar1 (2)",
    "prop_a2_swing_seat_restored": "mar1ojmar1ojmar1 (4)",
    "prop_a2_crater_restored": "k93kjfk93kjfk93k",
    "prop_a2_treehouse_dark": "mar1ojmar1ojmar1 (8)",
    "prop_a2_treehouse_restored": "k93kjfk93kjfk93k (1)",
    "prop_a2_rubble_dark": "k93kjfk93kjfk93k (2)",
    "prop_a2_rubble_restored": "k93kjfk93kjfk93k (3)",
    "prop_a2_mill_dark": "k93kjfk93kjfk93k (6)",
    "prop_a2_mill_restored": "k93kjfk93kjfk93k (7)",
    "prop_a2_canal_dark": "k93kjfk93kjfk93k (8)",
    "prop_a2_canal_restored": "k93kjfk93kjfk93k (9)",
    "fg_a2_front_restored": "l9wmv1l9wmv1l9wm (1)",
}
# Placeholder darks: name -> (restored source name, treatment)
DERIVED = {
    "bg_a2_swings_dark": ("bg_a2_swings_restored", "night"),
    "prop_a2_swing_seat_dark": ("prop_a2_swing_seat_restored", "night"),
    "prop_a2_crater_dark": ("prop_a2_crater_restored", "night"),
    "fg_a2_front_dark": ("fg_a2_front_restored", "silhouette"),
}


def green_mask(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (g > 150) & (g - np.maximum(r, b) > 90)


def treat(img, how):
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    keep = green_mask(a)
    lum = a @ np.array([.3, .59, .11], np.float32)
    if how == "night":
        out = a * np.array([.36, .34, .52]) * .7 + lum[..., None] * np.array([.10, .09, .16]) + np.array([6, 4, 14])
    else:
        out = a * .12 + np.array([10, 8, 18])
    out[keep] = a[keep]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


def main():
    for name, src in DIRECT.items():
        shutil.copyfile(os.path.join(SRC, G + src + ".jpg"), os.path.join(DST, name + ".jpg"))
        print(name, "<-", src)
    for name, (base, how) in DERIVED.items():
        treat(Image.open(os.path.join(DST, base + ".jpg")), how).save(os.path.join(DST, name + ".png"))
        print(name, "<-", base, f"({how}, placeholder)")


if __name__ == "__main__":
    main()
