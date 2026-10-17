import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';
import { newSession, readSave, resumeSession } from '../world/WorldState.js';
import { UI } from '../presentation/ui.js';

export class Title extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, height / 2, 'bg_p1_home_dark').setAlpha(0.45);
    this.tweens.add({ targets: bg, scale: 1.05, duration: 20000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.add.rectangle(1090, 0, 190, 300, 0x11101b).setOrigin(0);

    // Drifting embers.
    this.add.particles(0, height + 10, 'spark', {
      x: { min: 0, max: width }, lifespan: 6000, speedY: { min: -60, max: -20 }, speedX: { min: -15, max: 15 },
      scale: { start: 0.6, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', frequency: 180,
    });

    this.add.text(74, 87, 'EMBERS OF', { fontFamily: UI.title, fontSize: '31px', color: '#c5ab84', letterSpacing: 6 }).setShadow(3, 3, '#000', 0);
    this.add.text(70, 120, 'BEFORE', { fontFamily: UI.title, fontSize: '96px', color: '#f3d8ab', letterSpacing: 4 }).setShadow(4, 4, '#000', 0);
    const saved = readSave(), canContinue = saved && !saved.completed;
    const press = this.add.text(70, 250, canContinue ? '[ Enter ]  continue adventure' : '[ Enter ]  begin', { fontFamily: FONT, fontSize: '26px', color: '#f3e6d0' }).setShadow(2, 2, '#000', 0);
    const fresh = this.add.text(70, 298, canContinue ? '[ N ]  new adventure' : 'Prologue · The Ruined Village · The Playground · The Clock Tower', { fontFamily: FONT, fontSize: '18px', color: '#c4b69e' });
    this.add.text(70, 355, 'Light the past. Bring him home.', { fontFamily: FONT, fontSize: '20px', color: '#e8b070' });
    this.add.text(72, 649, 'A village held in night. A promise still burning.', { fontFamily: FONT, fontSize: '16px', color: '#aaa4a4' });
    this.tweens.add({ targets: press, alpha: 0.3, yoyo: true, repeat: -1, duration: 900 });

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
