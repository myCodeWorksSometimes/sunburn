"""Make a "continue this scene" canvas for the image generator.

Takes the previous painting and puts its right-hand OVERLAP (35%) on the left
of a blank 1920x1080 canvas. Attach the canvas to the generator and ask it to
fill the blank part, continuing the scene. process_backgrounds.py later pastes
the original pixels back over that strip, so the joint in the game is exact.

Usage:
  python tools/make_continuation.py bg_a2_swings_dark
  -> assets/backgrounds/seeds/seed_after_bg_a2_swings_dark.png
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "backgrounds")
OUT = os.path.join(SRC, "seeds")
W, H = 1920, 1080
OVERLAP = 0.35
BLANK = (255, 255, 255)


def find(base):
    for ext in (".png", ".jpg", ".jpeg"):
        path = os.path.join(SRC, base + ext)
        if os.path.exists(path):
            return path
    sys.exit(f"not found: assets/backgrounds/{base}.png/.jpg")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    base = sys.argv[1]
    prev = Image.open(find(base)).convert("RGB").resize((W, H), Image.LANCZOS)
    keep = round(W * OVERLAP)
    canvas = Image.new("RGB", (W, H), BLANK)
    canvas.paste(prev.crop((W - keep, 0, W, H)), (0, 0))
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"seed_after_{base}.png")
    canvas.save(path)
    print(path)


if __name__ == "__main__":
    main()
