import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Lighting } from '../systems/Lighting.js';
import { Captions, FONT } from '../systems/Captions.js';
import { MemorySystem } from '../systems/MemorySystem.js';
import { AudioCues } from '../systems/AudioCues.js';
import { getSession, saveSession } from '../world/WorldState.js';
import { regionAt } from '../world/layout.js';
import { BALANCE } from '../world/balance.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { surfaceArt } from '../presentation/Scenery.js';
import { panel } from '../presentation/ui.js';
import { RestorationField } from '../systems/RestorationField.js';
import { BossIntroduction } from '../systems/BossIntroduction.js';
import { VoiceDirector } from '../systems/VoiceDirector.js';

// Shared run mechanics for the continuous outdoors and the house interior.
export class Adventure extends Phaser.Scene {
  init(data = {}) { this.entry = data; }

  setup(width, spawn) {
    this.run = getSession(this);
    this.dead = false; this.leaving = false; this.holdMs = 0; this.holdTarget = null;
    this.activeBossHud=null;
    this.requireRelease = true; this.invulnerable = 600; this.regionId = '';
    this.resting = null; this.restMs = 0; this.requireRestRelease = true; this.noticeRemaining = 0;
    this.interactions = []; this.fires = []; this.enemies = []; this.surfaces = []; this.echoes = [];
    this.regionVisuals = new Map(); this.regionBounds = new Map(); this.ladders = []; this.width = width;
    this.terrainLife = [];
    this.memory = new MemorySystem(this);
    this.audio = new AudioCues(this);
    this.voices=new VoiceDirector(this);
    this.combat = new CombatSystem(this);
    this.cameras.main.setBackgroundColor('#11101b').setBounds(0, 0, width, 720);
    this.physics.world.setBounds(0, 0, width, 1200);
    this.solids = this.physics.add.staticGroup();
    this.player = new Player(this, spawn.x, spawn.y).setCollideWorldBounds(true);
    this.contactShadow=this.add.ellipse(spawn.x,spawn.y+2,44,9,0x08090c,.5).setDepth(19);
    if (this.run.hasLantern) this.player.giveLantern();
    this.physics.add.collider(this.player, this.solids, null, (_p, surface) => surface.body.enable);
    this.lighting = new Lighting(this, { darkness: 0.44, depth: 50 });
    this.restoration = new RestorationField(this);
    this.cinematic = new BossIntroduction(this);
    this.lantern = this.lighting.add({ follow: this.player, offsetY: -48, radius: 200, intensity: 0.95, flicker: 0.03, on: this.run.hasLantern });
    this.captions = new Captions(this, 110);
    panel(this, 450, 48, 850, 76, { depth: 105, alpha: .9 });
    panel(this, 1080, 48, 330, 76, { depth: 105, alpha: .85 });
    panel(this, 153, 143, 258, 94, { depth: 105, alpha: .83 });
    const style = { fontFamily: FONT, fontSize: '20px', color: '#f0d4a3', resolution: 2 };
    this.objectiveText = this.add.text(48, 48, '', {...style,fontSize:'19px',lineSpacing:3,wordWrap:{width:795}}).setOrigin(0,.5).setScrollFactor(0).setDepth(110);
    this.goalHint = this.add.text(48,52,'',style).setVisible(false);
    this.regionText = this.add.text(1226, 30, '', { ...style, fontSize: '16px', color: '#c7bba7',wordWrap:{width:295},align:'right' }).setOrigin(1, 0).setScrollFactor(0).setDepth(110);
    this.inventoryText = this.add.text(1252, 78, '', { ...style, fontSize: '13px', color: '#d0c8c0' }).setOrigin(1, 0).setScrollFactor(0).setDepth(110).setVisible(false);
    this.healthText=this.add.text(0,0,'',style).setVisible(false);
    this.healthSegments = Array.from({ length: BALANCE.health }, (_, i) => this.add.image(56 + i * 34, 122, 'kit-heart').setDisplaySize(22, 25).setScrollFactor(0).setDepth(110));
    this.add.image(54,154,'kit-flame').setDisplaySize(18,23).setScrollFactor(0).setDepth(110);
    this.add.image(196,122,'kit-oil').setDisplaySize(17,25).setScrollFactor(0).setDepth(110);
    this.oilText=this.add.text(214,122,'',{...style,fontSize:'16px'}).setOrigin(0,.5).setScrollFactor(0).setDepth(110);
    this.flameText = this.add.text(76,154,'',{...style,fontSize:'17px'}).setOrigin(0,.5).setScrollFactor(0).setDepth(110);
    this.add.rectangle(46,174,214,5,0x34303e).setOrigin(0,.5).setScrollFactor(0).setDepth(110);
    this.flameFill=this.add.rectangle(46,174,214,5,0xf5b05b).setOrigin(0,.5).setScrollFactor(0).setDepth(111);
    this.noticeText = this.add.text(640, 230, '', { ...style, fontSize: '18px',align:'center',wordWrap:{width:850} }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(115);
    this.timerText = this.add.text(640, 93, '', { ...style, fontSize: '19px' }).setOrigin(0.5).setScrollFactor(0).setDepth(110);
    this.timerTrack = this.add.rectangle(640, 117, 300, 5, 0x34303e).setScrollFactor(0).setDepth(110).setVisible(false);
    this.timerFill = this.add.rectangle(490, 117, 300, 5, 0xf5d28a).setOrigin(0, 0.5).setScrollFactor(0).setDepth(111).setVisible(false);
    this.promptText = this.add.text(790, 160, '', { ...style, fontSize: '17px',lineSpacing:3,align: 'center', wordWrap: { width: 760 } }).setOrigin(0.5).setScrollFactor(0).setDepth(115);
    this.promptPanel = panel(this, 790, 160, 500, 54, { depth: 114, alpha: .9 }).setVisible(false);
    this.holdTrack = this.add.rectangle(790, 198, 180, 4, 0x34303e).setScrollFactor(0).setDepth(115).setVisible(false);
    this.holdFill = this.add.rectangle(700, 198, 0, 4, 0xffd890).setOrigin(0, 0.5).setScrollFactor(0).setDepth(116).setVisible(false);

    this.keys = this.input.keyboard.addKeys({ use: 'E', pause: 'ESC', next: 'ENTER', attack: 'F', weapon:'X', oil: 'Q', inventory: 'I', rest: 'R', map: 'M', journal: 'J' });
    this.saveClock = 0;
    this.input.keyboard.on('keydown', () => this.audio.unlock());
    this.look = 0;
    this.cameras.main.scrollX = Phaser.Math.Clamp(spawn.x - 640, 0, width - 1280);
    this.screenCamera=this.cameras.add(0,0,1280,720).setName('screen-ui');
    this.syncScreenCameras();
    this.events.once('shutdown', () => { this.memory.cancel('shutdown'); this.clearEchoes(); this.lighting.destroy(); });
  }

  syncScreenCameras() {
    if(!this.screenCamera)return;
    const screen=this.children.list.filter(o=>o.depth>=100||o===this.lighting?.image);
    this.cameras.main.ignore(screen);
    this.screenCamera.ignore(this.children.list.filter(o=>!screen.includes(o)));
  }

  addSurface(x1, x2, y, { regionId, restoredOnly = false, permanent, requires, material = 'stone' } = {}) {
    const zone = this.add.zone((x1 + x2) / 2, y + 16, x2 - x1, 32);
    this.solids.add(zone);
    zone.body.checkCollision.down = zone.body.checkCollision.left = zone.body.checkCollision.right = false;
    const { block, edge } = surfaceArt(this, x1, x2, y, { material, regionId });
    const surface = { zone, block, edge, regionId, restoredOnly, permanent, requires };
    this.surfaces.push(surface);
    this.refreshSurface(surface);
    return surface;
  }

  refreshSurface(s) {
    if(!s?.zone?.body)return;
    const enabled = !s.restoredOnly || !!s.permanent?.() || (this.memory.isRestoredAt(s.regionId,s.zone.x-s.zone.width/2,s.zone.y-16) && this.memory.isRestoredAt(s.regionId,s.zone.x+s.zone.width/2,s.zone.y-16) && (!s.requires || s.requires()));
    s.zone.body.enable = enabled;
    s.block.setVisible(enabled); s.edge.setVisible(enabled);
  }

  addWall(x, y, height) {
    const zone = this.add.zone(x, y - height / 2, 20, height);
    this.solids.add(zone);
    const image = this.add.image(x, y, this.scene.key === 'Hearth' ? 'timber' : 'corruption').setOrigin(.5, 1).setDisplaySize(this.scene.key === 'Hearth' ? 22 : 86, height).setDepth(12);
    return { zone, image };
  }

  addLabel(x, y, text, colour = '#c9bdba', size = 17) {
    return this.add.text(x, y, text, { fontFamily: FONT, fontSize: `${size}px`, color: colour, stroke: '#11101b', strokeThickness: 4, align: 'center' }).setOrigin(0.5).setDepth(24);
  }

  addInteract(item) {
    const it = { range: 72, when: () => true, priority: 0, ...item };
    this.interactions.push(it); return it;
  }

  addFire(data) {
    const fire = { ...data, lit: !!this.run.litFires?.[data.id] };
    fire.sprite = this.add.sprite(fire.x, fire.floor, 'fire_unlit').setOrigin(0.5, 1).setScale(0.65).setDepth(16);
    if (fire.lit) fire.sprite.play('fire-burning');
    fire.light = this.lighting.add({ x: fire.x, y: fire.floor - 45, radius: 185, intensity: 1, flicker: 0.05, on: fire.lit });
    fire.embers = this.add.particles(fire.x, fire.floor - 28, 'spark', { lifespan: { min: 400, max: 1200 }, speedX: { min: -18, max: 18 }, speedY: { min: -55, max: -18 }, scale: { start: .2, end: 0 }, alpha: { start: .65, end: 0 }, blendMode: 'ADD', frequency: 190, emitting: fire.lit }).setDepth(28);
    this.fires.push(fire);
    this.addInteract({ id: fire.id, x: fire.x, floor: fire.floor,
      label: () => this.combat.weapon.drawn ? 'Retrieve the lantern to remember' : this.memory.cooldowns.has(fire.id) ? `Memory cooling — ${Math.ceil(this.memory.cooldowns.get(fire.id) / 1000)}s` : this.run.flame < BALANCE.rememberCost ? 'Need 25 flame — Q: oil, or hold R: rest' : 'E: remember — 25 flame',
      when: () => this.run.hasLantern && !fire.spent?.() && this.memory.fire?.id !== fire.id,
      use: () => this.ignite(fire),
    });
    return fire;
  }

  ignite(fire) {
    if(this.combat.weapon.drawn){this.notice('Retrieve your lantern before remembering.');return;}
    if (!this.memory.canActivate(fire) || this.player.acting) return;
    if (this.run.flame < BALANCE.rememberCost) { this.notice('Restoration needs 25 flame. Hold R here to recover.'); return; }
    this.player.setFlipX(fire.x < this.player.x);
    this.player.act('hero-light', () => {
      if (this.dead || this.leaving || fire.spent?.()) return;
      if (!this.memory.canActivate(fire) || !this.run.spendFlame(BALANCE.rememberCost)) return;
      fire.lit = true; fire.light.on = true; fire.sprite.play('fire-ignite'); fire.embers.start();
      fire.sprite.once('animationcomplete', () => fire.sprite.active && fire.sprite.play('fire-burning'));
      this.run.litFires ??= {}; this.run.litFires[fire.id] = true;
      if (fire.spawnId) this.run.setCheckpoint(this.scene.key, fire.spawnId);
      this.memory.activate(fire);
      this.audio.cue('ignite');
      const burst = this.add.sprite(fire.x, fire.floor, 'fx_burst').setOrigin(.5, 1).setDepth(29).setScale(.7).play('fx-burst');
      burst.once('animationcomplete', () => burst.destroy());
      fire.onLit?.(fire);
      saveSession(this);
    });
  }

  setMemoryVisual(regionId, alpha) {
    this.restoration.update(this.memory.fire,alpha);
    for (const s of this.surfaces) this.refreshSurface(s);
  }

  onMemoryReady(fire) {
    for (const enemy of this.enemies) if (enemy.active && !enemy.restorationImmune && this.memory.isRestoredAt(enemy.regionId,enemy.x,(enemy.floor??560)-35)) enemy.disperse();
  }

  onMemoryEnded() { this.clearEchoes(); }

  echo(points, { delay = 250 } = {}) {
    this.clearEchoes();
    const kid = this.add.sprite(points[0].x, points[0].y, 'brother').setOrigin(0.5, 1).setDepth(27).setTint(0xffe2a0).setAlpha(0.8).play('brother-run');
    this.echoes.push(kid);
    this.voices.memoryLaugh();
    let previous = points[0];
    const tweens = points.slice(1).map((point, i) => {
      const duration = Math.hypot(point.x - previous.x, point.y - previous.y) / 220 * 1000;
      const flip = point.x < previous.x; previous = point;
      return { targets: kid, x: point.x, y: point.y, duration, delay: i ? 0 : delay, onStart: () => kid.setFlipX(flip) };
    });
    tweens.push({ targets: kid, alpha: 0, duration: 300, onComplete: () => kid.destroy() });
    this.echoTween = this.tweens.chain({ tweens });
  }

  clearEchoes() {
    this.echoTween?.stop(); this.echoTween = null;
    this.echoes?.forEach(e => e.destroy()); this.echoes = [];
  }

  story(id, ...lines) {
    if (!this.run.completeStory(id)) return false;
    this.captions.clear(); this.captions.say(...lines);
    this.events.emit('story:completed', { storyId: id }); return true;
  }

  isSafe(x, feet) {
    return this.fires.some(f => f.lit && Math.abs(x - f.x) < 130 && Math.abs(feet - f.floor) < 110);
  }

  nearFire() {
    return this.fires.filter(f => Math.abs(this.player.x - f.x) < 75 && Math.abs(this.player.feet - f.floor) < 40)
      .sort((a, b) => Math.abs(a.x - this.player.x) - Math.abs(b.x - this.player.x))[0];
  }

  notice(text) { this.noticeText.setText(text); this.noticeRemaining = 2600; }

  cancelRest(requireRelease = false) {
    const wasResting = !!this.resting;
    this.resting = null; this.restMs = 0;
    if (requireRelease) this.requireRestRelease = true;
    if (wasResting && !this.dead && this.transferRemaining == null && !this.combat.hurtRemaining) this.player.frozen = false;
  }

  updateRest(delta) {
    if (!this.keys.rest.isDown) { this.requireRestRelease = false; this.cancelRest(); return; }
    if (this.requireRestRelease || this.player.acting || this.player.climbing || this.dead || this.transferRemaining != null || this.combat.hurtRemaining || this.combat.weapon.drawn || !this.run.hasLantern || this.run.rescuedEli) return;
    const fire = this.nearFire();
    if (!fire) { this.cancelRest(); return; }
    if (this.resting !== fire) { this.restMs = 0; this.resting = fire; }
    this.player.frozen = true; this.player.setVelocityX(0); this.restMs += delta;
    if (this.restMs >= BALANCE.restDuration) {
      this.memory.cancel('rest');
      fire.lit = true; fire.light.on = true; fire.sprite.play('fire-burning'); fire.embers.start(); this.run.litFires[fire.id] = true;
      if (fire.spawnId) this.run.setCheckpoint(this.scene.key, fire.spawnId);
      this.run.recover(); this.cancelRest(true); this.audio.cue('take');
      saveSession(this);
      this.notice('Rested — health, flame and one oil vial restored.');
    }
  }

  nearestInteract() {
    return this.interactions.filter(it => it.when() && Math.abs(this.player.x - it.x) < it.range && Math.abs(this.player.feet - it.floor) < 40)
      .sort((a, b) => b.priority - a.priority || Math.abs(a.x - this.player.x) - Math.abs(b.x - this.player.x))[0];
  }

  updateInteraction(delta) {
    const pressed = Phaser.Input.Keyboard.JustDown(this.keys.use);
    if (this.resting) {
      this.promptText.setText('Resting…');
      this.holdTrack.setVisible(true); this.holdFill.setVisible(true);
      this.holdFill.width = 180 * this.restMs / BALANCE.restDuration; return;
    }
    if (this.transferRemaining != null) {
      this.promptText.setText('Passing the warmth on…');
      this.holdTrack.setVisible(false); this.holdFill.setVisible(false); return;
    }
    if (!this.keys.use.isDown) { this.requireRelease = false; this.holdTarget = null; this.holdMs = 0; }
    const it = this.player.frozen || this.player.acting || this.dead ? null : this.nearestInteract();
    this.promptText.setText(it ? (typeof it.label === 'function' ? it.label() : it.label) : '');
    const fire = this.nearFire();
    if (fire && this.run.hasLantern && !this.combat.weapon.drawn && !this.run.rescuedEli && !this.player.acting) {
      const status = this.memory.fire?.id === fire.id ? 'Memory active' : fire.spent?.() ? 'Memory spent' : '';
      this.promptText.setText([this.promptText.text || status, 'Hold R · Rest (2s)'].filter(Boolean).join('\n'));
    }
    this.promptText.setText(this.promptText.text.replace(/\bE: /g,'E · '));
    this.holdTrack.setVisible(!!it?.hold); this.holdFill.setVisible(!!it?.hold);
    if (!it || this.requireRelease || this.holdTarget && this.holdTarget !== it) { this.holdTarget = null; this.holdMs = 0; }
    if (it && !this.requireRelease) {
      if (it.hold) {
        if (pressed) this.holdTarget = it;
        if (this.holdTarget === it && this.keys.use.isDown) {
          this.holdMs += delta;
          if (this.holdMs >= it.hold) { this.requireRelease = true; this.holdTarget = null; this.holdMs = 0; it.use(); }
        }
      } else if (pressed) { this.requireRelease = true; it.use(); }
    }
    this.holdFill.width = it?.hold ? Math.min(1, this.holdMs / it.hold) * 180 : 0;
  }

  die(reason = 'shadow') {
    if (this.dead || this.leaving || this.transferRemaining != null || this.run.rescuedEli) return;
    this.dead = true; this.run.deaths++;
    this.combat.cancel(); this.cancelRest(true);
    this.combat.resetWeapon();
    this.memory.cancel('death'); this.player.cancelAction(); this.player.stopClimb();
    this.player.frozen = true; this.player.setVelocity(0); this.player.play('hero-death');
    this.promptText.setText('The lantern remembers the way back…'); this.audio.cue('death');
    this.events.emit('player:died', { checkpointId: this.run.checkpoint.spawnId, reason });
    this.time.delayedCall(850, () => {
      const spawn = this.getSpawn(this.run.checkpoint.spawnId);
      this.player.body.reset(spawn.x, spawn.y); this.player.setVelocity(0); this.player.frozen = false;
      this.player.play('hero-idle'); this.dead = false; this.invulnerable = 1400;
      this.run.recover(); this.combat.hurtRemaining = 0; this.player.setAlpha(1).clearTint();
      this.requireRelease = true; this.holdMs = 0; this.holdTarget = null;
      this.player.resetJump();
      this.enemies.forEach(e => e.active && e.resetEncounter());
      this.events.emit('player:respawned', { checkpointId: this.run.checkpoint.spawnId });
    });
  }

  goTo(key, spawnId) {
    if (this.leaving || this.dead) return;
    if(this.combat.weapon.drawn){this.notice('Retrieve your lantern before leaving.');return;}
    this.audio.cue('door');
    this.leaving = true; this.memory.cancel('transition'); this.player.cancelAction();
    if (key === 'Hearth' || key === 'World') this.run.setCheckpoint(key, spawnId);
    saveSession(this);
    this.scene.start(key, { spawnId });
  }

  getGoal() {
    if (this.scene.key === 'Hearth' && this.run.rescuedEli) return { text: 'Epilogue: sit by the hearth together', scene: 'Hearth', x: 530, y: 430 };
    if (this.scene.key === 'Hearth' && this.run.eliFound && !this.run.hasHearthEmber) return { text: 'Remember the hearth, then hold E to take its last ember', scene: 'Hearth', x: 530, y: 430 };
    if (this.scene.key === 'Hearth' && this.run.hasHearthEmber) return { text: 'Take the iron cellar door on the right, then the Old Road to the tower', scene: 'Hearth', x: 980, y: 650 };
    return this.run.goal;
  }

  update(_time, delta) {
    const inventory = Phaser.Input.Keyboard.JustDown(this.keys.inventory);
    const map = Phaser.Input.Keyboard.JustDown(this.keys.map), journal = Phaser.Input.Keyboard.JustDown(this.keys.journal);
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause) || inventory || map || journal) {
      saveSession(this);
      this.audio.pause(); this.events.emit('game:paused', {});
      this.scene.launch('Pause', { owner: this.scene.key, inventory, map, journal }); this.scene.pause(); return;
    }
    this.audio.update(delta);
    if(this.cinematic.active){this.cinematic.update(delta);this.lighting.update(delta);this.syncScreenCameras();return;}
    if (Phaser.Input.Keyboard.JustDown(this.keys.next)) {
      if (this.transferRemaining != null) this.transferRemaining = 0;
      else this.captions.advance();
    }
    if (this.dead || this.leaving) return;
    this.invulnerable = Math.max(0, this.invulnerable - delta);
    this.updateRest(delta);
    if (Phaser.Input.Keyboard.JustDown(this.keys.weapon)) this.combat.toggleWeapon();
    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) this.combat.sweep();
    if (Phaser.Input.Keyboard.JustDown(this.keys.oil) && this.run.hasLantern && !this.combat.weapon.drawn && !this.player.acting && !this.player.frozen && this.transferRemaining == null && !this.run.rescuedEli) {
      if (this.run.useOil()) { this.audio.cue('take'); this.notice('Oil used — flame restored.'); }
      else this.notice(this.run.oil ? 'Flame is full — oil kept.' : 'No oil. Hold R at a fire to refill.');
    }
    this.player.update(this.ladders);
    this.contactShadow.setPosition(this.player.x,this.player.feet+2).setAlpha(this.player.body.blocked.down ? .5 : 0);
    this.combat.update(delta);
    this.memory.update(delta);
    this.tick?.(delta);
    if (this.leaving) return;
    if(this.cinematic.active){this.lighting.update(delta);this.syncScreenCameras();return;}
    const desiredLook = this.player.body.velocity.x === 0 ? 0 : Math.sign(this.player.body.velocity.x) * 110;
    this.look = Phaser.Math.Linear(this.look, desiredLook, 1 - Math.exp(-delta / 180));
    const camera = this.cameras.main;
    const target = Phaser.Math.Clamp((this.cameraFocusX ?? this.player.x + this.look) - 640, 0, this.width - 1280);
    camera.scrollX = Phaser.Math.Linear(camera.scrollX, target, 1 - Math.exp(-delta / 110));
    this.lantern.on = this.run.hasLantern;
    this.lantern.radius = 140 + this.run.flame * 0.6;
    this.player.setAlpha(this.invulnerable > 0 && this.invulnerable < 1300 ? 0.6 + Math.abs(Math.sin(this.invulnerable / 75)) * 0.4 : 1);
    this.lighting.update(delta);
    this.memoryShock=Math.max(0,(this.memoryShock??0)-delta);
    for (const enemy of this.enemies) if (enemy.active) {
      if(this.memoryShock>0)continue;
      enemy.tick(delta);
      if(this.cinematic.active)break;
      if (enemy.touches(this.player)) this.combat.damage(enemy.x);
    }
    if(this.cinematic.active){this.syncScreenCameras();return;}
    if (this.player.feet > 900) this.die('fall');
    this.updateInteraction(delta);
    const goal = this.getGoal();
    const objective=goal.text.replace(/^Act \d: /,'');
    this.objectiveText.setText(objective.charAt(0).toUpperCase()+objective.slice(1));
    const direction = goal.scene !== this.scene.key ? 'Passage' : Math.abs(goal.x - this.player.x) < 75 ? goal.y < this.player.feet - 40 ? '↑ Above you' : goal.y > this.player.feet + 40 ? '↓ Below you' : 'Here' : goal.x > this.player.x ? '→ Ahead' : '← Back';
    this.goalHint.setText(`${direction} · ${goal.scene === 'Hearth' ? 'Family home' : regionAt(goal.x).name} · M map · J journal · Autosaved`);
    if (this.lastObjective !== goal.text) {
      this.lastObjective = goal.text;
      document.getElementById('game-status')?.replaceChildren(goal.text);
      saveSession(this);
    }
    this.saveClock += delta;
    if (this.saveClock > 1500 && !this.dead) { this.saveClock = 0; saveSession(this); }
    this.inventoryText.setText([this.run.hasLantern ? 'Lantern' : '', this.run.hasEmberCup ? 'Ember cup' : '', this.run.hasHearthEmber ? 'Hearth ember — safe in your lantern' : ''].filter(Boolean).join('   ·   '));
    this.healthText.setText(`Health ${this.run.health} / ${BALANCE.health}`);
    this.healthSegments.forEach((segment, i) => segment.setTint(i < this.run.health ? 0xffffff : 0x484556).setAlpha(i < this.run.health ? 1 : .65));
    this.flameText.setText(`${this.run.flame} / ${BALANCE.flame}`);
    this.oilText.setText(`${this.run.oil} / ${BALANCE.oil}`);
    this.flameFill.width = 214 * this.run.flame / BALANCE.flame;
    this.flameFill.setFillStyle(this.run.flame < BALANCE.rememberCost ? 0xca805e : 0xf5b05b);
    this.captions.layout();
    const showPrompt=!this.captions.busy&&!this.activeBossHud?.visible;
    this.promptText.setVisible(showPrompt);
    this.promptPanel.setVisible(!!this.promptText.text&&showPrompt);
    this.promptPanel.resizePanel(Math.min(820,Math.max(260,this.promptText.width+48)),Math.max(50,this.promptText.height+26));
    this.noticeRemaining = Math.max(0, this.noticeRemaining - delta);
    this.noticeText.setVisible(!this.captions.busy);
    if (!this.noticeRemaining) this.noticeText.setText('');
    const memory = this.memory;
    this.timerTrack.setVisible(!!memory.fire); this.timerFill.setVisible(!!memory.fire);
    this.timerFill.width = memory.fire ? 300 * Math.max(0, memory.remaining / memory.fire.duration) : 0;
    this.timerFill.setFillStyle(memory.phase === 'warning' ? 0xff9763 : 0xf5d28a);
    this.timerText.setText(memory.fire ? (memory.phase === 'warming' ? 'Remembering…' : memory.phase === 'fading' ? 'Fading…' : `${Math.ceil(memory.remaining / 1000)}s${memory.phase === 'warning' ? ' · fading' : ''}`) : '');
    this.syncScreenCameras();
  }
}
