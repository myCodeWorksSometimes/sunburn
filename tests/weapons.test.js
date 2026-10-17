import test from 'node:test';
import assert from 'node:assert/strict';
import { WeaponState } from '../src/systems/WeaponState.js';
import { WorldState,decodeSave } from '../src/world/WorldState.js';

test('sword draw requires safe footing; lantern stays at its actual drop point',()=>{
  const w=new WeaponState();assert.equal(w.draw(40,560,false),false);assert.equal(w.carrying,true);
  assert.equal(w.draw(40,560,true),true);assert.deepEqual(w.drop,{x:40,floor:560});assert.equal(w.carrying,false);
  assert.equal(w.draw(800,560,true),false);assert.equal(w.drop.x,40);
  assert.equal(w.retrieve(140,560),false);assert.equal(w.retrieve(40,430),false);
  assert.equal(w.retrieve(80,560),true);assert.equal(w.carrying,true);assert.equal(w.drop,null);
});
test('death/reset cannot strand the quest lantern or keep sword mode',()=>{
  const w=new WeaponState();w.draw(500,560,true);w.reset();assert.equal(w.drawn,false);assert.equal(w.drop,null);
});
test('refugees are echoes until player rescue; rescue survives save/continue',()=>{
  const w=new WorldState();assert.equal(w.refugeesRescued,false);
  w.refugeesRescued=true;w.setCheckpoint('World','farBank');
  assert.equal(decodeSave(JSON.stringify(w)).refugeesRescued,true);
  const old=JSON.parse(JSON.stringify(w));delete old.refugeesRescued;
  assert.equal(decodeSave(JSON.stringify(old)).refugeesRescued,false,'old automatic reunion is not an escort');
});
