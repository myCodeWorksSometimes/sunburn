import { FONT } from '../systems/Captions.js';

// Registered pixel-art survivors, with distinct civilian silhouettes.
const LOOKS = {
  mara: { texture: 'npc-mara', label: 'Mara', height: 98 },
  tomas: { texture: 'npc-tomas', label: 'Tomas', height: 102 },
  nia: { texture: 'npc-nia', label: 'Nia', height: 70 },
};

// A living survivor: stands on the ground, faces Rowan, and can walk off-screen.
export class Npc {
  constructor(scene, who, x, y, { visible = true } = {}) {
    const look = LOOKS[who];
    this.scene = scene; this.who = who; this.baseY = y; this.visibleHeight=look.height;
    this.homeX=x;this.activity=who==='nia'?1700:who==='tomas'?3500:0;this.echoVisible=false;
    this.sprite = scene.add.sprite(x, y, look.texture, 0).setOrigin(0.5, 1).setDepth(19);
    if(!scene.anims.exists(`${look.texture}-walk`)) scene.anims.create({key:`${look.texture}-walk`,frames:scene.anims.generateFrameNumbers(look.texture,{frames:[1,2]}),frameRate:5,repeat:-1});
    this.label = scene.add.text(x, y - this.visibleHeight - 12, look.label, {
      fontFamily: FONT, fontSize: '14px', color: '#e8d6b4', stroke: '#11101b', strokeThickness: 2, resolution: 2,
    }).setOrigin(0.5, 1).setDepth(24);
    this.walking = null;
    this.setVisible(visible);
  }

  get x() { return this.sprite.x; }

  setVisible(on) {
    this.sprite.setVisible(on); this.label.setVisible(on);
    return this;
  }

  get visible() { return this.sprite.visible; }

  updateEcho(on,delta) {
    if(on){this.echoVisible=true;this.setVisible(true);this.sprite.setAlpha(.9);return;}
    if(this.echoVisible){
      this.echoVisible=false;
      const s=this.scene;
      if(s.textures.exists('echo-motion')){
        const row={mara:0,tomas:1,nia:2}[this.who];
        const bones=s.add.sprite(this.x,this.baseY,'echo-motion',row*6).setOrigin(.5,1).setDepth(23);
        const collapse={t:0};s.tweens.add({targets:collapse,t:5,duration:1100,onUpdate:()=>bones.setFrame(row*6+Math.floor(collapse.t)),onComplete:()=>bones.destroy()});
      }
      const ash=s.add.particles(this.x,this.baseY-this.visibleHeight*.5,'mote',{lifespan:1400,speedX:{min:25,max:80},speedY:{min:-35,max:5},scale:{start:.17,end:0},alpha:{start:.8,end:0},tint:[0xbcb4a7,0x5b5760],frequency:-1}).setDepth(26);
      ash.explode(28);s.time.delayedCall(1500,()=>ash.destroy());s.audio.cue('memory-break');
    }
    this.setVisible(false);
  }

  // Walks to x at a steady pace, then optionally hides (leaving the scene).
  walkTo(x, { hide = false, speed = 140 } = {}) {
    this.walking = { x, hide, speed };
  }

  tick(delta, player) {
    if (!this.visible) return;
    const s = this.sprite;
    this.activity+=delta;
    if (this.walking) {
      s.play(`npc-${this.who}-walk`,true);
      const dx = this.walking.x - s.x, step = this.walking.speed * delta / 1000;
      s.setFlipX(dx < 0);
      if (Math.abs(dx) <= step) {
        s.x = this.walking.x;
        if (this.walking.hide) this.setVisible(false);
        this.walking = null;
      } else s.x += Math.sign(dx) * step;
    } else {
      s.anims.stop();s.setFrame(Math.floor(this.activity/1800)%4===2?3:0);
      if(player&&Math.abs(player.x-s.x)<260)s.setFlipX(player.x<s.x);
      // Grounded, short civilian activity loops. Never bob their feet in air.
      if(!this.scene.refuge?.escort&&this.activity>8500){
        this.activity=0;this.walkTo(this.homeX+(this.who==='nia'?-22:26),{speed:30});
      }else if(!this.scene.refuge?.escort&&this.activity>4000&&Math.abs(s.x-this.homeX)>5)this.walkTo(this.homeX,{speed:30});
    }
    s.y = this.baseY;
    this.label.setPosition(s.x, s.y - this.visibleHeight - 12);
  }
}
