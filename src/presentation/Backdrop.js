// Parallax backdrop for the continuous World: a fixed sky, a slow looping
// skyline, then one painting per region on a single 0.7-speed layer. Paintings
// sit edge to edge in that layer's own space, so there are never gaps, and each
// one fades in over its left neighbour so the seams blend instead of cutting.
// The walkable ground, props and gameplay art stay at full speed in front.
import { GROUND } from '../world/layout.js';

export const PAINTING_SPEED = 0.7;
export const SKYLINE_SPEED = 0.25;
const FEATHER = 220; // screen pixels of crossfade between neighbouring paintings
const VIEW = 1280;

// Where a region's painting sits in the painting layer (screen = x - scrollX * speed).
export function paintingSlot(regions, index, speed = PAINTING_SPEED) {
  const r = regions[index], edge = VIEW / 2 * (1 - speed);
  let left = VIEW / 2 + (r.x - VIEW / 2) * speed;
  let right = VIEW / 2 + (r.x + r.width - VIEW / 2) * speed;
  if (index === 0) left -= edge;
  if (index === regions.length - 1) right += edge;
  return { left, right };
}

// New art (bg_a2_*, bg_a3_*) is used as soon as it is in public/bg; until then
// the region borrows `fallback`, whose painted walk line is `paintGround`.
export function regionArt(scene, r) {
  if (scene.textures.exists(`bg_${r.art}_dark`)) return { art: r.art, groundY: r.fallback ? null : r.paintGround };
  return { art: r.fallback ?? r.art, groundY: r.paintGround };
}

function softened(scene, key, featherPx, left, right) {
  const out = `${key}~soft${left ? 'L' : ''}${right ? 'R' : ''}`;
  if (scene.textures.exists(out)) return out;
  const src = scene.textures.get(key).getSourceImage();
  const canvas = document.createElement('canvas');
  canvas.width = src.width; canvas.height = src.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'destination-out';
  const band = (x0, x1) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), src.height);
  };
  if (left) band(0, featherPx);
  if (right) band(src.width, src.width - featherPx);
  scene.textures.addCanvas(out, canvas);
  return out;
}

// A copy of the skyline with a mirrored twin beside it, so it loops without a seam.
function looped(scene, key) {
  const out = `${key}~loop`;
  if (scene.textures.exists(out)) return out;
  const src = scene.textures.get(key).getSourceImage();
  const canvas = document.createElement('canvas');
  canvas.width = src.width * 2; canvas.height = src.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(src, 0, 0);
  ctx.translate(src.width * 2, 0); ctx.scale(-1, 1); ctx.drawImage(src, 0, 0);
  scene.textures.addCanvas(out, canvas);
  return out;
}

export function buildBackdrop(scene, regions) {
  // bg_sky_dark still shows the legacy broken sun, so the night uses the drawn star field.
  const sky = scene.add.tileSprite(0, 0, VIEW, 720, 'night-sky').setOrigin(0).setScrollFactor(0).setDepth(-12);
  const skyPast = scene.add.image(0, 0, 'bg_sky_restored').setOrigin(0).setScrollFactor(0).setDepth(-11).setDisplaySize(VIEW, 720).setAlpha(0);
  const skyline = scene.add.tileSprite(0, 40, VIEW, 720, looped(scene, 'bg_skyline_dark')).setOrigin(0).setScrollFactor(0).setDepth(-10).setAlpha(.85);
  const skylinePast = scene.add.tileSprite(0, 40, VIEW, 720, looped(scene, 'bg_skyline_restored')).setOrigin(0).setScrollFactor(0).setDepth(-9).setAlpha(0);
  const paintings = new Map();
  regions.forEach((r, i) => {
    const { art, groundY: legacyGround } = regionArt(scene, r);
    const dark = `bg_${art}_dark`, past = `bg_${art}_restored`;
    const tex = scene.textures.get(dark).getSourceImage();
    // New art puts the walk line 62% down the image.
    const groundY = legacyGround ?? Math.round(tex.height * .62);
    const { left, right } = paintingSlot(regions, i);
    const scale = Math.max(GROUND / groundY, (right - left + FEATHER) / tex.width);
    const x = (left + right) / 2 - tex.width * scale / 2, y = GROUND - groundY * scale;
    const feather = FEATHER / scale;
    // The painted ground is cropped: the real walkable ground is drawn in front.
    const crop = groundY + 3;
    const darkImage = scene.add.image(x, y, softened(scene, dark, feather, i > 0, false)).setOrigin(0).setScale(scale)
      .setScrollFactor(PAINTING_SPEED, 1).setDepth(-5).setCrop(0, 0, tex.width, crop);
    const pastImage = scene.add.image(x, y, softened(scene, past, feather, true, true)).setOrigin(0).setScale(scale)
      .setScrollFactor(PAINTING_SPEED, 1).setDepth(-4).setCrop(0, 0, tex.width, crop).setAlpha(0);
    darkImage.setName(`scenery-${r.id}`);
    paintings.set(r.id, { x, y, scale, art, dark: darkImage, past: pastImage });
  });
  return { sky, skyPast, skyline, skylinePast, paintings };
}

// Point (px, py) in a painting's own pixels → where it is drawn on the painting layer.
export function onPainting(backdrop, regionId, px, py) {
  const p = backdrop.paintings.get(regionId);
  return { x: p.x + px * p.scale, y: p.y + py * p.scale, scale: p.scale };
}

// Called every frame: scroll the skyline, and show the restored sky only as far
// as the restored region fills the view.
export function tickBackdrop(scene, backdrop, restored) {
  const cam = scene.cameras.main;
  backdrop.sky.tilePositionX = cam.scrollX * .05;
  const tileScale = 720 / backdrop.skyline.texture.getSourceImage().height;
  for (const s of [backdrop.skyline, backdrop.skylinePast]) { s.setTileScale(tileScale); s.tilePositionX = cam.scrollX * SKYLINE_SPEED / tileScale; }
  let alpha = 0;
  if (restored?.alpha > 0) {
    const b = scene.regionBounds.get(restored.regionId);
    const overlap = Math.max(0, Math.min(cam.scrollX + VIEW, b.x + b.width) - Math.max(cam.scrollX, b.x)) / VIEW;
    alpha = restored.alpha * Math.min(1, overlap * 1.6);
  }
  backdrop.skyPast.setAlpha(alpha); backdrop.skylinePast.setAlpha(alpha * .85);
}
