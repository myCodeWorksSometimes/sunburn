import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';

// Chapter end card. data.act picks the text (0 = prologue).
const CARDS = {
  0: ['End of the Prologue', 'He went to the playground. I have to follow.', 'Act 1 — The Ruined Village'],
  1: ['End of Act 1', 'The playground is just across the bridge.', 'Act 2 — The Playground — coming soon'],
};

export class End extends Phaser.Scene {
  constructor() {
    super('End');
  }

  init(data) {
    this.act = data?.act ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    const [title, line, next] = CARDS[this.act];
    const lines = [
      [title, '44px', '#ffd9a0'],
      [line, '24px', '#e8d8c0'],
      [next, '22px', '#a89880'],
      ['[ Enter ]  play again', '20px', '#8a7a6a'],
    ];
    lines.forEach(([t, size, color], i) => {
      const txt = this.add.text(width / 2, height / 2 - 90 + i * 64, t, { fontFamily: FONT, fontSize: size, color }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: txt, alpha: 1, delay: 600 + i * 900, duration: 1000 });
    });
    this.add.particles(0, height + 10, 'spark', {
      x: { min: 0, max: width }, lifespan: 6000, speedY: { min: -50, max: -20 },
      scale: { start: 0.5, end: 0 }, alpha: { start: 0.8, end: 0 }, blendMode: 'ADD', frequency: 250,
    });
    this.time.delayedCall(3000, () => this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Title')));
  }
}
