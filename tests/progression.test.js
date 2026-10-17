import test from 'node:test';
import assert from 'node:assert/strict';
import { WorldState, decodeSave } from '../src/world/WorldState.js';
import { MemorySystem } from '../src/systems/MemorySystem.js';
import { REGIONS, SPAWNS, WORLD_WIDTH, GAPS, RELAYS, A3 } from '../src/world/layout.js';
import { BALANCE } from '../src/world/balance.js';

test('hearth exchange is atomic and cannot lose/reissue the quest ember', () => {
  const state = new WorldState();
  assert.equal(state.takeHearthEmber(), false);
  state.hasEmberCup = true;
  assert.equal(state.takeHearthEmber(), false, 'Eli must be found before the ember is taken');
  state.findEli();
  assert.equal(state.takeHearthEmber(), true);
  assert.equal(state.homeMemorySpent, true);
  assert.equal(state.takeHearthEmber(), false);
  assert.equal(state.hasHearthEmber, true);
  state.deaths++;
  state.setCheckpoint('World', 'camp');
  assert.equal(state.hasHearthEmber, true);
  assert.equal(state.rescue(), false, 'all lamps must be lit first');
  for (const relay of RELAYS) state.ringRelay(relay.id);
  assert.equal(state.rescue(), false, 'guardian must be defeated');
  state.clearEncounter('bell-warden');
  assert.equal(state.rescue(), true);
  assert.equal(state.hasHearthEmber, false);
  assert.equal(state.rescuedEli, true);
  assert.equal(state.rescue(), false, 'transfer cannot commit twice');
});

test('once-only story and cleared encounters survive unrelated checkpoints', () => {
  const state = new WorldState();
  assert.equal(state.completeStory('cup-found'), true);
  state.hasEmberCup = true;
  state.clearEncounter('lane-crawler');
  state.setCheckpoint('Hearth', 'front');
  assert.equal(state.completeStory('cup-found'), false);
  assert.equal(state.clearedEncounters['lane-crawler'], true);
  assert.equal(state.hasEmberCup, true);
});

function fixture() {
  const records = [], scene = { events: { emit: (id, data) => records.push({ id, data }) },
    setMemoryVisual: (region, alpha) => records.push({ region, alpha, usable: memory.isRestored(region) }) };
  const memory = new MemorySystem(scene);
  return { memory, records };
}

test('useful time begins after warmup and restoration remains local', () => {
  const { memory } = fixture();
  memory.activate({ id: 'yard-fire', regionId: 'yard', duration: 9000 });
  memory.update(500);
  assert.equal(memory.remaining, 9000);
  assert.equal(memory.usable, false);
  memory.update(150);
  assert.equal(memory.usable, true);
  assert.equal(memory.remaining, 9000);
  memory.update(1000);
  assert.equal(memory.remaining, 8000);
  assert.equal(memory.isRestored('camp'), false);
});

test('death/replacement immediately disable the previous region before collider refresh', () => {
  const { memory, records } = fixture();
  memory.activate({ id: 'square-fire', regionId: 'square', duration: 9000 });
  memory.update(650);
  assert.equal(memory.isRestored('square'), true);
  memory.activate({ id: 'bridge-fire', regionId: 'bridge', duration: 9000 });
  const squareOff = records.find(r => r.region === 'square' && r.alpha === 0);
  assert.equal(squareOff.usable, false, 'invisible square stairs cannot remain solid');
  memory.update(650); memory.cancel('death');
  assert.equal(memory.isRestored('bridge'), false);
  assert.equal(records.filter(r => r.region === 'bridge').at(-1).usable, false);
});

test('expiry fades and permits a safe relight after simulation cooldown', () => {
  const { memory } = fixture();
  const fire = { id: 'bridge-fire', regionId: 'bridge', duration: 9000 };
  memory.activate(fire); memory.update(650); memory.update(9000);
  assert.equal(memory.phase, 'fading');
  memory.update(400); assert.equal(memory.usable, false);
  memory.update(250); assert.equal(memory.phase, 'idle');
  assert.equal(memory.canActivate(fire), false);
  memory.update(BALANCE.memoryCooldown); assert.equal(memory.canActivate(fire), true);
  assert.equal(memory.activate(fire), true);
});

