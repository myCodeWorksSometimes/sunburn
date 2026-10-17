import test from 'node:test';
import assert from 'node:assert/strict';
import { fieldContains, fieldRadius } from '../src/systems/RestorationField.js';
import { MemorySystem, WARMUP_MS } from '../src/systems/MemorySystem.js';
import { FIRES, BRIDGE_GAP, CAMP_GAP, SWING_GAP, GROUND } from '../src/world/layout.js';

test('restoration grows from its source and is circular, not a region switch', () => {
  const f={x:100,floor:560,radius:600};
  assert.equal(fieldContains(f,0,100,515),false);
  assert.equal(fieldContains(f,.25,200,515),true);
  assert.equal(fieldContains(f,.25,300,515),false);
  assert.equal(fieldContains(f,1,600,1015),false,'diagonal point outside actual circle');
  assert.equal(fieldContains(f,1,600,515),true);
  assert.equal(fieldContains(f,1,701,515,0),false);
  assert.equal(fieldContains(null,1,0,0),false);
});

test('required crossings fit completely inside their authored restorative halo', () => {
  for(const [id,gap] of [['bridge-fire',BRIDGE_GAP],['camp-fire',CAMP_GAP],['swing-fire',SWING_GAP]]) {
    const fire=FIRES.find(f=>f.id===id);
    for(const x of [gap.x1,gap.x2]) assert.equal(fieldContains(fire,1,x,GROUND),true,`${id}: edge ${x} fits radius ${fieldRadius(fire)}`);
  }
});

test('replacement and cancellation remove every point of the former circle', () => {
  const scene={events:{emit(){}},setMemoryVisual(){}};
  const m=new MemorySystem(scene),a={id:'a',regionId:'square',x:100,floor:560,radius:300,duration:9000};
  m.activate(a);m.update(WARMUP_MS);
  assert.equal(m.isRestoredAt('square',100,560),true);
  m.activate({...a,id:'b',x:1000});
  assert.equal(m.isRestoredAt('square',100,560),false);
  m.update(WARMUP_MS);assert.equal(m.isRestoredAt('square',1000,560),true);
  m.cancel('death');assert.equal(m.isRestoredAt('square',1000,560),false);
});

test('shutdown clears state without updating already-destroyed presentation',()=>{
  const m=new MemorySystem({events:{emit(){}},setMemoryVisual(){throw new Error('destroyed surface');}});
  m.activate({id:'home',regionId:'home',x:530,floor:430,duration:9000});
  assert.doesNotThrow(()=>m.cancel('shutdown'));
  assert.equal(m.phase,'idle');assert.equal(m.fire,null);assert.equal(m.alpha,0);
});
