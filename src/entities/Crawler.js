import Phaser from 'phaser';

// Deliberate enemy timing; the brother is never represented by this class.
export class Crawler extends Phaser.GameObjects.Sprite {
  constructor(scene, { id, x, floor, minX, maxX, regionId, dormant = false, kind = 'crawler' }) {
    super(scene, x, floor, 'shadow_idle');
    scene.add.existing(this);
    Object.assign(this, { id, floor, minX, maxX, regionId, dormant, kind });
    this.homeX = x; this.alive = true; this.state = 'idle'; this.elapsed = 0;
    this.maxHealth = kind === 'warden' ? 4 : 2;
    this.health = this.maxHealth; this.restorationImmune = kind === 'warden';
    this.feral = ['lane','camp','foundry'].includes(regionId);
    this.setOrigin(0.5, 1).setScale(kind === 'warden' ? 1.2 : kind === 'pouncer' ? .6 : .7).setDepth(22).play('shadow-idle');
    this.tell = scene.add.image(x, floor - 110, 'ui_eye').setDisplaySize(35, 29).setTint(0xffd39a).setDepth(26).setVisible(false);
    this.setVisible(!dormant || kind === 'warden');
    if(this.feral){this.anims.stop();this.setTexture('boss-motion',0).setScale(.46);}
  }

  animateFeral() {
    if(!this.feral)return;
    const row={idle:0,pursuit:2,windup:1,attack:2,recovery:0,staggered:4}[this.state]??0;
    this.anims.stop();this.setTexture('boss-motion',row*6+Math.floor(this.elapsed/(this.state==='attack'?60:this.state==='pursuit'?85:150))%6);
  }

  wake() { this.dormant = false; this.setVisible(true); }

  resetEncounter() {
    if (!this.alive) return;
    this.x = this.homeX; this.y = this.floor; this.state = 'idle'; this.elapsed = 0;
    this.clearTint(); this.tell.setVisible(false); this.play('shadow-idle');
    this.health = this.maxHealth;
    this.animateFeral();
  }

  tick(delta) {
    if (!this.alive || this.dormant) return;
    const scene = this.scene, p = scene.player;
    if (scene.dead || scene.leaving || scene.transferRemaining != null || scene.run.rescuedEli) return;
    if (!this.feral && this.kind === 'crawler' && p.x > this.maxX + 100) { this.disperse(); return; }
    const camera = scene.cameras.main;
    if (this.x < camera.scrollX + 35 || this.x > camera.scrollX + 1245) return;
    if(this.kind==='warden'&&!scene.run.completedStory['intro-bell-warden']){
      if(scene.cinematic.play({id:'bell-warden',name:'THE BELL WARDEN',subtitle:'The last thing between the brothers.',sprite:this,x:this.x,y:this.floor-70}))return;
    }
    this.tell.setPosition(this.x, this.floor - 110);
    const sameLevel = Math.abs(p.feet - this.floor) < 60;
    const dx = p.x - this.x;
    const fast = this.kind === 'warden' && this.health <= 2;
    const windup = this.feral ? 420 : this.kind === 'pouncer' ? 800 : this.kind === 'warden' ? fast ? 650 : 950 : 650;
    this.elapsed += delta;
    if(this.feral&&['pursuit','attack'].includes(this.state)){
      this.footClock=(this.footClock??0)+delta;
      if(this.footClock>300){this.footClock=0;scene.audio.playEffect('step-wet',.16*Math.max(0,1-Math.abs(dx)/600));}
    }
    if (this.state === 'staggered') {
      if (this.elapsed > 650) { this.state = 'recovery'; this.elapsed = 0; this.clearTint(); }
      this.animateFeral();
      return;
    }
    if(this.feral && this.state==='idle' && sameLevel && Math.abs(dx)<580 && !scene.isSafe(p.x,p.feet)) {
      this.state='pursuit';this.elapsed=0;this.play('shadow-move');scene.audio.cue('stalk');
    } else if(this.state==='pursuit') {
      if(!sameLevel||scene.isSafe(p.x,p.feet)||Math.abs(dx)>650){this.state='recovery';this.elapsed=0;this.play('shadow-idle');}
      else if(Math.abs(dx)>155) {this.x=Phaser.Math.Clamp(this.x+Math.sign(dx)*245*delta/1000,this.minX,this.maxX);this.setFlipX(dx<0);}
      else {this.state='windup';this.elapsed=0;this.attackDirection=Math.sign(dx)||1;this.tell.setVisible(true);this.setTint(0x8e6b97);scene.audio.cue('snarl');}
    } else if (this.state === 'idle' && sameLevel && Math.abs(dx) < 350 && !scene.isSafe(p.x, p.feet)) {
      this.state = 'windup'; this.elapsed = 0; this.tell.setVisible(true);
      this.attackDirection = Math.sign(dx) || 1;
      this.setTint(0xceb0e7); this.setFlipX(dx < 0);
      if(this.kind==='warden')scene.audio.bossCue('warden','windup');else scene.audio.cue('notice');
    } else if (this.state === 'windup' && this.elapsed > windup) {
      this.state = 'attack'; this.elapsed = 0; this.tell.setVisible(false); this.clearTint(); this.play('shadow-move');
      if(this.feral)scene.audio.cue('lunge');
      if(this.kind==='warden')scene.audio.bossCue('warden','attack');
    } else if (this.state === 'attack') {
      const direction = this.feral ? this.attackDirection : this.kind === 'crawler' ? Math.sign(dx) : this.attackDirection;
      const speed = this.feral ? 440 : this.kind === 'pouncer' ? 330 : this.kind === 'warden' ? fast ? 280 : 210 : 135;
      const step = direction * speed * delta / 1000;
      const nextX = Phaser.Math.Clamp(this.x + step, this.minX, this.maxX);
      if (!scene.isSafe(nextX, this.floor)) this.x = nextX;
      this.setFlipX(direction < 0);
      if (this.elapsed > (this.feral ? 450 : this.kind === 'crawler' ? 1500 : 650) || !sameLevel || scene.isSafe(p.x, p.feet)) {
        this.state = 'recovery'; this.elapsed = 0; this.play('shadow-idle');
      }
    } else if (this.state === 'recovery' && this.elapsed > (this.feral?650:800)) {
      this.state = 'idle'; this.elapsed = 0;
    }
    this.animateFeral();
  }

