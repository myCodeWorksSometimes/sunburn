import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { CombatSystem } from '../src/systems/CombatSystem.js';
import { WorldState } from '../src/world/WorldState.js';
function setup(){
  const run=new WorldState();run.hasLantern=true;
  const player={x:100,feet:560,acting:false,frozen:false,climbing:false,flipX:false,act(){this.acting=true;},cancelAction(){this.acting=false;}};
  const scene={run,player,lantern:{follow:player},events:new EventEmitter(),anims:{exists(){return true;}},audio:{cue(){}},notice(){}};
  return {scene,combat:new CombatSystem(scene)};
}
test('lantern sweep spends flame once and refuses attacks during recovery',()=>{
  const {scene:s,combat:c}=setup();assert.equal(c.sweep(),true);assert.equal(s.run.flame,80);
  assert.equal(c.sweep(),false);assert.equal(s.run.flame,80);
});
test('sword can fight with no flame, preserving lantern fuel and the quest ember',()=>{
  const {scene:s,combat:c}=setup();s.run.flame=0;s.run.hasHearthEmber=true;c.weapon.draw(100,560,true);
  assert.equal(c.sweep(),true);assert.equal(c.attack.sword,true);assert.equal(s.run.flame,0);assert.equal(s.run.hasHearthEmber,true);
});
test('stunned, climbing, cinematic, dead and rescued states cannot attack',()=>{
  for(const flag of ['frozen','climbing','acting']){const {scene:s,combat:c}=setup();s.player[flag]=true;assert.equal(c.sweep(),false);assert.equal(s.run.flame,100);}
  for(const flag of ['dead','leaving']){const {scene:s,combat:c}=setup();s[flag]=true;assert.equal(c.sweep(),false);}
  const {scene:s,combat:c}=setup();s.run.rescuedEli=true;assert.equal(c.sweep(),false);
});
test('Eli rescue cannot lock out recovery of an already-dropped lantern',()=>{
  const {scene:s,combat:c}=setup();c.weapon.draw(100,560,true);s.run.rescuedEli=true;
  assert.equal(c.toggleWeapon(),true);assert.equal(c.weapon.carrying,true);assert.equal(s.lantern.follow,s.player);
  assert.equal(c.toggleWeapon(),false,'peaceful coda cannot draw a new weapon');
});
