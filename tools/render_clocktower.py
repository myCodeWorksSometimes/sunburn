"""Procedural pixel-art render of the clock tower scene (dark version).

Draws at 400x240, applies banded light from the lantern and brazier,
then upscales 4x with nearest-neighbour to 1600x960.
"""
import math
import random
import sys

import numpy as np
from PIL import Image, ImageDraw

W, H = 400, 240
SCALE = 4
GROUND = 212
random.seed(7)

img = Image.new("RGB", (W, H))
d = ImageDraw.Draw(img)
emissive = []  # drawn after lighting so they glow


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0

# ---------- sky ----------
top, mid, low = (14, 9, 22), (38, 14, 30), (92, 24, 28)
for y in range(H):
    for x in range(W):
        t = y / 150
        t = min(t + (BAYER[y % 4, x % 4] - 0.5) * 0.12, 1)
        c = lerp(top, mid, t * 2) if t < 0.5 else lerp(mid, low, (t - 0.5) * 2)
        img.putpixel((x, y), c)

# red cloud bands
for i in range(26):
    cx, cy = random.randint(240, 400), random.randint(20, 110)
    w, h = random.randint(20, 60), random.randint(3, 7)
    d.ellipse([cx - w, cy - h, cx + w, cy + h], fill=(70, 18, 26))
for i in range(14):
    cx, cy = random.randint(260, 400), random.randint(30, 100)
    w, h = random.randint(10, 30), random.randint(2, 4)
    d.ellipse([cx - w, cy - h, cx + w, cy + h], fill=(110, 28, 30))

# cracked sun
SX, SY, SR = 330, 52, 26
d.ellipse([SX - SR - 6, SY - SR - 6, SX + SR + 6, SY + SR + 6], fill=(96, 20, 22))
d.ellipse([SX - SR - 2, SY - SR - 2, SX + SR + 2, SY + SR + 2], fill=(170, 34, 30))
d.ellipse([SX - SR, SY - SR, SX + SR, SY + SR], fill=(30, 6, 8))
for _ in range(9):
    a = random.uniform(0, math.tau)
    pts = [(SX + math.cos(a) * SR, SY + math.sin(a) * SR)]
    r = SR
    while r > 4:
        r -= random.randint(4, 8)
        a += random.uniform(-0.5, 0.5)
        pts.append((SX + math.cos(a) * r, SY + math.sin(a) * r))
    d.line(pts, fill=(200, 50, 36), width=1)
# drifting debris
for _ in range(30):
    a = random.uniform(0, math.tau)
    r = random.uniform(SR + 4, SR + 26)
    x, y = int(SX + math.cos(a) * r), int(SY + math.sin(a) * r)
    d.point((x, y), fill=(60, 14, 16))


