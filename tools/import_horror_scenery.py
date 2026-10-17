"""Key inspected generated environment/parts art; retain source and pixel grid."""
from pathlib import Path
import sys,shutil
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
kind,source=sys.argv[1:]
src=Image.open(source).convert('RGBA');a=np.array(src);rgb=a[:,:,:3].astype(float)
key=(rgb[:,:,1]>65)&(rgb[:,:,1]>rgb[:,:,0]*1.35)&(rgb[:,:,1]>rgb[:,:,2]*1.35)
a[key,3]=0;a[:,:,1]=np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+10)
image=Image.fromarray(a)
if kind=='foundry':
    edge=np.minimum(np.minimum(np.arange(src.width)/64,(src.width-1-np.arange(src.width))/64),1).clip(0,1)
    a[:,:,3]=(a[:,:,3]*edge[None,:]).astype(np.uint8);image=Image.fromarray(a)
if kind=='machinery':
    boxes=[(0,0,315,306),(320,0,575,300),(590,0,840,300),(870,0,980,300),(0,310,340,572),(370,310,470,572),(490,310,710,572),(715,360,1024,570)]
    names=['gear-large','gear-small','lever-base','lever-handle','brake-base','brake-handle','machine-plate','supply-ledge']
    for name,box in zip(names,boxes):
        part=image.crop(box);part=part.crop(part.getbbox());part.save(root/'public/art/production'/f'{name}.png')
if kind=='ui-frame':
    image=image.crop(image.getbbox()).resize((320,96),Image.Resampling.NEAREST)
if kind=='stall-ruined':image=image.crop(image.getbbox())
image.save(root/'public/art/production'/f'{kind}.png')
suffix='.png' if Path(source).suffix.lower()=='.png' else '.jpg'
shutil.copyfile(source,root/'art/production'/f'{kind}-source{suffix}')
print(kind,image.size)
