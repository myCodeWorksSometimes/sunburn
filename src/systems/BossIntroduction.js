import Phaser from 'phaser';
import { menuText, UI } from '../presentation/ui.js';

export class BossIntroduction {
  constructor(scene){this.scene=scene;this.active=false;scene.events.once('shutdown',()=>this.finish(false));}
  play({id,name,subtitle,sprite,x,y,onComplete,onUpdate,onDispose,mode='boss',duration=3900}) {
    const s=this.scene;
    if(this.active || s.run.completedStory[`intro-${id}`])return false;
    this.active=true;this.elapsed=0;this.spec={id,name,subtitle,sprite,x,y,onComplete,onUpdate,onDispose,mode,duration};
    this.before={scrollX:s.cameras.main.scrollX,scrollY:s.cameras.main.scrollY,zoom:s.cameras.main.zoom,frozen:s.player.frozen,physicsPaused:s.physics.world.isPaused,clockPaused:s.time.paused,tweenScale:s.tweens.timeScale};
    s.physics.world.pause();
    s.time.paused=true;s.tweens.timeScale=0;
    s.player.cancelAction();s.player.setVelocity(0);s.player.frozen=true;
    s.captions.clear();if(mode==='boss')s.audio.bossCue(id==='five-hand'?'fivehand':id==='bell-warden'?'warden':'braced','intro');else s.audio.cue('memory-break');
    const people=new Set((s.npcs??[]).flatMap(n=>[n.sprite,n.label]));
    this.hidden=s.children.list.filter(o=>o.depth>=100||people.has(o)||(mode==='echo'&&(o===s.player||o===s.contactShadow))).map(o=>[o,o.visible]);
    for(const[o]of this.hidden)o.setVisible(false);
    this.top=s.add.rectangle(640,0,1280,75,0x05060a,.96).setOrigin(.5,0).setDepth(200);
    this.bottom=s.add.rectangle(640,720,1280,110,0x05060a,.96).setOrigin(.5,1).setDepth(200);
    this.title=menuText(s,640,641,name,35,UI.gold).setFontFamily(UI.title).setDepth(201);
    this.sub=menuText(s,640,682,subtitle,15,'#c5b9a6').setDepth(201);
    this.skip=menuText(s,1210,40,'Enter · skip',13,'#b0a38f').setOrigin(1,.5).setDepth(201);
    if(mode==='boss'){sprite.pose?.(0);sprite.setFlipX(false);}
    s.syncScreenCameras?.();return true;
  }
  update(delta) {
    if(!this.active)return;
    const s=this.scene,c=s.cameras.main,sp=this.spec;
    this.elapsed+=delta;
    if(Phaser.Input.Keyboard.JustDown(s.keys.next)){this.finish();return;}
    // 0.7s approach, 2.5s direct gaze, 0.7s return; all gameplay clocks stop.
    const t=this.elapsed,enter=Math.min(1,t/700),leave=Math.max(0,Math.min(1,(t-(sp.duration-700))/700));
    const ease=v=>v*v*(3-2*v),amount=ease(enter)*(1-ease(leave));
    c.setZoom(this.before.zoom+amount*(sp.mode==='echo'?.4:.7));
    c.scrollX=this.before.scrollX+(sp.x-640-this.before.scrollX)*amount;
    c.scrollY=this.before.scrollY+(sp.y-360-this.before.scrollY)*amount;
    if(sp.mode==='boss'){
      sp.sprite.pose?.(0);sp.sprite.setFlipX(false);
      sp.sprite.animateState?.('summon',Math.min(500,t));
    }
    sp.onUpdate?.(t);
    if(t>=sp.duration)this.finish();
  }
  finish(commit=true) {
    if(!this.active)return;
    const s=this.scene,sp=this.spec;this.active=false;
    if(!commit){
      // Scene plugins shut down in registration order: cameras and display
      // objects may already be gone. They own their destruction. Only restore
      // the persistent clock settings needed when this scene starts again.
      s.time.paused=this.before.clockPaused;s.tweens.timeScale=this.before.tweenScale;
      this.hidden=[];this.spec=null;return;
    }
    s.cameras.main.setZoom(this.before.zoom);s.cameras.main.scrollY=this.before.scrollY;
    s.cameras.main.scrollX=this.before.scrollX;
    for(const[o,visible]of this.hidden??[])if(o.active)o.setVisible(visible);
    for(const o of[this.top,this.bottom,this.title,this.sub,this.skip])o?.destroy();
    if(sp.mode==='boss'&&sp.sprite?.active)sp.sprite.pose?.(1);
    sp.onDispose?.();
    s.player.frozen=this.before.frozen;s.requireRelease=true;
    s.time.paused=this.before.clockPaused;s.tweens.timeScale=this.before.tweenScale;
    if(!this.before.physicsPaused)s.physics.world.resume();
    if(commit){s.run.completeStory(`intro-${sp.id}`);sp.onComplete?.();}
  }
}
