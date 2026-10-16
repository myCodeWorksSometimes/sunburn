import { LevelScene } from './LevelScene.js';

// Act 1 — The Ruined Village. Four screens played left to right:
// lane -> market square -> broken bridge -> village campfire.

const SKY = [
  { dark: 'bg_sky_dark', restored: 'bg_sky_restored', scroll: 0.1 },
  { dark: 'bg_skyline_dark', restored: 'bg_skyline_restored', scroll: 0.4 },
];
const hint = (text) => ({ text, color: '#bfa98a' });

// ---------------------------------------------------------------------------
// 1. Village lane: hide on the crates, slip past the shadow, light the brazier.
// ---------------------------------------------------------------------------
const LANE = 555;

export class A1Lane extends LevelScene {
  constructor() {
    super('A1Lane');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.8,
      restoredDarkness: 0.06,
      layers: [...SKY, { dark: 'bg_a1_lane_dark', restored: 'bg_a1_lane_restored', restoredTransform: { x: 10, y: 30 } }],
      platforms: [
        { x1: 0, x2: 1290, y: LANE },
        { x1: 300, x2: 430, y: 470, oneWay: true }, // crate stack
      ],
      spawn: { x: 40, y: LANE },
      exit: { x: 1262, to: 'A1Square', when: () => this.lit },
    };
  }

  build() {
    this.lit = false;
    this.warned = false;
    this.lurker = this.addShadow(780, LANE, { speed: 80, sense: 380 });
    const brazier = this.addFire(1245, 462, { radius: 420, duration: 12000, scale: 0.7 });
    this.addInteract({
      x: 1238, floor: LANE, label: 'Light the brazier', kind: 'light', once: false,
      when: () => brazier.ready && !this.rewinding,
      use: () => this.lightFire(brazier),
    });
    this.time.delayedCall(900, () => this.captions.say('The village... so quiet.', "If anyone's left, they're hiding."));
  }

  tick() {
    if (!this.warned && this.lurker.active && this.lurker.hunting) {
      this.warned = true;
      this.captions.clear();
      this.captions.say('Another one!', hint('(Shadows can only reach you on their own level. Get up high, then jump over it.)'));
    }
    if (this.player.x > 1200 && !this.lit && !this.nudged) {
      this.nudged = true;
      this.captions.say('Too dark to go on. The brazier...');
    }
  }

  onRewindStart() {
    this.lit = true;
    this.captions.clear();
    this.captions.say('He came this way. Running.');
    this.playEcho([{ x: -20, y: LANE }, { x: 1330, y: LANE }], { ball: true, delay: 900, speed: 320 });
  }
}

// ---------------------------------------------------------------------------
// 2. Market square: light the fountain bonfire, climb the restored bell-tower stairs.
// ---------------------------------------------------------------------------
const SQUARE = 545;
const LANDING = 355;

export class A1Square extends LevelScene {
  constructor() {
    super('A1Square');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.8,
      restoredDarkness: 0.06,
      layers: [...SKY, { dark: 'bg_a1_square_dark', restored: 'bg_a1_square_restored', restoredTransform: { x: -20, y: -15 } }],
      platforms: [
        { x1: 0, x2: 1160, y: SQUARE },
        { x1: 530, x2: 790, y: 485, oneWay: true }, // fountain rim
        { x1: 1105, x2: 1290, y: LANDING, oneWay: true }, // bell tower landing
      ],
      walls: [{ x: 1160, top: LANDING + 22, bottom: 720 }],
      // The stairs only exist in the past.
      ramps: [{ points: [[900, SQUARE], [1120, LANDING]], restoredOnly: true }],
      spawn: { x: 40, y: SQUARE },
      exit: { x: 1262, to: 'A1Bridge', maxFeet: LANDING + 10 },
    };
  }

  build() {
    this.addShadow(420, SQUARE, { speed: 85, sense: 280 });
    this.addShadow(1020, SQUARE, { speed: 70, sense: 330 });
    const bonfire = this.addFire(660, 470, { radius: 460, duration: 14000, scale: 0.9 });
    this.addInteract({
      x: 660, floor: 485, label: 'Light the bonfire', kind: 'light', once: false,
      when: () => bonfire.ready && !this.rewinding,
      use: () => this.lightFire(bonfire),
    });
    this.time.delayedCall(900, () => this.captions.say('The market square. We used to buy honey cakes here.', hint('(Hop up onto the fountain.)')));
  }

  onRewindStart() {
    this.captions.clear();
    this.captions.say('The bell tower stairs... they\'re whole again!', hint('(Climb them before the past fades.)'));
    this.playEcho([{ x: -20, y: SQUARE }, { x: 900, y: SQUARE }, { x: 1120, y: LANDING }, { x: 1330, y: LANDING }], { ball: true, delay: 1200, speed: 300 });
  }

  onRewindEnd() {
    if (this.player.x < 1100) this.captions.say('Gone again. The embers need a moment... then I can relight it.');
  }
}

