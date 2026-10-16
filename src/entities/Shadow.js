import Phaser from 'phaser';

const SCALE = 0.85;

// A creeping shadow. It hunts the player in the dark and dissolves in firelight.
export class Shadow extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, { speed = 80, sense = 420, dormant = false } = {}) {
    super(scene, x, y, 'shadow_idle', 0);
    scene.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(19).setScale(SCALE).play('shadow-idle');
    this.speed = speed;
    this.sense = sense;
    this.home = { x, y };
    this.alive = true;
    this.hunting = false;
    this.dormant = dormant;
    if (dormant) this.setAlpha(0);
    // Faint violet aura so the silhouette reads against dark backgrounds.
    this.aura = scene.add.image(x, y, 'glow').setTint(0x8a4cff).setBlendMode('ADD').setDepth(18).setScale(0.9, 0.6).setAlpha(dormant ? 0 : 0.35);
    this.trail = scene.add.particles(0, 0, 'smoke', {
      follow: this, followOffset: { y: -20 },
      lifespan: 700, speed: { min: 5, max: 25 }, scale: { start: 1.6, end: 0 },
      alpha: { start: 0.6, end: 0 }, frequency: 70, emitting: !dormant,
    }).setDepth(18);
  }

  wake(riseTo = this.y - 10) {
    if (!this.dormant) return;
    this.trail.emitting = true;
    this.scene.tweens.add({
      targets: this, alpha: 1, y: riseTo, duration: 1100, ease: 'Sine.out',
      onComplete: () => { this.dormant = false; this.home = { x: this.x, y: this.y }; },
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.aura.setPosition(this.x, this.y - this.displayHeight * 0.45).setAlpha(this.alpha * 0.35);
  }

  update(player, dt) {
    if (!this.alive || this.dormant) return;
    // Shadows creep along their own floor and only notice you on the same level.
    const dx = player.x - this.x;
    const sameLevel = Math.abs(player.y - this.home.y) < 50;
    const now = this.scene.time.now;
    if (sameLevel && Math.abs(dx) < this.sense) this.lastSeen = now;
    // Keeps charging for a moment after losing sight (e.g. while you jump over it).
    const hunting = now - (this.lastSeen ?? -1e9) < 1000 && Math.abs(dx) > 2;
    if (hunting && !this.hunting) this.notice();
    this.hunting = hunting;
    if (hunting) {
      this.x += Math.sign(dx) * (this.speed * dt) / 1000;
      this.setFlipX(dx < 0);
      this.play('shadow-move', true);
    } else {
      this.play('shadow-idle', true);
    }
    this.y = this.home.y + Math.sin(this.scene.time.now / 330 + this.home.x) * 2;
  }

  // A warning eye pops above the shadow when it starts hunting.
  notice() {
    const eye = this.scene.add.image(this.x, this.y - this.displayHeight - 20, 'ui_eye').setScale(0.4).setDepth(65).setAlpha(0);
    this.scene.tweens.add({ targets: eye, alpha: 1, y: eye.y - 12, scale: 0.5, duration: 250, yoyo: true, hold: 500, onComplete: () => eye.destroy() });
  }

  touches(player) {
    if (!this.alive || this.dormant || this.alpha < 0.5) return false;
    return Math.abs(player.x - this.x) < 30 && Math.abs(player.y - this.y) < 55;
  }

  dissolve() {
    if (!this.alive) return;
    this.alive = false;
    this.trail.emitting = false;
    const scene = this.scene;
    // Recoil, then burn away in the firelight.
    this.play('shadow-hurt');
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      const fx = scene.add.sprite(this.x, this.y, 'fx_dissolve').setOrigin(0.5, 1).setDepth(21).play('fx-dissolve');
      fx.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => fx.destroy());
      this.play('shadow-dissolve');
      scene.tweens.add({
        targets: this, alpha: 0, duration: 700, ease: 'Cubic.in',
        onComplete: () => { this.trail.destroy(); this.aura.destroy(); this.destroy(); },
      });
    });
  }
}
