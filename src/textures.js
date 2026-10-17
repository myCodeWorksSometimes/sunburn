// Authored sprite animations and procedural light / particle gradients.
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
  anim('brother-run', 'brother', 9, -1, [1, 2, 3, 4]);
  anim('brother-idle', 'brother', 2, -1, [0, 0, 5, 0]);
  anim('hero-climb', 'hero_climb', 7);
  anim('hero-sweep', 'hero_light', 11, 0, [0, 1, 2, 3, 4]);
  anim('hero-idle', 'hero_idle', 6, -1, [0, 1, 2, 3, 4, 3, 2, 1]);
  anim('hero-walk', 'hero_walk', 10);
  anim('hero-interact', 'hero_interact', 8, 0, [0, 1, 2, 2, 1, 0]);
  anim('hero-light', 'hero_light', 7, 0, [0, 1, 2, 3, 3, 4]);
  anim('hero-death', 'hero_death', 9, 0);
  anim('sword-idle','sword-motion',6,-1,[0,1,2,3,4,5,6,7]);
  anim('sword-walk','sword-motion',12,-1,[8,9,10,11,12,13,14,15]);
  anim('sword-attack','sword-motion',16,0,[16,17,18,19,20,21,22,23]);
  anim('sword-draw','sword-motion',16,0,[24,25,26,27,28,29,30,31]);
  anim('shadow-idle', 'shadow_idle', 5);
  anim('shadow-move', 'shadow_move', 8);
  anim('shadow-hurt', 'shadow_hurt', 10, 0);
  anim('shadow-dissolve', 'shadow_dissolve', 4, 0);
  anim('fx-burst', 'fx_burst', 10, 0);
  anim('fire-ignite', 'fire_ignite', 9, 0);
  anim('fire-burning', 'fire_burning', 9);
  anim('fire-fading', 'fire_fading', 5, 0);
  anim('fx-embers', 'fx_embers', 6);
  anim('fx-dissolve', 'fx_dissolve', 9, 0);
}
