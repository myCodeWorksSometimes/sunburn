import { Crawler } from '../entities/Crawler.js';
import { placeProp } from '../presentation/Scenery.js';
import { CAMP_GAP, SWING_GAP, CANAL_GAP, RELAYS, GROUND, regionAt } from './layout.js';
import { saveSession } from './WorldState.js';
import { buildAct1Story, tickAct1Story } from './Act1Story.js';
import { buildTowerStory, tickTowerStory, towerMemory } from './TowerStory.js';
import { buildFiveHand } from './FiveHand.js';
import { buildBridgeWorks, tickBridgeWorks } from './BridgeWorks.js';
import { MARA_STALL } from './layout.js';
import { ACT2, buildAct2Art, tickAct2Art, dressSwingSeat, hasAct2Art } from './Act2Art.js';

const point = (x, y = GROUND) => ({ x, y });
function steps(s, regionId, start, permanent) {
  return [[start, start + 110, 500], [start + 120, start + 230, 440], [start + 240, start + 460, 380]]
    .map(([x1, x2, y]) => s.addSurface(x1, x2, y, { regionId, restoredOnly: true, permanent }));
}
function enemy(s, data) {
  if (s.run.clearedEncounters[data.id]) return null;
  const actor = new Crawler(s, data); s.enemies.push(actor); return actor;
}
function gate(s, x, isOpen, label) {
  const object = s.addWall(x, GROUND, 350);
  s.chapterGates.push({ ...object, isOpen });
  s.addInteract({ id: `gate-${x}`, x: x - 50, floor: GROUND, when: () => !isOpen(), label, use: () => s.captions.say(label) });
}

