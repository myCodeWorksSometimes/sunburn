import Phaser from 'phaser';

const RUN = 230;
const JUMP = 600;
const CLIMB = 170;
const BODY_W = 30;
const BODY_H = 84;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero_idle', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(20);
    this.body.setMaxVelocityY(1100);
    this.fitBody();
    this.climbing = false;
    this.ladder = null;
    this.frozen = false;
    this.acting = false; // playing a one-shot action (interact, light, death)
    this.hasLantern = false;
    this.wasAirborne = false;
    this.landedAt = 0;

    const kb = scene.input.keyboard;
    this.keys = kb.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN',
      a: 'A', d: 'D', w: 'W', s: 'S', space: 'SPACE',
    });
    this.play('hero-idle');
  }

  get feet() {
    return this.body.bottom;
  }

  // All hero sheets share one frame size, so the body is fitted once.
  fitBody() {
    const f = this.frame;
    this.body.setSize(BODY_W, BODY_H, false);
    this.body.setOffset((f.width - BODY_W) / 2, f.height - BODY_H);
  }

  giveLantern() {
    this.hasLantern = true;
  }

  readInput() {
    const k = this.keys;
    return {
      left: k.left.isDown || k.a.isDown,
      right: k.right.isDown || k.d.isDown,
      up: k.up.isDown || k.w.isDown,
      down: k.down.isDown || k.s.isDown,
      jump: Phaser.Input.Keyboard.JustDown(k.space) || Phaser.Input.Keyboard.JustDown(k.up) || Phaser.Input.Keyboard.JustDown(k.w),
    };
  }

  // Plays a one-shot animation with the player rooted in place, then calls done.
  act(key, done) {
    this.acting = true;
    this.setVelocityX(0);
    this.play(key);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.acting = false;
      done?.();
    });
  }

  startClimb(ladder) {
    this.climbing = true;
    this.ladder = ladder;
    this.body.setAllowGravity(false);
    this.setVelocity(0, 0);
    this.x = ladder.x;
  }

  stopClimb() {
    this.climbing = false;
    this.ladder = null;
    this.body.setAllowGravity(true);
  }

  update(ladders = []) {
    if (this.acting) {
      this.setVelocityX(0);
      return;
    }
    const i = this.frozen ? {} : this.readInput();
    const onGround = this.body.blocked.down || this.body.touching.down || this.rampGround;

    if (this.climbing) {
      const l = this.ladder;
      const vy = i.up ? -CLIMB : i.down ? CLIMB : 0;
      this.setVelocity(0, vy);
      if (i.up && this.feet <= l.top) {
        this.y -= this.feet - l.top + 1;
        this.stopClimb();
      } else if (i.down && this.feet >= l.bottom) {
        this.stopClimb();
      } else if ((i.left || i.right) && !i.up && !i.down && (this.feet <= l.top + 4 || this.feet >= l.bottom - 4)) {
        this.stopClimb();
      }
      // No climb sheet yet: alternate the reaching jump poses.
      this.anims.stop();
      this.setTexture('hero_jump', vy !== 0 && Math.floor(this.scene.time.now / 180) % 2 ? 1 : 3);
      return;
    }

    const ladder = ladders.find((l) => Math.abs(this.x - l.x) < 26 && this.feet >= l.top - 6 && this.feet <= l.bottom + 6);
    if (ladder && i.up && this.feet > ladder.top + 4) {
      this.startClimb(ladder);
      return;
    }
    if (ladder && i.down && Math.abs(this.feet - ladder.top) < 8) {
      this.startClimb(ladder);
      this.y += 10;
      return;
    }

    const vx = i.left ? -RUN : i.right ? RUN : 0;
    this.setVelocityX(vx);
    if (vx) this.setFlipX(vx < 0);
    if (i.jump && onGround) this.setVelocityY(-JUMP);

    if (!onGround) {
      this.airborneSince ??= this.scene.time.now;
      // Only a real fall counts; one-frame ground flickers shouldn't trigger the landing pose.
      const air = this.scene.time.now - this.airborneSince;
      if (air > 150) this.wasAirborne = true;
      const vy = this.body.velocity.y;
      if (air > 80 || vy < -100) {
        this.anims.stop();
        this.setTexture('hero_jump', vy < -200 ? 1 : vy < 150 ? 2 : 3);
      }
    } else {
      this.airborneSince = null;
      if (this.wasAirborne) {
        this.wasAirborne = false;
        this.landedAt = this.scene.time.now;
      }
      if (this.scene.time.now - this.landedAt < 90) {
        this.anims.stop();
        this.setTexture('hero_jump', 4);
      } else if (vx) {
        this.play('hero-walk', true);
      } else {
        this.play('hero-idle', true);
      }
    }
  }
}
