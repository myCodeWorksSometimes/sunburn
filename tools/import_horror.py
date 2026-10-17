"""Pack inspected Gemini animation cells without inventing animation frames.
Usage: python tools/import_horror.py boss|sword|echo source-image
Original source is retained for attribution and re-registration.
"""
import sys,shutil
from pathlib import Path
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]
kind,source=sys.argv[1:]
cols,rows,fw,fh,height={"boss":(6,6,256,256,205),"sword":(8,4,155,110,102),"echo":(6,3,96,112,98)}[kind]
src=Image.open(source).convert('RGBA')
a=np.array(src); rgb=a[:,:,:3].astype(float)
green=(rgb[:,:,1]>65)&(rgb[:,:,1]>rgb[:,:,0]*1.35)&(rgb[:,:,1]>rgb[:,:,2]*1.35)
a[green,3]=0
a[:,:,1]=np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+12)
keyed=Image.fromarray(a)
cells=[]
for row in range(rows):
    for col in range(cols):
        ys=[0,211,420,src.height] if kind=='echo' else [round(i*src.height/rows) for i in range(rows+1)]
        cell=keyed.crop((round(col*src.width/cols),ys[row],round((col+1)*src.width/cols),ys[row+1]))
        bbox=cell.getbbox();cells.append(cell.crop(bbox) if bbox else None)
# All cells use one scale. Attack extension/crouching never rescale the actor.
largest=max(c.height for c in cells[:cols] if c)
scale=height/largest
out=Image.new('RGBA',(fw*cols,fh*rows))
for i,c in enumerate(cells):
    if c is None:continue
    cell_scale=([98,102,70][i//cols]/cells[(i//cols)*cols].height) if kind=='echo' else scale
    resized=c.resize((round(c.width*cell_scale),round(c.height*cell_scale)),Image.Resampling.NEAREST)
    if resized.width>fw or resized.height>fh:raise ValueError(f'{kind} frame {i} exceeds cell; inspect source')
    out.alpha_composite(resized,((i%cols)*fw+(fw-resized.width)//2,(i//cols)*fh+fh-resized.height))
dest=root/'public/art/production'/f'{kind}-motion.png';out.save(dest)
original=root/'art/production'/f'{kind}-motion-source.jpg';shutil.copyfile(source,original)
print(dest, out.size)
