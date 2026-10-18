import { BALANCE } from '../world/balance.js';
import { WeaponState } from './WeaponState.js';

export class CombatSystem {
  constructor(scene) {
    this.scene = scene; this.cooldown = 0; this.attack = null; this.hurtRemaining = 0;
    this.weapon = new WeaponState();
    scene.events.once('shutdown', () => this.cancel());
  }

  sweep() {
    const s = this.scene;
    if (!s.run.hasLantern || s.dead || s.leaving || s.player.acting || s.player.frozen || s.player.climbing || this.cooldown > 0 || s.transferRemaining != null || s.run.rescuedEli) return false;
    const sword=this.weapon.drawn;
    if (!sword && !s.run.spendFlame(BALANCE.sweepCost)) { s.notice('Not enough flame. Q: oil · Hold R at a fire: rest'); return false; }
    this.cooldown = sword ? 520 : BALANCE.sweepCooldown;
    this.attack = { elapsed: 0, direction: s.player.flipX ? -1 : 1, struck: false, sword };
    s.player.act(sword && s.anims.exists('sword-attack') ? 'sword-attack' : 'hero-sweep'); s.audio.cue(sword?'blade':'sweep');
    return true;
  }

  toggleWeapon() {
    const s=this.scene,p=s.player;
    if(!s.run.hasLantern||s.dead||s.leaving||p.acting||p.frozen||p.climbing||this.cooldown>0||s.transferRemaining!=null||(s.run.rescuedEli&&!this.weapon.drawn))return false;
    if(this.weapon.drawn) {
      if(!this.weapon.retrieve(p.x,p.feet)){s.notice('Your lantern is on the ground. Return to it and press X.');return false;}
      this.dropCollider?.destroy();this.dropCollider=null;this.dropped?.destroy();this.dropped=null;p.swordDrawn=false;
      s.lantern.follow=p;s.lantern.offsetY=-48;
      s.audio.cue('blade');s.notice('Lantern recovered · F sweep · X draw sword');return true;
    }
    if(!this.weapon.draw(p.x,p.feet,p.body.blocked.down||p.body.touching.down)){s.notice('Land on solid ground before setting the lantern down.');return false;}
    p.swordDrawn=true;
    if(s.anims.exists('sword-draw'))p.act('sword-draw');
    this.dropped=s.physics.add.image(p.x,p.feet,'item-lantern').setOrigin(.5,1).setDisplaySize(22,32).setDepth(21).setVelocity(0);
    this.dropCollider=s.physics.add.collider(this.dropped,s.solids,null,(_drop,surface)=>surface.body.enable);
    s.lantern.follow=this.dropped;s.lantern.offsetY=-18;
    s.audio.cue('blade');s.notice('Sword drawn · F slash · X by the lantern to retrieve it');return true;
  }

  resetWeapon() {
    this.weapon.reset();this.dropped?.destroy();this.dropped=null;
    this.dropCollider?.destroy();this.dropCollider=null;
    if(this.scene.player)this.scene.player.swordDrawn=false;
    if(this.scene.lantern){this.scene.lantern.follow=this.scene.player;this.scene.lantern.offsetY=-48;}
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
    this.hurtRemaining = 360; this.knockback = s.player.x >= sourceX ? 170 : -170;
    s.player.frozen = true; s.player.setVelocityX(this.knockback);
    s.player.play(s.player.swordDrawn?'sword-hurt':'hero-hurt');
    s.player.setTint(0xe5a4a0);s.cameras.main.shake(140,.003);
    s.audio.cue('rowan-hurt');
    return true;
  }

  update(delta) {
    const s = this.scene;
    if(this.weapon.drawn&&this.dropped?.active){
      this.weapon.drop.x=this.dropped.x;this.weapon.drop.floor=this.dropped.body.bottom;
      if(this.dropped.body.bottom>900){this.resetWeapon();s.notice('The lost lantern returns to your hand.');}
    }
    this.cooldown = Math.max(0, this.cooldown - delta);
    if (this.hurtRemaining > 0) {
      this.hurtRemaining = Math.max(0, this.hurtRemaining - delta);
      s.player.setVelocityX(this.knockback);
      if (!this.hurtRemaining && !s.dead && s.transferRemaining == null && !s.resting){s.player.frozen = false;s.player.clearTint();}
    }
    if (!this.attack) return;
    this.attack.elapsed += delta;
    if (!this.attack.struck && this.attack.elapsed >= (this.attack.sword?160:BALANCE.sweepWindup)) {
      this.attack.struck = true;
      const dir = this.attack.direction;
      this.effect = s.add.container(s.player.x + dir * 76, s.player.feet - 53).setDepth(30);
      if(!this.attack.sword){const flame=s.add.sprite(0,8,'fx_burst').setDisplaySize(184,130).setFlipX(dir<0).setBlendMode('ADD').play('fx-burst');this.effect.add(flame);}
      const arc = s.add.graphics().lineStyle(3, 0xffe3a7, .8);
      arc.beginPath().arc(-dir * 45, 0, 90, dir > 0 ? -.65 : Math.PI - .65, dir > 0 ? .65 : Math.PI + .65).strokePath();
      this.effect.add(arc);
      s.tweens.add({ targets: this.effect, alpha: 0, duration: 400, ease: 'Quad.in' });
      for (const enemy of s.enemies) {
        const dx = (enemy.x - s.player.x) * dir;
        if (enemy.active && enemy.alive && dx >= 0 && dx <= (this.attack.sword?115:BALANCE.sweepRange) && Math.abs(enemy.floor - s.player.feet) <= 90) {
          if(enemy.hit(dir,this.attack.sword?'sword':'flame')&&this.attack.sword){
            s.cameras.main.shake(85,.002);
            const sparks=s.add.particles(enemy.x,enemy.floor-60,'spark',{lifespan:220,speed:{min:70,max:180},scale:{start:.2,end:0},frequency:-1}).setDepth(31);
            sparks.explode(7);s.time.delayedCall(250,()=>sparks.destroy());
          }
        }
      }
    }
    if (this.attack.elapsed > 600) { this.effect?.destroy(); this.effect = null; }
    if (this.attack.elapsed >= (this.attack.sword?520:BALANCE.sweepCooldown)) this.attack = null;
  }
}
