import Phaser from 'phaser';
import { createTextures } from '../textures.js';
import { FONT } from '../systems/Captions.js';
import { getSession } from '../world/WorldState.js';
import { createPresentationTextures } from '../presentation/textures.js';

const BACKGROUNDS = [
  'bg_title_screen', 'cut_01_before', 'cut_02_sun_breaks', 'cut_03_meteors',
  'bg_sky_dark', 'bg_sky_restored', 'bg_skyline_dark', 'bg_skyline_restored',
  'bg_p1_home_dark', 'bg_p1_home_restored', 'bg_p2_yard_dark', 'bg_p2_yard_restored',
  ...['lane', 'square', 'bridge', 'campfire'].flatMap((n) => [`bg_a1_${n}_dark`, `bg_a1_${n}_restored`]),
];

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2 - 200, height / 2, 0, 6, 0xffc864).setOrigin(0, 0.5);
    this.add.text(width / 2, height / 2 - 30, 'kindling…', { fontFamily: FONT, fontSize: '22px', color: '#d8c8b0' }).setOrigin(0.5);
    this.load.on('progress', (p) => (bar.width = 400 * p));
    for (const key of BACKGROUNDS) this.load.image(key, `bg/${key}.png`);
    // Region paintings added later (Act 2/3) are listed by tools/process_backgrounds.py.
    this.load.json('bg-manifest', 'bg/manifest.json');
    this.load.once('filecomplete-json-bg-manifest', (_key, _type, names) => {
      for (const key of names) if (!BACKGROUNDS.includes(key)) this.load.image(key, `bg/${key}.png`);
    });
    this.load.json('presentation-manifest', 'art/manifest.json');
    this.load.once('filecomplete-json-presentation-manifest', (_key, _type, assets) => {
      for (const [key, path] of Object.entries(assets)) {
        if (path.endsWith('.svg')) this.load.svg(key, path);
        else this.load.image(key, path);
      }
    });

    // Sprite sheets: frame sizes come from the manifest written by tools/extract_sprites.py.
    this.load.json('sprites', 'sprites/sprites.json');
    this.load.once('filecomplete-json-sprites', (key, type, data) => {
      for (const [name, a] of Object.entries(data.anims)) {
        this.load.spritesheet(name, `sprites/${name}.png`, { frameWidth: a.frameWidth, frameHeight: a.frameHeight });
      }
      for (const name of Object.keys(data.images)) this.load.image(name, `sprites/${name}.png`);
    });
  }

  create() {
    createPresentationTextures(this);
    createTextures(this);
    // ?scene=Yard jumps straight to a scene while developing.
    const start = new URLSearchParams(location.search).get('scene') || 'Title';
    if (start === 'World') getSession(this).hasLantern = true;
    this.scene.start(start, ['Title', 'Intro', 'Home'].includes(start) ? undefined : { hasLantern: true });
  }
}