# ---------- skyline ----------
def spire_layer(color, base, hmin, hmax, step, seed):
    rnd = random.Random(seed)
    x = -10
    while x < W:
        w = rnd.randint(step // 2, step)
        h = rnd.randint(hmin, hmax)
        d.rectangle([x, base - h, x + w, base], fill=color)
        if rnd.random() < 0.6:
            sh = rnd.randint(8, 26)
            d.polygon([(x, base - h), (x + w // 2, base - h - sh), (x + w, base - h)], fill=color)
            d.line([(x + w // 2, base - h - sh), (x + w // 2, base - h - sh - 4)], fill=color)
        if rnd.random() < 0.4:  # side turret
            tx = x + rnd.randint(0, w)
            d.rectangle([tx - 2, base - h - 10, tx + 2, base - h], fill=color)
            d.polygon([(tx - 3, base - h - 10), (tx, base - h - 18), (tx + 3, base - h - 10)], fill=color)
        x += w + rnd.randint(0, 8)


spire_layer((34, 18, 32), 170, 20, 60, 26, 1)
# aqueduct
d.rectangle([250, 128, 400, 142], fill=(40, 18, 30))
for ax in range(254, 400, 18):
    d.rectangle([ax, 142, ax + 4, 175], fill=(40, 18, 30))
for ax in range(258, 400, 18):
    d.ellipse([ax, 134, ax + 14, 152], fill=(80, 22, 28))
spire_layer((24, 14, 24), 190, 10, 40, 30, 2)

# ---------- tower ----------
TX0, TX1 = 118, 282
STONE = (58, 46, 50)
STONE_D = (40, 32, 36)
MORTAR = (28, 22, 26)


def bricks(x0, y0, x1, y1, base, dark, mortar, rnd):
    d.rectangle([x0, y0, x1, y1], fill=base)
    for y in range(y0, y1 + 1, 5):
        d.line([(x0, y), (x1, y)], fill=mortar)
        off = 0 if (y // 5) % 2 else 5
        for x in range(x0 + off, x1, 10):
            d.line([(x, y), (x, min(y + 5, y1))], fill=mortar)
    for _ in range((x1 - x0) * (y1 - y0) // 12):
        px, py = rnd.randint(x0, x1), rnd.randint(y0, y1)
        d.point((px, py), fill=dark)


trnd = random.Random(3)
# roof
d.polygon([(TX0 - 6, 44), (200, 2), (TX1 + 6, 44)], fill=(34, 26, 34))
for i in range(0, 40, 3):
    d.line([(TX0 - 6 + i * 2, 44 - i), (TX1 + 6 - i * 2, 44 - i)], fill=(26, 20, 28))
d.line([(200, 2), (200, -6)], fill=(34, 26, 34), width=2)
# side turrets
for tx in (TX0 - 4, TX1 + 4):
    d.rectangle([tx - 6, 40, tx + 6, 70], fill=STONE_D)
    d.polygon([(tx - 8, 40), (tx, 16), (tx + 8, 40)], fill=(34, 26, 34))

bricks(TX0, 44, TX1, GROUND, STONE, STONE_D, MORTAR, trnd)

# clock face
CX, CY, CR = 200, 66, 17
d.ellipse([CX - CR - 3, CY - CR - 3, CX + CR + 3, CY + CR + 3], fill=(90, 72, 54))
d.ellipse([CX - CR, CY - CR, CX + CR, CY + CR], fill=(36, 30, 30))
for k in range(12):
    a = k / 12 * math.tau
    d.point((CX + math.cos(a) * (CR - 3), CY + math.sin(a) * (CR - 3)), fill=(150, 124, 86))
d.line([(CX, CY), (CX, CY - 12)], fill=(150, 124, 86))
d.line([(CX, CY), (CX + 8, CY + 5)], fill=(150, 124, 86))
# crack across the face
d.line([(CX - 14, CY - 6), (CX - 4, CY - 2), (CX + 2, CY + 8), (CX + 12, CY + 12)], fill=(14, 10, 12))

# cutaway interior
IX0, IX1, IY0 = TX0 + 10, TX1 - 10, 90
bricks(IX0, IY0, IX1, GROUND - 1, (32, 24, 30), (24, 18, 24), (20, 14, 18), random.Random(4))
# ragged cutaway edge
for y in range(IY0, GROUND, 3):
    j = trnd.randint(0, 4)
    d.rectangle([IX0 - j, y, IX0, y + 3], fill=STONE)
    j = trnd.randint(0, 4)
    d.rectangle([IX1, y, IX1 + j, y + 3], fill=STONE)

# belfry floor + bell beam
d.rectangle([IX0, 104, IX1, 108], fill=(74, 52, 36))
d.rectangle([IX0, 104, IX0 + 40, 108], fill=(32, 24, 30))  # broken gap
d.polygon([(IX0 + 40, 104), (IX0 + 48, 104), (IX0 + 42, 112)], fill=(74, 52, 36))
d.rectangle([IX0, 92, IX1, 94], fill=(60, 42, 30))
# fallen bell
d.polygon([(IX0 + 50, 104), (IX0 + 56, 90), (IX0 + 70, 90), (IX0 + 76, 104)], fill=(70, 58, 40))
d.rectangle([IX0 + 48, 102, IX0 + 78, 104], fill=(84, 70, 48))


# gears
def gear(cx, cy, r, teeth, rot, color, dark):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + i / n * math.tau
        rr = r + 3 if (i % 4) in (1, 2) else r
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    d.polygon(pts, fill=color)
    d.ellipse([cx - r + 4, cy - r + 4, cx + r - 4, cy + r - 4], fill=dark)
    for k in range(4):
        a = rot + k / 4 * math.tau
        d.line([(cx, cy), (cx + math.cos(a) * (r - 4), cy + math.sin(a) * (r - 4))], fill=color, width=2)
    d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=color)
    d.point((cx, cy), fill=(20, 14, 16))


BRASS, BRASS_D = (112, 86, 50), (44, 34, 30)
gear(176, 146, 18, 10, 0.1, BRASS, BRASS_D)
gear(222, 172, 22, 12, 0.3, BRASS, BRASS_D)
gear(158, 192, 11, 8, 0.0, BRASS, BRASS_D)
gear(246, 132, 9, 7, 0.2, BRASS, BRASS_D)
# axle beams
d.line([(176, 146), (222, 172)], fill=(50, 38, 34), width=2)

# wooden platforms
WOOD, WOOD_D = (82, 58, 38), (54, 38, 28)
for x0, y, x1 in [(IX0, 162, IX0 + 22), (238, 146, IX1), (IX0, 182, IX0 + 16), (192, 126, 214)]:
    d.rectangle([x0, y, x1, y + 3], fill=WOOD)
    d.line([(x0, y + 3), (x1, y + 3)], fill=WOOD_D)
    for px in range(x0, x1, 6):
        d.point((px, y + 1), fill=WOOD_D)

# ladder
for lx in (IX1 - 14, IX1 - 6):
    d.line([(lx, 148), (lx, GROUND - 1)], fill=(70, 50, 34))
for ly in range(152, GROUND, 6):
    d.line([(IX1 - 14, ly), (IX1 - 6, ly)], fill=(70, 50, 34))

# hanging chains
for cx, length in [(200, 34), (154, 22), (258, 16)]:
    for y in range(109, 109 + length, 2):
        d.point((cx + (1 if (y // 2) % 2 else 0), y), fill=(74, 66, 64))

# cobwebs
for (wx, wy, sx, sy) in [(IX0, 109, 1, 1), (IX1, 109, -1, 1), (IX1, 95, -1, -1)]:
    for k in range(4):
        d.line([(wx, wy), (wx + sx * (14 - k * 3), wy + sy * (k * 4))], fill=(96, 92, 100))
    for rr in (5, 9, 13):
        d.line([(wx + sx * rr, wy), (wx + sx * rr * 0.7, wy + sy * rr * 0.7), (wx, wy + sy * rr)], fill=(80, 76, 84))

# brazier on belfry
BX, BY = 240, 103
d.polygon([(BX - 12, BY - 10), (BX + 12, BY - 10), (BX + 8, BY - 2), (BX - 8, BY - 2)], fill=(52, 44, 44))
d.line([(BX - 12, BY - 10), (BX + 12, BY - 10)], fill=(86, 72, 64))
d.line([(BX - 6, BY - 2), (BX - 9, BY)], fill=(52, 44, 44))
d.line([(BX + 6, BY - 2), (BX + 9, BY)], fill=(52, 44, 44))


def flame(cx, base, h, w):
    rnd = random.Random(cx)
    layers = [((168, 40, 20), 1.0), ((232, 104, 28), 0.72), ((252, 186, 64), 0.45), ((255, 236, 170), 0.2)]
    for col, f in layers:
        hh, ww = int(h * f), max(1, int(w * f))
        pts = [(cx - ww, base)]
        for k in range(1, 6):
            px = cx - ww + 2 * ww * k / 6
            py = base - hh * (0.5 + 0.5 * math.sin(k / 6 * math.pi)) - rnd.randint(0, 3)
            pts.append((px, py))
        pts.append((cx + ww, base))
        emissive.append(("poly", pts, col))
    for _ in range(8):
        emissive.append(("pt", (cx + rnd.randint(-w - 4, w + 4), base - h - rnd.randint(0, 14)),
                         (252, 186, 64) if rnd.random() < 0.5 else (232, 104, 28)))


flame(BX, BY - 10, 20, 9)


# shadows (enemies)
def shadow(x, y, s, flip=False, crouch=False):
    rnd = random.Random(x * 31 + y)
    f = -1 if flip else 1
    body = [(x, y), (x + f * 2 * s, y - 5 * s), (x + f * 4 * s, y - (5 if crouch else 8) * s),
            (x + f * 7 * s, y - (6 if crouch else 9) * s), (x + f * 9 * s, y - 6 * s),
            (x + f * 8 * s, y - 2 * s), (x + f * 10 * s, y)]
    d.polygon(body, fill=(6, 4, 10))
    for _ in range(6 * s):  # wispy tendrils
        tx = x + f * rnd.randint(0, 9 * s)
        ty = y - rnd.randint(2 * s, 8 * s)
        d.line([(tx, ty), (tx + rnd.randint(-3, 3), ty - rnd.randint(2, 5))], fill=(10, 6, 14))
    for leg in (2, 5, 8):
        d.line([(x + f * leg * s, y - 2 * s), (x + f * (leg + 1) * s, y + 1)], fill=(6, 4, 10))
    ex, ey = x + f * 7 * s, y - (5 if crouch else 8) * s
    emissive.append(("pt", (ex, ey), (236, 232, 210)))
    emissive.append(("pt", (ex + f * 2, ey), (236, 232, 210)))


shadow(IX0 + 2, 162, 2)
shadow(250, 146, 2, flip=False)
shadow(IX0 + 30, GROUND - 1, 3)
shadow(TX1 + 14, 70, 2, flip=True, crouch=True)  # on the outer turret ledge
shadow(330, GROUND - 1, 3, flip=True)

# shadow-brother with teddy bear, beside the brazier
KX, KY = 216, 103
d.ellipse([KX - 5, KY - 12, KX + 5, KY], fill=(8, 6, 12))
d.ellipse([KX - 4, KY - 19, KX + 4, KY - 11], fill=(8, 6, 12))
emissive.append(("pt", (KX - 1, KY - 15), (236, 232, 210)))
emissive.append(("pt", (KX + 2, KY - 15), (236, 232, 210)))
TEDDY = (120, 84, 54)
d.ellipse([KX + 3, KY - 8, KX + 9, KY - 2], fill=TEDDY)
d.ellipse([KX + 4, KY - 12, KX + 8, KY - 8], fill=TEDDY)
d.point((KX + 4, KY - 12), fill=TEDDY)
d.point((KX + 8, KY - 12), fill=TEDDY)

# ruined wall behind the player, so the lantern lights stone instead of sky
rw = random.Random(11)
bricks(30, 168, 112, GROUND, (50, 40, 44), (36, 28, 32), (24, 18, 22), rw)
for x in range(30, 113, 4):  # broken top edge
    cut = rw.randint(0, 14) if x < 60 else rw.randint(0, 6)
    d.rectangle([x, 160, x + 3, 168 + cut], fill=img.getpixel((x, 158)))
d.rectangle([62, 182, 74, 198], fill=(16, 10, 14))  # window
d.ellipse([62, 176, 74, 188], fill=(16, 10, 14))
for y in range(170, GROUND, 3):  # ivy
    if rw.random() < 0.7:
        d.point((100 + rw.randint(-2, 2), y), fill=(44, 58, 34))

# ---------- ground ----------
d.rectangle([0, GROUND, W, H], fill=(30, 22, 26))
d.line([(0, GROUND), (W, GROUND)], fill=(62, 50, 46))
grnd = random.Random(9)
for _ in range(500):
    x, y = grnd.randint(0, W), grnd.randint(GROUND + 1, H)
    d.point((x, y), fill=(44, 34, 36) if grnd.random() < 0.6 else (20, 14, 18))
for _ in range(14):  # rubble
    x = grnd.randint(0, W)
    w = grnd.randint(3, 8)
    d.polygon([(x, GROUND), (x + w // 2, GROUND - grnd.randint(2, 6)), (x + w, GROUND)], fill=(48, 38, 40))
for _ in range(40):  # dead grass
    x = grnd.randint(0, W)
    d.line([(x, GROUND), (x + grnd.randint(-1, 1), GROUND - grnd.randint(2, 5))], fill=(54, 46, 34))
# gravestones / fence
for x in range(14, 100, 16):
    d.rectangle([x, GROUND - 10, x + 1, GROUND], fill=(36, 26, 30))
    d.line([(x - 2, GROUND - 7), (x + 3, GROUND - 7)], fill=(36, 26, 30))
# dead tree
d.line([(372, GROUND), (370, 160)], fill=(26, 18, 22), width=3)
for (a, b) in [((370, 176), (356, 160)), ((370, 168), (386, 150)), ((371, 186), (390, 176)), ((360, 166), (352, 156))]:
    d.line([a, b], fill=(26, 18, 22), width=1)

# tower arch entrance
d.rectangle([TX0 + 8, GROUND - 22, TX0 + 30, GROUND], fill=(12, 8, 12))
d.ellipse([TX0 + 8, GROUND - 32, TX0 + 30, GROUND - 12], fill=(12, 8, 12))
d.arc([TX0 + 6, GROUND - 34, TX0 + 32, GROUND - 10], 180, 360, fill=(80, 66, 58))

# ---------- player with lantern ----------
PX, PY = 86, GROUND - 1
CLOAK, SCARF, SKIN_D = (36, 24, 22), (140, 34, 30), (60, 42, 34)
d.polygon([(PX - 3, PY - 14), (PX + 3, PY - 14), (PX + 4, PY - 4), (PX - 4, PY - 4)], fill=CLOAK)
d.polygon([(PX - 3, PY - 12), (PX - 11, PY - 4), (PX - 8, PY - 2), (PX - 4, PY - 6)], fill=SCARF)  # cape tail
d.rectangle([PX - 3, PY - 4, PX - 2, PY], fill=(26, 18, 18))
d.rectangle([PX + 1, PY - 4, PX + 2, PY], fill=(26, 18, 18))
d.ellipse([PX - 3, PY - 20, PX + 3, PY - 14], fill=SKIN_D)
d.polygon([(PX - 4, PY - 17), (PX, PY - 22), (PX + 4, PY - 17)], fill=CLOAK)  # hood
d.rectangle([PX - 3, PY - 15, PX + 3, PY - 14], fill=SCARF)
d.line([(PX - 2, PY - 18), (PX - 6, PY - 26)], fill=(90, 80, 76))  # sword hilt on back
d.line([(PX + 3, PY - 12), (PX + 6, PY - 9)], fill=CLOAK)  # arm
LX, LY = PX + 7, PY - 7
d.rectangle([LX - 2, LY - 1, LX + 2, LY + 4], fill=(50, 40, 34))
emissive.append(("rect", [LX - 1, LY, LX + 1, LY + 3], (255, 208, 110)))

# ---------- lighting ----------
arr = np.asarray(img).astype(np.float32) / 255.0
yy, xx = np.mgrid[0:H, 0:W]
light = np.zeros((H, W, 3), np.float32)
ambient = np.array([0.42, 0.40, 0.58], np.float32)  # cool moonless dark


def add_light(x, y, radius, color, strength):
    dist = np.sqrt((xx - x) ** 2 + ((yy - y) * 1.1) ** 2) / radius
    f = np.clip(1 - dist, 0, 1)
    f = f ** 1.4
    # banded falloff with ordered dither for a pixel-art look
    dither = BAYER[yy % 4, xx % 4]
    f = np.floor(f * 5 + dither * 0.9) / 5
    light[:] += f[..., None] * np.array(color, np.float32) * strength


add_light(LX, LY + 1, 60, (1.0, 0.62, 0.28), 2.0)
add_light(BX, BY - 18, 95, (1.0, 0.55, 0.22), 2.2)
add_light(SX, SY, 60, (0.9, 0.2, 0.15), 0.5)  # faint red sun glow

lit = arr * (ambient + light)
lit = np.clip(lit, 0, 1)
out = Image.fromarray((lit * 255).astype(np.uint8))
d = ImageDraw.Draw(out)
for kind, geo, col in emissive:
    if kind == "poly":
        d.polygon(geo, fill=col)
    elif kind == "pt":
        d.point(geo, fill=col)
    else:
        d.rectangle(geo, fill=col)

# vignette
o = np.asarray(out).astype(np.float32)
v = 1 - 0.55 * np.clip((((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) - 0.35, 0, 1)
o *= v[..., None]
out = Image.fromarray(np.clip(o, 0, 255).astype(np.uint8))

path = sys.argv[1] if len(sys.argv) > 1 else "Clock Tower.png"
out.resize((W * SCALE, H * SCALE), Image.NEAREST).save(path)
print("saved", path)
