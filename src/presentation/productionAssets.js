// Deterministic atlas packing; originals and generation prompts are retained.
export function prepareProductionAssets(scene) {
  function frame(source, key, col, row, cols, rows, padding = 2) {
    if (scene.textures.exists(key)) return key;
    const image = scene.textures.get(source).getSourceImage();
    const x = Math.round(col * image.width / cols), y = Math.round(row * image.height / rows);
    const w = Math.round((col + 1) * image.width / cols) - x, h = Math.round((row + 1) * image.height / rows) - y;
    const scratch = document.createElement('canvas'); scratch.width = w; scratch.height = h;
    const ctx = scratch.getContext('2d', { willReadFrequently: true }); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let l = w, r = 0, t = h, b = 0;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (data[(yy*w+xx)*4+3] > 48) { l=Math.min(l,xx); r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy); }
    l=Math.max(0,l-padding);t=Math.max(0,t-padding);r=Math.min(w-1,r+padding);b=Math.min(h-1,b+padding);
    const out = document.createElement('canvas'); out.width=r-l+1; out.height=b-t+1;
    out.getContext('2d').drawImage(scratch,l,t,out.width,out.height,0,0,out.width,out.height);
    scene.textures.addCanvas(key,out); return key;
  }
  if (scene.textures.exists('production-ui')) {
    ['panel','card','button','medallion','lantern','flame','heart','oil','map','compass','journal','door','cup','claw','time','mute'].forEach((name,i)=>frame('production-ui',`kit-${name}`,i%4,Math.floor(i/4),4,4));
  }
  if (scene.textures.exists('production-stall')) for (let c=0;c<2;c++) frame('production-stall',`stall-${c?'open':'closed'}`,c,0,2,1);
  if (scene.textures.exists('production-bosses')) for (let row=0;row<2;row++) for (let col=0;col<4;col++) frame('production-bosses',`${row?'braced':'fivehand'}-${col}`,col,row,4,2);
}

export function paintedBoss(scene, kind, x, floor, height) {
  if(kind==='braced'&&scene.textures.exists('boss-motion')){
    const sprite=scene.add.sprite(x,floor,'boss-motion',0).setOrigin(.5,1).setDepth(22);
    sprite.pose=()=>sprite;
    sprite.animateState=(state,elapsed)=>{
      const row={idle:0,windup:1,charge:2,summon:3,lash:3,stunned:4,recover:0,death:5}[state]??0;
      const speed=state==='charge'?75:state==='idle'?150:state==='death'?180:180;
      const f=state==='death'?Math.min(5,Math.floor(elapsed/speed)):Math.floor(elapsed/speed)%6;
      sprite.setFrame(row*6+f).setDisplaySize(256,256);return sprite;
    };
    return sprite;
  }
  const sprite=scene.add.sprite(x,floor,`${kind}-1`).setOrigin(.5,1).setDepth(22);
  sprite.pose=(index)=>{
    const key=`${kind}-${index}`;
    if (sprite.texture.key!==key) sprite.setTexture(key);
    sprite.setDisplaySize(height*sprite.frame.width/sprite.frame.height,height);
    return sprite;
  };
  return sprite.pose(1);
}