export function buildChapters(s) {
  s.transferRemaining = null; s.chapterGates = []; s.swingTime = 0;
  const run = s.run;
  s.addInteract({ id: 'home-door', x: 180, floor: GROUND, label: 'E: enter home', use: () => s.goTo('Hearth', 'front') });
  s.addInteract({ id: 'square-passage', x: 3410, floor: GROUND, label: () => run.shortcutOpen ? 'E: passage home' : 'E: inspect the sealed passage',
    use: () => run.shortcutOpen ? s.goTo('Hearth', 'shortcut') : s.captions.say('This old passage is sealed. It opens from our cellar.') });

  // ACT 1: the village, Mara's stall in the market and the Bridge Refuge.
  buildAct1Story(s, gate);
  buildFiveHand(s);
  buildBridgeWorks(s);
  enemy(s, { id: 'lane-crawler', x: 2480, floor: GROUND, minX: 1820, maxX: 2860, regionId: 'lane' });
  enemy(s, { id: 'camp-crawler', x: 7970, floor: GROUND, minX: 7690, maxX: 8240, regionId: 'camp' });
  s.campSurface = s.addSurface(CAMP_GAP.x1, CAMP_GAP.x2, GROUND, { regionId: 'camp', restoredOnly: true, material: 'bridge', permanent: () => run.campReturnOpen });

  // ACT 2: a moving restored swing, treehouse evidence, home return, canal wheel.
  s.swingPlatform = s.addSurface(9840, 9980, 500, { regionId: 'swings', restoredOnly: true, material: 'timber' });
  s.swingReturn = s.addSurface(SWING_GAP.x1, SWING_GAP.x2, GROUND, { regionId: 'swing-return', restoredOnly: true, material: 'bridge', permanent: () => run.swingReturnOpen });
  s.swingRopes = s.add.graphics().setDepth(14);
  const act2Art = hasAct2Art(s);
  if (act2Art) {
    buildAct2Art(s); dressSwingSeat(s, s.swingPlatform);
    // Two stone steps, then the painted treehouse platform itself.
    for (const [x1, x2, y] of [[10650, 10760, 500], [10770, 10880, 440]]) s.addSurface(x1, x2, y, { regionId: 'treehouse', restoredOnly: true });
    const deck = s.addSurface(ACT2.treehouse.x1, ACT2.treehouse.x2, ACT2.treehouse.platform, { regionId: 'treehouse', restoredOnly: true });
    deck.block.setAlpha(0); deck.edge.setAlpha(0);
  } else {
    s.addLabel(9900, 297, 'THE SWINGS', '#b3a38d', 15);
    steps(s, 'treehouse', 10650);
  }
  const itemX = act2Art ? 11140 : 10995;
  const drawing = s.add.image(itemX, 360, 'item_drawing').setDisplaySize(38, 32).setDepth(23).setVisible(!run.hasDrawing);
  const cup = placeProp(s, 'item-cup', itemX + 40, 380, 32, 28, 23).setVisible(!run.hasDrawing);
  s.addInteract({ id: 'eli-drawing', x: itemX + 5, floor: 380, label: 'E: take Eli’s drawing and the ember cup',
    when: () => !run.hasDrawing && s.memory.isRestored('treehouse'),
    use: () => {
      if (!run.findDrawing()) return;
      drawing.setVisible(false); cup.setVisible(false); s.audio.cue('take');
      s.story('drawing-found', { speaker: 'Echo Eli', text: 'The tower has a shelter. Follow me!' },
        { speaker: 'Rowan', text: 'He led them to the tower.' },
        { speaker: 'Rowan', text: 'His drawing… the two of us at the tower railing. The view I kept putting off.' },
        { speaker: 'Rowan', text: 'And his ember cup. He carried coals in this on every expedition.' },
        { text: 'The treehouse hatch opens onto the service path to the canal.', color: '#ebd5b0' });
    } });
  enemy(s, { id: 'playground-pouncer', x: 11460, floor: GROUND, minX: 11270, maxX: 11600, regionId: 'treehouse', kind: 'pouncer' });
  // The playground's way out is buried; the treehouse service hatch leads on.
  gate(s, 12050, () => run.hasDrawing, 'Rubble buries the playground exit. Eli always used the treehouse — search up there.');
  if (act2Art) {
    s.chapterGates.at(-1).image.setAlpha(0);
    // The mill's own stone ledges carry Rowan up to the sluice wheel.
    for (const [x1, x2, y] of [ACT2.mill.lower, ACT2.mill.upper]) {
      const ledge = s.addSurface(x1, x2, y, { regionId: 'canal', restoredOnly: true });
      ledge.block.setAlpha(0); ledge.edge.setAlpha(0);
    }
  } else {
    s.addSurface(12280, 12390, 500, { regionId: 'canal', restoredOnly: true });
    s.addSurface(12400, 12490, 440, { regionId: 'canal', restoredOnly: true });
  }
  s.canalSurface = s.addSurface(CANAL_GAP.x1, CANAL_GAP.x2, GROUND, { regionId: 'canal', restoredOnly: true, material: 'bridge', permanent: () => run.canalGateOpen || run.canalReturnOpen });
  const wheel = act2Art ? ACT2.mill.wheel : { x: 12420, y: 415 };
  s.add.circle(wheel.x, wheel.y, 19, 0x252832).setStrokeStyle(4, 0xb69868).setDepth(23);
  s.addInteract({ id: 'canal-wheel', x: wheel.x - (act2Art ? 20 : 0), floor: act2Art ? ACT2.mill.upper[2] : 440, hold: 800, label: 'Hold E: turn the sluice wheel — secure the tower road',
    when: () => !run.canalGateOpen && s.memory.isRestored('canal'),
    use: () => { run.canalGateOpen = true; s.refreshSurface(s.canalSurface); s.audio.cue('take'); s.story('sluice-open', { speaker: 'Rowan', text: 'The crossing will hold now. The tower is close.' }); } });

  // ACT 3: Eli at the tower window, the Old Road, then three relays and the Warden.
  buildTowerStory(s);
  gate(s, 13640, () => run.canalGateOpen, 'Restore the canal and turn its sluice wheel before entering the tower.');
  s.addSurface(14110, 14220, 500, { regionId: 'tower-court', restoredOnly: true });
  s.addSurface(14240, 14450, 440, { regionId: 'tower-court', restoredOnly: true });
  steps(s, 'tower-base', 15700);
  s.addSurface(17300, 17480, 500, { regionId: 'tower-crown', restoredOnly: true });
  s.eliStairs = steps(s, 'tower-crown', 17800, () => run.relayCount === 3 && !!run.clearedEncounters['bell-warden']);
  s.relaySprites = [];
  for (const [index, relay] of RELAYS.entries()) {
    const sprite = placeProp(s, 'item-lantern', relay.x, relay.floor, 38, 48, 23).setTint(run.litFinaleLamps[relay.id] ? 0xffffff : 0x716b7d);
    s.relaySprites.push({ sprite, relay });
    s.addLabel(relay.x, relay.floor - 75, `BELL ${index + 1}`, '#d3bc91', 13);
    s.addInteract({ id: relay.id, x: relay.x, floor: relay.floor, hold: 650,
      label: `Hold E: ring bell ${index + 1}`, when: () => !run.litFinaleLamps[relay.id] && run.hasHearthEmber && s.memory.isRestored(relay.regionId),
      use: () => {
        if (!run.ringRelay(relay.id)) return;
        sprite.clearTint(); s.audio.cue('rescue');
        s.story(relay.id, { text: run.relayCount === 3 ? 'The third bell breaks the Warden’s last ward.' : `Bell ${index + 1} answers. A ward breaks.` });
        if (run.relayCount === 3) { s.warden?.wake(); s.warden && (s.warden.state = 'recovery', s.warden.elapsed = -900); }
      } });
  }
  enemy(s, { id: 'court-crawler', x: 14900, floor: GROUND, minX: 14630, maxX: 15130, regionId: 'tower-court' });
  enemy(s, { id: 'tower-pouncer', x: 16500, floor: GROUND, minX: 16280, maxX: 16780, regionId: 'tower-base', kind: 'pouncer' });
  s.warden = enemy(s, { id: 'bell-warden', x: 17720, floor: GROUND, minX: 17480, maxX: 18030, regionId: 'tower-crown', kind: 'warden', dormant: run.relayCount < 3 });
  s.bossText = s.addLabel(17720, 360, 'BELL WARDEN · 3 WARDS', '#e0bd9a', 16);
  s.brother = s.add.sprite(18200, 380, 'brother').setOrigin(.5, 1).setDepth(25).play('brother-idle');
  // After the rescue Eli walks with Rowan, so he starts beside him on any arrival.
  if (run.rescuedEli) s.brother.setPosition(s.player.x - 60, s.player.y);
  // The viewing platform in front of the tower's open arches (CAMPAIGN Scene 14).
  s.addSurface(18270, 18540, 380, { regionId: 'tower-crown', restoredOnly: true, permanent: () => run.rescuedEli });
  s.add.image(18165, 370, 'ball-final').setDisplaySize(20, 20).setDepth(24);
  s.brotherLabel = s.addLabel(18200, 265, '… tap, tap …', '#d6be89', 17);
  s.addInteract({ id: 'rescue-eli', x: 18200, floor: 380, range: 85, priority: 10, hold: 1000,
    label: 'Hold E: give the hearth ember to Eli',
    when: () => run.hasHearthEmber && run.relayCount === 3 && !!run.clearedEncounters['bell-warden'] && s.transferRemaining == null,
    use: () => {
      s.transferRemaining = 2000; s.player.frozen = true; s.player.setVelocity(0); s.player.cancelAction();
      s.memory.activate({ id: 'rescue-memory', regionId: 'tower-crown', duration: 10000 }); s.audio.cue('rescue');
    } });
  placeProp(s, 'door', 17100, GROUND, 75, 120);
  s.homeRoadLabel = s.addLabel(17100, 395, 'OLD ROAD', '#d3bc91', 14).setVisible(run.rescuedEli);
  // The Old Road leads back to the Bridge Refuge, where Nia is waiting.
  s.addInteract({ id: 'old-road-home', x: 17100, floor: GROUND, priority: 20, when: () => run.rescuedEli,
    label: 'E: take the old road to the refuge together', use: () => s.goTo('World', 'oldRoadWest') });
}