// ---------------------------------------------------------------------------
// 3. The broken bridge: light the brazier and cross before it falls apart.
// ---------------------------------------------------------------------------
const BANK = 410;

export class A1Bridge extends LevelScene {
  constructor() {
    super('A1Bridge');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.8,
      restoredDarkness: 0.05,
      killY: 560,
      layers: [...SKY, { dark: 'bg_a1_bridge_dark', restored: 'bg_a1_bridge_restored' }],
      platforms: [
        { x1: 0, x2: 395, y: BANK, oneWay: true },
        { x1: 915, x2: 1290, y: BANK, oneWay: true },
      ],
      ramps: [{ points: [[380, BANK], [500, 440], [800, 440], [930, BANK]], restoredOnly: true }],
      spawn: { x: 40, y: BANK },
      exit: { x: 1262, to: 'A1Campfire' },
    };
  }

  build() {
    const brazier = this.addFire(290, 318, { radius: 420, duration: 9000, scale: 0.7 });
    this.addInteract({
      x: 290, floor: BANK, label: 'Light the brazier', kind: 'light', once: false,
      when: () => brazier.ready && !this.rewinding,
      use: () => this.lightFire(brazier),
    });
    this.time.delayedCall(900, () => this.captions.say("The old bridge... nothing left but rotten planks."));
  }

  onRewindStart() {
    this.captions.clear();
    this.captions.say('Quick — across, before it falls apart again!');
    this.playEcho([{ x: -20, y: BANK }, { x: 380, y: BANK }, { x: 500, y: 440 }, { x: 800, y: 440 }, { x: 930, y: BANK }, { x: 1330, y: BANK }], { ball: true, delay: 600, speed: 340 });
  }

  onRewindEnd() {
    if (this.player.x < 900) this.captions.say('Too slow. Wait for the embers, then try again.');
  }
}

// ---------------------------------------------------------------------------
// 4. The village campfire: the big fire of the act, then the rope bridge.
// ---------------------------------------------------------------------------
const CAMP = 545;

export class A1Campfire extends LevelScene {
  constructor() {
    super('A1Campfire');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.82,
      restoredDarkness: 0.04,
      killY: 650,
      layers: [...SKY, { dark: 'bg_a1_campfire_dark', restored: 'bg_a1_campfire_restored', restoredTransform: { x: 0, y: -21, scale: 1.12 } }],
      platforms: [{ x1: 0, x2: 990, y: CAMP }],
      // The rope bridge toward the playground is only whole in the past.
      ramps: [{ points: [[975, CAMP], [1075, 560], [1300, 567]], restoredOnly: true }],
      spawn: { x: 40, y: CAMP },
      exit: { x: 1262, to: 'End', data: { act: 1 } },
    };
  }

  build() {
    this.lit = false;
    this.addShadow(330, CAMP, { speed: 70, sense: 250 });
    this.addShadow(920, CAMP, { speed: 90, sense: 420 });
    // Rises behind you once you're past the first shadow, and chases you to the fire.
    this.riser = this.addShadow(260, 640, { speed: 95, sense: 700, dormant: true });

    const campfire = this.addFire(705, 485, { radius: 520, duration: 20000, sprite: 'campfire', base: 552, scale: 1.1 });
    this.addInteract({
      x: 705, floor: CAMP, label: 'Light the campfire', kind: 'light', once: false,
      when: () => campfire.ready && !this.rewinding,
      use: () => this.lightFire(campfire),
    });
    this.time.delayedCall(900, () => this.captions.say('The big campfire... where everyone gathered in the evenings.'));
  }

  tick() {
    if (!this.rose && this.player.x > 520 && this.riser.active) {
      this.rose = true;
      this.riser.wake(CAMP);
      this.cameras.main.shake(250, 0.004);
      this.captions.clear();
      this.captions.say("They're everywhere—! The campfire, now!");
    }
  }

  onRespawn() {
    if (!this.lit && this.riser?.active) {
      this.riser.setPosition(260, 640).setAlpha(0);
      this.riser.dormant = true;
      this.riser.trail.emitting = false;
      this.rose = false;
    }
  }

  onRewindStart() {
    this.lit = true;
    this.captions.clear();
    this.captions.say('The light... it\'s so warm.');
    this.playEcho([{ x: -20, y: CAMP }, { x: 975, y: CAMP }, { x: 1075, y: 560 }, { x: 1330, y: 567 }], { ball: true, delay: 1600, speed: 300 });
    this.time.delayedCall(5600, () => this.captions.say('He ran across the bridge. Toward the swings.', 'The playground... he\'s there. I know it.'));
  }

  onRewindEnd() {
    if (this.player.x < 975) this.captions.say('The bridge is gone again. Let the fire catch its breath.');
  }
}
