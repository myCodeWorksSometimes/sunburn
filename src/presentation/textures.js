// Runtime packing only: retain generated originals; normalize alpha bounds to
// stable game-sized cells, so existing actor origins and physics never change.
function pack(scene, source, key, count, w, h, actorHeight) {
  const image = scene.textures.get(source).getSourceImage();
  const scratch = document.createElement('canvas'); scratch.width = image.width; scratch.height = image.height;
  const scan = scratch.getContext('2d', { willReadFrequently: true }); scan.drawImage(image, 0, 0);
  const pixels = scan.getImageData(0, 0, image.width, image.height).data;
  const texture = scene.textures.createCanvas(key, w * count, h), ctx = texture.getContext();
  ctx.imageSmoothingEnabled = false;
  for (let i = 0; i < count; i++) {
    const left = Math.round(i * image.width / count), right = Math.round((i + 1) * image.width / count);
    let x1 = right, x2 = left, y1 = image.height, y2 = 0;
    for (let y = 0; y < image.height; y++) for (let x = left; x < right; x++) if (pixels[(y * image.width + x) * 4 + 3] > 40) {
      x1 = Math.min(x1, x); x2 = Math.max(x2, x); y1 = Math.min(y1, y); y2 = Math.max(y2, y);
    }
    const sw = x2 - x1 + 1, sh = y2 - y1 + 1, scale = Math.min(actorHeight / sh, (w - 10) / sw);
    ctx.drawImage(image, x1, y1, sw, sh, i * w + (w - sw * scale) / 2, h - sh * scale, sw * scale, sh * scale);
    texture.add(i, 0, i * w, 0, w, h);
  }
  texture.refresh();
}

export function createPresentationTextures(scene) {
  pack(scene, 'eli-source', 'brother', 6, 96, 96, 76);
  pack(scene, 'climb-source', 'hero_climb', 4, 155, 110, 106);
  // Keep the archived prototype's texture key available for its echo helper.
  scene.textures.addImage('ball', scene.textures.get('ball-final').getSourceImage());
  const sky = scene.textures.createCanvas('night-sky', 1280, 560), ctx = sky.getContext();
  const gradient = ctx.createLinearGradient(0, 0, 0, 560);
  gradient.addColorStop(0, '#111727'); gradient.addColorStop(.55, '#293340'); gradient.addColorStop(1, '#47434a');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1280, 560);
  let seed = 73;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 95; i++) { ctx.fillStyle = `rgba(186,198,205,${.12 + random() * .4})`; ctx.fillRect(random() * 1280, random() * 300, 1 + Math.floor(random() * 2), 1); }
  sky.refresh();
  const grass = scene.textures.createCanvas('living-edge', 256, 30), g = grass.getContext();
  for (let x = 0; x < 256; x += 3) {
    const height = 4 + random() * 15;
    g.strokeStyle = ['#507447', '#83a65d', '#a8bd6e'][Math.floor(random() * 3)];
    g.beginPath(); g.moveTo(x, 29); g.lineTo(x + random() * 6 - 3, 29 - height); g.stroke();
    if (x % 21 === 0) { g.fillStyle = '#e7d8a1'; g.fillRect(x, 28 - height, 2, 2); }
  }
  grass.refresh();
}
