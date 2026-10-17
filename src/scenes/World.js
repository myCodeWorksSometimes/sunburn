import { Adventure } from './Adventure.js';
import { REGIONS, SPAWNS, FIRES, GROUND, WORLD_WIDTH, regionAt, BRIDGE_GAP, YARD_GAP, GAPS, FIVE_HAND, BRIDGE_WORKS } from '../world/layout.js';
import { buildChapters, tickChapters, memoryChapter } from '../world/Chapters.js';
import { addOutdoorAtmosphere, placeProp } from '../presentation/Scenery.js';
import { buildBackdrop, tickBackdrop, onPainting, isWhole } from '../presentation/Backdrop.js';
import { cellarHatch, buildMarketCourt } from '../presentation/Act1Presentation.js';
import { DistantPresence } from '../presentation/DistantPresence.js';

export class World extends Adventure {
  constructor() { super('World'); }
  getSpawn(id) { return SPAWNS[id] || SPAWNS.front; }
  getGoal() {
    if(this.refuge?.escort)return {text:'Lead Tomas and Nia across the secured bridge. Stay close and carry the lantern.',scene:'World',x:BRIDGE_GAP.x2+200,y:GROUND};
    return super.getGoal();
  }

  create() {
    const spawnId = this.entry.spawnId || 'front';
    this.setup(WORLD_WIDTH, this.getSpawn(spawnId));
    this.run.setCheckpoint('World', spawnId);
    addOutdoorAtmosphere(this, WORLD_WIDTH, { sky: false });
    for (const r of REGIONS) this.regionBounds.set(r.id, { x: r.x, width: r.width });
    this.backdrop = buildBackdrop(this, REGIONS);
    this.distantPresence=new DistantPresence(this);
    for (const r of REGIONS) {
      const waterPast = this.add.graphics().setDepth(-8).setAlpha(0);
      if (r.id === 'bridge') waterPast.fillGradientStyle(0x38575e, 0x38575e, 0x111c2b, 0x111c2b).fillRect(BRIDGE_GAP.x1, GROUND, BRIDGE_GAP.x2 - BRIDGE_GAP.x1, 160);
      this.regionVisuals.set(r.id, [this.backdrop.paintings.get(r.id).past, waterPast]);
      // Connectors contain actual scenery and clear travel markings (whole paintings have their own doorways).
      if (!isWhole(this, r)) placeProp(this, 'marker', r.x + r.width - 140, GROUND, 52, 65);
    }
    const solidIntervals = [];
    let cursor = 0;
    for (const gap of GAPS) { solidIntervals.push([cursor, gap.x1]); cursor = gap.x2; }
    solidIntervals.push([cursor, WORLD_WIDTH]);
    for (const region of REGIONS) for (const [a, b] of solidIntervals) {
      const x1 = Math.max(a, region.x), x2 = Math.min(b, region.x + region.width);
      if (x2 <= x1) continue;
      const floor = this.addSurface(x1, x2, GROUND, { regionId: region.id });
      // A whole painting includes its own floor.
      if (isWhole(this, region)) { floor.block.setAlpha(0); floor.edge.setAlpha(0); }
    }
    this.yardSurface = this.addSurface(YARD_GAP.x1, YARD_GAP.x2, GROUND, { restoredOnly: true, regionId: 'yard', material: 'timber', permanent: () => this.run.yardReturnOpen });
    // The deck only returns once the bridge works' brake is set (CAMPAIGN Scene 7).
    this.bridgeSurface = this.addSurface(BRIDGE_GAP.x1, BRIDGE_GAP.x2, GROUND, { restoredOnly: true, regionId: 'bridge', material: 'bridge', permanent: () => this.run.bridgeReturnOpen, requires: () => this.run.bridgeBrakeSet });
    this.addSurface(2060, 2240, 485, { material: 'crate' });
    this.addSurface(3290, 3400, 500, { restoredOnly: true, regionId: 'square' });
    this.addSurface(3405, 3515, 440, { restoredOnly: true, regionId: 'square' });
    this.addSurface(3520, 3640, 380, { restoredOnly: true, regionId: 'square' });
    for (const fire of FIRES) this.addFire(fire);
    // The garden painting already contains the front door. The market passage
    // is a pavement hatch instead of a freestanding house door.
    cellarHatch(this, 3410, GROUND);
    buildMarketCourt(this);
    placeProp(this, 'marker', BRIDGE_GAP.x1-40, GROUND, 52, 65);
    // Water below the gap keeps its silhouette readable in either time state.
    this.water = this.add.graphics().setDepth(1);
    for (let i = 0; i < 19; i++) this.water.lineStyle(1, i % 3 ? 0x5d687b : 0xa18471, .35).lineBetween(BRIDGE_GAP.x1+15+(i*29)%90,607+i*6,BRIDGE_GAP.x2-30+(i*37)%40,607+i*6);
    // The face is mounted in the square painting's tower, so it moves with that layer.
    const face = onPainting(this.backdrop, 'square', 1120, 145), k = face.scale;
    this.add.circle(face.x, face.y, 26 * k, 0x1c202c).setStrokeStyle(2, 0xa38d6b).setDepth(-3);
    const ticks = this.add.graphics().setDepth(-3).lineStyle(1, 0xc4ad7e);
    for (let n = 0; n < 12; n++) { const a = n * Math.PI / 6; ticks.lineBetween(face.x + Math.sin(a) * 19 * k, face.y + Math.cos(a) * 19 * k, face.x + Math.sin(a) * 23 * k, face.y + Math.cos(a) * 23 * k); }
    this.clockHand = this.add.rectangle(face.x, face.y, 2, 19 * k, 0xe2c594).setOrigin(0.5, 1).setDepth(-3);
    buildChapters(this);
  }

