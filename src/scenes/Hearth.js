import Phaser from 'phaser';
import { Adventure } from './Adventure.js';
import { placeProp } from '../presentation/Scenery.js';
import { saveSession } from '../world/WorldState.js';

const SPAWNS = { cellar: { x: 900, y: 650 }, front: { x: 175, y: 430 }, shortcut: { x: 205, y: 650 } };

export class Hearth extends Adventure {
  constructor() { super('Hearth'); }
  getSpawn(id) { return SPAWNS[id] || SPAWNS.cellar; }

  create() {
    const spawnId = this.entry.spawnId || 'cellar';
    this.setup(1280, this.getSpawn(spawnId));
    this.run.setCheckpoint('Hearth', spawnId);
    this.regionText.setText('The family hearth');
    this.add.image(0, 0, 'bg_p1_home_dark').setOrigin(0).setDepth(-5).setAlpha(0.7);
    const past = this.add.image(0, 0, 'bg_p1_home_restored').setOrigin(0).setDepth(-4).setAlpha(0);
    this.regionVisuals.set('home', [past]);
    this.regionBounds.set('home', { x: 0, width: 1280 });
    // The legacy interior includes an obsolete shattered-sun illustration beyond
    // the right wall. Keep the supplied interior while hiding that non-canonical sky.
    this.add.rectangle(1118, 0, 162, 720, 0x11101b).setOrigin(0).setDepth(-3);
    this.addSurface(55, 1105, 650, { colour: 0x39343e });
    this.addSurface(55, 1105, 430, { colour: 0x3e3542 });
    this.addWall(50, 690, 450); this.addWall(1110, 690, 450);
    this.ladders = [{ x: 440, top: 430, bottom: 650 }];
    placeProp(this, 'ladder', 440, 650, 46, 220);
    this.addLabel(440, 547, 'W / S', '#ffe1a5', 13);
    placeProp(this, 'door', 175, 430, 72, 115);
    placeProp(this, 'door', 205, 650, 72, 115).setTint(0xb2a3b0);
    this.add.image(860, 365, 'item_photo').setDisplaySize(47, 39).setDepth(16);
    const lantern = placeProp(this, 'item-lantern', 650, 650, 38, 48, 21).setVisible(!this.run.hasLantern);
    this.tweens.add({ targets: lantern, y: 644, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.lighting.add({ x: 650, y: 600, radius: 180, intensity: 0.8, on: true });
    this.addInteract({ id: 'lantern', x: 650, floor: 650, label: 'E: light the lantern', when: () => !this.run.hasLantern,
      use: () => { this.run.hasLantern = true; this.player.giveLantern(); lantern.setVisible(false); this.audio.cue('take'); this.story('lantern-found', { speaker: 'Rowan', text: 'Grandpa’s lantern. Still warm.' }); } });
    this.hearth = this.addFire({ id: 'home-hearth', regionId: 'home', x: 530, floor: 430, duration: 18000, spawnId: 'front', spent: () => this.run.homeMemorySpent });
    this.addInteract({ id: 'take-hearth', x: 530, floor: 430, priority: 10, hold: 1000,
      label: 'Hold E: take the last ember\nThis home’s memory will fade.',
      when: () => this.run.hasEmberCup && this.run.eliFound && !this.run.homeMemorySpent && this.memory.isRestored('home'),
      use: () => {
        if (!this.run.takeHearthEmber()) return;
        this.memory.cancel('hearth-spent'); this.audio.cue('take');
        this.story('hearth-spent', { speaker: 'Rowan', text: 'I’m coming now.' });
      } });
    this.addInteract({ id: 'front-door', x: 175, floor: 430, label: 'E: go outside',
      use: () => {
        if (this.run.rescuedEli) { this.captions.say('The hearth is waiting for both of us.'); return; }
        if (!this.run.completedStory['home-first-memory']) this.captions.say('The hearth upstairs still holds a memory. Light it first.');
        else this.goTo('World', 'front');
      } });
    placeProp(this, 'item-ember', 205, 579, 16, 20, 17).setTint(this.run.shortcutOpen ? 0xffffff : 0x5a5667);
    this.addInteract({ id: 'cellar-latch', x: 205, floor: 650,
      label: () => this.run.shortcutOpen ? 'E: passage to the market' : this.run.hasHearthEmber ? 'E: warm the latch with the ember' : 'E: inspect the cold latch',
      use: () => {
        if (this.run.rescuedEli) { this.captions.say('We’re home. Let’s sit by the fire.'); return; }
        if (!this.run.hasHearthEmber && !this.run.shortcutOpen) { this.captions.say('A hearth mark. The latch needs an ember from home.'); return; }
        this.run.shortcutOpen = true; this.audio.cue('take'); this.goTo('World', 'shortcut');
      } });
    this.addInteract({ id: 'family-photo', x: 860, floor: 430, label: 'E: look at the family photograph',
      when: () => !this.run.completedStory['photo'],
      use: () => this.story('photo', { speaker: 'Rowan', text: 'I promised him the view from the tower. Always later.' }) });
    if (!this.run.completedStory['wake']) this.time.delayedCall(450, () => this.story('wake', { speaker: 'Rowan', text: 'Eli?' }, { text: 'A/D: move · E: interact · W/S: climb', color: '#ebd5b0', hold: 1200 }));
    if (this.run.rescuedEli) {
      this.hearth.lit = true; this.hearth.light.on = true; this.hearth.sprite.play('fire-burning'); this.hearth.embers.start();
      this.eli = this.add.sprite(this.player.x + 65, this.player.y, 'brother').setOrigin(.5, 1).setDepth(25).play('brother-idle');
      this.story('home-together', { speaker: 'Eli', text: 'You came this time.' }, { speaker: 'Rowan', text: 'No more later.' });
      this.addInteract({ id: 'home-ending', x: 530, floor: 430, hold: 1000, priority: 30,
        label: 'Hold E: sit by the hearth together', when: () => !this.run.completed && !this.sitting,
        use: () => {
          // CAMPAIGN Scene 14: the hearth can't replay their afternoon. Eli taps
          // twice, and the player answers.
          this.sitting = true; this.player.frozen = true; this.player.setVelocityX(0);
          this.captions.clear(); this.captions.say({ text: 'The hearth can’t bring back that afternoon. It just keeps them warm.', hold: 1000 });
          this.time.delayedCall(3200, () => {
            this.audio.cue('knock'); this.captions.say({ text: '… tap, tap …', color: '#ffe1a1', hold: 1600 });
            this.awaitingAnswer = true;
          });
        } });
    }
  }

  tick(delta) {
    if (!this.eli) return;
    if (this.awaitingAnswer) {
      this.notice('E: tap twice back');
      if (Phaser.Input.Keyboard.JustDown(this.keys.use)) {
        this.awaitingAnswer = false;
        this.audio.cue('knock'); this.time.delayedCall(300, () => this.audio.cue('knock'));
        this.run.completed = true; saveSession(this);
        this.captions.clear(); this.captions.say({ text: 'Outside, the night remains. Inside, two knocks are answered.', hold: 1200 });
        this.events.emit('game:completed', { endingId: 'three-acts-home' });
        this.time.delayedCall(3800, () => this.goTo('Credits'));
      }
      return;
    }
    // Eli follows between floors: once Rowan is off the ladder on another floor,
    // he appears at the ladder on that floor.
    const floor = (feet) => feet < 540 ? 430 : 650;
    if (!this.player.climbing && !this.eliMoving && floor(this.player.feet) !== this.eli.y) {
      this.eliMoving = true;
      this.tweens.add({ targets: this.eli, alpha: 0, duration: 200, onComplete: () => {
        this.eli.setPosition(this.ladders[0].x - 50, floor(this.player.feet));
        this.tweens.add({ targets: this.eli, alpha: 1, duration: 250, onComplete: () => { this.eliMoving = false; } });
      } });
    }
    const dx = this.player.x + (this.player.flipX ? 65 : -65) - this.eli.x;
    this.eli.x += Math.sign(dx) * Math.min(Math.abs(dx), delta * .22);
    this.eli.setFlipX(dx < 0).play(Math.abs(dx) > 10 ? 'brother-run' : 'brother-idle', true);
  }

  onMemoryReady(fire) {
    super.onMemoryReady(fire);
    this.audio.cue('knock');
    if (this.run.eliFound) {
      this.story('home-return-memory', { speaker: 'Echo Eli', text: 'You’ll come this time?' }, { speaker: 'Echo Rowan', text: 'Later. I promise.' });
      this.echo([{ x: 240, y: 430 }, { x: 240, y: 430 }], { delay: 3500 });
    } else {
      this.story('home-first-memory', { text: '… tap, tap …', color: '#ffe1a1', hold: 900 }, { speaker: 'Rowan', text: 'The room… it’s before the impact.' }, { speaker: 'Rowan', text: 'Eli. He went outside.' });
      this.echo([{ x: 975, y: 430 }, { x: 175, y: 430 }]);
    }
  }
}
