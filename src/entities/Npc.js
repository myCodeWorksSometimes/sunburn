import { FONT } from '../systems/Captions.js';
import { makeEchoDissolution,ECHO_FAREWELL_MS } from '../systems/EchoDissolution.js';

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
    if(on){this.collapseTween?.stop();this.dissolution?.destroy();this.dissolution=null;this.echoVisible=true;this.setVisible(true);this.sprite.setAlpha(.9);return;}
    if(this.echoVisible){
      this.echoVisible=false;
      const s=this.scene;
      if(s.textures.exists('echo-motion')){
        const effect=makeEchoDissolution(s,this);this.dissolution=effect;
        const dispose=()=>{effect.destroy();if(this.dissolution===effect)this.dissolution=null;this.setVisible(false);};
        const natural=s.memory.phase==='fading'||s.memory.lastEndReason==='expired';
        const nearby=Math.abs(s.player.x-this.x)<500&&Math.abs(s.player.feet-this.baseY)<45
          &&this.x>s.cameras.main.scrollX+70&&this.x<s.cameras.main.scrollX+1210;
        const inFight=s.fiveHand&&!['waiting','defeated'].includes(s.fiveHand.state);
        const cinematic=this.who==='mara'&&natural&&nearby&&!inFight&&!s.dead&&!s.leaving&&!s.player.frozen
          &&s.cinematic.play({id:'mara-farewell',name:'A MEMORY, CARRIED AWAY',subtitle:'Only the wind leaves the stall.',sprite:this.sprite,x:this.x,y:this.baseY-55,
            mode:'echo',duration:ECHO_FAREWELL_MS,onUpdate:ms=>effect.update(ms),onDispose:dispose});
        if(!cinematic){
          const clock={ms:0};this.collapseTween=s.tweens.add({targets:clock,ms:ECHO_FAREWELL_MS,duration:ECHO_FAREWELL_MS,onUpdate:()=>effect.update(clock.ms),onComplete:dispose});
        }
        effect.update(0);
      }
      if(!s.cinematic.active)s.audio.cue('memory-break');
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