test('fuel spending cannot go below zero, overpay, or accept invalid costs', () => {
  const state = new WorldState();
  for (let i = 0; i < 5; i++) assert.equal(state.spendFlame(BALANCE.sweepCost), true);
  assert.equal(state.flame, 0);
  assert.equal(state.spendFlame(BALANCE.rememberCost), false);
  assert.equal(state.spendFlame(-10), false);
  assert.equal(state.spendFlame(NaN), false);
  assert.equal(state.flame, 0);
});

test('oil and rest enforce supply caps without duplicating or spending quest items', () => {
  const state = new WorldState();
  state.hasEmberCup = true; state.findEli(); state.takeHearthEmber();
  assert.equal(state.useOil(), false, 'full meter must keep the vial');
  assert.equal(state.oil, 1);
  state.spendFlame(10); assert.equal(state.useOil(), true);
  assert.equal(state.flame, 100); assert.equal(state.oil, 0);
  assert.equal(state.useOil(), false);
  state.takeDamage(2); state.spendFlame(100);
  for (let i = 0; i < 10; i++) state.recover();
  assert.equal(state.health, 3); assert.equal(state.flame, 100); assert.equal(state.oil, 1);
  assert.equal(state.hasHearthEmber, true); assert.equal(state.homeMemorySpent, true);
  assert.equal(state.takeHearthEmber(), false);
});

test('continuous regions cover the world and checkpoints avoid the temporary gap', () => {
  assert.equal(REGIONS[0].x, 0);
  for (let i = 1; i < REGIONS.length; i++) assert.equal(REGIONS[i].x, REGIONS[i - 1].x + REGIONS[i - 1].width);
  assert.equal(REGIONS.at(-1).x + REGIONS.at(-1).width, WORLD_WIDTH);
  for (const spawn of Object.values(SPAWNS)) for (const gap of GAPS) assert.ok(spawn.x < gap.x1 || spawn.x > gap.x2);
});

test('drawing/cup and relay rewards are unique and require the protected ember', () => {
  const state = new WorldState();
  assert.equal(state.ringRelay(RELAYS[0].id), false);
  assert.equal(state.findDrawing(), true); assert.equal(state.findDrawing(), false);
  assert.equal(state.hasDrawing, true); assert.equal(state.hasEmberCup, true);
  state.findEli(); state.takeHearthEmber();
  assert.equal(state.ringRelay('fake-relay'), false);
  for (const relay of RELAYS) { assert.equal(state.ringRelay(relay.id), true); assert.equal(state.ringRelay(relay.id), false); }
  assert.equal(state.relayCount, 3); assert.equal(state.hasHearthEmber, true);
});

test('save round trip preserves all chapter gates and restores a safe checkpoint', () => {
  const state = new WorldState();
  state.findDrawing(); state.findEli(); state.takeHearthEmber(); state.ringRelay(RELAYS[0].id);
  state.villageGateOpen = state.campReturnOpen = state.swingReturnOpen = state.canalGateOpen = state.canalReturnOpen = true;
  state.setCheckpoint('World', 'mechanisms'); state.clearEncounter('playground-pouncer');
  const loaded = decodeSave(JSON.stringify(state));
  assert.ok(loaded instanceof WorldState); assert.equal(loaded.checkpoint.spawnId, 'mechanisms');
  assert.equal(loaded.relayCount, 1); assert.equal(loaded.hasHearthEmber, true);
  for (const key of ['villageGateOpen', 'campReturnOpen', 'swingReturnOpen', 'canalGateOpen', 'canalReturnOpen']) assert.equal(loaded[key], true);
  assert.equal(loaded.clearedEncounters['playground-pouncer'], true);
});

