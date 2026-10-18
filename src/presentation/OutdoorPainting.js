import {GROUND,YARD_GAP} from '../world/layout.js';

// Architectural islands end in open alleys, not in the middle of a roof. These
// crops retain complete buildings from the supplied art, at a consistent scale.
export const SCENERY_ISLANDS={
  lane:[['a1_lane',640,550,70,1,555],['a1_lane',640,550,900,1,555]],
  square:[['a1_square',380,145,70,1,545],['a1_square',540,750,650,1,545]],
  swings:[['a2_swings',0,535,70,1,535]],
  treehouse:[['a2_treehouse',0,525,850,1,545]],
  canal:[['a2_canal',0,530,950,1,535]],
};
export function sceneryProjection(r){
  if(r.id==='yard'){const scale=r.width/1290;return {x:r.x,y:GROUND-r.paintGround*scale,scale};}
  if(r.id==='camp')return {x:r.x-570,y:GROUND-545,scale:1};
  if(r.id==='square')return {x:r.x+110,y:GROUND-545,scale:1};
  const first=SCENERY_ISLANDS[r.id]?.[0];
  return first?{x:r.x+first[3]-first[1]*first[4],y:GROUND-first[5]*first[4],scale:first[4]}:{x:r.x,y:0,scale:1};
}
export const COURTYARD_REGISTRATION=[[0,-20],[535,515],[600,560],[720,680]];
export function courtyardY(y){
  const i=COURTYARD_REGISTRATION.findIndex(([from],i)=>i>0&&y<=from);
  const [a,b]=i<0?COURTYARD_REGISTRATION.slice(-2):COURTYARD_REGISTRATION.slice(i-1,i+1);
  return a[1]+(y-a[0])/(b[0]-a[0])*(b[1]-a[1]);
}
export function outdoorPainting(scene,r,state){
  const key=`outdoor-${r.id}-${state}`;if(scene.textures.exists(key))return key;
  const bleed=110,canvas=document.createElement('canvas');canvas.width=r.width+bleed*2;canvas.height=720;
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.translate(bleed,0);
  const source=art=>scene.textures.get(`bg_${art}_${state}`).getSourceImage();
  const island=(art,sx,sw,x,scale,floor)=>{
    const src=source(art),v=document.createElement('canvas');v.width=Math.ceil(sw*scale);v.height=720;
    const vc=v.getContext('2d');vc.imageSmoothingEnabled=false;
    vc.drawImage(src,sx,0,sw,src.height,0,GROUND-floor*scale,sw*scale,src.height*scale);
    // Only vegetation/open margins are feathered; no overlapping house halves.
    vc.globalCompositeOperation='destination-in';const g=vc.createLinearGradient(0,0,v.width,0);
    g.addColorStop(0,'transparent');g.addColorStop(Math.min(.1,22/v.width),'white');
    g.addColorStop(Math.max(.9,1-22/v.width),'white');g.addColorStop(1,'transparent');
    vc.fillStyle=g;vc.fillRect(0,0,v.width,720);
    if(art.startsWith('a2_')){
      // These source drawings crop foliage at their left edge. Give that
      // vegetation an irregular silhouette, safely before the intact house.
      const pixels=vc.getImageData(0,0,v.width,720),data=pixels.data;
      for(let y=0;y<720;y++){
        const edge=20+Math.sin(y*.031)*12+Math.sin(y*.113)*6;
        for(let xx=0;xx<48;xx++)data[(y*v.width+xx)*4+3]*=Math.max(0,Math.min(1,(xx-edge)/10));
      }
      vc.putImageData(pixels,0,0);
    }
    c.drawImage(v,x,0);
  };
  if(SCENERY_ISLANDS[r.id])for(const entry of SCENERY_ISLANDS[r.id])island(...entry);
  else if(r.id==='bridge'){
    // Complete refuge arch, then a complete house behind the foundry facade.
    island('a1_bridge',0,450,300,1.1,410);
    island('a1_lane',640,550,950,1,555);
    // The foreground painted bridge owns BOTH river banks. Do not append a
    // cropped right-hand house across the camp's boundary.
  }else if(r.id==='camp'){
    const src=source(r.art);c.drawImage(src,-570,GROUND-545);
    // Remove the baked bridge and its poles as a whole, not a rectangular hole
    // through the middle of architecture. The physical crossing paints its own.
    c.clearRect(300,0,r.width,720);
    c.globalCompositeOperation='destination-out';const g=c.createLinearGradient(260,0,300,0);
    g.addColorStop(0,'transparent');g.addColorStop(1,'white');c.fillStyle=g;c.fillRect(260,0,40,720);
    c.globalCompositeOperation='source-over';
  }else{
    const src=source(r.art),scale=r.width/src.width;
    c.drawImage(src,0,GROUND-r.paintGround*scale,src.width*scale,src.height*scale);
  }
  // One continuous foreground bank supplies the walking plane and cliff. Image
  // bottoms no longer butt together as unrelated rectangular cliff chunks.
  c.clearRect(-bleed,GROUND+8,canvas.width,720-GROUND);
  if(r.id==='yard')c.clearRect(YARD_GAP.x1-r.x,GROUND-3,YARD_GAP.x2-YARD_GAP.x1,30);
  scene.textures.addCanvas(key,canvas);return key;
}

// Courtyard art puts its floor at600, while its ledges use the common y−20
// registration. Compress only the lower wall; preserve every playable ledge.
export function courtyardPainting(scene,state){
  const key=`courtyard-floor-${state}`;if(scene.textures.exists(key))return key;
  const src=scene.textures.get(`bg_a3_courtyard_${state}`).getSourceImage();
  const canvas=document.createElement('canvas');canvas.width=1290;canvas.height=720;
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  for(let i=1;i<COURTYARD_REGISTRATION.length;i++){
    const [a,b]=COURTYARD_REGISTRATION.slice(i-1,i+1);
    c.drawImage(src,0,a[0],1290,b[0]-a[0],0,a[1],1290,b[1]-a[1]);
  }
  scene.textures.addCanvas(key,canvas);return key;
}
