import { Crawler } from '../entities/Crawler.js';
import { placeProp } from '../presentation/Scenery.js';
import { CAMP_GAP, BRIDGE_GAP, SWING_GAP, CANAL_GAP, RELAYS, GROUND, A3, regionAt } from './layout.js';
import { saveSession } from './WorldState.js';
import { buildAct1Story, tickAct1Story } from './Act1Story.js';
import { buildTowerStory, tickTowerStory, towerMemory } from './TowerStory.js';
import { buildFiveHand } from './FiveHand.js';
import { buildBridgeWorks, tickBridgeWorks } from './BridgeWorks.js';
import { MARA_STALL } from './layout.js';
import {stonePassage} from '../presentation/Act1Presentation.js';
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
  s.addInteract({ id: 'home-door', x: 225, floor: GROUND, label: 'E: enter home', use: () => s.goTo('Hearth', 'front') });
  s.addInteract({ id: 'square-passage', x: 3410, floor: GROUND, label: () => run.shortcutOpen ? 'E: passage home' : 'E: inspect the sealed passage',
    use: () => run.shortcutOpen ? s.goTo('Hearth', 'shortcut') : s.captions.say('This old passage is sealed. It opens from our cellar.') });

  // ACT 1: the village, Mara's stall in the market and the Bridge Refuge.
  buildAct1Story(s, gate);
  buildFiveHand(s);
  buildBridgeWorks(s);
  enemy(s, { id: 'lane-crawler', x: 2480, floor: GROUND, minX: 1820, maxX: 2860, regionId: 'lane' });
  if(!run.refugeesRescued)enemy(s, { id: 'camp-crawler', x: 8280, floor: GROUND, minX: 8010, maxX: 8340, regionId: 'camp' });
  s.campSurface = s.addSurface(CAMP_GAP.x1, CAMP_GAP.x2, GROUND, { regionId: 'camp', restoredOnly: true, material: 'bridge', permanent: () => run.campReturnOpen });

  // ACT 2: a moving restored swing, treehouse evidence, home return, canal wheel.
  s.swingPlatform = s.addSurface(9840, 9980, 500, { regionId: 'swings', restoredOnly: true, material: 'timber' });
  s.swingReturn = s.addSurface(SWING_GAP.x1, SWING_GAP.x2, GROUND, { regionId: 'swing-return', restoredOnly: true, material: 'bridge', permanent: () => run.swingReturnOpen, requires: () => false });
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
  // The tower's ledges, stairs and gallery are painted; their placeholder stone is hidden.
  const act3Art = s.textures.exists('bg_a3_courtyard_dark');
  const painted = (surface) => { if (act3Art) { surface.block.setAlpha(0); surface.edge.setAlpha(0); } return surface; };
  for (const [x1, x2, y] of A3.courtSteps) painted(s.addSurface(x1, x2, y, { regionId: 'tower-court', restoredOnly: true }));
  for (const [x1, x2, y] of A3.baseSteps) painted(s.addSurface(x1, x2, y, { regionId: 'tower-base', restoredOnly: true }));
  painted(s.addSurface(...A3.crownLedge, { regionId: 'tower-crown', restoredOnly: true }));
  // Only the restored landing paints the stair to Eli, so its treads stay visible once raised.
  const eliReachable = () => run.relayCount === 3 && !!run.clearedEncounters['bell-warden'];
  s.eliStairs = A3.eliSteps.map(([x1, x2, y]) => s.addSurface(x1, x2, y, { regionId: 'tower-crown', restoredOnly: true, material:'masonry-stair', permanent: eliReachable }));
  // The gallery leads from Eli out to the open arches (CAMPAIGN Scene 14).
  s.eliStairs.push(painted(s.addSurface(...A3.gallery, { regionId: 'tower-crown', restoredOnly: true, permanent: () => eliReachable() || run.rescuedEli })));
  s.relaySprites = [];
  for (const [index, relay] of RELAYS.entries()) {
    const sprite = placeProp(s, 'item-lantern', relay.x, relay.floor, 38, 48, 23).setTint(run.litFinaleLamps[relay.id] ? 0xffffff : 0x716b7d);
    const [bx, by] = A3.bells[relay.id];
    const glow = act3Art ? s.lighting.add({ x: bx, y: by, radius: 140, intensity: .9, flicker: .05, on: !!run.litFinaleLamps[relay.id] }) : null;
    sprite.setVisible(!act3Art);
    s.relaySprites.push({ sprite, relay, glow });
    s.addLabel(relay.x, relay.floor - 75, `BELL ${index + 1}`, '#d3bc91', 13);
    s.addInteract({ id: relay.id, x: relay.x, floor: relay.floor, hold: 650,
      label: `Hold E: ring bell ${index + 1}`, when: () => !run.litFinaleLamps[relay.id] && run.hasHearthEmber && s.memory.isRestored(relay.regionId),
      use: () => {
        if (!run.ringRelay(relay.id)) return;
        sprite.clearTint(); if (s.relaySprites[index].glow) s.relaySprites[index].glow.on = true; s.audio.cue('rescue');
        s.story(relay.id, { text: run.relayCount === 3 ? 'The third bell breaks the Warden’s last ward.' : `Bell ${index + 1} answers. A ward breaks.` });
        if (run.relayCount === 3) { s.warden?.wake(); s.warden && (s.warden.state = 'recovery', s.warden.elapsed = -900); }
      } });
  }
  enemy(s, { id: 'court-crawler', x: 14650, floor: GROUND, minX: 14250, maxX: 14800, regionId: 'tower-court' });
  enemy(s, { id: 'tower-pouncer', x: 15900, floor: GROUND, minX: 15670, maxX: 16090, regionId: 'tower-base', kind: 'pouncer' });
  const W = A3.warden, top = A3.gallery[2];
  s.warden = enemy(s, { id: 'bell-warden', x: W.x, floor: GROUND, minX: W.minX, maxX: W.maxX, regionId: 'tower-crown', kind: 'warden', dormant: run.relayCount < 3 });
  s.bossText = s.addLabel(W.x, 360, 'BELL WARDEN · 3 WARDS', '#e0bd9a', 16);
  s.brother = s.add.sprite(A3.eli, top, 'brother').setOrigin(.5, 1).setDepth(25).play('brother-idle');
  // After the rescue Eli walks with Rowan, so he starts beside him on any arrival.
  if (run.rescuedEli) s.brother.setPosition(s.player.x - 60, s.player.y);
  s.add.image(A3.eli - 35, top - 10, 'ball-final').setDisplaySize(20, 20).setDepth(24);
  s.brotherLabel = s.addLabel(A3.eli, top - 115, '… tap, tap …', '#d6be89', 17);
  s.addInteract({ id: 'rescue-eli', x: A3.eli, floor: top, range: 85, priority: 10, hold: 1000,
    label: 'Hold E: give the hearth ember to Eli',
    when: () => run.hasHearthEmber && run.relayCount === 3 && !!run.clearedEncounters['bell-warden'] && s.transferRemaining == null,
    use: () => {
      s.transferRemaining = 2000; s.player.frozen = true; s.player.setVelocity(0); s.player.cancelAction();
      s.memory.activate({ id: 'rescue-memory', regionId: 'tower-crown', duration: 10000 }); s.audio.cue('rescue');
    } });
  stonePassage(s,A3.oldRoadHome,GROUND,75,120);
  s.homeRoadLabel = s.addLabel(A3.oldRoadHome, 395, 'OLD ROAD', '#d3bc91', 14).setVisible(run.rescuedEli);
  // The Old Road leads back to the Bridge Refuge, where Nia is waiting.
  s.addInteract({ id: 'old-road-home', x: A3.oldRoadHome, floor: GROUND, priority: 20, when: () => run.rescuedEli,
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
    // Move only the body: Arcade's postUpdate copies its displacement onto the sprite.
    if (carry) s.player.body.x += next - old;
  }
  s.swingRopes.clear();
  const anchorY = s.act2Gate ? ACT2.swing.anchorY : 300;
  if (s.swingPlatform.block.visible) s.swingRopes.lineStyle(3, 0x9c835e).lineBetween(9880, anchorY, s.swingPlatform.zone.x - 45, 500).lineBetween(9940, anchorY, s.swingPlatform.zone.x + 45, 500);
  tickAct2Art(s);
  if (s.warden?.active && s.warden.alive) s.bossText.setPosition(s.warden.x, GROUND - 165).setText(run.relayCount < 3 ? `BELL WARDEN · ${3 - run.relayCount} WARDS` : `BELL WARDEN · ${s.warden.health} / 4`);
  else s.bossText.setVisible(false);
  if (run.relayCount === 3 && run.clearedEncounters['bell-warden']) for (const stair of s.eliStairs) s.refreshSurface(stair);
  if (x > A3.eliSteps[1][0] && !run.rescuedEli) {
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
  if (run.rescuedEli && x > A3.view && s.player.feet < A3.gallery[2] + 20) {
    if (s.story('view-platform', { speaker: 'Eli', text: 'You can see our house.' }, { speaker: 'Rowan', text: 'Yes.' },
      { speaker: 'Rowan', text: 'Come on. Let’s go home.' })) saveSession(s);
  }
  if (run.rescuedEli) {
    s.homeRoadLabel.setVisible(true);
    s.brother.clearTint().setAlpha(1);
    const target = s.player.x + (s.player.flipX ? 60 : -60), dx = target - s.brother.x;
    s.brother.x += Math.sign(dx) * Math.min(Math.abs(dx), delta * .24);
    // Eli follows Rowan's floor: gallery, stair treads, or the landing.
    const tread = [A3.gallery, ...A3.eliSteps.slice().reverse()].find(([x1]) => s.brother.x > x1);
    const floor = tread ? tread[2] : GROUND;
    s.brother.y = Math.min(floor, s.brother.y + delta * .45);
    s.brother.setFlipX(dx < 0).play(Math.abs(dx) > 10 ? 'brother-run' : 'brother-idle', true);
    s.brotherLabel.setText('ELI').setPosition(s.brother.x, s.brother.y - 100);
  } else s.brother.setTint(0xffdc94).setAlpha(.3 + (s.memory.fire?.regionId === 'tower-crown' ? s.memory.alpha : 0) * .5);
}

export function memoryChapter(s, fire) {
  if (fire.id === 'rescue-memory') return;
  if(fire.id==='refuge-hearth'){s.notice('Their tether holds only inside the fire. Secure the bridge, then guide them out.');return;}
  const run = s.run;
  const id = fire.regionId;
  if (id === 'yard') {
    s.story('yard-memory', { speaker: 'Rowan', text: 'Daylight. Even the grass remembers.' });
    s.echo([point(300), point(1350)]);
  } else if (id === 'lane') {
    s.notice('X · Draw sword; lantern stays on the ground. F · Strike after a lunge.'); s.echo([point(1750), point(2950)]);
  } else if (id === 'square') {
    if (!run.maraFreed) {
      s.story('square-memory', { speaker: 'Recorded Eli', text: 'You moved your hand. The card stayed there.' },
        { text: 'An ordinary afternoon at Mara’s stall. Climb the remembered steps to the stall roof.', color: '#ebd5b0' });
    }
    s.echo([point(3250), point(3335, 500), point(3450, 440), point(3580, 380), point(MARA_STALL.release - 40, MARA_STALL.roof)], { delay: 1600 });
  } else if (id === 'bridge') {
    if (!run.bridgeBrakeSet) s.story('bridge-gears-memory', { text: 'The bridge machinery wakes. Lever A turns both gears, lever B the small one. Line up both marks, then set the brake.', color: '#ebd5b0' });
    else { s.story('bridge-memory', { speaker: 'Rowan', text: 'Quick. Across before it falls apart.' }); s.echo([point(fire.x), point(BRIDGE_GAP.x2+55)]); }
  } else if (id === 'camp') {
    s.story('camp-memory', { speaker: 'Echo Eli', text: 'I’ll be by the swings!' }, { text: 'The campfire restores the walkway to the playground.' }); s.echo([point(8120), point(8900)]);
  } else if (id === 'swings') {
    s.story('swing-memory', { text: 'The swing moves in remembered time. Jump onto its board, then to the far bank.' }); s.echo([point(9280), point(9830, 500), point(10220)]);
  } else if (id === 'treehouse') {
    s.story('treehouse-memory', { speaker: 'Echo Eli', text: 'The tower has room for everyone!' }, { speaker: 'Rowan', text: 'His drawing. Up in the treehouse.' });
    s.echo([point(10580), point(10710, 500), point(10830, 440), point(11000, 380)]);
  } else if (id === 'canal') s.story('canal-memory', { text: 'Climb the two restored ledges. Turn the wheel to secure the tower road.' });
  else if (id === 'tower-court' && towerMemory(s)) return;
  else if (id.startsWith('tower-')) s.notice(run.hasHearthEmber ? 'Climb to the bell and hold E while this region is restored. M: map · J: journal' : 'The bells answer only to the hearth’s ember.');
}
