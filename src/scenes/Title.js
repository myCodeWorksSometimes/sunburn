import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';

export class Title extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, height / 2, 'bg_title_screen');
    this.tweens.add({ targets: bg, scale: 1.05, duration: 20000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Drifting embers.
    this.add.particles(0, height + 10, 'spark', {
      x: { min: 0, max: width }, lifespan: 6000, speedY: { min: -60, max: -20 }, speedX: { min: -15, max: 15 },
      scale: { start: 0.6, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', frequency: 180,
    });

    this.add.text(70, 80, 'EMBERS OF', { fontFamily: FONT, fontSize: '40px', color: '#e8b070' }).setShadow(3, 3, '#000', 0);
    this.add.text(66, 116, 'BEFORE', { fontFamily: FONT, fontSize: '96px', fontStyle: '600', color: '#ffd9a0' }).setShadow(4, 4, '#000', 0);
    const press = this.add.text(70, 250, '[ Enter ]  begin', { fontFamily: FONT, fontSize: '26px', color: '#f3e6d0' }).setShadow(2, 2, '#000', 0);
    this.tweens.add({ targets: press, alpha: 0.3, yoyo: true, repeat: -1, duration: 900 });

    this.cameras.main.fadeIn(1200);
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Intro'));
    };
    this.input.keyboard.on('keydown-ENTER', go);
    this.input.keyboard.on('keydown-SPACE', go);
  }
}
