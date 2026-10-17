import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';
import { GROUND, BRIDGE_WORKS as BW } from './layout.js';
import { saveSession } from './WorldState.js';
import { paintedBoss } from '../presentation/productionAssets.js';
import { bossHud } from '../presentation/bossHud.js';

// CAMPAIGN Scene 7 — the bridge works, between the refuge and the bridge fire.
// 1. The Braced Shadow: its armoured front turns any sweep. Bait its long, readable
//    charge into the cracked barrier (dodge onto the crate or jump); the impact
//    breaks the barrier and stuns it with its back exposed. Three committed openings, one hit per stagger.
// 2. The linked gears (in remembered time): lever A turns both gears, lever B
//    only the small one. Line up both marks, then set the present-day brake.
// Pixel-art poses share the same baseline and readable armour silhouette.

const WINDUP_MS = 1300, CHARGE_SPEED = 360, STUN_MS = 2600, RECOVER_MS = 900;
const GEAR_START = { big: 2, small: 1 }; // quarter turns away from the marks

export function buildBridgeWorks(s) {
  const run = s.run;
  const eliteCleared = () => !!run.clearedEncounters['braced-shadow'];

  // A crate beside the barrier: the safe spot to dodge the charge.
  s.addSurface(BW.crate[0], BW.crate[1], 485, { material: 'crate' });

  // ---- The cracked maintenance barrier (breaks when the elite charges into it).
  const barrier = { broken: eliteCleared() };
  barrier.zone = s.add.zone(BW.barrier, GROUND - 110, 24, 220);
  s.solids.add(barrier.zone);
  barrier.art = s.add.graphics().setDepth(12);
  const drawBarrier = () => {
    barrier.art.clear();
    // The bay's iron frame stays; only the boarded barrier breaks.
    barrier.art.fillStyle(0x2b2a33).fillRect(BW.barrier - 14, GROUND - 230, 6, 230).fillRect(BW.barrier + 8, GROUND - 230, 6, 230).fillRect(BW.barrier - 14, GROUND - 236, 28, 8);
    if (barrier.broken) return;
    for (let y = GROUND - 220; y < GROUND; y += 28) {
      barrier.art.fillStyle(y % 56 ? 0x5a4130 : 0x4a3426).fillRect(BW.barrier - 12, y, 24, 24);
      barrier.art.lineStyle(2, 0x2a1d16).lineBetween(BW.barrier - 10, y + 6, BW.barrier + 10, y + 18);
    }
    barrier.art.lineStyle(3, 0xc9a86a).lineBetween(BW.barrier - 6, GROUND - 160, BW.barrier + 4, GROUND - 120).lineBetween(BW.barrier + 4, GROUND - 120, BW.barrier - 3, GROUND - 90);
  };
  const barrierLabel = s.addLabel(BW.barrier, GROUND - 255, 'CRACKED BARRIER', '#a59f9a', 12);
  const setBarrier = (broken) => { barrier.broken = broken; barrier.zone.body.enable = !broken; barrierLabel.setVisible(!broken); drawBarrier(); };
  setBarrier(barrier.broken);

  // ---- The Braced Shadow (pseudo-enemy so the normal sweep and death reset reach it).
  const sprite = paintedBoss(s,'braced',BW.elite,GROUND,185);
  const hud=bossHud(s,'Braced Shadow');
  const shield = s.add.graphics().setDepth(23);
  const tell = s.add.text(BW.elite, GROUND - 130, '!', { fontFamily: FONT, fontSize: '28px', color: '#ff9a6a', stroke: '#11101b', strokeThickness: 5 }).setOrigin(0.5).setDepth(26).setVisible(false);
  const label = s.add.text(BW.elite, GROUND - 150, '', { fontFamily: FONT, fontSize: '14px', color: '#e0bd9a', stroke: '#11101b', strokeThickness: 4 }).setOrigin(0.5).setDepth(24);
  const elite = {
    id: 'braced-shadow', active: !eliteCleared(), alive: !eliteCleared(), x: BW.elite, floor: GROUND, regionId: 'bridge', restorationImmune: true,
    health: 3, state: 'idle', elapsed: 0, facing: -1, chargeDir: 1, hitDealt: false,hitUsed:false,
  };
  if (!elite.alive) for (const o of [sprite, shield, tell, label]) o.setVisible(false);
  const go = (state) => { elite.state = state; elite.elapsed = 0; };


  elite.tick = (delta) => {
    if (!elite.alive) return;
    const p = s.player;
    if(s.run.heardTomas&&p.x>BW.arenaMin-60&&p.x<BW.barrier+120&&!s.run.completedStory['intro-braced-shadow']) {
      if(s.cinematic.play({id:'braced-shadow',name:'THE BRACED SHADOW',subtitle:'Break the charge. Strike the exposed heart.',sprite,x:elite.x,y:GROUND-100,
        onComplete:()=>s.audio.cue('monster-roar')}))return;
    }
    hud.update(p.x>BW.arenaMin-90&&p.x<BW.barrier+30,elite.health,3,
      elite.state==='stunned'?(elite.hitUsed?'Retreat · prepare for its next charge':'Exposed back · F'):elite.state==='windup'?'Charge incoming · climb the supply ledge':'Lure it into the cracked barrier');
    elite.elapsed += delta;
    const sameLevel = Math.abs(p.feet - GROUND) < 60;
    const dx = p.x - elite.x;
    if (elite.state === 'idle') {
      elite.facing = Math.sign(dx) || elite.facing;
      // Only once Rowan is inside the arena (never while held at the refuge).
      if (sameLevel && Math.abs(dx) < 380 && p.x > BW.arenaMin + 10 && run.heardTomas) {
        elite.chargeDir = elite.facing; go('windup'); tell.setVisible(true); sprite.setTint(0xceb0e7); s.audio.cue('notice');
      }
    } else if (elite.state === 'windup') {
      tell.setAlpha(0.5 + Math.abs(Math.sin(elite.elapsed / 90)) * 0.5);
      if (elite.elapsed > WINDUP_MS) { go('charge'); tell.setVisible(false); sprite.clearTint(); elite.hitDealt = false;s.audio.cue('monster-roar'); }
    } else if (elite.state === 'charge') {
      elite.x += elite.chargeDir * CHARGE_SPEED * delta / 1000;
      if (elite.chargeDir > 0 && elite.x >= BW.barrier - 42) {
        // Slams into the barrier: it breaks, and the elite is stunned facing it.
        elite.x = BW.barrier - 42; go('stunned');
        elite.hitUsed=false;sprite.setTint(0xffb276); s.cameras.main.shake(220, 0.006); s.audio.cue('impact');
        if (!barrier.broken) {
          setBarrier(true);
          s.story('braced-barrier', { text: 'The barrier splinters. Its back is open — strike it!', color: '#ebd5b0' });
        } else s.notice('It slams into the iron frame. Strike its back!');
      } else if (elite.x <= BW.arenaMin || elite.x >= BW.arenaMax || elite.elapsed > 1400) {
        elite.x = Phaser.Math.Clamp(elite.x, BW.arenaMin, BW.arenaMax); go('recover');
      }
    } else if (elite.state === 'stunned') {
      if (elite.elapsed > STUN_MS) { go('recover'); sprite.clearTint(); elite.facing = -elite.chargeDir; }
    } else if (elite.state === 'recover' && elite.elapsed > RECOVER_MS) go('idle');
    sprite.pose(elite.state==='charge'?2:elite.state==='stunned'?3:1).setPosition(elite.x, GROUND).setFlipX(elite.state==='stunned'?elite.facing<0:elite.facing>0);
    tell.setPosition(elite.x, GROUND - 130);
    label.setText('');
  };

  elite.touches = (p) => elite.alive && elite.state === 'charge' && Math.abs(p.x - elite.x) < 40 && Math.abs(p.feet - GROUND) < 65;

  elite.hit = (dir) => {
    if (!elite.alive) return false;
    // Only its back is open, and only while stunned against the barrier.
    const fromBehind = Math.sign(s.player.x - elite.x) === -elite.facing;
    if (elite.state !== 'stunned' || !fromBehind || elite.hitUsed) {
      s.notice('Its braced front turns the light aside. Bait it into the barrier.'); s.audio.cue('notice');
      return false;
    }
    elite.health--;elite.hitUsed=true;s.audio.cue('monster-hit');
    sprite.setTint(0xffffff); s.time.delayedCall(120, () => elite.alive && sprite.setTint(0xffb276));
    if (elite.health <= 0) defeat();
    return true;
  };

  const defeat = () => {
    elite.alive = false; elite.state = 'gone';
    run.clearEncounter('braced-shadow');
    hud.update(false,0,3,'');s.audio.cue('monster-death');
    const fx = s.add.sprite(elite.x, GROUND - 20, 'fx_dissolve').setScale(0.7).setDepth(28).play('fx-dissolve');
    fx.once('animationcomplete', () => fx.destroy());
    s.tweens.add({ targets: [sprite, label], alpha: 0, duration: 600, onComplete: () => { sprite.setVisible(false); label.setVisible(false); } });
    shield.clear(); tell.setVisible(false);
    s.story('braced-defeated', { speaker: 'Rowan', text: 'The works are open. Now the gears.' },
      { text: 'Restore the bridge fire. Lever A turns both gears, lever B only the small one. Line up both marks, then set the brake.', color: '#ebd5b0' });
    saveSession(s);
  };
  elite.resetEncounter = () => {
    if (!elite.alive) return;
    elite.x = BW.elite; elite.health = 3; elite.facing = -1;elite.hitUsed=false; go('idle');
    sprite.clearTint().pose(1); tell.setVisible(false);
    if (!eliteCleared()) setBarrier(false);
  };
  elite.disperse = () => {};
  s.enemies.push(elite);

  // ---- The linked gears and the brake.
  const gears = { big: GEAR_START.big, small: GEAR_START.small };
  const drawGear = (g, r, teeth) => {
    g.clear().fillStyle(0x5d5244).fillCircle(0, 0, r).lineStyle(3, 0x2b2620).strokeCircle(0, 0, r);
    for (let i = 0; i < teeth; i++) { const a = i / teeth * Math.PI * 2; g.fillStyle(0x5d5244).fillRect(Math.cos(a) * r - 4, Math.sin(a) * r - 4, 8, 8); }
    g.fillStyle(0x2b2620).fillCircle(0, 0, r * 0.3);
    g.fillStyle(0xffd27a).fillTriangle(-6, -r + 2, 6, -r + 2, 0, -r + 16); // the mark
  };
  const big = s.add.graphics().setPosition(BW.bigGear.x, BW.bigGear.y).setDepth(11);
  const small = s.add.graphics().setPosition(BW.smallGear.x, BW.smallGear.y).setDepth(11);
  drawGear(big, BW.bigGear.r, 12); drawGear(small, BW.smallGear.r, 8);
  // Fixed targets: a white arrow above each gear.
  const targets = s.add.graphics().setDepth(11).fillStyle(0xf3ead8);
  for (const g of [BW.bigGear, BW.smallGear]) targets.fillTriangle(g.x - 7, g.y - g.r - 22, g.x + 7, g.y - g.r - 22, g.x, g.y - g.r - 10);
  const setRotations = () => {
    const turns = run.bridgeBrakeSet ? { big: 0, small: 0 } : gears;
    big.setRotation(turns.big * Math.PI / 2); small.setRotation(turns.small * Math.PI / 2);
  };
  // Gears look seized (dim) outside remembered time.
  const showGears = () => {
    const alive = s.memory.isRestored('bridge') || run.bridgeBrakeSet;
    big.setAlpha(alive ? 1 : 0.6); small.setAlpha(alive ? 1 : 0.6);
  };
  setRotations(); showGears();
  s.addLabel(BW.leverA, GROUND - 70, 'A', '#e8d6b4', 14);
  s.addLabel(BW.leverB, GROUND - 70, 'B', '#e8d6b4', 14);
  const levers = s.add.graphics().setDepth(12);
  const drawLevers = () => {
    levers.clear();
    for (const [x, on] of [[BW.leverA, false], [BW.leverB, false], [BW.brake, run.bridgeBrakeSet]]) {
      levers.fillStyle(0x6e5a44).fillRect(x - 3, GROUND - 46, 6, 46).lineStyle(4, x === BW.brake ? 0xd06a4a : 0xc9a86a).lineBetween(x, GROUND - 42, x + (on ? 16 : -16), GROUND - 62);
    }
  };
  drawLevers();
  s.addLabel(BW.brake, GROUND - 82, 'BRAKE', '#e8d6b4', 12);

  const turn = (which) => {
    if (!s.memory.isRestored('bridge')) { s.notice('The machinery is seized. Restore the bridge fire first.'); return; }
    if (which === 'A') { gears.big = (gears.big + 1) % 4; gears.small = (gears.small + 1) % 4; } else gears.small = (gears.small + 1) % 4;
    s.audio.cue('take');
    const turnTo = (g, n) => s.tweens.add({ targets: g, rotation: g.rotation + Math.PI / 2, duration: 280, ease: 'Sine.inOut', onComplete: () => g.setRotation(n * Math.PI / 2) });
    turnTo(small, gears.small); if (which === 'A') turnTo(big, gears.big);
  };
  const inBay = () => barrier.broken && !run.bridgeBrakeSet;
  s.addInteract({ id: 'bridge-lever-a', x: BW.leverA, floor: GROUND, range: 24, priority: 7, when: inBay, label: 'E: lever A — turns both gears', use: () => turn('A') });
  s.addInteract({ id: 'bridge-lever-b', x: BW.leverB, floor: GROUND, range: 24, priority: 7, when: inBay, label: 'E: lever B — turns the small gear', use: () => turn('B') });
  s.addInteract({ id: 'bridge-brake', x: BW.brake, floor: GROUND, range: 24, priority: 7, hold: 600, when: inBay, label: 'Hold E: set the brake',
    use: () => {
      if (gears.big !== 0 || gears.small !== 0) { s.notice('The marks don’t line up with the arrows yet.'); return; }
      if (!run.setBridgeBrake()) return;
      drawLevers(); setRotations(); showGears(); s.audio.cue('rescue');
      s.refreshSurface?.(s.bridgeSurface);
      s.story('bridge-brake', { speaker: 'Rowan', text: 'Locked. The deck will hold when the fire remembers it.' });
      saveSession(s);
    } });

  s.bridgeWorks = { showGears };
}

export function tickBridgeWorks(s) {
  s.bridgeWorks?.showGears();
}
