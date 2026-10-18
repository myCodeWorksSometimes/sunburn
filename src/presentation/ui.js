export const UI = { title: '"Pixelify Sans", serif', body: '"Pixelify Sans", sans-serif', mono: 'Consolas, monospace', gold: '#e8c58c', ink: 0x11141e, edge: 0x665640 };

export function panel(scene, x, y, w, h, { depth = 100, fixed = true, alpha = .94 } = {}) {
  const container = scene.add.container(x, y).setDepth(depth);
  if (fixed) container.setScrollFactor(0);
  const plate = scene.textures.exists('ui-frame')
    ?scene.add.nineslice(0,0,'ui-frame',null,w,h,16,16,12,12).setAlpha(alpha)
    :scene.add.rectangle(0, 0, w, h, UI.ink, alpha).setStrokeStyle(1, UI.edge, .85);
  container.add(plate);
  // Keep the painted frame, but quiet its central texture behind small text.
  container.add(scene.add.rectangle(0, 0, Math.max(1,w-32), Math.max(1,h-24), UI.ink, .88));
  container.resizePanel = (width,height) => {
    plate.setSize(width,height);
    container.list[1].setSize(Math.max(1,width-32),Math.max(1,height-24));
    return container;
  };
  if(scene.textures.exists('ui-frame'))return container;
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
