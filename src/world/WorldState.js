import { BALANCE } from './balance.js';
import { FIRES, RELAYS, SPAWNS, MARA_STALL, REFUGE, TOWER_WINDOW, OLD_ROAD_EAST } from './layout.js';

export const SAVE_KEY = 'embers-before-three-acts-v1';

// Run state deliberately outlives individual scenes. No sprites/timers are stored here.
export class WorldState {
  constructor() {
    this.version = 3;
    this.hasLantern = false;
    this.hasEmberCup = false;
    this.hasHearthEmber = false;
    this.homeMemorySpent = false;
    this.shortcutOpen = false;
    this.bridgeReturnOpen = false;
    this.rescuedEli = false;
    this.completed = false;
    this.completedStory = {};
    this.clearedEncounters = {};
    this.litFinaleLamps = {};
    this.litFires = {};
    this.villageGateOpen = false;
    // Campaign Act 1: Mara's stall and the Bridge Refuge family.
    this.maraFreed = false;
    this.heardNia = false;
    this.heardTomas = false;
    // Campaign Scene 10: Eli answers three knocks; the Old Road opens from the tower.
    this.eliFound = false;
    this.oldRoadOpen = false;
    this.campReturnOpen = false;
    this.swingReturnOpen = false;
    this.hasDrawing = false;
    this.canalGateOpen = false;
    this.canalReturnOpen = false;
    this.maxXReached = 185;
    this.checkpoint = { scene: 'Hearth', spawnId: 'cellar' };
    this.deaths = 0;
    this.health = BALANCE.health;
    this.flame = BALANCE.flame;
    this.oil = BALANCE.oil;
  }

  completeStory(id) {
    if (this.completedStory[id]) return false;
    this.completedStory[id] = true;
    return true;
  }

  clearEncounter(id) { this.clearedEncounters[id] = true; }
  setCheckpoint(scene, spawnId) { this.checkpoint = { scene, spawnId }; }

  spendFlame(amount) {
    if (!Number.isFinite(amount) || amount <= 0 || this.flame < amount) return false;
    this.flame -= amount; return true;
  }

  useOil() {
    if (this.oil <= 0 || this.flame >= BALANCE.flame) return false;
    this.flame = Math.min(BALANCE.flame, this.flame + BALANCE.oilRefill);
    this.oil--; return true;
  }

  recover() { this.health = BALANCE.health; this.flame = BALANCE.flame; this.oil = BALANCE.oil; }

  takeDamage(amount = 1) {
    this.health = Math.max(0, this.health - Math.max(0, amount));
    return this.health;
  }

  // Releasing the stall shutter frees Mara. Until Five-Hand is built, this also
  // clears the market exit (villageGateOpen).
  freeMara() {
    if (this.maraFreed) return false;
    this.maraFreed = true; this.villageGateOpen = true; return true;
  }

  hearNia() {
    if (!this.maraFreed || this.heardNia) return false;
    this.heardNia = true; return true;
  }

  hearTomas() {
    if (!this.heardNia || this.heardTomas) return false;
    this.heardTomas = true; return true;
  }

  findEli() {
    if (this.eliFound) return false;
    this.eliFound = true; return true;
  }

  openOldRoad() {
    if (!this.eliFound || this.oldRoadOpen) return false;
    this.oldRoadOpen = true; return true;
  }

  // Rowan only takes the last ember once he knows Eli is alive and needs it.
  takeHearthEmber() {
    if (!this.hasEmberCup || !this.eliFound || this.homeMemorySpent) return false;
    this.hasHearthEmber = true;
    this.homeMemorySpent = true;
    return true;
  }

  findDrawing() {
    if (this.hasDrawing) return false;
    this.hasDrawing = true; this.hasEmberCup = true; return true;
  }

  ringRelay(id) {
    if (!this.hasHearthEmber || !RELAYS.some(r => r.id === id) || this.litFinaleLamps[id]) return false;
    this.litFinaleLamps[id] = true; return true;
  }

  get relayCount() { return RELAYS.filter(r => this.litFinaleLamps[r.id]).length; }

  rescue() {
    if (this.rescuedEli || !this.hasHearthEmber || this.relayCount !== 3 || !this.clearedEncounters['bell-warden']) return false;
    this.rescuedEli = true;
    this.hasHearthEmber = false;
    return true;
  }

