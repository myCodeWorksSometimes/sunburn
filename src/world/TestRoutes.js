import {WorldState} from './WorldState.js';
import {RELAYS} from './layout.js';

export const TEST_ROUTES={
  afaqbridge:{stage:0,scene:'World',spawnId:'bridge',name:'Bridge: west bank'},
  afaqisasleep:{stage:1,scene:'World',spawnId:'farBank',name:'After the bridge / Act 2 approach'},
  afaqswings:{stage:2,scene:'World',spawnId:'playground',name:'Act 2: swings'},
  afaqtree:{stage:3,scene:'World',spawnId:'treehouse',name:'Act 2: treehouse'},
  afaqcanal:{stage:4,scene:'World',spawnId:'canal',name:'Act 2: canal'},
  afaqtower:{stage:5,scene:'World',spawnId:'courtyard',name:'Act 3: find Eli'},
  afaqbells:{stage:6,scene:'World',spawnId:'courtyard',name:'Act 3: three bells'},
  afaqwarden:{stage:7,scene:'World',spawnId:'crown',name:'Act 3: Bell Warden'},
  afaqrescue:{stage:8,scene:'World',spawnId:'crown',name:'Act 3: rescue Eli'},
  afaqending:{stage:9,scene:'Hearth',spawnId:'front',name:'Home ending'},
};
export function testRunFor(code){
  const route=TEST_ROUTES[code];if(!route)return null;
  const r=new WorldState(),n=route.stage;r.testMode=true;
  r.hasLantern=r.maraFreed=r.villageGateOpen=r.heardNia=r.heardTomas=r.yardReturnOpen=r.bridgeBrakeSet=true;
  r.clearedEncounters['five-hand']=r.clearedEncounters['braced-shadow']=true;
  for(const id of ['wake','lantern-found','home-first-memory','night-reveal','act-1','mara-freed','five-hand-defeated','braced-defeated','bridge-brake'])r.completeStory(id);
  r.bridgeReturnOpen=n>=1;r.refugeesRescued=n>=1;
  r.campReturnOpen=n>=2;r.swingReturnOpen=n>=3;
  if(n>=4){r.findDrawing();r.completeStory('drawing-found');}
  r.canalGateOpen=r.canalReturnOpen=n>=5;
  if(n>=6){r.findEli();r.openOldRoad();r.takeHearthEmber();r.shortcutOpen=true;r.completeStory('eli-found');r.completeStory('old-road-open');r.completeStory('hearth-spent');}
  if(n>=7)for(const relay of RELAYS)r.ringRelay(relay.id);
  if(n>=8)r.clearEncounter('bell-warden');
  if(n>=9){r.rescue();r.completeStory('view-platform');r.completeStory('nia-eli');}
  r.setCheckpoint(route.scene,route.spawnId);r.recover();
  return {run:r,...route};
}

export class CheatBuffer {
  constructor(){this.reset();}
  reset(){this.value='';this.last=0;}
  get armed(){return this.value.startsWith('afaq');}
  feed(key,now){
    if(now-this.last>2500)this.reset();this.last=now;
    if(key==='Escape'){this.reset();return null;}
    if(key==='Backspace'){this.value=this.value.slice(0,-1);return null;}
    if(!/^[a-z]$/i.test(key))return null;
    const next=this.value+key.toLowerCase(),codes=[...Object.keys(TEST_ROUTES),'afaqback'];
    this.value=codes.some(c=>c.startsWith(next))?next:key.toLowerCase()==='a'?'a':'';
    if(codes.includes(this.value)){const complete=this.value;this.reset();return complete;}
    return null;
  }
}