  touches(player) {
    return this.alive && !this.dormant && this.state === 'attack' && Math.abs(player.x - this.x) < (this.kind === 'warden' ? 55 : 32) && Math.abs(player.feet - this.floor) < 65;
  }

  disperse() {
    if (!this.alive) return;
    this.alive = false; this.state = 'dispersing'; this.tell.setVisible(false);
    this.scene.run.clearEncounter(this.id);
    if(this.kind==='warden')this.scene.audio.bossCue('warden','death');else this.scene.audio.cue('monster-death');
    if(!this.feral)this.play('shadow-dissolve');
    else {this.anims.stop();const dying={f:0};this.scene.tweens.add({targets:dying,f:5,duration:500,onUpdate:()=>this.active&&this.setTexture('boss-motion',30+Math.floor(dying.f))});}
    const dissolve = this.scene.add.sprite(this.x, this.floor - 25, 'fx_dissolve').setScale(.65).setDepth(28).play('fx-dissolve');
    dissolve.once('animationcomplete', () => dissolve.destroy());
    this.scene.tweens.add({ targets: this, alpha: 0, duration: 550, onComplete: () => this.destroy() });
  }

  hit(direction) {
    if (this.kind === 'warden' && this.scene.run.relayCount < 3) { this.scene.notice('Ring all three bells to break the Warden’s wards.'); return false; }
    if (!this.alive || this.dormant) return false;
    if(this.kind==='warden')this.scene.audio.bossCue('warden','hurt');else this.scene.audio.cue('monster-hit');
    this.health--;
    if(this.kind==='warden'&&this.health===2)this.scene.audio.bossCue('warden','enrage');
    if (this.health <= 0) this.disperse();
    else {
      this.state = 'staggered'; this.elapsed = 0; this.tell.setVisible(false);
      this.x = Phaser.Math.Clamp(this.x + direction * 30, this.minX, this.maxX);
      this.setTint(0xffb276); this.play('shadow-hurt');
    }
    return true;
  }

  destroy(fromScene) { this.tell?.destroy(); super.destroy(fromScene); }
}