test('invalid saves are rejected and supplies cannot load outside caps', () => {
  assert.equal(decodeSave('{broken'), null);
  assert.equal(decodeSave(JSON.stringify({ version: 1, checkpoint: { scene: 'World', spawnId: 'front' } })), null);
  const state = new WorldState(); state.checkpoint.spawnId = 'missing'; assert.equal(decodeSave(JSON.stringify(state)), null);
  state.setCheckpoint('World', 'crown'); state.flame = 999; state.oil = -4; state.health = 0;
  const loaded = decodeSave(JSON.stringify(state));
  assert.equal(loaded.flame, 100); assert.equal(loaded.oil, 0); assert.equal(loaded.health, 1);
});

test('out-of-order relay visits target the actual missing bell', () => {
  const state = new WorldState();
  state.hasLantern = true; state.completedStory['home-first-memory'] = true;
  state.villageGateOpen = state.bridgeReturnOpen = state.campReturnOpen = state.swingReturnOpen = state.canalGateOpen = true;
  state.findDrawing(); state.findEli(); state.takeHearthEmber(); state.ringRelay('tower-relay-3');
  assert.equal(state.goal.x, RELAYS[0].x); assert.match(state.objective, /bell 1/);
  state.ringRelay('tower-relay-1'); assert.equal(state.goal.x, RELAYS[1].x);
  assert.match(state.objective, /bell 2/);
});

test('completion and rescue survive saving while consumed ember stays consumed', () => {
  const state = new WorldState(); state.findDrawing(); state.findEli(); state.takeHearthEmber();
  for (const r of RELAYS) state.ringRelay(r.id);
  state.clearEncounter('bell-warden'); state.rescue(); state.completed = true;
  state.setCheckpoint('Hearth', 'front');
  const loaded = decodeSave(JSON.stringify(state));
  assert.equal(loaded.rescuedEli, true); assert.equal(loaded.completed, true);
  assert.equal(loaded.hasHearthEmber, false); assert.equal(loaded.takeHearthEmber(), false);
});

test('campaign Act 1: Mara, Nia and Tomas progress in order, once each', () => {
  const state = new WorldState();
  state.hasLantern = true; state.completedStory['home-first-memory'] = true;
  assert.match(state.objective, /knocking/);
  state.completeStory('mara-knock');
  assert.match(state.objective, /roof release/);
  assert.equal(state.hearNia(), false, 'the refuge story needs Mara freed first');
  assert.equal(state.freeMara(), true);
  assert.equal(state.freeMara(), false);
  assert.equal(state.villageGateOpen, false, 'Five-Hand still holds the market exit');
  assert.match(state.objective, /Five-Hand/);
  assert.equal(state.defeatFiveHand(), true); assert.equal(state.defeatFiveHand(), false);
  assert.equal(state.villageGateOpen, true); assert.equal(state.clearedEncounters['five-hand'], true);
  assert.match(state.objective, /Bridge Refuge/);
  assert.equal(state.hearTomas(), false, 'Tomas speaks after the reunion');
  assert.equal(state.hearNia(), true); assert.equal(state.hearNia(), false);
  assert.match(state.objective, /Tomas/);
  assert.equal(state.hearTomas(), true); assert.equal(state.hearTomas(), false);
  assert.match(state.objective, /Braced Shadow/);
  assert.equal(state.setBridgeBrake(), false, 'the brake is behind the barrier the elite breaks');
  state.clearEncounter('braced-shadow');
  assert.match(state.objective, /gear marks/);
  assert.equal(state.setBridgeBrake(), true); assert.equal(state.setBridgeBrake(), false);
  assert.match(state.objective, /cross before it falls apart/);
});

