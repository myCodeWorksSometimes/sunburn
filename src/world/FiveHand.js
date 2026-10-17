import { FONT } from '../systems/Captions.js';
import { GROUND, FIVE_HAND as FH } from './layout.js';
import { saveSession } from './WorldState.js';

// CAMPAIGN Scene 5 — Five-Hand, a shadow rooted in Mara's card counter at the
// market exit. Watch the lantern card, track the swaps, stand under your pick
// and press E. A correct pick exposes its knot for a lantern sweep; a wrong pick
// earns a telegraphed hand sweep along the ground. Two hits defeat it.
// Placeholder art: a large shadow behind a counter, cards and arms drawn in code.

const ROUNDS = [
  { swaps: [[1, 3], [0, 2]], swapMs: 950 },
  { swaps: [[0, 4], [1, 2], [3, 1]], swapMs: 750 }, // the first swap's paths cross over
];
const OBSERVE_MS = 1800, FLIP_MS = 170, WINDOW_MS = 4200, WINDUP_MS = 900, SWEEP_MS = 650;
const LANTERN = 2; // index of the lantern card in the starting row
const SYMBOLS = ['sun', 'diamond', 'lantern', 'leaf', 'star'];

function drawFace(g, symbol, faceUp) {
  g.clear();
  if (!faceUp) {
    g.fillStyle(0x4d3424).fillRoundedRect(-17, -25, 34, 50, 4).lineStyle(2, 0xc49a5c).strokeRoundedRect(-17, -25, 34, 50, 4);
    g.lineStyle(2, 0xd9b26a).strokeCircle(0, 0, 8);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.lineBetween(Math.cos(a) * 10, Math.sin(a) * 10, Math.cos(a) * 14, Math.sin(a) * 14); }
    return;
  }
  g.fillStyle(0xeee0c0).fillRoundedRect(-17, -25, 34, 50, 4).lineStyle(2, 0x6b4a2c).strokeRoundedRect(-17, -25, 34, 50, 4);
  if (symbol === 'lantern') {
    g.fillStyle(0x3a2c22).fillRect(-7, -12, 14, 4).fillRect(-7, 10, 14, 4);
    g.fillStyle(0xffb347).fillRect(-6, -8, 12, 18);
    g.fillStyle(0xfff1b0).fillRect(-2, -3, 4, 8);
    g.lineStyle(2, 0x3a2c22).strokeCircle(0, -17, 4);
  } else if (symbol === 'sun') {
    g.fillStyle(0xd88c3a).fillCircle(0, 0, 7);
  } else if (symbol === 'diamond') {
    g.fillStyle(0x8c3a3a).fillTriangle(0, -10, 8, 0, 0, 10).fillTriangle(0, -10, -8, 0, 0, 10);
  } else if (symbol === 'leaf') {
    g.fillStyle(0x5d7a3e).fillEllipse(0, 0, 10, 20);
  } else {
    g.fillStyle(0x4a5f8c).fillTriangle(0, -10, 9, 7, -9, 7).fillTriangle(0, 10, 9, -4, -9, -4);
  }
}

