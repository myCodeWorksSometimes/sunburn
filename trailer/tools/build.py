"""Assemble the trailer: story cards, act cards, gameplay clips, end card, music."""
import os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = r"D:\vibecodinggamedevv"
BG = os.path.join(REPO, "public", "bg")
CLIPS = os.path.join(HERE, "clips")
WORK = os.path.join(HERE, "work")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "trailer.mp4")
os.makedirs(WORK, exist_ok=True)
shutil.copy(os.path.join(REPO, "public", "fonts", "PixelifySans.ttf"), os.path.join(WORK, "font.ttf"))
FPS = 30

def run(args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True, cwd=WORK)

def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\u2019").replace(",", "\\,")

def text(t, size, y, start=0.4, dur=None, color="0xF3E3C3"):
    fade = f"if(lt(t,{start}),0,if(lt(t,{start}+0.8),(t-{start})/0.8,1))"
    if dur:
        fade = f"if(lt(t,{start}),0,if(lt(t,{start}+0.8),(t-{start})/0.8,if(gt(t,{dur}-0.9),max(0,({dur}-t)/0.7),1)))"
    return (f"drawtext=fontfile=font.ttf:text='{esc(t)}':fontsize={size}:fontcolor={color}:x=(w-text_w)/2:y={y}"
            f":borderw=3:bordercolor=0x120E16:alpha='{fade}'")

def still(name, src, dur, lines, crop=None, dim=0.55, zoom=0.06, size=40):
    """A slowly pushing-in painting with fading caption lines."""
    frames = int(dur * FPS)
    c = f"crop={crop}," if crop else ""
    vf = (f"{c}scale=2560:1440,zoompan=z='1+{zoom}*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1280x720:fps={FPS},"
          f"eq=brightness={-0.35 * (1 - dim)}:saturation=0.95,"
          f"drawbox=x=0:y=500:w=1280:h=220:color=black@0.45:t=fill,")
    y = 560 if len(lines) == 1 else 540
    vf += ",".join(text(l, size, y + i * 56, 0.5 + i * 0.9, dur) for i, l in enumerate(lines))
    vf += f",fade=t=in:st=0:d=0.6,fade=t=out:st={dur - 0.6}:d=0.6,format=yuv420p"
    run(["-loop", "1", "-i", os.path.join(BG, src), "-vf", vf, "-t", str(dur), "-r", str(FPS), "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", f"{name}.mp4"])
    return f"{name}.mp4"

def card(name, lines, dur, sizes):
    vf = ",".join(text(l, s, f"(h/2)-{(len(lines) - 1) * 40 - i * 80}-text_h/2", 0.3 + i * 0.6, dur, c) for i, (l, s, c) in enumerate(zip(lines, sizes, ["0xF6D58E", "0xE9DCC4", "0xBFB2A0"])))
    vf += f",fade=t=in:st=0:d=0.4,fade=t=out:st={dur - 0.5}:d=0.5,format=yuv420p"
    run(["-f", "lavfi", "-i", f"color=c=0x0B090F:s=1280x720:r={FPS}", "-vf", vf, "-t", str(dur), "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", f"{name}.mp4"])
    return f"{name}.mp4"

def src_of(name):
    alt = os.path.join(HERE, "clips3", name + ".mp4")
    return alt if os.path.exists(alt) else os.path.join(CLIPS, name + ".mp4")

