// A photographed-in-the-painting cobbled walking plane, with irregular edges.
// This is separate from the building painting so its contact line is invariant.
export function naturalGround(scene,x1,x2,y,regionId) {
  const objects=[];
  for(const state of ['dark','restored']) {
    const key=`path-${state}`;
    if(!scene.textures.exists(key)) {
      const src=scene.textures.get(`bg_a1_lane_${state}`).getSourceImage();
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=105;
      const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
      c.drawImage(src,0,540,620,95,0,0,512,105);
      c.globalCompositeOperation='destination-in';c.beginPath();
      c.moveTo(0,5);for(let x=0;x<=512;x+=8)c.lineTo(x,3+Math.sin(x*.47)*2);
      c.lineTo(512,78);for(let x=512;x>=0;x-=13)c.lineTo(x,83+Math.sin(x*.13)*13);c.closePath();c.fill();
      c.globalCompositeOperation='destination-out';const fade=c.createLinearGradient(0,42,0,105);
      fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=fade;c.fillRect(0,0,512,105);
      scene.textures.addCanvas(key,canvas);
    }
    const image=scene.add.tileSprite(x1,y-4,x2-x1,105,key).setOrigin(0).setDepth(10).setAlpha(state==='dark'?1:0);
    image.tilePositionX=x1%512;objects.push(image);
    if(state==='restored')scene.regionVisuals.get(regionId)?.push(image);
  }
  const block=scene.add.container(0,0,objects).setDepth(10),edge=scene.add.container(0,0).setDepth(11);
  return {block,edge};
}

export function supplyLedge(scene,x1,x2,y) {
  const block=scene.add.container(x1,y).setDepth(10),edge=scene.add.container(x1,y).setDepth(11);
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