export function tickChapters(s, delta) {
  const run = s.run, x = s.player.x;
  tickAct1Story(s, delta);
  tickTowerStory(s, delta);
  tickBridgeWorks(s);
  run.maxXReached = Math.max(run.maxXReached, x);
  if (regionAt(x).act === 'Act 1') s.story('act-1', { text: 'ACT 1 — THE RUINED VILLAGE', hold: 1000 }, { speaker: 'Rowan', text: 'The playground is beyond the village. Keep going.' });
  for (const g of s.chapterGates) { g.zone.body.enable = !g.isOpen(); g.image.setVisible(!g.isOpen()); }
  if (x > CAMP_GAP.x2 + 35 && !run.campReturnOpen) {
    run.campReturnOpen = true; s.refreshSurface(s.campSurface); run.setCheckpoint('World', 'playground');
    s.story('act-2', { text: 'ACT 2 — THE PLAYGROUND', hold: 1000 }, { speaker: 'Rowan', text: 'The swings. He was supposed to be here.' });
  }
  if (x > SWING_GAP.x2 + 35 && !run.swingReturnOpen) {
    run.swingReturnOpen = true; s.refreshSurface(s.swingReturn); run.setCheckpoint('World', 'swingBank'); s.notice('The return boardwalk is secured.');
  }
  if (x > CANAL_GAP.x2 + 35 && !run.canalReturnOpen) {
    run.canalReturnOpen = true; s.refreshSurface(s.canalSurface); run.setCheckpoint('World', 'canalBank');
  }
  if (x > 13700) s.story('act-3', { text: 'ACT 3 — THE CLOCK TOWER', hold: 1000 }, { speaker: 'Rowan', text: 'I promised you the view. I’m here now.' });
  if (x > 350) s.story('night-reveal', { speaker: 'Rowan', text: 'The clock’s stopped. The whole village is waiting.' });
  if (s.memory.isRestored('swings')) {
    s.swingTime += delta;
    const platform = s.swingPlatform, old = platform.zone.x, next = 9910 + Math.sin(s.swingTime / 1050) * 100;
    const carry = Math.abs(s.player.feet - 500) < 6 && Math.abs(s.player.x - old) < 90 && s.player.body.velocity.y >= 0;
    platform.zone.x = next; platform.zone.body.updateFromGameObject(); platform.block.x = platform.edge.x = next - 70;
    if (carry) { const dx = next - old; s.player.x += dx; s.player.body.x += dx; }
  }
  s.swingRopes.clear();
  const anchorY = s.act2Gate ? ACT2.swing.anchorY : 300;
  if (s.swingPlatform.block.visible) s.swingRopes.lineStyle(3, 0x9c835e).lineBetween(9880, anchorY, s.swingPlatform.zone.x - 45, 500).lineBetween(9940, anchorY, s.swingPlatform.zone.x + 45, 500);
  tickAct2Art(s);
  if (s.warden?.active && s.warden.alive) s.bossText.setPosition(s.warden.x, GROUND - 165).setText(run.relayCount < 3 ? `BELL WARDEN · ${3 - run.relayCount} WARDS` : `BELL WARDEN · ${s.warden.health} / 4`);
  else s.bossText.setVisible(false);
  if (run.relayCount === 3 && run.clearedEncounters['bell-warden']) for (const stair of s.eliStairs) s.refreshSurface(stair);
  if (x > 17920 && !run.rescuedEli) {
    if (s.story('eli-landing', { text: '… tap, tap …', color: '#ffe1a1' }, { speaker: 'Rowan', text: 'Eli. I brought it. I’m here.' })) s.audio.cue('knock');
  }
  if (s.transferRemaining != null) {
    s.transferRemaining -= delta;
    if (s.transferRemaining <= 0) {
      s.transferRemaining = null;
      if (run.rescue()) {
        s.player.frozen = false; s.memory.cancel('rescue');
        s.enemies.forEach(e => e.active && e.disperse());
        // The daylight fades and Eli stays. Let that moment play without dialogue.
        run.completeStory('rescue'); s.captions.clear(); s.events.emit('story:completed', { storyId: 'rescue' });
        saveSession(s);
      } else s.player.frozen = false;
    }
  }
  if (run.rescuedEli && x > 18360 && s.player.feet < 400) {
    if (s.story('view-platform', { speaker: 'Eli', text: 'You can see our house.' }, { speaker: 'Rowan', text: 'Yes.' },
      { speaker: 'Rowan', text: 'Come on. Let’s go home.' })) saveSession(s);
  }
  if (run.rescuedEli) {
    s.homeRoadLabel.setVisible(true);
    s.brother.clearTint().setAlpha(1);
    const target = s.player.x + (s.player.flipX ? 60 : -60), dx = target - s.brother.x;
    s.brother.x += Math.sign(dx) * Math.min(Math.abs(dx), delta * .24);
    const floor = s.brother.x > 18040 ? 380 : s.brother.x > 17920 ? 440 : s.brother.x > 17800 ? 500 : GROUND;
    s.brother.y = Math.min(floor, s.brother.y + delta * .45);
    s.brother.setFlipX(dx < 0).play(Math.abs(dx) > 10 ? 'brother-run' : 'brother-idle', true);
    s.brotherLabel.setText('ELI').setPosition(s.brother.x, s.brother.y - 100);
  } else s.brother.setTint(0xffdc94).setAlpha(.3 + (s.memory.fire?.regionId === 'tower-crown' ? s.memory.alpha : 0) * .5);
}

