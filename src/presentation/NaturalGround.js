// A photographed-in-the-painting cobbled walking plane, with irregular edges.
// This is separate from the building painting so its contact line is invariant.
export const GROUND_SAMPLES={path:[500,535,460,65],bank:[800,570,200,130]};
export function naturalGround(scene,x1,x2,y,regionId) {
  const objects=[];
  for(const state of ['dark','restored']) {
    const key=`path-${state}`;
    if(!scene.textures.exists(key)) {
      const src=scene.textures.get(`bg_a1_lane_${state}`).getSourceImage();
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
      const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
      // The old x0 sample included a transparent cliff at its left edge. That
      // hole repeated every512px, even though the floor collider was solid.
      c.drawImage(src,...GROUND_SAMPLES.bank,0,0,512,160);
      c.drawImage(src,...GROUND_SAMPLES.path,0,0,512,65);
      c.globalCompositeOperation='destination-in';c.beginPath();
      c.moveTo(0,0);for(let x=0;x<=512;x+=8)c.lineTo(x,1+Math.sin(x*.47));
      c.lineTo(512,140);for(let x=512;x>=0;x-=13)c.lineTo(x,141+Math.sin(x*.13)*13);c.lineTo(0,141);c.closePath();c.fill();
      c.globalCompositeOperation='destination-out';const fade=c.createLinearGradient(0,100,0,160);
      fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=fade;c.fillRect(0,0,512,160);
      const loop=document.createElement('canvas');loop.width=1024;loop.height=160;
      const lc=loop.getContext('2d');lc.drawImage(canvas,0,0);lc.translate(1024,0);lc.scale(-1,1);lc.drawImage(canvas,0,0);
      scene.textures.addCanvas(key,loop);
    }
    const image=scene.add.tileSprite(x1,y-2,x2-x1,160,key).setOrigin(0).setDepth(10).setAlpha(state==='dark'?1:0);
    image.tilePositionX=x1%1024;objects.push(image);
    if(state==='restored')scene.regionVisuals.get(regionId)?.push(image);
  }
  const block=scene.add.container(0,0,objects).setDepth(10),edge=scene.add.container(0,0).setDepth(11);
  return {block,edge};
}

export function supplyLedge(scene,x1,x2,y) {
  const block=scene.add.container(x1,y).setDepth(10),edge=scene.add.container(x1,y).setDepth(11);
  if(scene.textures.exists('supply-ledge')){
    block.add(scene.add.image(0,0,'supply-ledge').setOrigin(0).setDisplaySize(x2-x1,76));return {block,edge};
  }
  // Sample the stall's actual painted wooden beam, not a vector X-box.
  const key='painted-supply-wood';
  if(!scene.textures.exists(key)) {
    const src=scene.textures.get('production-stall').getSourceImage(),c=document.createElement('canvas');c.width=180;c.height=76;
    c.getContext('2d').drawImage(src,100,240,570,70,0,0,180,76);scene.textures.addCanvas(key,c);
  }
  block.add(scene.add.tileSprite(0,0,x2-x1,76,key).setOrigin(0));
  const g=scene.add.graphics();g.lineStyle(4,0x292526).lineBetween(8,2,8,73).lineBetween(x2-x1-8,2,x2-x1-8,73);g.lineStyle(2,0x9d8861).lineBetween(0,1,x2-x1,1);block.add(g);
  return {block,edge};
}

// Blend only paving at the outdoor/tower threshold. Buildings never dissolve
// into each other, and the physical walking line remains exactly560 throughout.
export function courtyardThreshold(scene){
  const x=13520,w=200;
  for(const state of ['dark','restored']){
    const key=`court-threshold-${state}`;
    if(!scene.textures.exists(key)){
      const src=scene.textures.get(`path-${state}`).getSourceImage();
      const c=document.createElement('canvas');c.width=w;c.height=160;
      const ctx=c.getContext('2d');ctx.drawImage(src,-(x%1024),0);ctx.drawImage(src,1024-(x%1024),0);
      ctx.globalCompositeOperation='destination-in';const g=ctx.createLinearGradient(60,0,w,0);
      g.addColorStop(0,'white');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,w,160);scene.textures.addCanvas(key,c);
    }
    const image=scene.add.image(x,558,key).setOrigin(0).setDepth(11).setAlpha(state==='dark'?1:0);
    if(state==='restored')scene.regionVisuals.get('canal').push(image);
  }
}
