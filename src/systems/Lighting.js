// Screen-space darkness with holes punched out for each light.
// Drawn on a quarter-resolution canvas so the falloff bands like pixel art.

const RES = 4;

export class Lighting {
  constructor(scene, { darkness = 0.92, depth = 50 } = {}) {
    this.scene = scene;
    this.darkness = darkness;
    this.lights = new Set();
    this.restoredAreas = [];
    const { width, height } = scene.scale;
    this.w = Math.ceil(width / RES);
    this.h = Math.ceil(height / RES);
    this.key = `dark-${scene.sys.settings.key}`;
    if (scene.textures.exists(this.key)) scene.textures.remove(this.key);
    this.tex = scene.textures.createCanvas(this.key, this.w, this.h);
    this.ctx = this.tex.getContext();
    this.image = scene.add.image(0, 0, this.key).setOrigin(0).setScale(RES).setScrollFactor(0).setDepth(depth);
    this.time = 0;
  }

  // light: { x, y, radius, intensity, flicker, follow?: gameObject, offsetX, offsetY, glow?: image }
  add(light) {
    const l = { intensity: 1, flicker: 0, offsetX: 0, offsetY: 0, on: true, ...light };
    if (l.warm !== false) {
      l.glow = this.scene.add.image(0, 0, 'glow').setBlendMode('ADD').setDepth(this.image.depth - 1).setAlpha(0);
    }
    this.lights.add(l);
    return l;
  }

  remove(l) {
    l.glow?.destroy();
    this.lights.delete(l);
  }

  update(delta) {
    this.time += delta;
    const cam = this.scene.cameras.main;
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = `rgba(6,3,12,${this.darkness})`;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'destination-out';
    // Restoration is daylight across the affected region, rather than a larger
    // lantern halo. Adjacent corrupted regions retain their darkness.
    for (const area of this.restoredAreas) {
      ctx.fillStyle = `rgba(0,0,0,${Math.min(1, area.alpha) * 0.92})`;
      ctx.fillRect((area.x - cam.scrollX) / RES, 0, area.width / RES, this.h);
    }

    for (const l of this.lights) {
      if (l.follow) {
        l.x = l.follow.x + l.offsetX * (l.follow.flipX ? -1 : 1);
        l.y = l.follow.y + l.offsetY;
      }
      const flick = l.flicker ? 1 + Math.sin(this.time * 0.013 + l.x) * l.flicker * 0.5 + (Math.random() - 0.5) * l.flicker : 1;
      const r = Math.max(1, l.radius * flick * (l.on ? 1 : 0));
      const sx = (l.x - cam.scrollX) / RES;
      const sy = (l.y - cam.scrollY) / RES;
      if (l.glow) {
        l.glow.setPosition(l.x, l.y).setScale((r * 2.2) / 256).setAlpha(l.on ? 0.28 * l.intensity * this.darkness : 0);
      }
      if (!l.on || l.intensity <= 0) continue;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r / RES);
      const i = Math.min(1, l.intensity);
      g.addColorStop(0, `rgba(0,0,0,${i})`);
      g.addColorStop(0.5, `rgba(0,0,0,${i * 0.85})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(sx - r / RES, sy - r / RES, (r * 2) / RES, (r * 2) / RES);
    }
    this.tex.refresh();
  }

  destroy() {
    for (const l of this.lights) l.glow?.destroy();
    this.lights.clear();
    this.image.destroy();
    this.scene.textures.remove(this.key);
  }
}