export function memoryChapter(s, fire) {
  if (fire.id === 'rescue-memory') return;
  const run = s.run;
  const id = fire.regionId;
  if (id === 'yard') {
    s.story('yard-memory', { speaker: 'Rowan', text: 'Daylight. Even the grass remembers.' });
    s.echo([point(300), point(1350)]);
  } else if (id === 'lane') {
    s.notice('F: face a Crawler and sweep twice, or evade it from the crate.'); s.echo([point(1750), point(2950)]);
  } else if (id === 'square') {
    if (!run.maraFreed) {
      s.story('square-memory', { speaker: 'Recorded Eli', text: 'You moved your hand. The card stayed there.' },
        { text: 'An ordinary afternoon at Mara’s stall. Climb the remembered steps to the stall roof.', color: '#ebd5b0' });
    }
    s.echo([point(MARA_STALL.shutter - 30), point(MARA_STALL.shutter - 30), point(3890), point(3970, 500), point(4070, 440), point(4240, 380), point(MARA_STALL.release - 40, MARA_STALL.roof)], { delay: 1600 });
  } else if (id === 'bridge') {
    if (!run.bridgeBrakeSet) s.story('bridge-gears-memory', { text: 'The bridge machinery wakes. Lever A turns both gears, lever B the small one. Line up both marks, then set the brake.', color: '#ebd5b0' });
    else { s.story('bridge-memory', { speaker: 'Rowan', text: 'Quick. Across before it falls apart.' }); s.echo([point(5900), point(6900)]); }
  } else if (id === 'camp') {
    s.story('camp-memory', { speaker: 'Echo Eli', text: 'I’ll be by the swings!' }, { text: 'The campfire restores the walkway to the playground.' }); s.echo([point(7530), point(8900)]);
  } else if (id === 'swings') {
    s.story('swing-memory', { text: 'The swing moves in remembered time. Jump onto its board, then to the far bank.' }); s.echo([point(9280), point(9830, 500), point(10220)]);
  } else if (id === 'treehouse') {
    s.story('treehouse-memory', { speaker: 'Echo Eli', text: 'The tower has room for everyone!' }, { speaker: 'Rowan', text: 'His drawing. Up in the treehouse.' });
    s.echo([point(10580), point(10710, 500), point(10830, 440), point(11000, 380)]);
  } else if (id === 'canal') s.story('canal-memory', { text: 'Climb the two restored ledges. Turn the wheel to secure the tower road.' });
  else if (id === 'tower-court' && towerMemory(s)) return;
  else if (id.startsWith('tower-')) s.notice(run.hasHearthEmber ? 'Climb to the bell and hold E while this region is restored. M: map · J: journal' : 'The bells answer only to the hearth’s ember.');
}
