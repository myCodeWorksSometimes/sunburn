import { Npc } from '../entities/Npc.js';
import { GROUND, MARA_STALL as STALL, REFUGE, BRIDGE_GAP } from './layout.js';
import { saveSession } from './WorldState.js';
import { stonePassage } from '../presentation/Act1Presentation.js';

// Mara died at the market. Her memory reveals a route, never becomes a living
// copy at the refuge. Tomas and Nia require an explicit, player-led escort.
export function buildAct1Story(s,gate) {
  const run=s.run;s.npcs=[];s.knockClock=0;
  const width=STALL.x2-STALL.x1,cx=(STALL.x1+STALL.x2)/2;
  const ruin=s.add.image(cx,GROUND,'stall-ruined').setOrigin(.5,1).setDisplaySize(width+20,185).setDepth(10);
  const healthy=s.add.image(cx,GROUND,run.maraFreed?'stall-open':'stall-closed').setOrigin(.5,1).setDisplaySize(width+20,185).setDepth(11).setAlpha(0);
  s.regionVisuals.get('square').push(healthy);
  const roof=s.addSurface(STALL.x1,STALL.x2,STALL.roof,{material:'timber'});roof.block.setAlpha(0);roof.edge.setAlpha(0);
  s.add.ellipse(cx,GROUND+4,width+40,12,0x08090d,.45).setDepth(9);
  const lever=s.add.graphics().setDepth(22);
  const drawLever=()=>{lever.clear().fillStyle(0x554944).fillRect(STALL.release-4,STALL.roof-24,8,24).lineStyle(4,0xc0a16e).lineBetween(STALL.release,STALL.roof-22,STALL.release+(run.maraFreed?15:-15),STALL.roof-42);};drawLever();
  const stallMara=new Npc(s,'mara',STALL.shutter,GROUND,{visible:false});stallMara.echo=true;
  s.npcs.push(stallMara);
  s.addInteract({id:'mara-shutter',x:STALL.shutter,floor:GROUND,range:65,when:()=>!run.maraFreed,label:'E: knock on the ruined shutter',use:()=>{
    s.audio.cue('knock');s.story('mara-knock',{speaker:'Rowan',text:'Someone is knocking. From before the impact.'},{speaker:'Echo Mara',text:'The release is on the roof. Please—my daughter is at the bridge.'},{text:'Remember the market fire. Climb its repaired scaffold to the roof.'});
  }});
  s.addInteract({id:'mara-release',x:STALL.release,floor:STALL.roof,hold:600,priority:5,when:()=>!run.maraFreed,label:'Hold E: release the shutter',use:()=>{
    if(!run.freeMara())return;drawLever();healthy.setTexture('stall-open').setDisplaySize(width+20,185);s.audio.cue('machinery');
    s.story('mara-freed',{speaker:'Echo Mara',text:'Rowan? Eli took Nia and Tomas toward the bridge. He came back for them.'},{speaker:'Rowan',text:'Come with me.'},{speaker:'Echo Mara',text:'I never left this stall. But they may still be waiting. Watch the lantern card in the court.'},{speaker:'Rowan',text:'I will find them.'});saveSession(s);
  }});
  s.addInteract({id:'talk-mara-stall',x:STALL.shutter,floor:GROUND,range:50,priority:3,when:()=>stallMara.visible,label:'E: listen to Mara’s memory',use:()=>s.captions.say({speaker:'Echo Mara',text:'Watch the lantern card. Please bring my little girl across the bridge.'})});
  gate(s,STALL.exitGate,()=>run.villageGateOpen,'Five-Hand holds the Card Court exit.');
  stonePassage(s,REFUGE.oldRoad,GROUND);s.addLabel(REFUGE.oldRoad,GROUND-150,'OLD ROAD','#a59f9a',13);
  s.addInteract({id:'old-road-west',x:REFUGE.oldRoad,floor:GROUND,range:40,label:()=>run.oldRoadOpen?'E: take the Old Road to the tower':'E: try the Old Road gate',use:()=>run.oldRoadOpen?s.goTo('World','oldRoadEast'):s.captions.say({speaker:'Rowan',text:'Barred from the tower side.'})});
  s.addFire({id:'refuge-hearth',regionId:'bridge',x:REFUGE.hearth,floor:GROUND,radius:460,duration:20000,spawnId:'refuge'});
  s.addLabel(REFUGE.hearth,GROUND-155,'REFUGE HEARTH','#bba989',12);
  const safeX=BRIDGE_GAP.x2+100;
  const niaHome=BRIDGE_GAP.x2+50,tomasHome=BRIDGE_GAP.x2+330;
  const nia=new Npc(s,'nia',run.refugeesRescued?niaHome:REFUGE.nia,GROUND,{visible:run.refugeesRescued});
  const tomas=new Npc(s,'tomas',run.refugeesRescued?tomasHome:REFUGE.tomas,GROUND,{visible:run.refugeesRescued});
  nia.echo=tomas.echo=!run.refugeesRescued;s.npcs.push(nia,tomas);
  s.refuge={stallMara,nia,tomas,healthy,ruin,escort:false,safeX,away:0};
  s.addInteract({id:'talk-nia',x:nia.x,floor:GROUND,range:45,priority:4,when:()=>nia.visible,label:'E: talk to Nia',use:()=>s.captions.say({speaker:'Nia',text:run.refugeesRescued?'My hands are warm. Mama said you would come.':'Eli sent us down the old road when the bell rang. He did not come.'})});
  s.addInteract({id:'talk-tomas',x:tomas.x,floor:GROUND,range:45,priority:6,when:()=>tomas.visible,label:'E: talk to Tomas',use:()=>{
    if(run.hearTomas()){
      s.story('refuge-hearth',{speaker:'Tomas',text:'We cannot leave this fire alone. Secure the bridge, then come back with your lantern.'},{speaker:'Rowan',text:'Mara is still at the market. A memory.'},{speaker:'Tomas',text:'I know. Save Nia. There is something in the abandoned foundry, far beyond the arches.'},{speaker:'Tomas',text:'Keep moving and strike when you can. Its charge can break the barrier. The works beyond it control the bridge.'},{text:'In remembered time: A turns both gears, B the small gear. Align the marks and engage the brake.'});saveSession(s);
    }else s.captions.say({speaker:'Tomas',text:run.refugeesRescued?'You brought us through. We will keep the far-bank fire.':'Clear the foundry, secure the bridge, then come back for us.'});
  }});
  s.addInteract({id:'refuge-escort',x:REFUGE.hearth,floor:GROUND,range:80,hold:900,priority:9,when:()=>run.bridgeReturnOpen&&!run.refugeesRescued&&!s.refuge.escort&&s.memory.isRestoredAt('bridge',REFUGE.hearth,GROUND-40),label:'Hold E: share the lantern and lead the family across',use:()=>{
    if(s.combat.weapon.drawn){s.notice('Carry the lantern to guide them.');return;}
    s.refuge.escort=true;nia.setVisible(true);tomas.setVisible(true);s.audio.cue('rescue');
    s.captions.say({speaker:'Rowan',text:'Stay with my light. Both of you. We cross together.'});
  }});
  const resetEscort=()=>{if(!run.refugeesRescued){s.refuge.escort=false;for(const [npc,x]of [[nia,REFUGE.nia],[tomas,REFUGE.tomas]]){npc.walking=null;npc.sprite.x=x;npc.setVisible(false);}}};
  s.events.on('player:respawned',resetEscort);s.events.once('shutdown',()=>s.events.off('player:respawned',resetEscort));
}

