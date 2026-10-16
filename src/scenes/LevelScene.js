import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Shadow } from '../entities/Shadow.js';
import { Lighting } from '../systems/Lighting.js';
import { Captions, Prompt, FONT } from '../systems/Captions.js';

const DEPTH = { bg: 0, restored: 1, world: 10, dark: 50, echo: 60, fx: 70, ui: 100 };

// Shared base for playable scenes: layered dark/restored backgrounds, collision,
// lighting, fires that rewind time, shadows, echoes and interactables.
export class LevelScene extends Phaser.Scene {
  // Subclasses return their layout here.
  get level() {
    throw new Error('LevelScene subclass must define level');
  }

  init(data) {
    this.entry = data || {};
  }

  create() {
    const L = (this.L = this.level);
    this.restored = 0;
    this.rewinding = false;
    this.fires = [];
    this.shadows = [];
    this.interactables = [];
    this.dead = false;

    this.cameras.main.setBackgroundColor(L.background ?? '#050308');
    this.cameras.main.setBounds(0, 0, L.width, 720);
    this.physics.world.setBounds(0, 0, L.width, 900);

    // Backgrounds: each layer has a dark image and an optional restored image on top.
    this.restoredImages = [];
    for (const layer of L.layers) {
      this.add.image(0, 0, layer.dark).setOrigin(0).setScrollFactor(layer.scroll ?? 1).setDepth(DEPTH.bg);
      if (layer.restored) {
        const t = { x: 0, y: 0, scale: 1, ...layer.restoredTransform };
        const img = this.add.image(t.x, t.y, layer.restored).setOrigin(0).setScale(t.scale)
          .setScrollFactor(layer.scroll ?? 1).setDepth(DEPTH.restored).setAlpha(0);
        this.restoredImages.push(img);
      }
    }

    // Collision geometry.
    this.solids = this.physics.add.staticGroup();
    this.oneWays = this.physics.add.staticGroup();
    this.restoredSolids = [];
    for (const p of L.platforms) {
      const zone = this.add.zone((p.x1 + p.x2) / 2, p.y + 20, p.x2 - p.x1, 40);
      (p.oneWay ? this.oneWays : this.solids).add(zone);
      if (p.oneWay) zone.body.checkCollision.down = zone.body.checkCollision.left = zone.body.checkCollision.right = false;
      if (p.restoredOnly) {
        zone.body.enable = false;
        this.restoredSolids.push(zone);
      }
    }
    for (const w of L.walls || []) {
      this.solids.add(this.add.zone(w.x, (w.top + w.bottom) / 2, 20, w.bottom - w.top));
    }
    this.ladders = L.ladders || [];
    // Ramps are walkable polylines (stairs, sagging bridge decks) with no collider.
    this.ramps = (L.ramps || []).map((r) => ({ restoredOnly: false, ...r }));

    // Player.
    const spawn = this.entry.spawn || L.spawn;
    this.checkpoint = { ...spawn };
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.setCollideWorldBounds(true);
    if (this.entry.hasLantern || L.startWithLantern) this.player.giveLantern();
    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.player, this.oneWays, null, () => !this.player.climbing && this.player.body.velocity.y >= 0);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12, 0, 120);

    // Lighting.
    this.lighting = new Lighting(this, { darkness: L.darkness ?? 0.92, depth: DEPTH.dark });
    this.playerLight = this.lighting.add({ follow: this.player, offsetY: -50, radius: 160, intensity: 0.9, flicker: 0.04, warm: false });
    this.lanternLight = this.lighting.add({ follow: this.player, offsetX: 36, offsetY: -32, radius: 260, intensity: 1, flicker: 0.08, on: false });
    if (this.player.hasLantern) this.lanternLight.on = true;

    // UI.
    this.captions = new Captions(this, DEPTH.ui);
    this.prompt = new Prompt(this);
    // Rewind timer: the burning bar is cropped away over the empty one as time runs out.
    const TS = 0.6;
    const tx = 640 - (this.textures.getFrame('ui_timer_empty').width * TS) / 2;
    this.timerBg = this.add.image(tx, 112, 'ui_timer_empty').setOrigin(0, 1).setScale(TS).setScrollFactor(0).setDepth(DEPTH.ui).setVisible(false);
    this.timerBar = this.add.image(tx, 112, 'ui_timer_full').setOrigin(0, 1).setScale(TS).setScrollFactor(0).setDepth(DEPTH.ui).setVisible(false);
    this.timerLabel = this.add.text(640, 116, 'the past lingers…', { fontFamily: FONT, fontSize: '16px', color: '#ffe6b0' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(DEPTH.ui).setVisible(false);

    this.keyUse = this.input.keyboard.addKeys({ e: 'E', enter: 'ENTER' });
    if (new URLSearchParams(location.search).has('debug')) {
      this.input.keyboard.on('keydown-T', () => (this.restored > 0.5 ? this.endRewind() : this.startRewind({ x: this.player.x, y: this.player.y - 40 }, 30000)));
    }

    this.build();
    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  // Subclass hook for placing story content.
  build() {}

  // ---- Fires ----------------------------------------------------------------

  // sprite: 'campfire' draws the campfire sheet with its base at (x, base).
  addFire(x, y, { radius = 330, lit = false, duration = 15000, scale = 1, onLight, sprite, base } = {}) {
    const light = this.lighting.add({ x, y, radius, intensity: 1, flicker: 0.12, on: lit });
    let campfire = null;
    if (sprite === 'campfire') {
      campfire = this.add.sprite(x, base, 'fire_unlit', 0).setOrigin(0.5, 1).setDepth(15).setScale(scale * 1.1);
    }
    const flames = this.add.particles(x, y, 'spark', {
      x: { min: -10 * scale, max: 10 * scale }, lifespan: { min: 400, max: 900 }, speedY: { min: -90 * scale, max: -40 * scale },
      speedX: { min: -12, max: 12 }, scale: { start: 1.6 * scale, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD',
      frequency: 30, emitting: lit,
    }).setDepth(DEPTH.echo);
    const fire = { x, y, light, flames, lit, duration, onLight, ready: !lit, campfire };
    this.fires.push(fire);
    return fire;
  }

  lightFire(fire) {
    if (!fire.ready || this.rewinding) return;
    fire.ready = false;
    fire.lit = true;
    fire.light.on = true;
    fire.flames.emitting = !fire.campfire;
    if (fire.campfire) {
      fire.campfire.play('fire-ignite');
      fire.campfire.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => fire.campfire.play('fire-burning'));
    }
    if (fire.embers) { fire.embers.setVisible(true); fire.light.radius = fire.baseRadius ?? fire.light.radius; fire.flames.frequency = 30; }
    fire.baseRadius ??= fire.light.radius;
    this.checkpoint = { x: fire.x, y: this.player.feet };
    this.add.particles(fire.x, fire.y, 'spark', {
      speed: { min: 80, max: 260 }, lifespan: 700, scale: { start: 1.4, end: 0 }, blendMode: 'ADD', emitting: false,
    }).setDepth(DEPTH.fx).explode(40);
    const burst = this.add.sprite(fire.x, fire.y + 20, 'fx_burst').setDepth(DEPTH.fx).setBlendMode('ADD').setScale(1.4).play('fx-burst');
    burst.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => burst.destroy());
    if (!fire.embers) {
      fire.embers = this.add.sprite(fire.x, fire.y - 40, 'fx_embers').setDepth(DEPTH.echo).setBlendMode('ADD').setAlpha(0.8).play('fx-embers');
    }
    this.startRewind(fire, fire.duration);
    fire.onLight?.(fire);
  }

  // ---- Rewind ----------------------------------------------------------------

  startRewind(origin, duration) {
    this.rewinding = true;
    this.rewindOrigin = origin;
    const cam = this.cameras.main;
    cam.flash(700, 255, 220, 170);
    cam.shake(400, 0.004);
    this.clockFx(origin.x, origin.y, -1);

    // Shadows near the light are burned away.
    for (const s of this.shadows) {
      if (s.alive && Phaser.Math.Distance.Between(s.x, s.y, origin.x, origin.y) < 700) s.dissolve();
    }

    this.tweens.addCounter({
      from: this.restored, to: 1, duration: 1400, ease: 'Sine.inOut',
      onUpdate: (tw) => this.setRestored(tw.getValue()),
    });

    this.timerBg.setVisible(true);
    this.timerBar.setVisible(true).setCrop();
    this.timerLabel.setVisible(true);
    this.rewindEnd = this.time.now + duration;
    this.rewindDuration = duration;
    this.onRewindStart(origin);
  }

  endRewind() {
    if (!this.rewinding) return;
    this.rewinding = false;
    this.timerBg.setVisible(false);
    this.timerBar.setVisible(false);
    this.timerLabel.setVisible(false);
    this.cameras.main.shake(300, 0.003);
    if (this.rewindOrigin) this.clockFx(this.rewindOrigin.x, this.rewindOrigin.y, 1);
    this.tweens.addCounter({
      from: this.restored, to: 0, duration: 1600, ease: 'Sine.inOut',
      onUpdate: (tw) => this.setRestored(tw.getValue()),
    });
    // The fire burns down to embers and can be relit after a moment.
    for (const f of this.fires) {
      if (f.lit && !f.ready && !f.permanent) {
        this.time.delayedCall(1600, () => {
          f.light.radius = (f.baseRadius ?? f.light.radius) * 0.5;
          f.flames.frequency = 120;
          if (f.campfire) f.campfire.play('fire-fading');
          f.embers?.setVisible(false);
        });
        this.time.delayedCall(3500, () => { f.ready = true; });
      }
    }
    this.onRewindEnd();
  }

  setRestored(v) {
    this.restored = v;
    for (const img of this.restoredImages) img.setAlpha(v);
    const L = this.L;
    this.lighting.darkness = Phaser.Math.Linear(L.darkness ?? 0.92, L.restoredDarkness ?? 0.1, v);
    for (const z of this.restoredSolids) z.body.enable = v > 0.5;
  }

  clockFx(x, y, dir) {
    const g = this.add.graphics().setDepth(DEPTH.fx).setPosition(x, y).setBlendMode('ADD');
    const R = 140;
    g.lineStyle(3, 0xffd890, 0.9).strokeCircle(0, 0, R);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.lineBetween(Math.cos(a) * (R - 14), Math.sin(a) * (R - 14), Math.cos(a) * R, Math.sin(a) * R);
    }
    const hands = this.add.graphics().setDepth(DEPTH.fx).setPosition(x, y).setBlendMode('ADD');
    hands.lineStyle(5, 0xfff0c0, 1).lineBetween(0, 0, 0, -R * 0.75);
    hands.lineStyle(4, 0xfff0c0, 1).lineBetween(0, 0, R * 0.5, 0);
    const ring = this.add.circle(x, y, 20).setStrokeStyle(4, 0xffe0a0, 1).setDepth(DEPTH.fx).setBlendMode('ADD');
    this.tweens.add({ targets: [g, hands], scale: { from: 0.4, to: 1.3 }, alpha: { from: 1, to: 0 }, duration: 1500, ease: 'Cubic.out' });
    this.tweens.add({ targets: hands, rotation: dir * Math.PI * 4, duration: 1500, ease: 'Cubic.out', onComplete: () => { g.destroy(); hands.destroy(); } });
    this.tweens.add({ targets: ring, radius: 900, alpha: 0, duration: 1300, ease: 'Cubic.out', onComplete: () => ring.destroy() });
  }

  onRewindStart() {}
  onRewindEnd() {}

  // ---- Echoes ----------------------------------------------------------------

  // The brother's memory replays along a path of points while the past is restored.
  playEcho(points, { speed = 260, delay = 600, ball = false, onDone } = {}) {
    const [start, ...rest] = points;
    const kid = this.add.sprite(start.x, start.y, 'brother', 0).setOrigin(0.5, 1).setDepth(DEPTH.echo)
      .setBlendMode('ADD').setTint(0xffe2a0).setAlpha(0);
    const ballImg = ball ? this.add.image(start.x + 20, start.y - 10, 'ball').setDepth(DEPTH.echo).setBlendMode('ADD').setAlpha(0) : null;
    const motes = this.add.particles(0, 0, 'mote', {
      follow: kid, followOffset: { y: -30 }, lifespan: 900, speed: { min: 5, max: 30 },
      scale: { start: 0.8, end: 0 }, alpha: { start: 0.8, end: 0 }, blendMode: 'ADD', frequency: 50,
    }).setDepth(DEPTH.echo);
    const chain = [{ targets: kid, alpha: 0.85, duration: 500, delay }];
    let prev = start;
    for (const p of rest) {
      const d = Phaser.Math.Distance.Between(prev.x, prev.y, p.x, p.y);
      chain.push({
        targets: kid, x: p.x, y: p.y, duration: (d / speed) * 1000,
        onStart: () => { kid.setFlipX(p.x < kid.x); kid.play('brother-run', true); },
      });
      prev = p;
    }
    const bounce = () => ballImg.setPosition(kid.x + (kid.flipX ? -18 : 18), kid.y - 8 - Math.abs(Math.sin(this.time.now / 120)) * 22).setAlpha(kid.alpha);
    if (ballImg) this.events.on('update', bounce);
    chain.push({
      targets: kid, alpha: 0, duration: 600,
      onStart: () => kid.anims.stop(),
      onComplete: () => {
        if (ballImg) { this.events.off('update', bounce); ballImg.destroy(); }
        motes.emitting = false;
        kid.destroy();
        this.time.delayedCall(1000, () => motes.destroy());
        onDone?.();
      },
    });
    this.tweens.chain({ tweens: chain });
    return kid;
  }

  // ---- Interactables ---------------------------------------------------------

  addInteract(opts) {
    const it = { range: 50, once: true, used: false, when: () => true, ...opts };
    this.interactables.push(it);
    return it;
  }

  nearestInteract() {
    let best = null;
    let bestD = Infinity;
    for (const it of this.interactables) {
      if (it.used || !it.when()) continue;
      const dx = Math.abs(this.player.x - it.x);
      const dy = Math.abs(this.player.feet - (it.floor ?? this.player.feet));
      if (dx < it.range && dy < 30 && dx < bestD) { best = it; bestD = dx; }
    }
    return best;
  }

  // Shows a close-up of an inspected keepsake while its caption plays.
  showItem(key) {
    this.itemPopup?.destroy();
    const img = this.add.image(640, 250, key).setScrollFactor(0).setDepth(DEPTH.ui).setAlpha(0).setScale(0.7);
    this.itemPopup = img;
    this.tweens.add({ targets: img, alpha: 1, scale: 0.8, duration: 400, ease: 'Back.out' });
    this.tweens.add({ targets: img, alpha: 0, delay: 3600, duration: 500, onComplete: () => img.destroy() });
  }

  // ---- Shadows / death ------------------------------------------------------

  addShadow(x, y, opts) {
    const s = new Shadow(this, x, y, opts);
    this.shadows.push(s);
    return s;
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.player.frozen = true;
    this.player.stopClimb();
    this.player.setVelocity(0, 0);
    this.cameras.main.shake(300, 0.01);
    if (this.player.body.blocked.down || this.player.body.touching.down) this.player.act('hero-death');
    this.cameras.main.fadeOut(1100, 10, 0, 20);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.player.acting = false;
      this.player.play('hero-idle');
      this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
      this.player.setVelocity(0, 0);
      for (const s of this.shadows) if (s.alive) { s.x = s.home.x; s.y = s.home.y; }
      this.onRespawn();
      this.cameras.main.fadeIn(700, 0, 0, 0);
      this.dead = false;
      this.player.frozen = false;
    });
  }

  onRespawn() {}

  goTo(key, data) {
    if (this.leaving) return;
    this.leaving = true;
    this.player.frozen = true;
    this.cameras.main.fadeOut(900, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key, data));
  }

  // ---- Loop -------------------------------------------------------------------

  // Snaps the player onto any active ramp under their feet.
  applyRamps() {
    const p = this.player;
    p.rampGround = false;
    if (p.climbing || p.body.velocity.y < 0) return;
    for (const r of this.ramps) {
      if (r.restoredOnly && this.restored <= 0.5) continue;
      const pts = r.points;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        if (p.x < x1 || p.x > x2) continue;
        const ry = y1 + ((p.x - x1) / (x2 - x1)) * (y2 - y1);
        if (p.feet >= ry - 8 && p.feet <= ry + 26) {
          // Move the body only; Arcade copies the change to the sprite in postUpdate.
          p.body.y += ry - p.feet;
          p.setVelocityY(0);
          p.rampGround = true;
          return;
        }
      }
    }
  }

  update(time, delta) {
    this.applyRamps();
    this.player.update(this.ladders);

    const exit = this.L.exit;
    if (exit && !this.dead && this.player.x > exit.x && (exit.maxFeet === undefined || this.player.feet < exit.maxFeet) && (!exit.when || exit.when())) {
      this.goTo(exit.to, { hasLantern: true, ...exit.data });
    }
    this.lighting.update(delta);

    for (const s of this.shadows) {
      if (!s.active) continue;
      s.update(this.player, delta);
      if (!this.dead && s.touches(this.player)) this.die();
    }
    this.shadows = this.shadows.filter((s) => s.active);

    if (!this.dead && this.player.feet > (this.L.killY ?? 900)) this.die();

    if (this.rewinding) {
      // Scene clock, same one startRewind used (the loop's time can drift from it).
      const now = this.time.now;
      const left = this.rewindEnd - now;
      const frac = Math.max(0, left / this.rewindDuration);
      this.timerBar.setCrop(0, 0, this.timerBar.frame.width * frac, this.timerBar.frame.height);
      // Warn the player when the memory is about to fade.
      if (left < 3000) for (const img of this.restoredImages) img.setAlpha(0.75 + Math.sin(now / 60) * 0.25);
      if (left <= 0) this.endRewind();
    }

    const it = this.player.frozen || this.player.acting ? null : this.nearestInteract();
    if (it) {
      this.prompt.show(it.x, (it.promptY ?? this.player.y - 110), it.label);
      if (!this.player.acting && (Phaser.Input.Keyboard.JustDown(this.keyUse.e) || Phaser.Input.Keyboard.JustDown(this.keyUse.enter))) {
        if (it.once) it.used = true;
        this.player.setFlipX(it.x < this.player.x);
        if (it.kind === 'light') {
          this.player.act('hero-light', () => it.use(it));
        } else {
          if (it.kind === 'inspect') this.player.act('hero-interact');
          it.use(it);
        }
      }
    } else {
      this.prompt.hide();
    }

    this.tick?.(time, delta);
  }
}
