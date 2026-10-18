// Register supplied paintings to the playable world. No generated/replacement art.
import { GROUND, BRIDGE_GAP, YARD_GAP, MARA_STALL, FIVE_HAND } from '../world/layout.js';

export const HOME = {
  front: { x: 175, floor: 430 }, cellar: { x: 980, floor: 650 },
  ladder: { x: 410, top: 430, bottom: 650 },
};

export function homePainting(scene, state) {
  const key = `home-registered-${state}`;
  if (scene.textures.exists(key)) return key;
  const src = scene.textures.get(`bg_p1_home_${state}`).getSourceImage();
  const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720;
  const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
  // The supplied pair has different floor heights. Register BOTH floors, not
  // just the top-left corner; the iron cellar door belongs on the right.
  const upper = state === 'dark' ? 430 : 478, lower = state === 'dark' ? 680 : 716;
  ctx.drawImage(src, 0, 0, src.width, upper, 0, 0, 1280, HOME.front.floor);
  if(state==='dark') {
    // The dark drawing places its ladder at x475, the healthy drawing at410.
    // Register the cellar in strips, preserving the gate/right wall anchors.
    const from=[0,425,525,890,src.width],to=[0,365,455,883,1280];
    for(let i=0;i<from.length-1;i++)ctx.drawImage(src,from[i],upper,from[i+1]-from[i],lower-upper,to[i],430,to[i+1]-to[i],220);
  } else ctx.drawImage(src, 0, upper, src.width, lower - upper, 0, 430, 1280, 220);
  ctx.fillStyle = '#11101b'; ctx.fillRect(0, 650, 1280, 70);
  ctx.drawImage(src, 0, lower, src.width, src.height - lower, 0, 650, 1280, src.height - lower);
  const floorShade = ctx.createLinearGradient(0, 650, 0, 706);
  floorShade.addColorStop(0, 'rgba(17,16,27,0)'); floorShade.addColorStop(1, 'rgba(17,16,27,1)');
  ctx.fillStyle = floorShade; ctx.fillRect(0, 650, 1280, 70);
  // The obsolete broken-sun detail is outside the house, beyond its right wall.
  const veil = ctx.createLinearGradient(1050, 0, 1125, 0);
  veil.addColorStop(0, 'rgba(17,16,27,0)'); veil.addColorStop(1, 'rgba(17,16,27,1)');
  ctx.fillStyle = veil; ctx.fillRect(1050, 0, 230, 430);
  scene.textures.addCanvas(key, canvas); return key;
}

export function isRegisteredRegion(r) { return r.act === 'Act 1' || r.id === 'yard'; }

export function registeredPainting(scene, r, state) {
  const key = `registered-${r.id}-${state}`;
  if (scene.textures.exists(key)) return key;
  const src = scene.textures.get(`bg_${r.art}_${state}`).getSourceImage();
  const bleed=110;
  const canvas = document.createElement('canvas'); canvas.width = r.width+bleed*2; canvas.height = 720;
  const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.translate(bleed,0);
  if (r.id === 'bridge') {
    const gapLeft = BRIDGE_GAP.x1 - r.x, gapRight = BRIDGE_GAP.x2 - r.x;
    // Never stretch a 450px arch across the entire approach. Continue the lane
    // at native pixel scale; register the refuge arch and river banks separately.
    const lane=scene.textures.get(`bg_a1_lane_${state}`).getSourceImage();
    for(let x=0;x<gapLeft;x+=lane.width)ctx.drawImage(lane,x,GROUND-555);
    const bank=document.createElement('canvas');bank.width=495;bank.height=792;
    const bc=bank.getContext('2d');bc.imageSmoothingEnabled=false;bc.drawImage(src,0,0,450,720,0,0,495,792);
    bc.globalCompositeOperation='destination-in';const fade=bc.createLinearGradient(0,0,495,0);
    fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(.13,'rgba(0,0,0,1)');fade.addColorStop(.86,'rgba(0,0,0,1)');fade.addColorStop(1,'rgba(0,0,0,0)');bc.fillStyle=fade;bc.fillRect(0,0,495,792);
    ctx.drawImage(bank,300,GROUND-410*1.1);
    ctx.clearRect(gapLeft,0,gapRight-gapLeft,720);
    ctx.drawImage(src,900,0,src.width-900,src.height,gapRight,GROUND-410,src.width-900,src.height);
  } else {
    const scale = r.id==='camp'?1:r.width / src.width;
    // The camp painting's fire pit is at590 and its broken crossing at900.
    // Match those landmarks to8120 and8400, rather than putting the gap inside a house.
    ctx.drawImage(src, r.id==='camp'?-570:0, GROUND - r.paintGround * scale, src.width*scale, src.height * scale);
    if(r.id==='camp')ctx.clearRect(300,0,320,720);
    if (r.id === 'yard') {
      // Keep the real pit clear; only the restored bridge supplies its collider.
      ctx.clearRect(YARD_GAP.x1 - r.x, GROUND + 4, YARD_GAP.x2 - YARD_GAP.x1, 160);
    }
  }
  // Actual overlapping edge pixels, not two alpha fades ending at the same x.
  ctx.drawImage(canvas,bleed,0,bleed,720,-bleed,0,bleed,720);
  ctx.drawImage(canvas,r.width,0,bleed,720,r.width,0,bleed,720);
  // A light feather hides region seams; painted cliff bottoms stay intact.
  ctx.globalCompositeOperation = 'destination-out';
  for (const [start, end] of [[-bleed,bleed],[r.width+bleed,r.width-bleed]]) {
    if (r.x === 0 && start < 0) continue;
    const fade = ctx.createLinearGradient(start, 0, end, 0);
    fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade; ctx.fillRect(Math.min(start, end), 0, bleed*2, GROUND - 40);
    // Fade the architecture, never punch a visual hole through solid terrain.
    for (let y = 0; y < 40; y++) {
      ctx.globalAlpha = 1 - y / 40;
      ctx.fillRect(Math.min(start, end), GROUND - 40 + y, bleed*2, 1);
    }
    ctx.globalAlpha = 1;
  }
  scene.textures.addCanvas(key, canvas); return key;
}