def clip(name, start, dur, caption=None):
    src = src_of(name)
    vf = f"trim=start={start}:duration={dur},setpts=PTS-STARTPTS,fps={FPS},fade=t=in:st=0:d=0.3,fade=t=out:st={dur - 0.3}:d=0.3"
    if caption:
        vf += "," + text(caption, 34, 74, 0.3, min(dur, 3.6), "0xF6D58E")
    vf += ",format=yuv420p"
    out = f"g_{name}_{start}.mp4"
    run(["-i", src, "-vf", vf, "-an", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", out])
    return out

def length(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True, cwd=WORK).stdout)

parts = []
# --- Story (about 32 s) ---
parts.append(still("s1", "cut_01_before.png", 5.5, ["Before the meteor,", "every afternoon was ordinary."], dim=1.0))
parts.append(still("s2", "cut_03_meteors.png", 5.0, ["Then the sky fell."], crop="iw*0.68:ih*0.68:0:0", zoom=0.10))
parts.append(still("s3", "bg_title_screen.png", 5.5, ["Corruption swallowed the village.", "The night never ended."], crop="iw*0.74:ih*0.74:0:ih*0.26"))
parts.append(still("s4", "bg_a2_swings_dark.png", 5.5, ["My little brother Eli was at the swings.", "He never came home."]))
parts.append(still("s5", "bg_a1_campfire_restored.png", 6.0, ["But fire remembers.", "Light it, and the world returns... for a moment."], dim=1.0))
parts.append(card("title", ["EMBERS OF BEFORE", "one night to bring him home"], 4.5, [86, 32]))

# --- Gameplay (about 2 minutes) ---
G = [
    ("act1", None), ("yard", 0.3, 8.5, "Fire brings back the world before"),
    ("lane", 0.3, 9.5, None), ("fivehand", 0.5, 20.0, "Face what the meteor made"), ("bridge", 0.3, 10.0, "Cross while the memory lasts"),
    ("act2", None), ("swing", 0.3, 12.0, "Ride a moment that's already gone"), ("treehouse", 0.3, 10.5, "Follow his trail"), ("canal", 0.5, 11.0, None),
    ("act3", None), ("knock", 3.0, 7.5, "Three knocks. Someone answers."), ("bells", 0.3, 12.5, "Ring the bells in remembered time"),
    ("mechanisms", 0.3, 8.5, None), ("warden", 0.3, 12.0, "Break the Bell Warden"), ("rescue", 0.3, 16.0, None),
]
ACTS = {"act1": ("ACT I", "THE RUINED VILLAGE"), "act2": ("ACT II", "THE PLAYGROUND"), "act3": ("ACT III", "THE CLOCK TOWER")}
gameplay = 0.0
for g in G:
    if g[1] is None:
        a, b = ACTS[g[0]]
        parts.append(card(g[0], [a, b], 2.2, [40, 54]))
        continue
    name, start, dur, cap = g
    src = src_of(name)
    if not os.path.exists(src):
        print("missing clip", name); continue
    avail = length(src) - start - 0.1
    dur = max(1.0, min(dur, avail))
    parts.append(clip(name, start, round(dur, 2), cap)); gameplay += dur

# --- End (about 9 s) ---
parts.append(card("end1", ["Find him", "before the last ember fades."], 4.0, [54, 40]))
parts.append(card("end2", ["EMBERS OF BEFORE", "A 2D side-scrolling adventure", "Made in Phaser for the jam - October 2026"], 5.5, [86, 30, 24]))

with open(os.path.join(WORK, "parts.txt"), "w") as f:
    f.writelines(f"file '{p}'\n" for p in parts)
run(["-f", "concat", "-safe", "0", "-i", "parts.txt", "-c", "copy", "video.mp4"])
total = length("video.mp4")

# --- Music: the game's CC0 soundscape, with the boss layer under the fights ---
A = os.path.join(REPO, "public", "audio")
run(["-stream_loop", "-1", "-i", os.path.join(A, "score.ogg"), "-stream_loop", "-1", "-i", os.path.join(A, "bossbed.ogg"),
     "-filter_complex",
     f"[0:a]atrim=0:{total},volume=1.0[a0];[1:a]atrim=0:{total},volume='if(between(t,{total*0.45},{total*0.62})+between(t,{total*0.78},{total*0.9}),0.8,0.0)':eval=frame[a1];"
     f"[a0][a1]amix=inputs=2:normalize=0,afade=t=in:d=2,afade=t=out:st={total-3}:d=3,loudnorm=I=-16:TP=-1.5[a]",
     "-map", "[a]", "-c:a", "aac", "-b:a", "192k", "music.m4a"])
run(["-i", "video.mp4", "-i", "music.m4a", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "copy", "-shortest", "-movflags", "+faststart", OUT])
print(f"total {total:.1f}s, gameplay {gameplay:.1f}s -> {OUT}")
