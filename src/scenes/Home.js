import { LevelScene } from './LevelScene.js';

const UPPER = 425;
const CELLAR = 672;

// Prologue, part 1: waking in the cellar of the family home.
export class Home extends LevelScene {
  constructor() {
    super('Home');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.8,
      restoredDarkness: 0.15,
      layers: [{ dark: 'bg_p1_home_dark', restored: 'bg_p1_home_restored', restoredTransform: { y: -30 } }],
      platforms: [
        { x1: 60, x2: 1095, y: UPPER, oneWay: true },
        { x1: 60, x2: 1095, y: CELLAR },
      ],
      walls: [
        { x: 50, top: 0, bottom: 720 },
        { x: 1105, top: 0, bottom: 720 },
      ],
      ladders: [{ x: 457, top: UPPER, bottom: CELLAR }],
      spawn: { x: 860, y: CELLAR },
    };
  }

  build() {
    const say = (...l) => this.captions.say(...l);
    this.candleLit = false;

    // The cellar candle that kept burning through it all.
    this.lighting.add({ x: 653, y: 582, radius: 170, intensity: 0.7, flicker: 0.15 });

    // Light the lantern from the cellar candle.
    const spark = this.add.image(653, 560, 'ui_spark').setScale(0.35).setDepth(60).setBlendMode('ADD');
    this.tweens.add({ targets: spark, alpha: 0.3, scale: 0.28, yoyo: true, repeat: -1, duration: 700 });
    this.addInteract({
      x: 653, floor: CELLAR, label: 'Light the lantern', kind: 'light',
      use: () => {
        spark.destroy();
        this.player.giveLantern();
        this.lanternLight.on = true;
        say("Grandpa's old lantern. Still has oil.", { text: '(W / S to climb the ladder)', color: '#bfa98a' });
      },
    });

    // Something watches from the dark upstairs.
    this.addShadow(1050, UPPER, { speed: 30, sense: 320 });

    // Upstairs memories.
    const inspect = (x, label, item, ...lines) =>
      this.addInteract({ x, floor: UPPER, label, kind: 'inspect', use: () => { this.showItem(item); say(...lines); } });
    inspect(590, 'Look at the drawing', 'item_drawing', 'He drew all of us last summer. Everyone holding hands, under the sun.');
    inspect(650, 'Look at the photo', 'item_photo', 'Us, last spring. He made me promise to take him up the clock tower one day.');
    inspect(975, 'Look at the teddy bear', 'item_teddy', 'He never goes anywhere without this...', 'He must have left in a hurry.');

    const candle = this.addFire(527, 348, { radius: 360, duration: 12000, scale: 0.35 });
    candle.permanent = true;
    this.addInteract({
      x: 527, floor: UPPER, label: 'Light the candle', kind: 'light',
      when: () => this.player.hasLantern,
      use: () => this.lightFire(candle),
    });

    this.addInteract({
      x: 175, floor: UPPER, label: 'Go outside', once: false,
      use: () => {
        if (!this.candleLit) say("Not yet. I can barely see. There's a candle on the table...");
        else this.goTo('Yard', { hasLantern: true });
      },
    });

    this.time.delayedCall(900, () => say('...How long was I down here?', "It's so dark. I need light.", { text: '(A / D to move, E to interact)', color: '#bfa98a' }));
  }

  onRewindStart() {
    this.candleLit = true;
    this.captions.clear();
    this.captions.say('The candle... the room remembers.');
    this.playEcho([{ x: 975, y: UPPER }, { x: 900, y: UPPER }, { x: 175, y: UPPER }], { ball: true, delay: 1400, speed: 280 });
    this.time.delayedCall(5200, () => this.captions.say('He grabbed his ball and ran out. To the playground.'));
  }

  onRewindEnd() {
    this.captions.say('The past fades again. I have to follow him.');
  }
}