// A passage in a constructed wall uses the supplied stone/iron arch, not the
// unrelated flat SVG door. Painted doors in the home/yard need no overlay at all.
export function stonePassage(scene, x, floor, width = 85, height = 125) {
  const key = 'passage-stone-iron';
  if (!scene.textures.exists(key)) {
    const src = scene.textures.get('bg_p1_home_dark').getSourceImage();
    const canvas = document.createElement('canvas'); canvas.width = 190; canvas.height = 228;
    const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false;
    c.beginPath(); c.moveTo(4, 228); c.lineTo(4, 85); c.bezierCurveTo(4, -20, 186, -20, 186, 85); c.lineTo(186, 228); c.closePath(); c.clip();
    c.drawImage(src, 890, 470, 190, 228, 0, 0, 190, 228);
    scene.textures.addCanvas(key, canvas);
  }
  const arch = scene.add.image(x, floor, key).setOrigin(.5, 1).setDisplaySize(width, height).setDepth(9);
  scene.add.ellipse(x, floor + 2, width + 16, 9, 0x111018, .6).setDepth(10);
  return arch;
}

export function cellarHatch(scene, x, floor) {
  const g = scene.add.graphics().setDepth(9);
  g.fillStyle(0x1b181d).fillEllipse(x, floor + 2, 94, 16);
  g.fillStyle(0x584632).fillPoints([{x:x-40,y:floor-4},{x:x+29,y:floor-4},{x:x+40,y:floor+7},{x:x-29,y:floor+7}], true);
  for (let i = -22; i < 30; i += 13) g.lineStyle(1, 0x302922).lineBetween(x+i, floor-3, x+i+9, floor+6);
  g.lineStyle(2, 0xa28d61).strokeCircle(x + 14, floor, 3);
  return g;
}

export function buildMarketCourt(scene) {
  const { arenaStart: left, body: right } = FIVE_HAND;
  // Architecture frames a distinct market-court encounter beyond the stall.
  const stone = scene.textures.get('stone-ground').getSourceImage();
  for (const x of [left - 95, right + 65]) {
    scene.add.tileSprite(x, GROUND - 230, 34, 230, 'stone-ground').setOrigin(.5, 0).setTileScale(85 / stone.height).setTint(0x7b7379).setDepth(8);
    scene.add.image(x, GROUND - 230, 'timber').setDisplaySize(55, 16).setDepth(9);
  }
  scene.addLabel((left + right) / 2, 225, 'THE CARD COURT', '#c4b398', 15);
  const cloth = scene.add.graphics().setDepth(8);
  cloth.fillStyle(0x3e2933, .9).fillTriangle(left - 80, 295, left + 110, 310, left - 80, 360);
  cloth.fillStyle(0x3e2933, .9).fillTriangle(right + 50, 295, right - 110, 310, right + 50, 360);
  scene.addLabel(MARA_STALL.x1 + 45, GROUND - 36, '→ CARD COURT', '#b4a38c', 11);
}
