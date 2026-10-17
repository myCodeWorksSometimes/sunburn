// Phaser4 WebGL masks: a world-space soft disc, shared by restored artwork.
export const fieldRadius = fire => fire?.radius ?? (fire?.regionId==='home'?470:720);
export function fieldContains(fire, alpha, x, y, inset=35) {
  if (!fire || alpha<=0) return false;
  const radius=fieldRadius(fire)*Math.min(1,alpha);
  return Math.hypot(x-fire.x,y-(fire.floor-45)) <= Math.max(0,radius-inset);
}
export class RestorationField {
  constructor(scene) {
    this.scene=scene; this.targets=new Set(); this.radius=0;
    const key='memory-soft-disc';
    if (!scene.textures.exists(key)) {
      const tex=scene.textures.createCanvas(key,256,256),c=tex.getContext();
      const g=c.createRadialGradient(128,128,0,128,128,128);
      g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.78,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g;c.fillRect(0,0,256,256);tex.refresh();
    }
    this.mask=scene.make.image({key,x:0,y:0,add:false}).setScale(.001);
    scene.events.once('shutdown',()=>this.mask.destroy());
  }
  attach(object) {
    if (!object || !object.enableFilters || this.targets.has(object)) return;
    object.enableFilters();
    object.filters.external.addMask(this.mask,false,this.scene.cameras.main);
    this.targets.add(object);
  }
  update(fire,alpha) {
    this.radius=fire?fieldRadius(fire)*alpha:0;
    if(fire)this.mask.setPosition(fire.x,fire.floor-45);
    this.mask.setDisplaySize(Math.max(.01,this.radius*2),Math.max(.01,this.radius*2));
    const opacity=Math.min(1,alpha*3);
    for(const list of this.scene.regionVisuals.values()) for(const o of list) {
      this.attach(o);o.setAlpha(opacity);
    }
    for(const {growth}of this.scene.terrainLife){this.attach(growth);growth.setAlpha(opacity);}
    const backdrop=this.scene.backdrop;
    if(backdrop)for(const o of [backdrop.skyPast,backdrop.skylinePast]){this.attach(o);o.setAlpha(opacity);}
    this.scene.lighting.restoredAreas=fire&&alpha>0?[{x:fire.x,y:fire.floor-45,radius:this.radius,alpha:opacity}]:[];
  }
}
