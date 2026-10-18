import { placeProp } from '../presentation/Scenery.js';
import { GROUND, TOWER_WINDOW as WIN, OLD_ROAD_EAST as EAST } from './layout.js';
import { saveSession } from './WorldState.js';

// Campaign Scene 10 ("Three knocks"): Eli behind a lattice window high on the
// tower, seen from the courtyard. Answering three knocks proves he is alive, not
// a recording. Then the Old Road is released from the tower side.

const FOUND_LINES = [
  { text: '… tap, tap, tap …', color: '#ffe1a1' },
  { speaker: 'Eli', text: 'That’s too many.' },
  { speaker: 'Rowan', text: 'Eli! You heard me. You’re really here.' },
  { speaker: 'Eli', text: 'I rang the bell so the shadows would follow me instead of them.' },
  { speaker: 'Eli', text: 'I thought I could get down after they left. I keep ending up back here.' },
  { speaker: 'Rowan', text: 'Mara is only a memory. But you answered me. Our hearth still remembers you.' },
  { speaker: 'Rowan', text: 'I know what to bring. Wait for me.' },
];

export function buildTowerStory(s) {
  const run = s.run;
  const frame = s.add.graphics().setDepth(18);
  frame.fillStyle(0x2a2630).fillRect(WIN.x - 54, WIN.y - 72, 108, 124);
  frame.fillStyle(0x0d0c12).fillRect(WIN.x - 40, WIN.y - 58, 80, 96);
  frame.fillStyle(0x3b3540).fillRect(WIN.x - 62, WIN.y + 50, 124, 10);
  // The courtyard painting has its own stone window; only the bars and Eli are drawn.
  const painted = s.textures.exists('bg_a3_courtyard_dark');
  frame.setVisible(!painted);
  const eli = s.add.sprite(WIN.x, WIN.y + 38, 'brother').setOrigin(0.5, 1).setScale(0.8).setDepth(19).play('brother-idle')
    .setTint(run.eliFound ? 0xffffff : 0x8a8274).setAlpha(run.eliFound ? 1 : 0.75).setVisible(!run.rescuedEli);
  const bars = s.add.graphics().setDepth(20).lineStyle(4, 0x8f7a5c);
  for (let x = WIN.x - 30; x <= WIN.x + 30; x += 15) bars.lineBetween(x, WIN.y - 58, x, WIN.y + 38);
  for (let y = WIN.y - 36; y <= WIN.y + 30; y += 22) bars.lineBetween(WIN.x - 40, y, WIN.x + 40, y);
  bars.strokeRect(WIN.x - 40, WIN.y - 58, 80, 96);
  s.addLabel(WIN.x, WIN.y - 92, 'INSPECTION WINDOW', '#a59f9a', 12).setVisible(!painted);
  // A faint light in the window so Eli reads against the night.
  const glow = s.lighting.add({ x: WIN.x, y: WIN.y - 8, radius: 120, intensity: run.eliFound ? 0.8 : 0.5, flicker: 0.04, on: !run.rescuedEli });
  s.tower = { eli, glow, stepped: false, tapClock: 0 };

  s.addInteract({ id: 'eli-window', x: WIN.knock, floor: GROUND, range: 70, priority: 8, when: () => !run.eliFound && !s.tower.knocking,
    label: 'E: tap three times — “Copy me.”', use: () => knock(s) });
  s.addInteract({ id: 'eli-window-talk', x: WIN.knock, floor: GROUND, range: 70, priority: 2, when: () => run.eliFound && !run.rescuedEli,
    label: 'E: call up to Eli',
    use: () => s.captions.say(run.hasHearthEmber
      ? { speaker: 'Eli', text: 'Is that warm light for me? Hurry, Rowan.' }
      : { speaker: 'Eli', text: 'You’ll come back? Promise?' }) });

  // The Old Road's east door, released from the tower side.
  const door = placeProp(s, 'door', EAST.door, GROUND, 80, 128).setTint(run.oldRoadOpen ? 0xffffff : 0x6d6878);
  s.addLabel(EAST.door, GROUND - 150, 'OLD ROAD', '#a59f9a', 13);
  const lever = s.add.graphics().setDepth(22);
  const drawLever = (pulled) => {
    lever.clear().fillStyle(0x6e5a44).fillRect(EAST.release - 3, GROUND - 46, 6, 46);
    lever.lineStyle(4, 0xc9a86a).lineBetween(EAST.release, GROUND - 42, EAST.release + (pulled ? 16 : -16), GROUND - 62);
  };
  drawLever(run.oldRoadOpen);
  s.addInteract({ id: 'old-road-release', x: EAST.release, floor: GROUND, range: 40, hold: 700, priority: 6, when: () => run.eliFound && !run.oldRoadOpen,
    label: 'Hold E: release the Old Road gate',
    use: () => {
      if (!run.openOldRoad()) return;
      drawLever(true); door.clearTint(); s.audio.cue('take');
      s.story('old-road-open', { speaker: 'Rowan', text: 'The road the children escaped by. It runs straight to the refuge.' },
        { speaker: 'Rowan', text: 'Home is past the market. Hold on, Eli.' });
      saveSession(s);
    } });
  s.addInteract({ id: 'old-road-east', x: EAST.door, floor: GROUND, range: 40, priority: 5,
    label: () => run.oldRoadOpen ? 'E: take the Old Road to the Bridge Refuge' : 'E: try the Old Road gate',
    use: () => run.oldRoadOpen ? s.goTo('World', 'oldRoadWest')
      : s.captions.say(run.eliFound ? { text: 'Barred. The release is right beside it.', color: '#ebd5b0' }
        : { speaker: 'Rowan', text: 'The old road. Barred… there must be a release on this side.' }) });
}

