import test from 'node:test';
import assert from 'node:assert/strict';
import {wardenReleased,wardenInstruction} from '../src/world/WardenEncounter.js';
import {testRunFor} from '../src/world/TestRoutes.js';
import {RELAYS,OLD_ROAD_EAST} from '../src/world/layout.js';

test('Warden route directs a premature visit back through Eli and the home ember',()=>{
  const r=testRunFor('afaqtower').run;
  assert.equal(wardenReleased(r),false);
  assert.equal(wardenInstruction(r).x,14230);
  r.findEli();assert.equal(wardenInstruction(r).x,OLD_ROAD_EAST.release);
  r.openOldRoad();assert.equal(wardenInstruction(r).x,OLD_ROAD_EAST.door);
});
test('each missing bell remains required even when later bells were visited first',()=>{
  const r=testRunFor('afaqbells').run;
  r.ringRelay(RELAYS[2].id);assert.equal(wardenReleased(r),false);
  assert.equal(wardenInstruction(r).x,RELAYS[0].x);
  r.ringRelay(RELAYS[0].id);assert.equal(wardenInstruction(r).x,RELAYS[1].x);
  r.ringRelay(RELAYS[1].id);assert.equal(wardenReleased(r),true);
  assert.match(wardenInstruction(r).text,/X.*lantern.*F strikes/);
});
test('victory directs lantern recovery and Eli stairs, and consuming the ember cannot reseal the route',()=>{
  const r=testRunFor('afaqrescue').run;
  assert.equal(wardenReleased(r),true);assert.match(wardenInstruction(r).text,/lantern.*raised stairs/);
  assert.equal(r.rescue(),true);assert.equal(r.hasHearthEmber,false);
  assert.equal(wardenReleased(r),true);
});
