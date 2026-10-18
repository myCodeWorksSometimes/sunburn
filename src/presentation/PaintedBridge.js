// Reuse the village painting's timber, rope, river and masonry. Register each
// column's walking line to the collider rather than floating Rowan above a sag.
export function paintedBridge(scene,x1,x2,y,regionId){
  const key='painted-walkway-registered';
  if(!scene.textures.exists(key)){
    const src=scene.textures.get('bg_a1_bridge_restored').getSourceImage();
    const canvas=document.createElement('canvas');canvas.width=660;canvas.height=410;
    const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
    for(let x=340;x<1000;x+=2){
      const t=Math.max(0,Math.min(1,(x-415)/515));
      const walk=420+27*Math.sin(Math.PI*t);
      c.drawImage(src,x,walk-130,2,410,x-340,0,2,410);
    }
    // Cut out the distant aqueduct/sky ABOVE the deck. Only the actual brown
    // ropes, posts and lanterns belong in the foreground; a rectangle of the
    // source painting here would duplicate the skyline at a different scale.
    const pixels=c.getImageData(0,0,660,130),data=pixels.data;
    for(let x=0;x<660;x++)for(let y=0;y<130;y++){
      const sx=x+340,i=(y*660+x)*4,r=data[i],g=data[i+1],b=data[i+2];
      const post=[407,435,895,935].some(p=>Math.abs(sx-p)<10)
        ||(y>56&&[350,550,650,730,800,980].some(p=>Math.abs(sx-p)<5));
      const rope=(y>65&&y<96)||(y>100&&y<124);
      const timber=(r>g*1.12&&r>b*1.2)||(r<90&&g<80&&b<80&&r>=g*.9);
      if((!post&&!rope)||!timber)data[i+3]=0;
    }
    c.putImageData(pixels,0,0);
    c.globalCompositeOperation='destination-in';
    const fade=c.createLinearGradient(0,0,660,0);
    fade.addColorStop(0,'transparent');fade.addColorStop(.075,'white');
    fade.addColorStop(.925,'white');fade.addColorStop(1,'transparent');
    c.fillStyle=fade;c.fillRect(0,0,660,410);
    const bottom=c.createLinearGradient(0,290,0,410);
    bottom.addColorStop(0,'white');bottom.addColorStop(1,'transparent');
    // destination-in must cover the whole canvas; a bottom-only draw erases
    // the rope/deck above it as pixels outside the source become transparent.
    c.fillStyle=bottom;c.fillRect(0,0,660,410);
    scene.textures.addCanvas(key,canvas);
  }
  const scale=(x2-x1)/515;
  const block=scene.add.container(x1-75*scale,y-130*scale).setDepth(10);
  const dark=scene.add.image(0,0,key).setOrigin(0).setScale(scale).setTint(0x646477);
  const past=scene.add.image(0,0,key).setOrigin(0).setScale(scale).setTint(0xbab0a3).setAlpha(0);
  block.add([dark,past]);
  scene.regionVisuals.get(regionId==='swing-return'?'swings':regionId)?.push(past);
  const edge=scene.add.container(0,0).setDepth(11);
  return {block,edge};
}
