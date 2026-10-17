import { Adventure } from './Adventure.js';
import { REGIONS, SPAWNS, FIRES, GROUND, WORLD_WIDTH, regionAt, BRIDGE_GAP, YARD_GAP, GAPS } from '../world/layout.js';
import { buildChapters, tickChapters, memoryChapter } from '../world/Chapters.js';
import { addOutdoorAtmosphere, placeProp } from '../presentation/Scenery.js';

export class World extends Adventure {
  constructor() { super('World'); }
  getSpawn(id) { return SPAWNS[id] || SPAWNS.front; }

  create() {
    const spawnId = this.entry.spawnId || 'front';
    this.setup(WORLD_WIDTH, this.getSpawn(spawnId));
    this.run.setCheckpoint('World', spawnId);
    addOutdoorAtmosphere(this, WORLD_WIDTH);
    for (const r of REGIONS) {
      // Keep legacy shattered-sun sky out of the new route. Bounded skies cannot
      // accidentally turn distant regions into day.
      const sky = this.add.graphics().setDepth(-9).setAlpha(0);
      sky.fillGradientStyle(0x8fb3c5, 0x8fb3c5, 0xe3d7b1, 0xe3d7b1).fillRect(r.x, 0, r.width, GROUND);
      // Paintings are set dressing behind the authored walkable foreground.
      // Crop their old ground away; both states share the same registration.
      const paintGround = r.paintGround;
      const dark = this.add.image(r.x + 80, GROUND - paintGround, `bg_${r.art}_dark`).setOrigin(0).setDepth(-5).setAlpha(.94).setCrop(0, 0, 1290, paintGround - 12);
      const past = this.add.image(r.x + 80, GROUND - paintGround, `bg_${r.art}_restored`).setOrigin(0).setDepth(-4).setAlpha(0).setCrop(0, 0, 1290, paintGround - 12);
      const waterPast = this.add.graphics().setDepth(-8).setAlpha(0);
      if (r.id === 'bridge') waterPast.fillGradientStyle(0x38575e, 0x38575e, 0x111c2b, 0x111c2b).fillRect(BRIDGE_GAP.x1, GROUND, BRIDGE_GAP.x2 - BRIDGE_GAP.x1, 160);
      this.regionVisuals.set(r.id, [sky, past, waterPast]);
      this.regionBounds.set(r.id, { x: r.x, width: r.width });
      dark.setName(`scenery-${r.id}`);
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
    this.bridgeSurface = this.addSurface(BRIDGE_GAP.x1, BRIDGE_GAP.x2, GROUND, { restoredOnly: true, regionId: 'bridge', material: 'bridge', permanent: () => this.run.bridgeReturnOpen });
    this.addSurface(2060, 2240, 485, { material: 'crate' });
    this.addSurface(3900, 4005, 500, { restoredOnly: true, regionId: 'square' });
    this.addSurface(4010, 4120, 440, { restoredOnly: true, regionId: 'square' });
    this.addSurface(4130, 4330, 380, { restoredOnly: true, regionId: 'square' });
    for (const fire of FIRES) this.addFire(fire);
    placeProp(this, 'door', 180, GROUND, 78, 125);
    placeProp(this, 'door', 3410, GROUND, 70, 112).setTint(0x9a91a2);
    placeProp(this, 'marker', 5445, GROUND, 52, 65);
    // Water below the gap keeps its silhouette readable in either time state.
    this.water = this.add.graphics().setDepth(1);
    for (let i = 0; i < 19; i++) this.water.lineStyle(1, i % 3 ? 0x5d687b : 0xa18471, .35).lineBetween(5500 + (i * 29) % 160, 607 + i * 6, 5920 + (i * 37) % 100, 607 + i * 6);
    // The face is mounted in the supplied tower's upper opening.
    this.add.circle(4400, 160, 26, 0x1c202c).setStrokeStyle(2, 0xa38d6b).setDepth(18);
    const ticks = this.add.graphics().setDepth(19).lineStyle(1, 0xc4ad7e);
    for (let n = 0; n < 12; n++) { const a = n * Math.PI / 6; ticks.lineBetween(4400 + Math.sin(a) * 19, 160 + Math.cos(a) * 19, 4400 + Math.sin(a) * 23, 160 + Math.cos(a) * 23); }
    this.clockHand = this.add.rectangle(4400, 160, 2, 19, 0xe2c594).setOrigin(0.5, 1).setDepth(20);
    buildChapters(this);
  }

  tick(delta) {
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
      this.notice('The return walkway is secured.');
    }
    tickChapters(this, delta);
  }

  onMemoryReady(fire) { super.onMemoryReady(fire); memoryChapter(this, fire); }
}
