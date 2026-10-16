import { LevelScene } from './LevelScene.js';

const GROUND = 508;

// Prologue, part 2: the front yard. First shadow chase, first brazier.
export class Yard extends LevelScene {
  constructor() {
    super('Yard');
  }

  get level() {
    return {
      width: 1290,
      darkness: 0.8,
      restoredDarkness: 0.05,
      killY: 610,
      layers: [
        { dark: 'bg_sky_dark', restored: 'bg_sky_restored', scroll: 0.1 },
        { dark: 'bg_skyline_dark', restored: 'bg_skyline_restored', scroll: 0.4 },
        { dark: 'bg_p2_yard_dark', restored: 'bg_p2_yard_restored', restoredTransform: { x: -82, y: -20, scale: 1.06 } },
      ],
      platforms: [
        { x1: 0, x2: 708, y: GROUND },
        { x1: 812, x2: 1290, y: GROUND - 4 },
        // The meteor crater is only whole ground in the past.
        { x1: 700, x2: 820, y: GROUND - 2, restoredOnly: true },
      ],
      spawn: { x: 183, y: GROUND },
    };
  }

  build() {
    const say = (...l) => this.captions.say(...l);
    this.brazierLit = false;
    this.warned = false;

    // Embers glowing in the bottom of the crater.
    this.lighting.add({ x: 760, y: 640, radius: 120, intensity: 0.45, flicker: 0.3 });

    this.lurker = this.addShadow(758, 640, { speed: 95, sense: 900, dormant: true });

    const brazier = this.addFire(965, 448, { radius: 420, duration: 16000, scale: 0.8 });
    this.addInteract({
      x: 965, floor: GROUND - 4, label: 'Light the brazier', kind: 'light', once: false,
      when: () => brazier.ready && !this.rewinding,
      use: () => this.lightFire(brazier),
    });

    this.time.delayedCall(900, () => say("Everything's... gone.", 'The playground is past the village. He has to be there.'));
  }

  onRespawn() {
    if (!this.brazierLit && this.lurker?.active) {
      this.lurker.setPosition(758, 640).setAlpha(0);
      this.lurker.dormant = true;
      this.lurker.trail.emitting = false;
      this.warned = false;
    }
  }

  tick() {
    if (!this.warned && !this.brazierLit && this.player.x > 430) {
      this.warned = true;
      this.lurker.wake(GROUND);
      this.cameras.main.shake(250, 0.004);
      this.captions.clear();
      this.captions.say('What IS that—?!', { text: '(SPACE to jump. Get to the brazier!)', color: '#bfa98a' });
    }
    if (this.brazierLit && this.player.x > 1250) {
      this.goTo('A1Lane', { hasLantern: true });
    }
  }

  onRewindStart() {
    this.brazierLit = true;
    this.captions.clear();
    this.captions.say('The light burned it away... and the yard — it looks like before.');
    this.playEcho([{ x: 183, y: GROUND }, { x: 1330, y: GROUND - 4 }], { ball: true, delay: 1500, speed: 300 });
    this.time.delayedCall(6000, () => this.captions.say('He ran out through the gate. Follow him!'));
  }

  onRewindEnd() {
    this.captions.say("It doesn't last. But the fire keeps them away for now.");
  }
}
