import {A3,GROUND,RELAYS,OLD_ROAD_EAST} from './layout.js';
import {bossHud} from '../presentation/bossHud.js';

export function wardenReleased(run){
  return run.relayCount===3 && (run.hasHearthEmber || run.rescuedEli);
}
export function wardenInstruction(run){
  if(!run.eliFound)return {x:14230,y:GROUND,text:'Answer Eli at the courtyard window first. The Warden is sealed by three bells.'};
  if(!run.hasHearthEmber&&!run.rescuedEli)return {x:run.oldRoadOpen?OLD_ROAD_EAST.door:OLD_ROAD_EAST.release,y:GROUND,text:'The Warden is sealed. Take the Old Road home and bring the hearth ember.'};
  const bell=RELAYS.find(r=>!run.litFinaleLamps[r.id]);
  if(bell)return {x:bell.x,y:bell.floor,text:`${3-run.relayCount} wards remain. Remember the fire below bell ${RELAYS.indexOf(bell)+1}, climb up and hold E.`};
  if(!run.clearedEncounters['bell-warden'])return {x:A3.warden.x,y:GROUND,text:'X sets down the lantern and draws your sword. Face the Warden; F strikes. Jump over its charge.'};
  return {x:A3.eli,y:A3.gallery[2],text:'Retrieve your lantern with X, then climb the raised stairs. Hold E beside Eli.'};
}

export function buildWardenEncounter(s){
  const gate=s.addWall(16705,GROUND,600);gate.image.destroy();
  const wards=s.add.graphics().setDepth(23),hud=bossHud(s,'The Bell Warden');
  s.wardenEncounter={gate,wards,hud,clock:0};
  for(const floor of [GROUND,A3.crownLedge[2]])s.addInteract({
    id:`warden-seal-${floor}`,x:16650,floor,range:45,priority:3,
    when:()=>!wardenReleased(s.run),label:()=>`E: inspect the ${3-s.run.relayCount} bell wards`,
    use:()=>{s.notice(wardenInstruction(s.run).text);s.wayfinder.forced=10000;},
  });
}
export function tickWardenEncounter(s,delta){
  const e=s.wardenEncounter,run=s.run,w=s.warden;
  const cleared=!!run.clearedEncounters['bell-warden'],sealed=!wardenReleased(run)&&!cleared;
  e.clock+=delta;e.gate.zone.body.enable=sealed;e.wards.clear();
  if(w?.active&&w.alive){
    w.dormant=sealed;w.setAlpha(sealed?.4:1);
    if(sealed){
      const pulse=.6+Math.sin(e.clock/330)*.15;
      // Three suspended bell seals and a pixelated curtain read as a barrier,
      // rather than an idle, apparently damageable monster in the walkway.
      for(let y=GROUND-315;y<GROUND;y+=12)e.wards.fillStyle(0x8964b2,pulse*.5).fillRect(16698+Math.sin(y*.08+e.clock/350)*4,y,8,8);
      for(let i=0;i<3;i++){
        if(run.litFinaleLamps[RELAYS[i].id])continue;
        const x=w.x-48+i*48,y=GROUND-215+Math.sin(e.clock/400+i)*5;
        e.wards.lineStyle(2,0xc1a1de,pulse).strokeCircle(x,y,17);
        e.wards.lineBetween(x-8,y+6,x+8,y+6).lineBetween(x-8,y+6,x-5,y-6).lineBetween(x-5,y-6,x+5,y-6).lineBetween(x+5,y-6,x+8,y+6);
        e.wards.fillStyle(0xf0cba3,pulse).fillRect(x-2,y+8,4,4);
      }
    }
  }
  const near=Math.abs(s.player.x-A3.warden.x)<650;
  e.hud.update(near&&!sealed&&!cleared&&!s.cinematic.active,w?.health??0,4,
    w?.state==='windup'?'Charge coming · jump or retreat':w?.state==='recovery'||w?.state==='staggered'?'Opening · face it and press F':'X sword · F strike · jump the charge');
  if(near&&sealed){
    if(s.story('warden-sealed',{text:'Three bell wards bind it. The hearth ember wakes the bells.'}))s.wayfinder.forced=10000;
  }
}