export function buildFiveHand(s) {
  const run = s.run;
  const fight = { state: 'waiting', round: 0, swapIndex: 0, elapsed: 0, hits: 0, picked: -1, hitDealt: false };
  s.fiveHand = fight;
  // Saves from before Five-Hand existed already have the market exit open.
  const defeated = () => !!run.clearedEncounters['five-hand'] || run.villageGateOpen;

  // The rooted body: a large shadow behind Mara's card counter, with a violet aura.
  const aura = s.add.image(FH.body, GROUND - 70, 'glow').setTint(0x8a4cff).setBlendMode('ADD').setScale(1.3, 1).setAlpha(0.35).setDepth(17);
  const body = s.add.sprite(FH.body, GROUND, 'shadow_idle').setOrigin(0.5, 1).setScale(1.25).setFlipX(true).setDepth(18).play('shadow-idle');
  const counter = s.add.graphics().setDepth(19);
  counter.fillStyle(0x4a3424).fillRect(FH.body - 60, GROUND - 42, 120, 42).fillStyle(0x6b4a2c).fillRect(FH.body - 66, GROUND - 48, 132, 8);
  const knot = s.add.circle(FH.body - 12, GROUND - 82, 13, 0xb47cff).setStrokeStyle(3, 0xfff0ff).setDepth(21).setVisible(false);
  const arms = s.add.graphics().setDepth(20);
  const label = s.add.text(FH.body, GROUND - 190, '', { fontFamily: FONT, fontSize: '15px', color: '#e0bd9a', stroke: '#11101b', strokeThickness: 4 }).setOrigin(0.5).setDepth(24);
  const warn = s.add.rectangle((FH.arenaStart + FH.body) / 2, GROUND - 8, FH.body - FH.arenaStart, 16, 0xd04cff, 0.35).setDepth(9).setVisible(false);
  const sweep = s.add.graphics().setDepth(22);

  // Cards: index = identity; cardAt[slot] = which card is in that slot.
  const cards = SYMBOLS.map((symbol, i) => {
    const g = s.add.graphics();
    const c = s.add.container(FH.slots[i], FH.cardY, [g]).setDepth(23);
    drawFace(g, symbol, true);
    return { c, g, symbol, faceUp: true };
  });
  fight.cardAt = [0, 1, 2, 3, 4];

  const flip = (card, faceUp) => {
    s.tweens.add({ targets: card.c, scaleX: 0, duration: FLIP_MS, onComplete: () => {
      card.faceUp = faceUp; drawFace(card.g, card.symbol, faceUp);
      s.tweens.add({ targets: card.c, scaleX: 1, duration: FLIP_MS });
    } });
  };
  const resetCards = () => {
    fight.cardAt = [0, 1, 2, 3, 4];
    cards.forEach((card, i) => { s.tweens.killTweensOf(card.c); card.c.setPosition(FH.slots[i], FH.cardY).setScale(1); card.faceUp = true; drawFace(card.g, card.symbol, true); });
  };
  const show = (on) => { for (const o of [aura, body, counter, arms, label, ...cards.map(c => c.c)]) o.setVisible(on); };
  show(!defeated());

  const go = (state) => { fight.state = state; fight.elapsed = 0; };
  // Already beaten (loaded save or revisit): stay dormant for good.
  if (defeated()) fight.state = 'defeated';
  fight.reset = () => {
    if (defeated()) return;
    resetCards(); knot.setVisible(false); warn.setVisible(false); sweep.clear();
    fight.round = Math.min(fight.round, ROUNDS.length - 1); fight.swapIndex = 0; go('waiting');
  };

  // Standing under a card and pressing E picks it.
  FH.slots.forEach((x, slot) => s.addInteract({ id: `five-hand-card-${slot}`, x, floor: GROUND, range: 22, priority: 9,
    when: () => fight.state === 'select', label: 'E: pick this card',
    use: () => {
      fight.picked = fight.cardAt[slot];
      flip(cards[fight.picked], true);
      go('reveal');
    } }));

  // A pseudo-enemy so the existing lantern sweep can strike the exposed knot.
  const target = {
    id: 'five-hand', active: true, alive: !defeated(), x: FH.body, floor: GROUND, regionId: 'square', restorationImmune: true,
    tick: (delta) => update(delta), touches: () => false, resetEncounter: () => fight.reset(), disperse: () => {},
    hit: () => {
      if (fight.state !== 'window') { s.notice('Its knot is hidden. Find the lantern card first.'); return false; }
      fight.hits++; knot.setVisible(false); body.setTint(0xffb276);
      s.time.delayedCall(250, () => body.clearTint()); s.audio.cue('take');
      if (fight.hits >= ROUNDS.length) { win(); return true; }
      fight.round++; fight.swapIndex = 0; resetCards(); go('observe');
      s.notice('A hit! It gathers its cards again.');
      return true;
    },
  };
  s.enemies.push(target);

  const win = () => {
    target.alive = false; go('defeated');
    run.defeatFiveHand();
    s.tweens.add({ targets: [aura, body, counter, arms, label, ...cards.map(c => c.c)], alpha: 0, duration: 900, onComplete: () => show(false) });
    const fx = s.add.sprite(FH.body, GROUND - 20, 'fx_dissolve').setScale(0.9).setDepth(28).play('fx-dissolve');
    fx.once('animationcomplete', () => fx.destroy());
    s.audio.cue('rescue');
    s.story('five-hand-defeated', { speaker: 'Mara', text: 'You found it every time. Eli always did too.' },
      { speaker: 'Mara', text: 'The way out is clear. I’m going to Nia.' });
    s.events.emit('five-hand:defeated', {});
    saveSession(s);
  };

  function update(delta) {
    if (fight.state === 'defeated') return;
    const p = s.player;
    fight.elapsed += delta;
    // Arms reach from the body up to each card.
    arms.clear().lineStyle(7, 0x0b0812, 0.95);
    for (const card of cards) arms.beginPath().moveTo(FH.body - 10, GROUND - 95).lineTo((FH.body + card.c.x) / 2, card.c.y - 55).lineTo(card.c.x, card.c.y - 22).strokePath();
    label.setText(`FIVE-HAND  ·  ${fight.hits} / ${ROUNDS.length}`);

    if (fight.state === 'waiting') {
      if (run.maraFreed && p.x > FH.arenaStart - 20) {
        s.story('five-hand-wake', { text: 'The cards on Mara’s counter turn over by themselves.', color: '#ebd5b0' },
          { speaker: 'Mara', text: 'It took my card game! Watch the lantern card — its heart hides under that one.' },
          { text: 'Track the lantern card. Stand under it and press E, then sweep with F.', color: '#ebd5b0' });
        go('observe');
      }
      return;
    }
    // Walking well away resets the round without penalty.
    if (p.x < FH.arenaStart - 320 && !['window', 'punish'].includes(fight.state)) { fight.reset(); return; }

    const round = ROUNDS[fight.round];
    if (fight.state === 'observe' && fight.elapsed > OBSERVE_MS) {
      cards.forEach(card => flip(card, false)); go('flipdown');
    } else if (fight.state === 'flipdown' && fight.elapsed > FLIP_MS * 2 + 250) {
      go('shuffle'); fight.swapIndex = 0; swapNext();
    } else if (fight.state === 'select') {
      if (!s.noticeRemaining) s.notice('Stand under the lantern card and press E.');
    } else if (fight.state === 'reveal' && fight.elapsed > FLIP_MS * 2 + 350) {
      if (fight.picked === LANTERN) {
        knot.setVisible(true); go('window'); s.notice('The knot is exposed — sweep it with F!');
      } else {
        const slot = fight.cardAt.indexOf(LANTERN); flip(cards[LANTERN], true);
        s.notice(`Wrong card — the lantern was card ${slot + 1}. Jump or back away!`);
        warn.setVisible(true); go('punish'); fight.hitDealt = false;
      }
    } else if (fight.state === 'window') {
      knot.setScale(1 + Math.sin(fight.elapsed / 120) * 0.12);
      if (fight.elapsed > WINDOW_MS) { knot.setVisible(false); s.notice('Too slow — it hides its knot again.'); resetCards(); go('observe'); }
    } else if (fight.state === 'punish') {
      warn.setAlpha(0.2 + Math.abs(Math.sin(fight.elapsed / 90)) * 0.4);
      if (fight.elapsed > WINDUP_MS) {
        const t = Math.min(1, (fight.elapsed - WINDUP_MS) / SWEEP_MS);
        const front = FH.body - t * (FH.body - FH.arenaStart);
        sweep.clear().fillStyle(0x0b0812, 0.95).fillRect(front, GROUND - 34, FH.body - front, 30).fillStyle(0x8a4cff, 0.8).fillRect(front - 6, GROUND - 38, 10, 38);
        if (!fight.hitDealt && p.x > front - 10 && p.feet > GROUND - 34) { fight.hitDealt = true; s.combat.damage(FH.body); }
        if (t >= 1) { sweep.clear(); warn.setVisible(false); resetCards(); go('observe'); }
      }
    }
  }

  // One visible swap at a time; the two cards arc past each other.
  function swapNext() {
    if (fight.state !== 'shuffle') return; // reset mid-shuffle
    const round = ROUNDS[fight.round];
    if (fight.swapIndex >= round.swaps.length) { go('select'); return; }
    const [a, b] = round.swaps[fight.swapIndex++];
    const ca = cards[fight.cardAt[a]], cb = cards[fight.cardAt[b]];
    [fight.cardAt[a], fight.cardAt[b]] = [fight.cardAt[b], fight.cardAt[a]];
    s.tweens.add({ targets: ca.c, x: FH.slots[b], duration: round.swapMs, ease: 'Sine.inOut' });
    s.tweens.add({ targets: ca.c, y: FH.cardY - 46, duration: round.swapMs / 2, yoyo: true, ease: 'Sine.out' });
    s.tweens.add({ targets: cb.c, x: FH.slots[a], duration: round.swapMs, ease: 'Sine.inOut' });
    s.tweens.add({ targets: cb.c, y: FH.cardY + 30, duration: round.swapMs / 2, yoyo: true, ease: 'Sine.out',
      onComplete: () => s.time.delayedCall(220, swapNext) });
  }
}
