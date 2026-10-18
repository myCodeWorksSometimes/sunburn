"""Pack the inspected 18 Oct ChatGPT 6x6 Five-Hand sheet; no invented frames.
Usage: python tools/import_fivehand_motion.py downloaded.png
Row boundaries below belong to this source, not arbitrary model outputs.
"""
from pathlib import Path
from collections import deque
import sys,shutil
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1];source=Path(sys.argv[1])
im=Image.open(source).convert('RGBA');a=np.array(im);rgb=a[:,:,:3].astype(float)
key=(rgb[:,:,1]>65)&(rgb[:,:,1]>rgb[:,:,0]*1.35)&(rgb[:,:,1]>rgb[:,:,2]*1.35)
a[key,3]=0;a[:,:,1]=np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+10)
im=Image.fromarray(a);ys=[0,219,420,622,820,1040,1254];xs=[0,211,420,630,840,1048,1254]
# Attack hands extend beyond the nominal source cells. Separate connected
# silhouettes before cropping so the next cell never contains a severed claw.
mask=a[:,:,3]>0;labels=np.zeros(mask.shape,np.int32);parts=[];h,w=mask.shape
for y,x in zip(*np.where(mask)):
    if labels[y,x]:continue
    ident=len(parts)+1;queue=deque([(x,y)]);labels[y,x]=ident;xxs=[];yys=[]
    while queue:
        xx,yy=queue.popleft();xxs.append(xx);yys.append(yy)
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,1),(1,-1),(-1,-1)]:
            nx,ny=xx+dx,yy+dy
            if 0<=nx<w and 0<=ny<h and mask[ny,nx] and not labels[ny,nx]:labels[ny,nx]=ident;queue.append((nx,ny))
    parts.append((len(xxs),min(xxs),min(yys),max(xxs)+1,max(yys)+1,ident))
out=Image.new('RGBA',(384*6,256*6));scale=1.05
for row in range(6):
    bodies=sorted([p for p in parts if p[0]>12000 and ys[row]<(p[2]+p[4])/2<ys[row+1]],key=lambda p:(p[1]+p[3])/2) if row<5 else []
    if row<5 and len(bodies)!=6:raise ValueError(f'Expected six separate bodies in row {row}: {len(bodies)}')
    for col in range(6):
        if row<5:
            _,left,top,right,bottom,ident=bodies[col]
            piece=a[top:bottom,left:right].copy();piece[:,:,3]=np.where(labels[top:bottom,left:right]==ident,255,0)
            crop=Image.fromarray(piece)
            x=col*384+round(192+(left-(xs[col]+xs[col+1])/2)*scale)
            y=row*256+round(256+(top-ys[row+1])*scale)
        else:
            ex=[0,170,390,620,835,1030,1254]
            cell=im.crop((ex[col],ys[row],ex[col+1],ys[row+1]));crop=cell.crop(cell.getbbox())
            x=col*384+round((384-crop.width*scale)/2)
            y=row*256+round((256-crop.height*scale)/2)
        part=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.NEAREST)
        out.alpha_composite(part,(x,y))
out.save(root/'public/art/production/fivehand-motion.png')
shutil.copyfile(source,root/'art/production/fivehand-motion-source.png')
print('Packed 36 isolated reference-matched frames at 384x256, including six projectile frames.')