  tick(delta) {
    this.distantPresence.update(delta);
    tickBackdrop(this, this.backdrop, this.restoredView);
    if (this.memory.isRestored('square')) this.clockHand.rotation += delta / 800;
    const region = regionAt(this.player.x);
    const inCourt = this.player.x >= FIVE_HAND.arenaStart - 110 && this.player.x < 4850;
    const inFoundry=this.player.x>BRIDGE_WORKS.arenaMin-40&&this.player.x<BRIDGE_WORKS.barrier+80&&!this.run.clearedEncounters['braced-shadow'];
    this.cameraFocusX = inCourt && this.run.maraFreed && !this.run.villageGateOpen ? 4440 : inFoundry?(BRIDGE_WORKS.arenaMin+BRIDGE_WORKS.barrier)/2:null;
    this.regionText.setText(inCourt ? 'Act 1 · The Card Court' : this.player.x>BRIDGE_WORKS.arenaMin&&this.player.x<BRIDGE_WORKS.barrier ? 'Act 1 · Abandoned Foundry' : `${region.act} · ${region.name}`);
    if (this.regionId !== region.id) {
      const previous = this.regionId; this.regionId = region.id;
      this.events.emit('region:entered', { regionId: region.id, fromRegionId: previous });
    }
    if (this.player.x > YARD_GAP.x2 + 35 && !this.run.yardReturnOpen) {
      this.run.yardReturnOpen = true; this.refreshSurface(this.yardSurface);
      this.notice('You secure the garden boardwalk — the way home stays open.');
    }
    if (this.player.x > BRIDGE_GAP.x2 + 45 && !this.run.bridgeReturnOpen) {
      this.run.bridgeReturnOpen = true;
      this.refreshSurface(this.bridgeSurface);
      this.run.setCheckpoint('World', 'farBank');
      this.notice('You release the maintenance walkway — the way back stays open.');
    }
    tickChapters(this, delta);
    if(this.player.x>1950&&this.player.x<2200&&!this.run.completedStory['supply-ledge']){
      this.run.completeStory('supply-ledge');this.notice('Raised supply ledge · jump up to evade the Crawler’s ground lunge.');
    }
  }

  setMemoryVisual(regionId, alpha) { super.setMemoryVisual(regionId, alpha); this.restoredView = { regionId, alpha }; }

  onMemoryReady(fire) { super.onMemoryReady(fire); memoryChapter(this, fire); }
}
