import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';
import { UI } from '../presentation/ui.js';

export class Credits extends Phaser.Scene {
  constructor() { super('Credits'); }
  create() {
    this.cameras.main.setBackgroundColor('#11101b');
    this.add.image(640, 360, 'bg_a1_campfire_dark').setAlpha(.28);
    const text = (y, line, size, colour = '#e8d8c0') => this.add.text(640, y, line, { fontFamily: FONT, fontSize: `${size}px`, color: colour, align: 'center' }).setOrigin(0.5);
    text(125, 'EMBERS OF BEFORE', 44, '#f5d28a').setFontFamily(UI.title);
    text(205, 'Light the past. Bring him home.', 22);
    text(236, 'THE RUINED VILLAGE  ·  THE PLAYGROUND  ·  THE CLOCK TOWER', 13, '#b6a78f');
    this.add.sprite(600, 360, 'hero_idle').setOrigin(0.5, 1).play('hero-idle');
    this.add.sprite(690, 360, 'brother').setOrigin(0.5, 1).play('brother-idle');
    this.add.image(636, 320, 'glow').setScale(0.7).setAlpha(0.6).setBlendMode('ADD');
    text(415, 'The night remains. Eli is here.', 24, '#f5d28a');
    text(485, 'Created by the Sunburn team · Phaser and Vite\nSupplied world / hero art · AI-assisted pixel UI and creature animation\nCC0 effects: Ogrebane · rubberduck · AntumDeluge\nOriginal boss scores · Bundled synthetic character dialogue\nSources and processing: audio/LICENSES.md · voices/README.md', 15);
    text(590, '[ Enter ]  Return to title', 22).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('Title'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Title'));
    document.getElementById('game-status')?.replaceChildren('Adventure complete. Eli is rescued. Enter returns to title.');
  }
}