  get goal() {
    const goal = (text, scene, x, y = 560) => ({ text, scene, x, y });
    if (!this.hasLantern) return goal('Find the lantern in the cellar', 'Hearth', 650, 650);
    if (!this.completedStory['home-first-memory']) return goal('Climb upstairs and remember the hearth', 'Hearth', 530, 430);
    if (this.completed) return goal('Together, at last', 'Hearth', 530, 430);
    if (this.rescuedEli) return goal('Take the old road home together', 'World', 16500);
    // Older saves opened the market without Mara; they skip straight to the bridge.
    if (!this.maraFreed && !this.villageGateOpen) return this.completedStory['mara-knock']
      ? goal('Act 1: restore the market; climb the steps to the stall roof release', 'World', MARA_STALL.release, MARA_STALL.roof)
      : goal('Act 1: someone is knocking inside a market stall', 'World', MARA_STALL.shutter);
    if (!this.bridgeReturnOpen && this.maraFreed && !this.heardNia) return goal('Act 1: follow Mara to the Bridge Refuge', 'World', REFUGE.mara);
    if (!this.bridgeReturnOpen && this.maraFreed && !this.heardTomas) return goal('Act 1: talk to Tomas by the refuge hearth', 'World', REFUGE.tomas);
    if (!this.bridgeReturnOpen) return goal('Act 1: restore and cross the broken bridge', 'World', 5370);
    if (!this.campReturnOpen) return goal('Act 1: remember the campfire; cross toward the playground', 'World', 6870);
    if (!this.swingReturnOpen) return goal('Act 2: restore the swing crossing', 'World', 8510);
    if (!this.hasDrawing) return goal('Act 2: restore the treehouse; find Eli’s drawing above', 'World', 10400, 380);
    if (!this.canalGateOpen && !this.hasHearthEmber) return goal('Act 2: restore the canal; turn the sluice wheel above', 'World', 11820, 440);
    if (!this.eliFound) return goal('Act 3: someone is tapping at the tower window', 'World', TOWER_WINDOW.knock);
    if (!this.oldRoadOpen && !this.hasHearthEmber) return goal('Act 3: release the Old Road gate in the courtyard', 'World', OLD_ROAD_EAST.release);
    if (!this.hasHearthEmber) return goal('Go home through the market and take the hearth’s last ember', 'Hearth', 530, 430);
    const next = RELAYS.find(r => !this.litFinaleLamps[r.id]);
    if (next) return goal(this.relayCount ? `Act 3: ring bell ${RELAYS.indexOf(next) + 1} in remembered time (${this.relayCount}/3 complete)`
      : `Act 3: back to the tower by the Old Road — ring bell ${RELAYS.indexOf(next) + 1} in remembered time`, 'World', next.x, next.floor);
    if (!this.clearedEncounters['bell-warden']) return goal('Act 3: the wards are broken — defeat the Bell Warden', 'World', 17120);
    return goal('Act 3: climb to Eli; hold E to give him the hearth ember', 'World', 17600, 380);
  }

  get objective() { return this.goal.text; }
}

export function decodeSave(text) {
  try {
    const data = JSON.parse(text);
    if (data?.version !== 3 || !data.checkpoint) return null;
    const { scene, spawnId } = data.checkpoint;
    if (!(scene === 'World' && Object.hasOwn(SPAWNS, spawnId)) && !(scene === 'Hearth' && ['front', 'cellar', 'shortcut'].includes(spawnId))) return null;
    const run = new WorldState();
    for (const key of Object.keys(run)) {
      if (typeof run[key] === 'boolean') run[key] = data[key] === true;
    }
    for (const [key, cap] of [['health', 3], ['flame', 100], ['oil', 1], ['deaths', 999999], ['maxXReached', 18000]]) {
      if (Number.isFinite(data[key])) run[key] = Math.max(key === 'health' ? 1 : 0, Math.min(cap, Math.floor(data[key])));
    }
    for (const key of ['completedStory', 'clearedEncounters']) {
      if (data[key] && typeof data[key] === 'object') for (const [id, value] of Object.entries(data[key])) if (/^[a-z0-9-]{1,80}$/.test(id) && value === true) run[key][id] = true;
    }
    for (const id of [...FIRES.map(f => f.id), 'home-hearth']) if (data.litFires?.[id] === true) run.litFires[id] = true;
    for (const r of RELAYS) if (data.litFinaleLamps?.[r.id] === true) run.litFinaleLamps[r.id] = true;
    if (run.hasDrawing) run.hasEmberCup = true;
    // Saves from before the campaign: an open market or a crossed bridge means
    // the matching story has effectively happened.
    if (run.villageGateOpen) run.maraFreed = true;
    if (run.bridgeReturnOpen) run.heardNia = run.heardTomas = true;
    // Saves from the old route took the ember before finding Eli.
    if (run.hasHearthEmber || run.homeMemorySpent || run.rescuedEli) run.eliFound = run.oldRoadOpen = true;
    if (run.rescuedEli) { run.hasHearthEmber = false; run.homeMemorySpent = true; }
    run.checkpoint = { scene, spawnId }; return run;
  } catch { return null; }
}

export function readSave() {
  try { return decodeSave(globalThis.localStorage?.getItem(SAVE_KEY)); } catch { return null; }
}

export function saveSession(scene) {
  try { globalThis.localStorage?.setItem(SAVE_KEY, JSON.stringify(getSession(scene))); } catch { /* Storage can be disabled; the current run still works. */ }
}

export function resumeSession(scene) {
  const run = readSave(); if (run) scene.registry.set('worldState', run); return run;
}

export function getSession(scene) {
  let state = scene.registry.get('worldState');
  if (!state) { state = new WorldState(); scene.registry.set('worldState', state); }
  return state;
}

export function newSession(scene) {
  const state = new WorldState();
  scene.registry.set('worldState', state);
  try { globalThis.localStorage?.removeItem(SAVE_KEY); } catch { /* Optional persistence. */ }
  return state;
}
