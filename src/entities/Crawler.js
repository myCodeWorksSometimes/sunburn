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
    this.setOrigin(0.5, 1).setScale(kind === 'warden' ? 1.2 : kind === 'pouncer' ? .6 : .7).setDepth(22).play('shadow-idle');
    this.tell = scene.add.image(x, floor - 110, 'ui_eye').setDisplaySize(35, 29).setTint(0xffd39a).setDepth(26).setVisible(false);
    this.setVisible(!dormant || kind === 'warden');
  }

  wake() { this.dormant = false; this.setVisible(true); }

  resetEncounter() {
    if (!this.alive) return;
    this.x = this.homeX; this.y = this.floor; this.state = 'idle'; this.elapsed = 0;
    this.clearTint(); this.tell.setVisible(false); this.play('shadow-idle');
    this.health = this.maxHealth;
  }

  tick(delta) {
    if (!this.alive || this.dormant) return;
    const scene = this.scene, p = scene.player;
    if (scene.dead || scene.leaving || scene.transferRemaining != null || scene.run.rescuedEli) return;
    if (this.kind === 'crawler' && p.x > this.maxX + 100) { this.disperse(); return; }
    const camera = scene.cameras.main;
    if (this.x < camera.scrollX + 35 || this.x > camera.scrollX + 1245) return;
    this.tell.setPosition(this.x, this.floor - 110);
    const sameLevel = Math.abs(p.feet - this.floor) < 60;
    const dx = p.x - this.x;
    const fast = this.kind === 'warden' && this.health <= 2;
    const windup = this.kind === 'pouncer' ? 800 : this.kind === 'warden' ? fast ? 650 : 950 : 650;
    this.elapsed += delta;
    if (this.state === 'staggered') {
      if (this.elapsed > 650) { this.state = 'recovery'; this.elapsed = 0; this.clearTint(); }
      return;
    }
    if (this.state === 'idle' && sameLevel && Math.abs(dx) < 350 && !scene.isSafe(p.x, p.feet)) {
      this.state = 'windup'; this.elapsed = 0; this.tell.setVisible(true);
      this.attackDirection = Math.sign(dx) || 1;
      this.setTint(0xceb0e7); this.setFlipX(dx < 0); scene.audio.cue('notice');
    } else if (this.state === 'windup' && this.elapsed > windup) {
      this.state = 'attack'; this.elapsed = 0; this.tell.setVisible(false); this.clearTint(); this.play('shadow-move');
    } else if (this.state === 'attack') {
      const direction = this.kind === 'crawler' ? Math.sign(dx) : this.attackDirection;
      const speed = this.kind === 'pouncer' ? 330 : this.kind === 'warden' ? fast ? 280 : 210 : 135;
      const step = direction * speed * delta / 1000;
      const nextX = Phaser.Math.Clamp(this.x + step, this.minX, this.maxX);
      if (!scene.isSafe(nextX, this.floor)) this.x = nextX;
      this.setFlipX(direction < 0);
      if (this.elapsed > (this.kind === 'crawler' ? 1500 : 650) || !sameLevel || scene.isSafe(p.x, p.feet)) {
        this.state = 'recovery'; this.elapsed = 0; this.play('shadow-idle');
      }
    } else if (this.state === 'recovery' && this.elapsed > 800) {
      this.state = 'idle'; this.elapsed = 0;
    }
  }

  touches(player) {
    return this.alive && !this.dormant && this.state === 'attack' && Math.abs(player.x - this.x) < (this.kind === 'warden' ? 55 : 32) && Math.abs(player.feet - this.floor) < 65;
  }

  disperse() {
    if (!this.alive) return;
    this.alive = false; this.state = 'dispersing'; this.tell.setVisible(false);
    this.scene.run.clearEncounter(this.id);
    this.scene.audio.cue('monster-death');
    this.play('shadow-dissolve');
    const dissolve = this.scene.add.sprite(this.x, this.floor - 25, 'fx_dissolve').setScale(.65).setDepth(28).play('fx-dissolve');
    dissolve.once('animationcomplete', () => dissolve.destroy());
    this.scene.tweens.add({ targets: this, alpha: 0, duration: 550, onComplete: () => this.destroy() });
  }

  hit(direction) {
    if (this.kind === 'warden' && this.scene.run.relayCount < 3) { this.scene.notice('Ring all three bells to break the Warden’s wards.'); return false; }
    if (!this.alive || this.dormant) return false;
    this.scene.audio.cue('monster-hit');
    this.health--;
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
