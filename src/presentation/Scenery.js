import { naturalGround, supplyLedge } from './NaturalGround.js';
// Presentation follows collision; decorative art never adds physics bodies.
export function surfaceArt(scene, x1, x2, y, { material = 'stone', regionId } = {}) {
  const width = x2 - x1, indoor = scene.scene.key === 'Hearth';
  if(!indoor&&y===560&&['yard','lane','square','bridge','camp'].includes(regionId)&&material==='stone')return naturalGround(scene,x1,x2,y,regionId);
  if(!indoor&&material==='crate'&&x1<8800)return supplyLedge(scene,x1,x2,y);
  const block = scene.add.container(x1, y).setDepth(10);
  const edge = scene.add.container(x1, y).setDepth(11);
  // Registered paintings already supply the complete indoor floor and Act 1
  // terrain/cliff silhouette. Physics stays; don't paste a rectangle over it.
  if (indoor || (y === 560 && ['yard', 'lane', 'square', 'bridge', 'camp'].includes(regionId) && material === 'stone')) return { block, edge };
  if (material === 'crate') {
    block.add(scene.add.image(width / 2, 0, 'crate').setOrigin(.5, 0).setDisplaySize(width, 76));
  } else if (indoor || material === 'timber' || material === 'bridge') {
    block.add(scene.add.tileSprite(0, 0, width, indoor ? 28 : 38, 'timber').setOrigin(0).setTileScale(1, .8));
    const g = scene.add.graphics(); block.add(g);
    // Underfloor beams / bridge braces, rather than a solid grey collision slab.
    g.lineStyle(8, 0x29232a).lineBetween(4, 33, width - 4, 33);
    if (material === 'bridge') {
      for (let x = 20; x < width; x += 95) {
        g.lineStyle(7, 0x44332d).lineBetween(x, 5, x, -65);
        g.lineStyle(2, 0xa8885d).lineBetween(x - 2, 0, x - 2, -65);
        const next = Math.min(width - 12, x + 95);
        g.lineStyle(3, 0x927451).beginPath().moveTo(x, -57).lineTo((x + next) / 2, -45).lineTo(next, -57).strokePath();
      }
    }
  } else {
    const height = y >= 550 ? 180 : 45;
    const source = scene.textures.get('stone-ground').getSourceImage();
    block.add(scene.add.tileSprite(0, 0, width, height, 'stone-ground').setOrigin(0).setTileScale(180 / source.height).setTint(0xbbb7bd));
    if (y < 550) {
      // Remembered stair treads sit on complete stone columns, not floating boxes.
      block.add(scene.add.tileSprite(10, 42, Math.max(1, width - 20), 560 - y - 42, 'stone-ground').setOrigin(0).setTileScale(.2).setTint(0x777780));
    }
    if (regionId) {
      const growth = scene.add.tileSprite(0, -25, width, 30, 'living-edge').setOrigin(0).setAlpha(0);
      edge.add(growth); (scene.terrainLife ??= []).push({ regionId, growth });
    }
  }
  return { block, edge };
}

export function addOutdoorAtmosphere(scene, width, { sky = true } = {}) {
  if (sky) {
    scene.add.tileSprite(0, 0, width, 560, 'night-sky').setOrigin(0).setDepth(-30).setScrollFactor(.2, 1);
    scene.add.tileSprite(0, 125, width, 440, 'bg_skyline_dark').setOrigin(0).setDepth(-20).setScrollFactor(.55, 1).setAlpha(.32).setTileScale(.8);
  }
  scene.add.particles(0, 0, 'mote', {
    x: { min: 0, max: 1280 }, y: { min: 240, max: 560 },
    lifespan: 6500, speedX: { min: -8, max: -22 }, speedY: { min: -5, max: 5 },
    scale: { start: .13, end: 0 }, alpha: { start: .24, end: 0 }, frequency: 240,
  }).setDepth(35).setScrollFactor(0);
}

export function placeProp(scene, key, x, floor, width, height, depth = 15) {
  return scene.add.image(x, floor, key).setOrigin(.5, 1).setDisplaySize(width, height).setDepth(depth);
}
