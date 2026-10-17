import { BALANCE } from '../world/balance.js';

export class CombatSystem {
  constructor(scene) {
    this.scene = scene; this.cooldown = 0; this.attack = null; this.hurtRemaining = 0;
    scene.events.once('shutdown', () => this.cancel());
  }

  sweep() {
    const s = this.scene;
    if (!s.run.hasLantern || s.dead || s.leaving || s.player.acting || s.player.frozen || s.player.climbing || this.cooldown > 0 || s.transferRemaining != null || s.run.rescuedEli) return false;
    if (!s.run.spendFlame(BALANCE.sweepCost)) { s.notice('Not enough flame. Q: oil · Hold R at a fire: rest'); return false; }
    this.cooldown = BALANCE.sweepCooldown;
    this.attack = { elapsed: 0, direction: s.player.flipX ? -1 : 1, struck: false };
    s.player.act('hero-sweep'); s.audio.cue('sweep');
    return true;
  }

  cancel() {
    this.attack = null; this.effect?.destroy(); this.effect = null;
    if (this.scene.player?.active) this.scene.player.cancelAction();
  }

  damage(sourceX) {
    const s = this.scene;
    if (s.dead || s.leaving || s.invulnerable > 0 || s.transferRemaining != null || s.run.rescuedEli || s.isSafe(s.player.x, s.player.feet)) return false;
    this.cancel(); s.cancelRest(true);
    s.run.takeDamage(); s.invulnerable = BALANCE.damageImmunity;
    if (!s.run.health) { s.die('health'); return true; }
    this.hurtRemaining = 170; this.knockback = s.player.x >= sourceX ? 170 : -170;
    s.player.frozen = true; s.player.setVelocityX(this.knockback);
    s.audio.cue('notice'); s.notice('Hit — find an opening, or retreat to a fire.');
    return true;
  }

  update(delta) {
    const s = this.scene;
    this.cooldown = Math.max(0, this.cooldown - delta);
    if (this.hurtRemaining > 0) {
      this.hurtRemaining = Math.max(0, this.hurtRemaining - delta);
      s.player.setVelocityX(this.knockback);
      if (!this.hurtRemaining && !s.dead && s.transferRemaining == null && !s.resting) s.player.frozen = false;
    }
    if (!this.attack) return;
    this.attack.elapsed += delta;
    if (!this.attack.struck && this.attack.elapsed >= BALANCE.sweepWindup) {
      this.attack.struck = true;
      const dir = this.attack.direction;
      this.effect = s.add.container(s.player.x + dir * 76, s.player.feet - 53).setDepth(30);
      const flame = s.add.sprite(0, 8, 'fx_burst').setDisplaySize(184, 130).setFlipX(dir < 0).setBlendMode('ADD').play('fx-burst');
      this.effect.add(flame);
      const arc = s.add.graphics().lineStyle(3, 0xffe3a7, .8);
      arc.beginPath().arc(-dir * 45, 0, 90, dir > 0 ? -.65 : Math.PI - .65, dir > 0 ? .65 : Math.PI + .65).strokePath();
      this.effect.add(arc);
      s.tweens.add({ targets: this.effect, alpha: 0, duration: 400, ease: 'Quad.in' });
      for (const enemy of s.enemies) {
        const dx = (enemy.x - s.player.x) * dir;
        if (enemy.active && enemy.alive && dx >= 0 && dx <= BALANCE.sweepRange && Math.abs(enemy.floor - s.player.feet) <= 90) enemy.hit(dir);
      }
    }
    if (this.attack.elapsed > 600) { this.effect?.destroy(); this.effect = null; }
    if (this.attack.elapsed >= BALANCE.sweepCooldown) this.attack = null;
  }
}
