export const UI = { title: 'Georgia, serif', body: 'Trebuchet MS, sans-serif', mono: 'Consolas, monospace', gold: '#e8c58c', ink: 0x11141e, edge: 0x665640 };

export function panel(scene, x, y, w, h, { depth = 100, fixed = true, alpha = .94 } = {}) {
  const container = scene.add.container(x, y).setDepth(depth);
  if (fixed) container.setScrollFactor(0);
  const plate = scene.add.rectangle(0, 0, w, h, UI.ink, alpha).setStrokeStyle(1, UI.edge, .85);
  container.add(plate);
  const trim = scene.add.graphics().lineStyle(1, 0xd8b37b, .7);
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const a = dx * (w / 2 - 7), b = dy * (h / 2 - 7);
    trim.lineBetween(a, b, a - dx * 17, b).lineBetween(a, b, a, b - dy * 12);
  }
  container.add(trim); return container;
}

export function menuText(scene, x, y, label, size = 18, color = '#dfd7c6') {
  return scene.add.text(x, y, label, { fontFamily: UI.body, fontSize: `${size}px`, color, align: 'center', lineSpacing: 7 }).setOrigin(.5);
}
