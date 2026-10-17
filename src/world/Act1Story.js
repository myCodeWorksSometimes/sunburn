import { Npc } from '../entities/Npc.js';
import { placeProp } from '../presentation/Scenery.js';
import { GROUND, MARA_STALL as STALL, REFUGE } from './layout.js';
import { saveSession } from './WorldState.js';

// Campaign Act 1 (CAMPAIGN.md Scenes 4 and 6): Mara trapped in her market stall,
// then her family at the Bridge Refuge. Five-Hand and the bridge works come later.

const FREED_LINES = [
  { speaker: 'Mara', text: 'Rowan? Oh, thank the fire.' },
  { speaker: 'Rowan', text: 'Mara. Have you seen Eli?' },
  { speaker: 'Mara', text: 'He came back for the little ones. Took them toward the bridge.' },
  { speaker: 'Mara', text: 'Nia was with them. But that thing at my counter is blocking the way out.' },
  { speaker: 'Rowan', text: 'Stay behind the shutter. I’ll deal with it.' },
];

const REUNION_LINES = [
  { speaker: 'Mara', text: 'Nia!' },
  { speaker: 'Nia', text: 'Mama! You came!' },
  { speaker: 'Rowan', text: 'Nia — did you see Eli?' },
  { speaker: 'Nia', text: 'We went to the tower. Then the shadows came.' },
  { speaker: 'Nia', text: 'Eli said to use the old road when the bell rang.' },
  { speaker: 'Rowan', text: 'Did he come with you?' },
  { speaker: 'Nia', text: 'We heard it. He didn’t come.' },
];

const HEARTH_LINES = [
  { speaker: 'Tomas', text: 'The old road’s gate only opens from the tower side. The bridge is your way across.' },
  { speaker: 'Tomas', text: 'Be careful at its fire. It could show me the crossing… but I couldn’t get out.' },
  { speaker: 'Mara', text: 'I brought an ember from our hearth. Then he could take my hand.' },
  { speaker: 'Tomas', text: 'The house hasn’t remembered since.' },
  { speaker: 'Rowan', text: 'An ember from home… can bring someone back.' },
  { speaker: 'Tomas', text: 'Something braced in iron guards the bridge works. Its front turns any blow. Make it charge the cracked barrier.' },
  { speaker: 'Tomas', text: 'Inside, line up both gear marks in remembered time, then set the brake. The brake holds in any time.' },
];

