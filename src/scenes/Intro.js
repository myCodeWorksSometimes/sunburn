import Phaser from 'phaser';
import { Captions, FONT } from '../systems/Captions.js';

// Meteor corruption, followed by the last ordinary afternoon's remembered world.
const SHOTS = [
  {
    key: 'cut_01_before', duration: 9500,
    lines: [
      { speaker: 'Eli', text: 'The tower today?', color: '#ffe2a0' },
      { speaker: 'Rowan', text: 'After work. I promise.', color: '#c8d8ff' },
      { speaker: 'Eli', text: 'I’ll be by the square.', color: '#ffe2a0' },
    ],
  },
  { key: 'cut_01_before', duration: 2500, impact: true, lines: ['A meteor struck. Daylight never returned.'] },
];

export class Intro extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create() {
    this.done = false;
    const { width, height } = this.scale;
    this.captions = new Captions(this);
    this.add.text(width - 20, 20, '[Enter] skip', { fontFamily: FONT, fontSize: '16px', color: '#8a7a6a' }).setOrigin(1, 0).setDepth(200);
    this.input.keyboard.once('keydown-ENTER', () => this.finish());
    this.index = 0;
    this.showShot();
  }

  showShot() {
    const shot = SHOTS[this.index];
    if (!shot) return this.finish();
    const { width, height } = this.scale;
    const img = this.add.image(width / 2, height / 2, shot.key).setScale(1.02);
    this.tweens.add({ targets: img, scale: 1.1, duration: shot.duration + 1000 });
    const cam = this.cameras.main;
    if (shot.impact) {
      const streak = this.add.graphics().lineStyle(8, 0xffbd7a, 1).lineBetween(990, 0, 650, 350);
      const veil = this.add.rectangle(640, 360, 1280, 720, 0x100c1b).setAlpha(0).setDepth(5);
      this.tweens.add({ targets: veil, alpha: 1, duration: 1200 });
      this.time.delayedCall(1200, () => streak.destroy());
    }
    cam.fadeIn(700);
    if (shot.shake) cam.shake(shot.duration, shot.shake);
    if (shot.flash) cam.flash(900, 255, 120, 60);
    this.captions.clear();
    this.time.delayedCall(500, () => this.captions.say(...shot.lines));
    this.time.delayedCall(shot.duration, () => {
      cam.fadeOut(600, 0, 0, 0);
      cam.once('camerafadeoutcomplete', () => {
        img.destroy();
        this.index++;
        this.showShot();
      });
    });
  }

  blackout() {
    this.cameras.main.resetFX();
    this.cameras.main.setAlpha(1);
    this.captions.clear();
    this.cameras.main.fadeIn(10);
    this.captions.say({ text: 'I was down in the cellar when it hit.', hold: 1800 });
    this.time.delayedCall(4200, () => this.finish());
  }

  finish() {
    if (this.done) return;
    this.done = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Hearth', { spawnId: 'cellar' }));
  }
}
