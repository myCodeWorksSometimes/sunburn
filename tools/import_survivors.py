"""Extract the Gemini survivor sheet; preserve original and registered foot lines.
Run with the project's Python/Pillow runtime. No generative edits are performed.
"""
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / 'art/production/survivors-source.jpg').convert('RGBA')
a = np.array(source)
r, g, b = (a[:, :, i].astype(int) for i in range(3))
key = (g > 110) & (g > r + 40) & (g > b + 40)
a[key, 3] = 0
# Remove JPEG green spill at the silhouette without blurring the pixel edges.
a[:, :, 1] = np.where(g > np.maximum(r,b)+10, np.minimum(g,np.maximum(r,b)), g)
source = Image.fromarray(a)
for name, (top,bottom), height in zip(['mara','tomas','nia'],[(0,365),(365,735),(735,1024)],[98,102,70]):
    sheet = Image.new('RGBA',(96*4,112))
    for col in range(4):
        frame = source.crop((col*256,top,(col+1)*256,bottom))
        box = frame.getbbox()
        frame = frame.crop(box)
        frame = frame.resize((round(frame.width*height/frame.height),height),Image.Resampling.NEAREST)
        sheet.alpha_composite(frame,(col*96+(96-frame.width)//2,112-height))
    sheet.save(ROOT / f'public/art/production/npc-{name}.png')
