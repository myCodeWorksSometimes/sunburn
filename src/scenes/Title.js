import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';
import { newSession, readSave, resumeSession } from '../world/WorldState.js';
import { UI, panel } from '../presentation/ui.js';
import { homePainting } from '../presentation/Act1Presentation.js';

export class Title extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, height / 2, homePainting(this,'dark')).setAlpha(0.45);
    this.tweens.add({ targets: bg, scale: 1.05, duration: 20000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Drifting embers.
    this.add.particles(0, height + 10, 'spark', {
      x: { min: 0, max: width }, lifespan: 6000, speedY: { min: -60, max: -20 }, speedX: { min: -15, max: 15 },
      scale: { start: 0.6, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', frequency: 180,
    });

    this.add.text(74, 87, 'EMBERS OF', { fontFamily: UI.title, fontSize: '31px', color: '#c5ab84', letterSpacing: 6 }).setShadow(3, 3, '#000', 0);
    this.add.text(70, 120, 'BEFORE', { fontFamily: UI.title, fontSize: '96px', color: '#f3d8ab', letterSpacing: 4 }).setShadow(4, 4, '#000', 0);
    panel(this,320,333,520,150,{depth:0,fixed:false,alpha:.82});
    this.add.image(760,340,'kit-medallion').setDisplaySize(145,145).setAlpha(.75);
    const saved = readSave(), canContinue = saved && !saved.completed;
    const press = this.add.text(100, canContinue?282:315, canContinue ? 'Enter · Continue' : 'Enter · Begin', { fontFamily: FONT, fontSize: '25px', color: '#f3e6d0',resolution:2 }).setShadow(2, 2, '#000', 0);
    const fresh = this.add.text(100, 345, canContinue ? 'N · New adventure' : '', { fontFamily: FONT, fontSize: '20px', color: '#c4b69e',resolution:2 });
    this.add.text(96, 446, 'Light the past. Bring him home.', { fontFamily: FONT, fontSize: '20px', color: '#e8b070' });

    this.tweens.add({ targets: press, alpha: 0.7, yoyo: true, repeat: -1, duration: 900 });

    this.cameras.main.fadeIn(1200);
    let started = false;
    const go = (resume = false) => {
      if (started) return;
      started = true;
      const run = resume ? resumeSession(this) : null;
      if (!run) newSession(this);
      this.cameras.main.fadeOut(700, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => run ? this.scene.start(run.checkpoint.scene, { spawnId: run.checkpoint.spawnId }) : this.scene.start('Intro'));
    };
    this.input.keyboard.on('keydown-ENTER', () => go(canContinue));
    this.input.keyboard.on('keydown-SPACE', () => go(canContinue));
    this.input.keyboard.on('keydown-N', () => go(false));
    press.setInteractive({ useHandCursor: true }).on('pointerdown', () => go(canContinue));
    if (canContinue) fresh.setInteractive({ useHandCursor: true }).on('pointerdown', () => go(false));
    document.getElementById('game-status')?.replaceChildren('Embers of Before. Press Enter to begin.');
  }
}