// Rowan taps three; after a pause Eli answers three. Recordings can't do that.
function knock(s) {
  const run = s.run, t = (ms, fn) => s.time.delayedCall(ms, fn);
  s.tower.knocking = true; s.player.frozen = true; s.player.setVelocityX(0);
  s.captions.clear(); s.captions.say({ speaker: 'Rowan', text: 'Copy me.', hold: 700 });
  for (const ms of [500, 800, 1100]) t(ms, () => s.audio.cue('knock'));
  for (const ms of [2200, 2500, 2800]) t(ms, () => { s.audio.cue('knock'); s.tower.eli.clearTint().setAlpha(1); });
  t(3200, () => {
    s.tower.knocking = false; s.player.frozen = false;
    if (run.findEli()) { s.story('eli-found', ...FOUND_LINES); saveSession(s); }
  });
}

// Restoring the courtyard after finding Eli: he can move in the daylight…
export function towerMemory(s) {
  const run = s.run;
  if (!run.eliFound || run.rescuedEli || run.completedStory['eli-step']) return false;
  s.story('eli-step', { speaker: 'Eli', text: 'Rowan — the daylight! I can move!' }, { speaker: 'Rowan', text: 'Toward the inner door. Come on!' });
  s.tower.stepped = true;
  s.tweens.add({ targets: s.tower.eli, x: WIN.x + 26, duration: 900, ease: 'Sine.out' });
  return true;
}

export function tickTowerStory(s, delta) {
  const run = s.run, tower = s.tower;
  tower.eli.setVisible(!run.rescuedEli);
  tower.glow.on = !run.rescuedEli; tower.glow.intensity = run.eliFound ? 0.8 : 0.5;
  // …until the memory fades and the fractured moment pulls him back.
  if (tower.stepped && !s.memory.isRestored('tower-court')) {
    tower.stepped = false;
    s.tweens.add({ targets: tower.eli, x: WIN.x, duration: 350, ease: 'Cubic.in' });
    s.story('eli-pulled', { speaker: 'Eli', text: 'No… it pulled me back again.' }, { speaker: 'Rowan', text: 'Not for much longer. I’m going home for the ember.' });
  }
  // Two taps from the window draw Rowan in before he has answered.
  if (!run.eliFound && run.canalGateOpen && Math.abs(s.player.x - WIN.knock) < 500) {
    if (s.player.x > WIN.knock - 260 && s.story('eli-taps', { text: '… tap, tap …', color: '#ffe1a1' },
      { speaker: 'Rowan', text: 'That knock… Eli?! Up at the window!' })) tower.tapClock = 0;
    tower.tapClock -= delta;
    if (tower.tapClock <= 0 && !tower.knocking) {
      tower.tapClock = 3200; s.audio.cue('knock'); s.time.delayedCall(300, () => s.audio.cue('knock'));
    }
  }
}
