export const UI = { title: 'Georgia, serif', body: 'Trebuchet MS, sans-serif', mono: 'Consolas, monospace', gold: '#e8c58c', ink: 0x11141e, edge: 0x665640 };

export function panel(scene, x, y, w, h, { depth = 100, fixed = true, alpha = .94 } = {}) {
  const container = scene.add.container(x, y).setDepth(depth);
  if (fixed) container.setScrollFactor(0);
  const short=h<140,key=short?'kit-button':'kit-panel';
  const plate = scene.textures.exists(key)
    ?scene.add.nineslice(0,0,key,null,w,h,short?40:30,short?40:30,short?12:30,short?12:30).setAlpha(alpha)
    :scene.add.rectangle(0, 0, w, h, UI.ink, alpha).setStrokeStyle(1, UI.edge, .85);
  container.add(plate);
  // Keep the painted frame, but quiet its central texture behind small text.
  container.add(scene.add.rectangle(0, 0, Math.max(1,w-64), Math.max(1,h-34), UI.ink, .88));
  const trim = scene.add.graphics().lineStyle(1, 0xd8b37b, .7);
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const a = dx * (w / 2 - 7), b = dy * (h / 2 - 7);
    trim.lineBetween(a, b, a - dx * 17, b).lineBetween(a, b, a, b - dy * 12);
  }
  container.add(trim); return container;
}

export function menuText(scene, x, y, label, size = 18, color = '#dfd7c6') {
  return scene.add.text(x, y, label, { fontFamily: UI.body, fontSize: `${size}px`, color, align: 'center', lineSpacing: 6, resolution: 2 }).setOrigin(.5).setPadding(2,1,2,2);
}
