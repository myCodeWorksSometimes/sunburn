// Procedural textures (brother echo, ball, light/particle gradients) plus the
// animations for the sprite sheets cut by tools/extract_sprites.py.

const PALETTE = {
  K: '#0e0a12', // outline
  H: '#2a1a14', // hair
  S: '#d8a070', // skin
  s: '#a8704c', // skin shade
  C: '#3a3046', // coat
  c: '#2a2234', // coat shade
  R: '#a33030', // red scarf / cloak
  r: '#6e1e24', // red shade
  P: '#2e2a30', // trousers
  B: '#1c1410', // boots
  Y: '#ffd45a', // lantern glass
  y: '#f08a24', // lantern glass shade
  M: '#5a4a3a', // metal
  T: '#6a8ad0', // brother's shirt
  t: '#44609a', // shirt shade
  b: '#e8b860', // brother's hair
  D: '#050308', // shadow body
  d: '#1e1028', // shadow edge
  W: '#f4f0ff', // shadow eyes
  O: '#c0392b', // ball
};

const BROTHER = [
  '....KKKK....',
  '...KbbbbK...',
  '..KbbbbbbK..',
  '..KbbSSSSK..',
  '..KbSSKSsK..',
  '...KSSSSK...',
  '...KTTTTK...',
  '..KTTTTTTK..',
  '.KSKTTTTKSK.',
  '.KK.TTTTtKK.',
  '...KtttttK..',
  '...KPPKPPK..',
  '...KPPKPPK..',
  '...KPPKPPK..',
  '...KBBKBBK..',
  '..KBBBKBBBK.',
  '..KKKK.KKKK.',
];

const BROTHER_RUN = [
  '....KKKK....',
  '...KbbbbK...',
  '..KbbbbbbK..',
  '..KbbSSSSK..',
  '..KbSSKSsK..',
  '...KSSSSK...',
  '...KTTTTK...',
  '..KTTTTTTKSK',
  '.KSKTTTTKKK.',
  '.KK.TTTTtK..',
  '...KtttttK..',
  '...KPPKPPK..',
  '..KPPK.KPPK.',
  '.KPPK...KPPK',
  '.KBBK...KBBK',
  'KBBBK..KBBBK',
  'KKKK...KKKK.',
];

const BALL = [
  '.KKK.',
  'KOOOK',
  'KOOOK',
  'KOOOK',
  '.KKK.',
];

function drawMap(ctx, map, ox, oy, px) {
  map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = PALETTE[row[x]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x * px, oy + y * px, px, px);
    }
  });
}

// Builds one texture with several frames laid out horizontally.
function sheet(scene, key, frames, px) {
  const fw = Math.max(...frames.map((f) => Math.max(...f.map((r) => r.length)))) * px;
  const fh = Math.max(...frames.map((f) => f.length)) * px;
  const tex = scene.textures.createCanvas(key, fw * frames.length, fh);
  const ctx = tex.getContext();
  frames.forEach((f, i) => {
    drawMap(ctx, f, i * fw, fh - f.length * px, px);
    tex.add(i, 0, i * fw, 0, fw, fh);
  });
  tex.refresh();
}

function radial(scene, key, size, stops) {
  const tex = scene.textures.createCanvas(key, size, size);
  const ctx = tex.getContext();
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  tex.refresh();
}

export function createTextures(scene) {
  const PX = 4;
  // No brother sheet yet, so his echo is still a placeholder pixel sprite.
  sheet(scene, 'brother', [BROTHER, BROTHER_RUN], PX);
  sheet(scene, 'ball', [BALL], 3);

  radial(scene, 'glow', 256, [
    [0, 'rgba(255,190,110,1)'],
    [0.35, 'rgba(255,140,60,0.45)'],
    [1, 'rgba(255,120,40,0)'],
  ]);
  radial(scene, 'spark', 16, [
    [0, 'rgba(255,255,230,1)'],
    [0.4, 'rgba(255,200,90,0.9)'],
    [1, 'rgba(255,120,30,0)'],
  ]);
  radial(scene, 'mote', 16, [
    [0, 'rgba(255,240,200,1)'],
    [1, 'rgba(255,220,150,0)'],
  ]);
  radial(scene, 'smoke', 32, [
    [0, 'rgba(20,10,30,0.9)'],
    [1, 'rgba(20,10,30,0)'],
  ]);

  const anim = (key, texture, frameRate, repeat = -1, frames) =>
    scene.anims.create({ key, frames: scene.anims.generateFrameNumbers(texture, frames ? { frames } : {}), frameRate, repeat });
  anim('brother-run', 'brother', 8);
  anim('hero-idle', 'hero_idle', 6, -1, [0, 1, 2, 3, 4, 3, 2, 1]);
  anim('hero-walk', 'hero_walk', 10);
  anim('hero-interact', 'hero_interact', 8, 0, [0, 1, 2, 2, 1, 0]);
  anim('hero-light', 'hero_light', 7, 0, [0, 1, 2, 3, 3, 4]);
  anim('hero-death', 'hero_death', 9, 0);
  anim('shadow-idle', 'shadow_idle', 5);
  anim('shadow-move', 'shadow_move', 8);
  anim('shadow-hurt', 'shadow_hurt', 10, 0);
  anim('shadow-dissolve', 'shadow_dissolve', 4, 0);
  anim('fx-burst', 'fx_burst', 10, 0);
  anim('fire-ignite', 'fire_ignite', 9, 0);
  anim('fire-burning', 'fire_burning', 6, -1, [3, 4]);
  anim('fire-fading', 'fire_fading', 5, 0);
  anim('fx-embers', 'fx_embers', 6);
  anim('fx-dissolve', 'fx_dissolve', 9, 0);
}
