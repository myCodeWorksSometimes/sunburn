import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {CheatBuffer,TEST_ROUTES,testRunFor} from '../src/world/TestRoutes.js';
import {saveSession,newSession,SAVE_KEY} from '../src/world/WorldState.js';
import {navigationHint} from '../src/world/NavigationHints.js';
import {VoiceDirector} from '../src/systems/VoiceDirector.js';

test('typed routes arm only after prefix, expire, cancel and accept mixed case',()=>{
  const b=new CheatBuffer();let code,time=0;
  for(const c of 'afaq')b.feed(c,time+=100);
  assert.equal(b.armed,true);b.feed('Escape',time+=100);assert.equal(b.armed,false);
  for(const c of 'afaq')b.feed(c,time+=100);
  b.feed('i',time+=2600);assert.equal(b.armed,false);
  for(const c of 'afaqisasleep'.toUpperCase())code=b.feed(c,time+=100);
  assert.equal(code,'afaqisasleep');assert.equal(b.armed,false);
  for(const c of 'afaqback')code=b.feed(c,time+=100);
  assert.equal(code,'afaqback');
});
test('each test route supplies real prerequisite state but leaves its objective unfinished',()=>{
  for(const code of Object.keys(TEST_ROUTES)){
    const {run,scene,spawnId}=testRunFor(code);
    assert.equal(run.testMode,true);assert.deepEqual(run.checkpoint,{scene,spawnId});
    assert.equal(run.completed,false);assert.equal(run.health,3);
  }
  assert.equal(testRunFor('afaqisasleep').run.campReturnOpen,false);
  assert.equal(testRunFor('afaqswings').run.swingReturnOpen,false);
  assert.equal(testRunFor('afaqtree').run.hasDrawing,false);
  assert.equal(testRunFor('afaqcanal').run.canalGateOpen,false);
  assert.equal(testRunFor('afaqtower').run.eliFound,false);
  assert.equal(testRunFor('afaqbells').run.hasHearthEmber,true);
  assert.equal(testRunFor('afaqbells').run.relayCount,0);
  assert.equal(testRunFor('afaqwarden').run.relayCount,3);
  assert.equal(testRunFor('afaqwarden').run.clearedEncounters['bell-warden'],undefined);
  assert.equal(testRunFor('afaqrescue').run.rescuedEli,false);
  assert.equal(testRunFor('afaqending').run.rescuedEli,true);
});
test('test autosaves cannot replace the normal adventure',()=>{
  const values=new Map([[SAVE_KEY,'normal adventure']]);
  const previous=globalThis.localStorage;
  globalThis.localStorage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
  try{
    const r=testRunFor('afaqisasleep').run,scene={registry:{get:()=>r}};
    saveSession(scene);assert.equal(values.get(SAVE_KEY),'normal adventure');
    r.testMode=false;saveSession(scene);assert.equal(JSON.parse(values.get(SAVE_KEY)).bridgeReturnOpen,true);
  }finally{globalThis.localStorage=previous;}
});
test('new adventure from a test run also preserves the normal save',()=>{
  const previous=globalThis.localStorage;let removed=0,current=testRunFor('afaqtree').run;
  globalThis.localStorage={removeItem:()=>removed++};
  const scene={registry:{get:()=>current,set:(_key,value)=>current=value}};
  try{
    assert.equal(newSession(scene).testMode,true);assert.equal(removed,0);
    current.testMode=false;assert.equal(newSession(scene).testMode,false);assert.equal(removed,1);
  }finally{globalThis.localStorage=previous;}
});
test('navigation gives the missing local action across gaps, fuel and elevation',()=>{
  const run=testRunFor('afaqisasleep').run;
  assert.equal(navigationHint({run,x:8360}).x,8120);
  assert.equal(navigationHint({run,x:8360,memory:'camp'}).x,8760);
  run.flame=0;assert.match(navigationHint({run,x:8360}).text,/Hold R/);
  run.flame=100;run.campReturnOpen=true;
  assert.equal(navigationHint({run,x:9730,memory:'swings'}).y,500);
  run.swingReturnOpen=true;
  assert.equal(navigationHint({run,x:10700,feet:500,memory:'treehouse'}).y,440);
  run.findDrawing();assert.equal(navigationHint({run,x:12440,feet:439,memory:'canal'}).x,12450);
  assert.equal(navigationHint({run,x:12440,weapon:{drawn:true,drop:{x:12000,floor:560}}}).y,560);
});
test('a finished shared voice clears its pointer before map pause/resume',()=>{
  const events=new EventEmitter(),sound=new EventEmitter();
  sound.duration=1;sound.destroy=()=>sound.emit('destroy');
  sound.pause=()=>assert.fail('AudioCues owns shared sound pause');
  const s={events,cache:{json:{get:()=>({'Rowan|Eli?':'voices/eli.ogg'})},audio:{exists:()=>true}},audio:{settings:{effects:1},playEffect:()=>sound}};
  const voice=new VoiceDirector(s);voice.speak({speaker:'Rowan',text:'Eli?'});
  sound.destroy();assert.equal(voice.sound,null);
  assert.doesNotThrow(()=>{events.emit('pause');events.emit('resume');events.emit('shutdown');});
});