test('campaign Act 1 flags survive saving; older saves migrate safely', () => {
  const state = new WorldState();
  state.freeMara(); state.hearNia(); state.setCheckpoint('World', 'refuge');
  const loaded = decodeSave(JSON.stringify(state));
  assert.equal(loaded.maraFreed, true); assert.equal(loaded.heardNia, true); assert.equal(loaded.heardTomas, false);
  assert.equal(loaded.checkpoint.spawnId, 'refuge');
  const old = new WorldState();
  old.villageGateOpen = true; old.bridgeReturnOpen = true; old.setCheckpoint('World', 'camp');
  const json = JSON.parse(JSON.stringify(old));
  delete json.maraFreed; delete json.heardNia; delete json.heardTomas;
  const migrated = decodeSave(JSON.stringify(json));
  assert.equal(migrated.maraFreed, true); assert.equal(migrated.heardNia, true); assert.equal(migrated.heardTomas, true);
});

test('campaign route: canal, then Eli at the window, Old Road, then the ember', () => {
  const state = new WorldState();
  state.hasLantern = true; state.completedStory['home-first-memory'] = true;
  state.freeMara(); state.defeatFiveHand(); state.hearNia(); state.hearTomas();
  state.bridgeReturnOpen = state.campReturnOpen = state.swingReturnOpen = true;
  state.findDrawing();
  assert.match(state.objective, /canal/, 'the canal no longer waits for the ember');
  state.canalGateOpen = true;
  assert.match(state.objective, /tower window/);
  assert.equal(state.openOldRoad(), false, 'the Old Road opens after Eli is found');
  assert.equal(state.takeHearthEmber(), false, 'no ember before Eli is found');
  assert.equal(state.findEli(), true); assert.equal(state.findEli(), false);
  assert.match(state.objective, /Old Road gate/);
  assert.equal(state.openOldRoad(), true); assert.equal(state.openOldRoad(), false);
  assert.equal(state.goal.scene, 'Hearth');
  assert.equal(state.takeHearthEmber(), true);
  assert.match(state.objective, /Old Road — ring bell 1/);
  state.ringRelay(RELAYS[0].id);
  assert.match(state.objective, /bell 2 .*1\/3/);
});

test('old-route saves that already hold the ember count as having found Eli', () => {
  const old = new WorldState();
  old.hasEmberCup = old.hasHearthEmber = old.homeMemorySpent = true; old.setCheckpoint('World', 'canal');
  const json = JSON.parse(JSON.stringify(old)); delete json.eliFound; delete json.oldRoadOpen;
  const loaded = decodeSave(JSON.stringify(json));
  assert.equal(loaded.eliFound, true); assert.equal(loaded.oldRoadOpen, true);
  for (const id of ['oldRoadWest', 'oldRoadEast']) {
    const s = new WorldState(); s.setCheckpoint('World', id);
    assert.equal(decodeSave(JSON.stringify(s)).checkpoint.spawnId, id);
  }
});

test('after the rescue: viewing platform, then the refuge with Nia, then home', () => {
  const state = new WorldState();
  state.hasLantern = true; state.completedStory['home-first-memory'] = true;
  state.findDrawing(); state.findEli(); state.takeHearthEmber();
  for (const r of RELAYS) state.ringRelay(r.id);
  state.clearEncounter('bell-warden'); assert.equal(state.rescue(), true);
  assert.match(state.objective, /arches/); assert.equal(state.goal.y, A3.gallery[2]);
  state.completeStory('view-platform');
  assert.match(state.objective, /refuge/);
  state.completeStory('nia-eli');
  assert.equal(state.goal.scene, 'Hearth'); assert.match(state.objective, /home together/);
});

test('saves from before the bridge works keep a crossed bridge crossable', () => {
  const old = new WorldState(); old.bridgeReturnOpen = true; old.setCheckpoint('World', 'farBank');
  const json = JSON.parse(JSON.stringify(old)); delete json.bridgeBrakeSet;
  const loaded = decodeSave(JSON.stringify(json));
  assert.equal(loaded.bridgeBrakeSet, true); assert.equal(loaded.clearedEncounters['braced-shadow'], true);
});