export function buildAct1Story(s, gate) {
  const run = s.run;
  s.npcs = [];
  s.knockClock = 0;

  // ---- Market: Mara's stall. Its roof is reached from the remembered steps.
  const width = STALL.x2 - STALL.x1;
  const body = s.add.graphics().setDepth(9);
  body.fillStyle(0x2c2326).fillRect(STALL.x1 + 6, STALL.roof + 30, width - 12, GROUND - STALL.roof - 30);
  for (let x = STALL.x1, i = 0; x < STALL.x2; x += 25, i++) body.fillStyle(i % 2 ? 0x7a3a34 : 0xa88f62).fillRect(x, STALL.roof + 36, Math.min(25, STALL.x2 - x), 20);
  body.fillStyle(0x4a3a30).fillRect(STALL.x1 + 14, GROUND - 58, width - 28, 10);
  s.addSurface(STALL.x1, STALL.x2, STALL.roof, { material: 'timber' });
  const opening = s.add.rectangle(STALL.shutter, GROUND - 56, 92, 112, 0x15121a).setDepth(9).setVisible(run.maraFreed);
  const shutter = placeProp(s, 'door', STALL.shutter, GROUND, 96, 118).setTint(0x8c7b6a).setVisible(!run.maraFreed);
  s.addLabel(STALL.shutter, STALL.roof + 80, 'MARA’S STALL', '#d3bc91', 12);
  const lever = s.add.graphics().setDepth(22);
  const drawLever = (pulled) => {
    lever.clear().fillStyle(0x6e5a44).fillRect(STALL.release - 3, STALL.roof - 34, 6, 34);
    lever.lineStyle(4, 0xc9a86a).lineBetween(STALL.release, STALL.roof - 30, STALL.release + (pulled ? 16 : -16), STALL.roof - 48);
  };
  drawLever(run.maraFreed);
  const releaseLabel = s.addLabel(STALL.release, STALL.roof - 70, 'SHUTTER RELEASE', '#d3bc91', 12).setVisible(!run.maraFreed);
  // Mara stays in her stall until Five-Hand is gone, then leaves for the refuge.
  const stallMara = new Npc(s, 'mara', STALL.shutter, GROUND, { visible: run.maraFreed && !run.villageGateOpen });
  // She walks off toward the refuge; tickAct1Story swaps her to the refuge copy
  // once she leaves (or as soon as Rowan goes on ahead).
  const onFiveHandDefeated = () => s.time.delayedCall(6000, () => stallMara.walkTo(STALL.exitGate + 90, { hide: true }));
  s.events.on('five-hand:defeated', onFiveHandDefeated);
  s.events.once('shutdown', () => s.events.off('five-hand:defeated', onFiveHandDefeated));
  s.npcs.push(stallMara);

  s.addInteract({ id: 'mara-shutter', x: STALL.shutter, floor: GROUND, range: 70, when: () => !run.maraFreed,
    label: 'E: knock on the shutter',
    use: () => {
      s.audio.cue('knock');
      if (!s.story('mara-knock', { text: '… knock, knock …', color: '#ffe1a1' },
        { speaker: 'Mara', text: 'Someone’s there? The shutter’s jammed — the release is up on the roof!' },
        { speaker: 'Rowan', text: 'Hold on. I’ll find a way up.' },
        { text: 'Restore the market fire. Its remembered steps reach the stall roof.', color: '#ebd5b0' })) {
        s.captions.say({ speaker: 'Mara', text: 'The release is on the roof! Please hurry.' });
      }
    } });

  s.addInteract({ id: 'mara-release', x: STALL.release, floor: STALL.roof, hold: 600, priority: 5, when: () => !run.maraFreed,
    label: 'Hold E: pull the shutter release',
    use: () => {
      if (!run.freeMara()) return;
      drawLever(true); releaseLabel.setVisible(false);
      shutter.setVisible(false); opening.setVisible(true);
      stallMara.setVisible(true);
      s.audio.cue('take');
      s.notice('The shutter opens.');
      s.story('mara-freed', ...FREED_LINES);
      saveSession(s);
    } });

  // Five-Hand's tendrils hold this exit until it is defeated (FiveHand.js).
  gate(s, STALL.exitGate, () => run.villageGateOpen, run.maraFreed ? 'Five-Hand’s tendrils hold the market exit.' : 'Corruption chokes the market exit. Someone is knocking in the stalls behind you.');

  // ---- Bridge Refuge: the family, their spent hearth and the Old Road's west gate.
  placeProp(s, 'door', REFUGE.oldRoad, GROUND, 80, 128).setTint(0x6d6878);
  s.addLabel(REFUGE.oldRoad, GROUND - 150, 'OLD ROAD', '#a59f9a', 13);
  s.addInteract({ id: 'old-road-west', x: REFUGE.oldRoad, floor: GROUND, range: 40,
    label: () => run.oldRoadOpen ? 'E: take the Old Road to the tower' : 'E: try the Old Road gate',
    use: () => run.oldRoadOpen ? s.goTo('World', 'oldRoadEast')
      : s.captions.say({ speaker: 'Rowan', text: run.heardTomas ? 'Barred from the tower side, like Tomas said.' : 'Barred. From the other side.' }) });

  // An ordinary household fire: rest works here, restoration does not.
  const hearth = s.addFire({ id: 'refuge-hearth', regionId: 'bridge', x: REFUGE.hearth, floor: GROUND, duration: 1000, spawnId: 'refuge', spent: () => true });
  hearth.lit = true; hearth.light.on = true; hearth.sprite.play('fire-burning'); hearth.embers.start();
  s.addLabel(REFUGE.hearth, GROUND - 150, 'REFUGE HEARTH', '#d3bc91', 12);
  s.addInteract({ id: 'refuge-hearth-look', x: REFUGE.hearth, floor: GROUND, range: 30, priority: -1, label: 'E: look at the hearth',
    use: () => s.captions.say({ speaker: 'Rowan', text: run.heardTomas ? 'Still warm. It just doesn’t remember any more.' : 'Warm… but no memory stirs in it.' }) });

  const nia = new Npc(s, 'nia', REFUGE.nia, GROUND);
  const tomas = new Npc(s, 'tomas', REFUGE.tomas, GROUND);
  const mara = new Npc(s, 'mara', REFUGE.mara, GROUND, { visible: run.maraFreed && run.villageGateOpen });
  if (run.heardNia) mara.sprite.x = REFUGE.nia + 50;
  s.npcs.push(nia, tomas, mara);
  s.refuge = { mara, stallMara };

  s.addInteract({ id: 'talk-nia', x: REFUGE.nia, floor: GROUND, range: 34, priority: 4, label: 'E: talk to Nia',
    use: () => s.captions.say(run.heardNia
      ? { speaker: 'Nia', text: 'Eli showed me Mama’s card trick. You find him, okay?' }
      : { speaker: 'Nia', text: 'Is Mama coming? She was at the market.' }) });
  s.addInteract({ id: 'talk-tomas', x: REFUGE.tomas, floor: GROUND, range: 34, priority: 6,
    label: () => run.heardNia && !run.heardTomas ? 'E: talk to Tomas' : 'E: talk to Tomas',
    use: () => {
      if (run.hearTomas()) {
        // Queue after any reunion lines still playing instead of cutting them off.
        run.completeStory('refuge-hearth'); s.captions.say(...HEARTH_LINES);
        s.events.emit('story:completed', { storyId: 'refuge-hearth' }); saveSession(s); return;
      }
      s.captions.say(run.heardTomas
        ? { speaker: 'Tomas', text: run.bridgeBrakeSet ? 'The brake’s set. The bridge fire will hold the deck — be quick.' : 'Bait it into the cracked barrier, then hit its back. Lever A turns both gears, lever B the small one.' }
        : { speaker: 'Tomas', text: 'Mara? Is Mara with you? She went back for supplies.' });
    } });
  s.addInteract({ id: 'talk-mara-stall', x: STALL.shutter, floor: GROUND, range: 50, priority: 3, when: () => stallMara.visible && !stallMara.walking,
    label: 'E: talk to Mara', use: () => s.captions.say({ speaker: 'Mara', text: run.villageGateOpen ? 'Thank you. I’m going to Nia now.' : 'Watch the lantern card. Its heart hides under it.' }) });
  s.refuge.talkMara = s.addInteract({ id: 'talk-mara', x: mara.x, floor: GROUND, range: 34, priority: 4, when: () => run.maraFreed && mara.visible,
    label: 'E: talk to Mara',
    use: () => s.captions.say({ speaker: 'Mara', text: 'He came back for my girl. Go and bring him home.' }) });
}

