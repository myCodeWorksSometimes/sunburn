import Phaser from 'phaser';
import { FONT } from '../systems/Captions.js';
import { GROUND, BRIDGE_WORKS as BW } from './layout.js';
import { saveSession } from './WorldState.js';
import { paintedBoss } from '../presentation/productionAssets.js';
import { bossHud } from '../presentation/bossHud.js';
import { Crawler } from '../entities/Crawler.js';

// CAMPAIGN Scene 7 — the bridge works, between the refuge and the bridge fire.
// 1. The Braced Shadow: its armoured front turns any sweep. Bait its long, readable
//    charge into the cracked barrier (dodge onto the crate or jump); the impact
//    breaks the barrier and stuns it with its back exposed. Three committed openings, one hit per stagger.
// 2. The linked gears (in remembered time): lever A turns both gears, lever B
//    only the small one. Line up both marks, then set the present-day brake.
// Six-frame action rows share a grounded baseline; smaller offspring use the
// same creature lineage. Summoning is bounded to two living offspring.

const WINDUP_MS = 1000, CHARGE_SPEED = 540, STUN_MS = 2300, RECOVER_MS = 750;
const GEAR_START = { big: 2, small: 1 }; // quarter turns away from the marks

export function buildBridgeWorks(s) {
  const run = s.run;
  const eliteCleared = () => !!run.clearedEncounters['braced-shadow'];
  // The abandoned foundry is a full arena beyond the refuge approach. It has
  // its own architecture, name and smoke; no monster standing with civilians.
  const foundryScale=1460/s.textures.get('foundry').getSourceImage().width;
  s.add.image(BW.arenaMin-110,GROUND-450*foundryScale,'foundry').setOrigin(0).setScale(foundryScale).setDepth(-2);
  const smoke=s.add.particles(BW.elite,GROUND-10,'smoke',{x:{min:-380,max:450},lifespan:2800,speedY:{min:-60,max:-22},speedX:{min:-18,max:18},scale:{start:1.5,end:4},alpha:{start:.32,end:0},frequency:180}).setDepth(14);

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
  const aura=s.add.image(BW.elite,GROUND-100,'mote').setDisplaySize(260,260).setTint(0x9771d1).setBlendMode('ADD').setAlpha(0).setDepth(18);
  const sigil=s.add.graphics().setDepth(17);
  const hud=bossHud(s,'Braced Shadow');
  const shield = s.add.graphics().setDepth(23);
  const tell = s.add.text(BW.elite, GROUND - 130, '!', { fontFamily: FONT, fontSize: '28px', color: '#ff9a6a', stroke: '#11101b', strokeThickness: 5 }).setOrigin(0.5).setDepth(26).setVisible(false);
  const label = s.add.text(BW.elite, GROUND - 150, '', { fontFamily: FONT, fontSize: '14px', color: '#e0bd9a', stroke: '#11101b', strokeThickness: 4 }).setOrigin(0.5).setDepth(24);
  const elite = {
    id: 'braced-shadow', active: !eliteCleared(), alive: !eliteCleared(), x: BW.elite, floor: GROUND, regionId: 'bridge', restorationImmune: true,
    health: 3, state: 'idle', elapsed: 0, facing: -1, chargeDir: 1, hitDealt: false,hitUsed:false,
  };
  if (!elite.alive) for (const o of [sprite, shield, tell, label]) o.setVisible(false);
  const minions=[];
  const seals=[BW.arenaMin-20,BW.barrier+40].map(x=>{
    const zone=s.add.zone(x,GROUND-140,18,280);s.solids.add(zone);zone.body.enable=false;
    const mist=s.add.particles(x,GROUND,'smoke',{y:{min:-250,max:0},lifespan:800,speedX:{min:-8,max:8},speedY:-35,scale:{start:1.2,end:2.5},alpha:{start:.65,end:0},frequency:75,emitting:false}).setDepth(25);
    return {zone,mist};
  });
  let sealed=false;
  const setSeals=on=>{if(on===sealed)return;sealed=on;for(const {zone,mist}of seals){zone.body.enable=on;if(on)mist.start();else mist.stop();}};
  const clearMinions=()=>{for(const m of minions){m.alive=false;if(m.active)m.destroy();}minions.length=0;};
  const go = (state) => { elite.state = state; elite.elapsed = 0; };
  let summonClock=0,perchClock=0;
  const summon=()=>{
    for(let i=0;i<2;i++){
      if(minions.filter(m=>m.active&&m.alive).length>=2)break;
      const x=Phaser.Math.Clamp(elite.x+(i?180:-180),BW.arenaMin+30,BW.arenaMax-30);
      const m=new Crawler(s,{id:`foundry-summon-${i}`,x,floor:GROUND,minX:BW.arenaMin,maxX:BW.arenaMax,regionId:'foundry',kind:'pouncer'});
      m.restorationImmune=true;minions.push(m);s.enemies.push(m);
      const fx=s.add.sprite(x,GROUND-25,'fx_dissolve').setDepth(28).play('fx-dissolve');fx.once('animationcomplete',()=>fx.destroy());
    }
    s.audio.cue('summon');s.cameras.main.shake(200,.003);
  };


  elite.tick = (delta) => {
    if (!elite.alive) return;
    const p = s.player;
    const inArena=p.x>BW.arenaMin-70&&p.x<BW.barrier+120;
    if(p.x>BW.arenaMin+20&&p.x<BW.barrier+20&&run.heardTomas)setSeals(true);
    sprite.setVisible(inArena);shield.setVisible(inArena);
    aura.setVisible(inArena).setPosition(elite.x,GROUND-100).setAlpha(elite.state==='summon'?.24:elite.state==='windup'?.1:.025);
    sigil.clear();if(elite.state==='summon')sigil.lineStyle(2,0x9a78bc,.65).strokeEllipse(elite.x,GROUND-4,220,30);
    if(elite.state==='lash'){
      sigil.lineStyle(2,elite.elapsed<650?0xd2a470:0x9a78bc,.8).strokeEllipse(elite.lashX,GROUND-5,95,18);
      if(elite.elapsed>=650)for(let n=-1;n<=1;n++){
        sigil.lineStyle(4,0x6e4c8a,.9).beginPath().moveTo(elite.lashX+n*27,GROUND).lineTo(elite.lashX-n*15,GROUND-75).lineTo(elite.lashX+n*9,GROUND-175).strokePath();
      }
    }
    if(!inArena){hud.update(false,elite.health,3,'');return;}
    summonClock+=delta;
    if(s.run.heardTomas&&p.x>BW.arenaMin-60&&p.x<BW.barrier+120&&!s.run.completedStory['intro-braced-shadow']) {
      if(s.cinematic.play({id:'braced-shadow',name:'THE BRACED SHADOW',subtitle:'Break the charge. Strike the exposed heart.',sprite,x:elite.x,y:GROUND-100,
        onComplete:()=>s.audio.cue('monster-roar')}))return;
    }
    hud.update(p.x>BW.arenaMin-90&&p.x<BW.barrier+30,elite.health,3,
      elite.state==='stunned'?(elite.hitUsed?'Retreat · the darkness is gathering':'Exposed back · F'):elite.state==='lash'?'Tendril strike · move sideways':elite.state==='summon'?'Summoning · cut down its spawn':elite.state==='windup'?'Charge incoming · jump or use the ledge':elite.health===1?'Enraged · bait the charge':'Lure it into the cracked barrier');
    elite.elapsed += delta;
    const sameLevel = Math.abs(p.feet - GROUND) < 60;
    perchClock=!sameLevel&&p.feet<GROUND&&p.feet>GROUND-220?perchClock+delta:0;
    const dx = p.x - elite.x;
    if (elite.state === 'idle') {
      elite.facing = Math.sign(dx) || elite.facing;
      if(perchClock>1400){elite.lashX=p.x;go('lash');tell.setText('!').setVisible(true);s.audio.cue('snarl');}
      else if(summonClock>8500&&minions.filter(m=>m.active&&m.alive).length<2){go('summon');tell.setText('◊').setVisible(true);s.audio.cue('snarl');}
      // Only once Rowan is inside the arena (never while held at the refuge).
      else if (sameLevel && Math.abs(dx) < 900 && p.x > BW.arenaMin + 10 && run.heardTomas) {
        elite.chargeDir = elite.facing; go('windup'); tell.setVisible(true); sprite.setTint(0xceb0e7); s.audio.cue('notice');
      }
    } else if(elite.state==='lash') {
      if(elite.elapsed>1050){perchClock=0;tell.setVisible(false);go('recover');}
    } else if(elite.state==='summon') {
      if(elite.elapsed>1250){summon();summonClock=0;tell.setText('!').setVisible(false);go('recover');}
    } else if (elite.state === 'windup') {
      tell.setAlpha(0.5 + Math.abs(Math.sin(elite.elapsed / 90)) * 0.5);
      if (elite.elapsed > WINDUP_MS*(elite.health===1 ? .72 : 1)) { go('charge'); tell.setVisible(false); sprite.clearTint(); elite.hitDealt = false;s.audio.cue('monster-roar'); }
    } else if (elite.state === 'charge') {
      elite.x += elite.chargeDir * CHARGE_SPEED * (elite.health===1?1.25:1) * delta / 1000;
      if (elite.chargeDir > 0 && elite.x >= BW.barrier - 42) {
        // Slams into the barrier: it breaks, and the elite is stunned facing it.
        elite.x = BW.barrier - 42; go('stunned');
        elite.hitUsed=false;sprite.setTint(0xffb276); s.cameras.main.shake(220, 0.006); s.audio.cue('impact');
        if (!barrier.broken) {
          setBarrier(true);
          s.story('braced-barrier', { text: 'The barrier splinters. Its back is open — strike it!', color: '#ebd5b0' });
        } else s.notice('It slams into the iron frame. Strike its back!');
      } else if (elite.x <= BW.arenaMin || elite.x >= BW.arenaMax || elite.elapsed > 2300) {
        elite.x = Phaser.Math.Clamp(elite.x, BW.arenaMin, BW.arenaMax); go('recover');
      }
    } else if (elite.state === 'stunned') {
      if (elite.elapsed > STUN_MS) { go('recover'); sprite.clearTint(); elite.facing = -elite.chargeDir; }
    } else if (elite.state === 'recover' && elite.elapsed > RECOVER_MS) go('idle');
    if(sprite.animateState)sprite.animateState(elite.state,elite.elapsed);
    else sprite.pose(elite.state==='charge'?2:elite.state==='stunned'?3:1);
    sprite.setPosition(elite.x,GROUND).setFlipX(elite.facing<0);
    tell.setPosition(elite.x, GROUND - 130);
    label.setText('');
  };

  elite.touches = (p) => elite.alive && ((elite.state === 'charge' && Math.abs(p.x - elite.x)<40 && Math.abs(p.feet-GROUND)<65)
    || (elite.state==='lash' && elite.elapsed>=650 && elite.elapsed<850 && Math.abs(p.x-elite.lashX)<48 && Math.abs(p.feet-GROUND)<210));

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
    setSeals(false);
    aura.setVisible(false);sigil.clear();
    clearMinions();smoke.stop();sprite.animateState?.('death',0);
    run.clearEncounter('braced-shadow');
    hud.update(false,0,3,'');s.audio.cue('monster-death');
    const fx = s.add.sprite(elite.x, GROUND - 20, 'fx_dissolve').setScale(0.7).setDepth(28).play('fx-dissolve');
    fx.once('animationcomplete', () => fx.destroy());
    const dying={t:0};s.tweens.add({targets:dying,t:1200,duration:1200,onUpdate:()=>sprite.animateState?.('death',dying.t),onComplete:()=>{sprite.setVisible(false);label.setVisible(false);}});
    shield.clear(); tell.setVisible(false);
    s.story('braced-defeated', { speaker: 'Rowan', text: 'The works are open. Now the gears.' },
      { text: 'Restore the bridge fire. Lever A turns both gears, lever B only the small one. Line up both marks, then set the brake.', color: '#ebd5b0' });
    saveSession(s);
  };
  elite.resetEncounter = () => {
    if (!elite.alive) return;
    elite.x = BW.elite; elite.health = 3; elite.facing = -1;elite.hitUsed=false; go('idle');
    clearMinions();summonClock=0;perchClock=0;
    setSeals(false);
    sprite.clearTint().pose(1); tell.setVisible(false);
    if (!eliteCleared()) setBarrier(false);
  };
  elite.disperse = () => {};
  s.enemies.push(elite);

  // ---- The linked gears and the brake.
  const gears = { big: GEAR_START.big, small: GEAR_START.small };
  s.add.image((BW.bigGear.x+BW.smallGear.x)/2,GROUND-125,'machine-plate').setDisplaySize(250,250).setDepth(10);
  const gear=(data,key)=>{
    const image=s.add.image(0,0,key).setDisplaySize(data.r*2,data.r*2);
    const mark=s.add.rectangle(0,-data.r+8,5,12,0xf5cf82).setStrokeStyle(1,0x302526);
    return s.add.container(data.x,data.y,[image,mark]).setDepth(11);
  };
  const big=gear(BW.bigGear,'gear-large'),small=gear(BW.smallGear,'gear-small');
  // Fixed targets: a white arrow above each gear.
  const targets = s.add.graphics().setDepth(11).fillStyle(0xf3ead8);
  for (const g of [BW.bigGear, BW.smallGear]) targets.fillTriangle(g.x - 7, g.y - g.r - 22, g.x + 7, g.y - g.r - 22, g.x, g.y - g.r - 10);
  const setRotations = () => {
    const turns = run.bridgeBrakeSet ? { big: 0, small: 0 } : gears;
    big.setRotation(turns.big * Math.PI / 2); small.setRotation(-turns.small * Math.PI / 2);
  };
  // Gears look seized (dim) outside remembered time.
  const showGears = () => {
    const alive = s.memory.isRestoredAt('bridge',BW.bigGear.x,BW.bigGear.y) || run.bridgeBrakeSet;
    big.setAlpha(alive ? 1 : 0.6); small.setAlpha(alive ? 1 : 0.6);
  };
  setRotations(); showGears();
  s.addLabel(BW.leverA, GROUND - 108, 'A', '#e8d6b4', 14);
  s.addLabel(BW.leverB, GROUND - 108, 'B', '#e8d6b4', 14);
  const handles={};
  for(const [x,key]of [[BW.leverA,'A'],[BW.leverB,'B'],[BW.brake,'brake']]){
    const brake=key==='brake';
    s.add.image(x,GROUND,brake?'brake-base':'lever-base').setOrigin(.5,1).setDisplaySize(brake?70:40,brake?58:40).setDepth(12);
    handles[key]=s.add.image(x,GROUND-28,brake?'brake-handle':'lever-handle').setOrigin(.5,.9).setDisplaySize(13,72).setDepth(13);
  }
  const leverAngles={A:-.65,B:-.65,brake:run.bridgeBrakeSet ? .65 : -.65};
  let turning=false;
  const drawLevers = () => {
    for(const key of Object.keys(handles))handles[key].setRotation(leverAngles[key]);
  };
  drawLevers();
  s.addLabel(BW.brake, GROUND - 108, 'BRAKE', '#e8d6b4', 12);

  const turn = (which) => {
    if(turning)return;
    if (!s.memory.isRestoredAt('bridge',which==='A'?BW.leverA:BW.leverB,GROUND-30)) { s.notice('The machinery is seized. Restore the bridge fire first.'); return; }
    if (which === 'A') { gears.big = (gears.big + 1) % 4; gears.small = (gears.small + 1) % 4; } else gears.small = (gears.small + 1) % 4;
    turning=true;const motion={t:0};const start=leverAngles[which];
    s.tweens.add({targets:motion,t:1,duration:480,onUpdate:()=>{leverAngles[which]=start+Math.sin(motion.t*Math.PI)*1.1;drawLevers();},onComplete:()=>{leverAngles[which]=start;drawLevers();turning=false;}});
    s.audio.cue('machinery');
    const turnTo = (g,n,sign=1) => s.tweens.add({ targets:g,rotation:g.rotation+sign*Math.PI/2,duration:280,ease:'Sine.inOut',onComplete:()=>g.setRotation(sign*n*Math.PI/2) });
    turnTo(small,gears.small,-1);if(which==='A')turnTo(big,gears.big);
  };
  const inBay = () => eliteCleared() && barrier.broken && !run.bridgeBrakeSet;
  s.addInteract({ id: 'bridge-lever-a', x: BW.leverA, floor: GROUND, range: 24, priority: 7, when: inBay, label: 'E: lever A — turns both gears', use: () => turn('A') });
  s.addInteract({ id: 'bridge-lever-b', x: BW.leverB, floor: GROUND, range: 24, priority: 7, when: inBay, label: 'E: lever B — turns the small gear', use: () => turn('B') });
  s.addInteract({ id: 'bridge-brake', x: BW.brake, floor: GROUND, range: 24, priority: 7, hold: 600, when: inBay, label: 'Hold E: set the brake',
    use: () => {
      if(turning)return;
      if(!s.memory.isRestoredAt('bridge',BW.brake,GROUND-30)){s.notice('Restore the bridge fire to engage the brake.');return;}
      if (gears.big !== 0 || gears.small !== 0) { s.notice('The marks don’t line up with the arrows yet.'); return; }
      if (!run.setBridgeBrake()) return;
      s.tweens.add({targets:leverAngles,brake:.65,duration:450,onUpdate:drawLevers});setRotations();showGears();s.audio.cue('machinery');
      s.refreshSurface?.(s.bridgeSurface);
      s.story('bridge-brake', { speaker: 'Rowan', text: 'Locked. The deck will hold when the fire remembers it.' });
      saveSession(s);
    } });

  s.bridgeWorks = { showGears,gears,big,small,handles,elite };
}

export function tickBridgeWorks(s) {
  s.bridgeWorks?.showGears();
}
