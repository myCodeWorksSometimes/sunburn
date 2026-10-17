import { Adventure } from './Adventure.js';
import { REGIONS, SPAWNS, FIRES, GROUND, WORLD_WIDTH, regionAt, BRIDGE_GAP, YARD_GAP, GAPS } from '../world/layout.js';
import { buildChapters, tickChapters, memoryChapter } from '../world/Chapters.js';
import { addOutdoorAtmosphere, placeProp } from '../presentation/Scenery.js';
import { buildBackdrop, tickBackdrop, onPainting, PAINTING_SPEED } from '../presentation/Backdrop.js';

export class World extends Adventure {
  constructor() { super('World'); }
  getSpawn(id) { return SPAWNS[id] || SPAWNS.front; }

  create() {
    const spawnId = this.entry.spawnId || 'front';
    this.setup(WORLD_WIDTH, this.getSpawn(spawnId));
    this.run.setCheckpoint('World', spawnId);
    addOutdoorAtmosphere(this, WORLD_WIDTH, { sky: false });
    for (const r of REGIONS) this.regionBounds.set(r.id, { x: r.x, width: r.width });
    this.backdrop = buildBackdrop(this, REGIONS);
    for (const r of REGIONS) {
      const waterPast = this.add.graphics().setDepth(-8).setAlpha(0);
      if (r.id === 'bridge') waterPast.fillGradientStyle(0x38575e, 0x38575e, 0x111c2b, 0x111c2b).fillRect(BRIDGE_GAP.x1, GROUND, BRIDGE_GAP.x2 - BRIDGE_GAP.x1, 160);
      this.regionVisuals.set(r.id, [this.backdrop.paintings.get(r.id).past, waterPast]);
      // Connectors contain actual scenery and clear travel markings.
      placeProp(this, 'marker', r.x + r.width - 140, GROUND, 52, 65);
    }
    const solidIntervals = [];
    let cursor = 0;
    for (const gap of GAPS) { solidIntervals.push([cursor, gap.x1]); cursor = gap.x2; }
    solidIntervals.push([cursor, WORLD_WIDTH]);
    for (const region of REGIONS) for (const [a, b] of solidIntervals) {
      const x1 = Math.max(a, region.x), x2 = Math.min(b, region.x + region.width);
      if (x2 > x1) this.addSurface(x1, x2, GROUND, { regionId: region.id });
    }
    this.addSurface(YARD_GAP.x1, YARD_GAP.x2, GROUND, { restoredOnly: true, regionId: 'yard', material: 'timber' });
    // The deck only returns once the bridge works' brake is set (CAMPAIGN Scene 7).
    this.bridgeSurface = this.addSurface(BRIDGE_GAP.x1, BRIDGE_GAP.x2, GROUND, { restoredOnly: true, regionId: 'bridge', material: 'bridge', permanent: () => this.run.bridgeReturnOpen, requires: () => this.run.bridgeBrakeSet });
    this.addSurface(2060, 2240, 485, { material: 'crate' });
    this.addSurface(3900, 4005, 500, { restoredOnly: true, regionId: 'square' });
    this.addSurface(4010, 4120, 440, { restoredOnly: true, regionId: 'square' });
    this.addSurface(4130, 4330, 380, { restoredOnly: true, regionId: 'square' });
    for (const fire of FIRES) this.addFire(fire);
    placeProp(this, 'door', 180, GROUND, 78, 125);
    placeProp(this, 'door', 3410, GROUND, 70, 112).setTint(0x9a91a2);
    placeProp(this, 'marker', 6045, GROUND, 52, 65);
    // Water below the gap keeps its silhouette readable in either time state.
    this.water = this.add.graphics().setDepth(1);
    for (let i = 0; i < 19; i++) this.water.lineStyle(1, i % 3 ? 0x5d687b : 0xa18471, .35).lineBetween(6100 + (i * 29) % 160, 607 + i * 6, 6520 + (i * 37) % 100, 607 + i * 6);
    // The face is mounted in the square painting's tower, so it moves with that layer.
    const face = onPainting(this.backdrop, 'square', 1120, 145), k = face.scale;
    this.add.circle(face.x, face.y, 26 * k, 0x1c202c).setStrokeStyle(2, 0xa38d6b).setDepth(-3).setScrollFactor(PAINTING_SPEED, 1);
    const ticks = this.add.graphics().setDepth(-3).setScrollFactor(PAINTING_SPEED, 1).lineStyle(1, 0xc4ad7e);
    for (let n = 0; n < 12; n++) { const a = n * Math.PI / 6; ticks.lineBetween(face.x + Math.sin(a) * 19 * k, face.y + Math.cos(a) * 19 * k, face.x + Math.sin(a) * 23 * k, face.y + Math.cos(a) * 23 * k); }
    this.clockHand = this.add.rectangle(face.x, face.y, 2, 19 * k, 0xe2c594).setOrigin(0.5, 1).setDepth(-3).setScrollFactor(PAINTING_SPEED, 1);
    buildChapters(this);
  }

  tick(delta) {
    tickBackdrop(this, this.backdrop, this.restoredView);
    if (this.memory.isRestored('square')) this.clockHand.rotation += delta / 800;
    const region = regionAt(this.player.x);
    this.regionText.setText(`${region.act} · ${region.name}`);
    if (this.regionId !== region.id) {
      const previous = this.regionId; this.regionId = region.id;
      this.events.emit('region:entered', { regionId: region.id, fromRegionId: previous });
    }
    if (this.player.x > BRIDGE_GAP.x2 + 45 && !this.run.bridgeReturnOpen) {
      this.run.bridgeReturnOpen = true;
      this.refreshSurface(this.bridgeSurface);
      this.run.setCheckpoint('World', 'farBank');
      this.notice('You release the maintenance walkway — the way back stays open.');
    }
    tickChapters(this, delta);
  }

  setMemoryVisual(regionId, alpha) { super.setMemoryVisual(regionId, alpha); this.restoredView = { regionId, alpha }; }

  onMemoryReady(fire) { super.onMemoryReady(fire); memoryChapter(this, fire); }
}