export function tickAct1Story(s, delta) {
  const run = s.run, x = s.player.x;
  for (const npc of s.npcs) npc.tick(delta, s.player);
  s.refuge.talkMara.x = s.refuge.mara.x;
  const { stallMara, mara } = s.refuge;
  if (run.villageGateOpen && !mara.visible && (!stallMara.visible || x > STALL.exitGate + 20)) {
    stallMara.setVisible(false); mara.setVisible(true);
  }

  // Coming home with Eli: Nia sees him (CAMPAIGN Scene 14).
  if (run.rescuedEli && Math.abs(x - REFUGE.nia) < 260 && s.story('nia-eli',
    { speaker: 'Nia', text: 'Eli! You came back!' }, { speaker: 'Eli', text: 'Rowan came for me.' },
    { speaker: 'Nia', text: 'You rang the bell. We heard it, and we ran.' },
    { speaker: 'Mara', text: 'Go home, you two. Your hearth is waiting.' })) saveSession(s);

  // Knocking draws Rowan to the stall before he has spoken to Mara.
  if (!run.maraFreed && !run.completedStory['mara-knock'] && Math.abs(x - STALL.shutter) < 450) {
    s.knockClock -= delta;
    if (s.knockClock <= 0) { s.knockClock = 2600; s.audio.cue('knock'); s.notice('Knocking… from inside a market stall.'); }
  }

  // Arriving at the refuge plays the reunion once.
  if (run.maraFreed && !run.heardNia && x > REFUGE.oldRoad - 40 && x < REFUGE.barrier + 200) {
    if (run.hearNia()) {
      s.story('refuge-reunion', ...REUNION_LINES);
      s.refuge.mara.walkTo(REFUGE.nia + 50);
      saveSession(s);
    }
  }

  // Tomas has something to say before Rowan tries the bridge.
  if (run.maraFreed && !run.heardTomas && !run.bridgeReturnOpen && x > REFUGE.barrier) {
    const push = x - REFUGE.barrier;
    s.player.body.x -= push;
    s.player.setVelocityX(Math.min(0, s.player.body.velocity.x));
    if (!s.noticeRemaining) s.notice('Tomas: “Rowan — a word before the bridge.”');
  }
}