export function tickAct1Story(s,delta) {
  const run=s.run,x=s.player.x,r=s.refuge;
  for(const npc of s.npcs)npc.tick(delta,s.player);
  r.stallMara.updateEcho(run.maraFreed&&s.memory.isRestoredAt('square',r.stallMara.x,GROUND-45),delta);
  for(const npc of [r.nia,r.tomas]){
    if(run.refugeesRescued){npc.echo=false;npc.setVisible(true);}
    else if(r.escort){
      npc.setVisible(true);npc.echo=false;
      const behind=npc===r.nia?80:145;
      if(Math.abs(x-npc.x)>behind+20&&!s.combat.weapon.drawn)npc.walkTo(Math.max(npc.x,x-behind),{speed:185});
      else npc.walking=null;
    }else {npc.echo=true;npc.updateEcho(s.memory.isRestoredAt('bridge',npc.x,GROUND-40),delta);}
  }
  if(r.escort){
    r.away=s.combat.weapon.drawn||Math.abs(x-r.nia.x)>440||Math.abs(x-r.tomas.x)>440?r.away+delta:0;
    if(r.away>6000){r.escort=false;r.away=0;for(const [npc,pos]of [[r.nia,REFUGE.nia],[r.tomas,REFUGE.tomas]]){npc.walking=null;npc.updateEcho(false,delta);npc.sprite.x=pos;}s.notice('Their tether broke. Return to the refuge fire and try again.');}
    else if(r.nia.x>BRIDGE_GAP.x2+30&&r.tomas.x>BRIDGE_GAP.x2+30){
      run.refugeesRescued=true;r.escort=false;r.nia.homeX=BRIDGE_GAP.x2+50;r.tomas.homeX=BRIDGE_GAP.x2+330;r.nia.walkTo(r.nia.homeX);r.tomas.walkTo(r.tomas.homeX);
      s.enemies.find(e=>e.id==='camp-crawler')?.disperse();
      s.story('refugees-rescued',{speaker:'Nia',text:'The fire is behind us. I am still here.'},{speaker:'Tomas',text:'We were caught in the crossing. The secured bridge let you lead us out.'},{speaker:'Tomas',text:'The tower holds Eli much deeper. He may need an ember from a place that knows him.'},{speaker:'Rowan',text:'Keep her bird safe. I have one more person to find.'});saveSession(s);
    }
  }
  for(const it of s.interactions){if(it.id==='talk-nia')it.x=r.nia.x;if(it.id==='talk-tomas')it.x=r.tomas.x;}
  if(run.rescuedEli&&Math.min(Math.abs(x-REFUGE.nia),Math.abs(x-r.safeX))<300&&s.story('nia-eli',
    {speaker:'Rowan',text:run.refugeesRescued?'They made it across. Eli, you gave them a chance.':'The refuge still waits inside its fire.'},
    {speaker:'Eli',text:'You came for me.'}))saveSession(s);
  if(!run.maraFreed&&!run.completedStory['mara-knock']&&Math.abs(x-STALL.shutter)<450){s.knockClock-=delta;if(s.knockClock<=0){s.knockClock=2600;s.audio.cue('knock');s.notice('Knocking... from the ruined toy stall.');}}
  if(run.maraFreed&&!run.heardNia&&s.memory.isRestoredAt('bridge',REFUGE.hearth,GROUND-40)&&x>REFUGE.oldRoad&&x<REFUGE.barrier){
    if(run.hearNia()){s.story('refuge-reunion',{speaker:'Nia',text:'Mama said wait by the fire. Eli went back to the tower.'},{speaker:'Rowan',text:'I heard her. At the market.'},{speaker:'Nia',text:'You can hear her too?'});saveSession(s);}
  }
  if(run.maraFreed&&!run.heardTomas&&!run.bridgeReturnOpen&&x>REFUGE.barrier){s.player.body.x-=x-REFUGE.barrier;s.player.setVelocityX(Math.min(0,s.player.body.velocity.x));if(!s.noticeRemaining)s.notice('Remember the refuge hearth. Tomas knows the crossing.');}
}
