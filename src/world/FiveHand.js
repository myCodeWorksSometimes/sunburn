import { FONT } from '../systems/Captions.js';
import { GROUND, FIVE_HAND as FH } from './layout.js';
import { saveSession } from './WorldState.js';
import { paintedBoss } from '../presentation/productionAssets.js';
import { bossHud } from '../presentation/bossHud.js';

// CAMPAIGN Scene 5 — Five-Hand, a shadow rooted in Mara's card counter at the
// market exit. Watch the lantern card, track the swaps, stand under your pick
// and press E. A correct pick exposes its knot for a lantern sweep; a wrong pick
// earns a telegraphed hand sweep along the ground. Two hits defeat it.
// Painted pixel poses; fine threads connect the creature to readable game cards.

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
  const fight = { state: 'waiting', round: 0, swapIndex: 0, elapsed: 0, hits: 0, picked: -1, hitDealt: false,
    x:FH.body,clock:0,inactive:0,timeouts:0,physical:false,attackNumber:0,hitCooldown:0,lastPlayerX:0 };
  s.fiveHand = fight;
  // Saves from before Five-Hand existed already have the market exit open.
  const defeated = () => !!run.clearedEncounters['five-hand'] || run.villageGateOpen;

  // The rooted body: a large shadow behind Mara's card counter, with a violet aura.
  const aura = s.add.image(FH.body, GROUND - 70, 'glow').setTint(0x8a4cff).setBlendMode('ADD').setScale(1.3, 1).setAlpha(0.35).setDepth(17);
  const body = paintedBoss(s,'fivehand',FH.body,GROUND,230);
  fight.sprite=body;
  const hud=bossHud(s,'Five-Hand');
  const counter = s.add.graphics().setDepth(19);
  const knot = s.add.circle(FH.body - 12, GROUND - 132, 13, 0xb47cff).setStrokeStyle(3, 0xfff0ff).setDepth(25).setVisible(false);
  const arms = s.add.graphics().setDepth(20);
  const label = s.add.text(FH.body, GROUND - 190, '', { fontFamily: FONT, fontSize: '15px', color: '#e0bd9a', stroke: '#11101b', strokeThickness: 4 }).setOrigin(0.5).setDepth(24);
  const warn = s.add.rectangle((FH.arenaStart + FH.body) / 2, GROUND - 8, FH.body - FH.arenaStart, 16, 0xd04cff, 0.35).setDepth(9).setVisible(false);
  const sweep = s.add.graphics().setDepth(22);
  const magicSheet=s.textures.exists('fivehand-motion');
  const magic=s.add.sprite(FH.body,GROUND-45,magicSheet?'fivehand-motion':'fx_dissolve',magicSheet?30:0).setDepth(27).setVisible(false);
  const magicFrame=f=>magic.setFrame((magicSheet?30:0)+Math.min(magicSheet?5:4,f));

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
    cards.forEach((card, i) => { s.tweens.killTweensOf(card.c); card.c.setPosition(FH.slots[i], FH.cardY).setScale(1).setVisible(true); card.faceUp = true; drawFace(card.g, card.symbol, true); });
  };
  const show = (on) => { for (const o of [aura, body, counter, arms, label, ...cards.map(c => c.c)]) o.setVisible(on); };
  show(!defeated());

  const go = (state) => { fight.state = state; fight.elapsed = 0; };
  // Already beaten (loaded save or revisit): stay dormant for good.
  if (defeated()) fight.state = 'defeated';
  fight.reset = ({full=false}={}) => {
    if (defeated()) return;
    resetCards(); knot.setVisible(false); warn.setVisible(false); sweep.clear();
    body.clearTint().pose(1);
    if(full){fight.hits=0;fight.round=0;fight.timeouts=0;fight.physical=false;fight.attackNumber=0;}
    if(fight.physical)for(const card of cards)card.c.setVisible(false);
    fight.x=FH.body;target.x=FH.body;fight.inactive=0;magic.setVisible(false);
    fight.round = Math.min(fight.round, ROUNDS.length - 1); fight.swapIndex = 0; go('waiting');
  };

  // Standing under a card and pressing E picks it.
  FH.slots.forEach((x, slot) => s.addInteract({ id: `five-hand-card-${slot}`, x, floor: GROUND, range: 38, priority: 9,
    when: () => fight.state === 'select', label: 'E: pick this card',
    use: () => {
      fight.picked = fight.cardAt[slot];
      flip(cards[fight.picked], true);
      go('reveal');
    } }));

  // A pseudo-enemy so the existing lantern sweep can strike the exposed knot.
  const target = {
    id: 'five-hand', active: true, alive: !defeated(), x: FH.body, floor: GROUND, regionId: 'square', restorationImmune: true,
    tick: (delta) => update(delta), touches: () => false, resetEncounter: () => fight.reset({full:true}), disperse: () => {},
    hit: () => {
      if(fight.hitCooldown>0)return false;
      if(!fight.physical&&fight.state!=='window'){s.notice('Find the lantern card to expose its heart.');return false;}
      fight.hitCooldown=400; // shorter than a valid sword recovery (520ms)
      fight.hits++; knot.setVisible(false); body.setTint(0xffb276).pose(3);
      s.time.delayedCall(250, () => {body.clearTint();body.pose(1);}); s.audio.bossCue('fivehand','hurt');
      if (fight.hits >= ROUNDS.length) { win(); return true; }
      fight.round++; fight.swapIndex = 0;
      if(fight.physical)go('hunt-recover');else{resetCards();go('observe');}
      s.notice('A hit! It gathers its cards again.');
      return true;
    },
  };
  s.enemies.push(target);

  const win = () => {
    target.alive = false; go('defeated');magic.setVisible(false);warn.setVisible(false);sweep.clear();hud.update(false,0,2,'');s.audio.bossCue('fivehand','death');
    run.defeatFiveHand();
    s.tweens.add({ targets: [aura, body, counter, arms, label, ...cards.map(c => c.c)], alpha: 0, duration: 900, onComplete: () => show(false) });
    const fx = s.add.sprite(fight.x, GROUND - 20, 'fx_dissolve').setScale(0.9).setDepth(28).play('fx-dissolve');
    fx.once('animationcomplete', () => fx.destroy());
    s.audio.cue('rescue');
    s.story('five-hand-defeated', { speaker: 'Echo Mara', text: fight.physical?'It cannot hold the court any longer.':'You found it every time. Eli always did too.' },
      { speaker: 'Echo Mara', text: 'The way out is clear. Please find my little girl.' });
    s.events.emit('five-hand:defeated', {});
    saveSession(s);
  };

  function update(delta) {
    if (fight.state === 'defeated') return;
    const p = s.player;
    fight.clock+=delta;fight.hitCooldown=Math.max(0,fight.hitCooldown-delta);target.state=fight.state;
    target.x=fight.x;
    body.setPosition(fight.x,GROUND+Math.sin(fight.clock/390)*5).setAngle(Math.sin(fight.clock/690)*2);
    aura.setPosition(fight.x,body.y-100).setAlpha(.23+Math.sin(fight.clock/280)*.07);
    knot.setPosition(fight.x-12,body.y-132);
    // A continuous breathing/gesture cycle, with a stronger lean during shuffles.
    if(!['punish','leap','leap-tell'].includes(fight.state))body.pose(fight.state==='shuffle'?Math.floor(fight.clock/260)%2?2:1:1);
    hud.update(fight.state!=='waiting'&&fight.state!=='introducing'&&p.x>FH.arenaStart-180&&p.x<FH.body+100,2-fight.hits,2,
      {observe:'Watch the lantern card',shuffle:'Follow the swaps',select:'Choose · E · do not keep it waiting',window:'Heart exposed · F',punish:'Jump the moving hand','leap-tell':'It is crouching · evade the marked landing',leap:'Move away from its landing','hunt-recover':fight.physical?'Strike its heart · F':'Move away · it will return to the cards','magic-tell':'Shadow cards gathering · prepare to jump','magic-cast':'Jump the moving shadow'}[fight.state]??'');
    fight.elapsed += delta;
    // Arms reach from the body up to each card.
    arms.clear();
    if(!fight.physical)for (const [i,card] of cards.entries()) {
      const sway=Math.sin(fight.clock/170+i)*9,handY=card.c.y-27+sway;
      arms.lineStyle(5,0x211728,.9).beginPath().moveTo(body.x-10,body.y-95).lineTo((body.x+card.c.x)/2,handY-42).lineTo(card.c.x,handY).strokePath();
      arms.lineStyle(2,0x9673a9,.75);
      for(let finger=-2;finger<=2;finger++)arms.lineBetween(card.c.x+finger*3,handY,card.c.x+finger*5,handY+9+Math.abs(finger)*2);
    }
    label.setText('');
    body.animateState?.(fight.state,fight.elapsed,fight.clock);

    if (fight.state === 'waiting') {
      if (run.maraFreed && !defeated() && p.x > FH.arenaStart - 20 && p.x < FH.body+100) {
        s.story('five-hand-wake', { text: 'Beyond the stall, five cards rise over the abandoned game court.', color: '#ebd5b0' },
          { speaker: 'Echo Mara', text: 'It took my card game! Watch the lantern card — its heart hides under that one.' },
          { text: 'Track the lantern card. Stand under it and press E, then sweep with F.', color: '#ebd5b0' });
        go('introducing');
        if(!s.cinematic.play({id:'five-hand',name:'FIVE-HAND',subtitle:'Keeper of the lost cards',sprite:body,x:FH.body,y:GROUND-115,
          onComplete:()=>{s.audio.bossCue('fivehand','idle');if(fight.physical)startLeap();else go('observe');}})){
            if(fight.physical)startLeap();else go('observe');
          }
      }
      return;
    }
    // Walking well away resets the round without penalty.
    if (p.x < FH.arenaStart - 320 && !['window', 'punish'].includes(fight.state)) { fight.reset(); return; }

    if(['leap-tell','leap','hunt-recover','magic-tell','magic-cast','returning','enrage'].includes(fight.state)){
      updateHunt(delta);body.animateState?.(fight.state,fight.elapsed,fight.clock);return;
    }

    const round = ROUNDS[fight.round];
    if (fight.state === 'observe' && fight.elapsed > OBSERVE_MS) {
      cards.forEach(card => flip(card, false)); go('flipdown');
    } else if (fight.state === 'flipdown' && fight.elapsed > FLIP_MS * 2 + 250) {
      go('shuffle'); fight.swapIndex = 0; swapNext();
    } else if (fight.state === 'select') {
      const moved=Math.abs(p.body.velocity.x)>20||Math.abs(p.body.velocity.y)>30||Math.abs(p.x-fight.lastPlayerX)>6;
      fight.inactive=moved||s.combat.attack?0:fight.inactive+delta;
      if(fight.inactive>=8000){
        fight.timeouts++;fight.physical=fight.timeouts>=2;
        if(fight.physical){for(const card of cards){s.tweens.killTweensOf(card.c);card.c.setVisible(false);}s.audio.bossCue('fivehand','enrage');s.notice('The game is over. Evade its leap, then strike.');go('enrage');}
        else startLeap();
      }
    } else if (fight.state === 'reveal' && fight.elapsed > FLIP_MS * 2 + 350) {
      if (fight.picked === LANTERN) {
        knot.setVisible(true); go('window'); s.notice('The knot is exposed — sweep it with F!');
      } else {
        const slot = fight.cardAt.indexOf(LANTERN); flip(cards[LANTERN], true);
        s.notice(`Wrong card — the lantern was card ${slot + 1}. Jump or back away!`);
        warn.setVisible(true);body.pose(2);s.audio.bossCue('fivehand','windup'); go('punish'); fight.hitDealt = false;
      }
    } else if (fight.state === 'window') {
      knot.setScale(1 + Math.sin(fight.elapsed / 120) * 0.12);
      if (fight.elapsed > WINDOW_MS) { knot.setVisible(false); s.notice('Too slow — it hides its knot again.'); resetCards(); go('observe'); }
    } else if (fight.state === 'punish') {
      warn.setAlpha(0.2 + Math.abs(Math.sin(fight.elapsed / 90)) * 0.4);
      if (fight.elapsed > WINDUP_MS) {
        const t = Math.min(1, (fight.elapsed - WINDUP_MS) / SWEEP_MS);
        const front = FH.body - t * (FH.body - FH.arenaStart);
        sweep.clear().fillStyle(0x0b0812, 0.25).fillRect(front, GROUND - 34, FH.body - front, 30).fillStyle(0x8a4cff, 0.9).fillRect(front - 15, GROUND - 38, 30, 38);
        magic.setVisible(true).setPosition(front,GROUND-30).setScale(.65).setFlipX(false);
        magicFrame(Math.floor(t*5));
        if(!fight.castSound){fight.castSound=true;s.audio.bossCue('fivehand','magic');}
        // Only the visible moving front hits. The fading trail is not a second
        // invisible hazard after Rowan has already jumped over the hand.
        if (!fight.hitDealt && Math.abs(p.x - front) < 34 && p.x < FH.body + 65 && p.feet > GROUND - 34) { fight.hitDealt = true; s.combat.damage(FH.body); }
        if (t >= 1) { sweep.clear();magic.setVisible(false);fight.castSound=false;warn.setVisible(false); body.pose(1);resetCards(); go('observe'); }
      }
    }
    fight.lastPlayerX=p.x;
    body.animateState?.(fight.state,fight.elapsed,fight.clock);
  }

  function startLeap(){
    fight.inactive=0;fight.leapFrom=fight.x;
    fight.landing=PhaserClamp(s.player.x,FH.arenaStart+30,FH.body-70);
    body.setFlipX(fight.landing>fight.x);
    fight.hitDealt=false;go('leap-tell');body.pose(2);s.audio.bossCue('fivehand','windup');
  }
  function updateHunt(){
    const p=s.player,t=fight.elapsed;
    sweep.clear();warn.setVisible(false);
    if(fight.state==='enrage'){
      sweep.lineStyle(2,0x9a78bc,.65).strokeEllipse(fight.x,GROUND-8,110+t*.12,20+t*.015);
      if(t>=1100)startLeap();
    }else if(fight.state==='leap-tell'){
      body.pose(2); // the coiled attack pose holds its tell
      sweep.lineStyle(2,0xcba5df,.8).strokeEllipse(fight.landing,GROUND-4,100+Math.sin(t/70)*10,17);
      if(t>=850){go('leap');s.audio.bossCue('fivehand','attack');}
    }else if(fight.state==='leap'){
      const u=Math.min(1,t/700);fight.x=fight.leapFrom+(fight.landing-fight.leapFrom)*u;
      target.x=fight.x;body.setPosition(fight.x,GROUND-Math.sin(u*Math.PI)*145).pose(2);
      if(u>=1){
        if(!fight.hitDealt&&Math.abs(p.x-fight.x)<62&&Math.abs(p.feet-GROUND)<65){s.combat.damage(fight.x);fight.hitDealt=true;}
        s.cameras.main.shake(140,.003);s.audio.bossCue('fivehand','stagger');go('hunt-recover');
      }
    }else if(fight.state==='hunt-recover'){
      body.pose(3);knot.setVisible(fight.physical);
      if(!fight.physical&&t>900&&Math.abs(p.x-fight.x)>150){
        knot.setVisible(false);fight.returnFrom=fight.x;go('returning');
      }else if(fight.physical&&t>1350){
        knot.setVisible(false);fight.attackNumber++;
        if(fight.attackNumber%2){fight.hitDealt=false;fight.magicDir=p.x<fight.x?-1:1;go('magic-tell');s.audio.bossCue('fivehand','windup');}
        else startLeap();
      }
    }else if(fight.state==='returning'){
      const u=Math.min(1,t/900);fight.x=fight.returnFrom+(FH.body-fight.returnFrom)*u;
      target.x=fight.x;body.setPosition(fight.x,GROUND-Math.sin(u*Math.PI)*25).pose(2);
      if(u>=1){body.setFlipX(false);resetCards();go('observe');}
    }else if(fight.state==='magic-tell'){
      body.pose(2);magic.setVisible(true).setPosition(fight.x,GROUND-110).setScale(.8);magicFrame(Math.min(2,Math.floor(t/300)));
      if(t>900){fight.magicStart=fight.x;go('magic-cast');s.audio.bossCue('fivehand','magic');}
    }else if(fight.state==='magic-cast'){
      const front=fight.magicStart+fight.magicDir*t*.55;
      magic.setPosition(front,GROUND-65).setFlipX(fight.magicDir>0);magicFrame(Math.floor(t/110)%3);
      sweep.lineStyle(3,0x826083,.6).lineBetween(front-fight.magicDir*60,GROUND-16,front,GROUND-30);
      if(!fight.hitDealt&&Math.abs(p.x-front)<34&&Math.abs(p.feet-GROUND)<50){s.combat.damage(front);fight.hitDealt=true;}
      if(t>1400){magic.setVisible(false);sweep.clear();startLeap();}
    }
  }
  function PhaserClamp(n,a,b){return Math.max(a,Math.min(b,n));}

  // One visible swap at a time; the two cards arc past each other.
  function swapNext() {
    if (fight.state !== 'shuffle') return; // reset mid-shuffle
    const round = ROUNDS[fight.round];
    if (fight.swapIndex >= round.swaps.length) { fight.inactive=0;fight.lastPlayerX=s.player.x;go('select'); return; }
    const [a, b] = round.swaps[fight.swapIndex++];
    const ca = cards[fight.cardAt[a]], cb = cards[fight.cardAt[b]];
    [fight.cardAt[a], fight.cardAt[b]] = [fight.cardAt[b], fight.cardAt[a]];
    s.audio.bossCue('fivehand','magic');
    s.tweens.add({ targets: ca.c, x: FH.slots[b], duration: round.swapMs, ease: 'Sine.inOut' });
    s.tweens.add({ targets: ca.c, y: FH.cardY - 46, duration: round.swapMs / 2, yoyo: true, ease: 'Sine.out' });
    s.tweens.add({ targets: cb.c, x: FH.slots[a], duration: round.swapMs, ease: 'Sine.inOut' });
    s.tweens.add({ targets: cb.c, y: FH.cardY + 30, duration: round.swapMs / 2, yoyo: true, ease: 'Sine.out',
      onComplete: () => s.time.delayedCall(220, swapNext) });
  }
}
