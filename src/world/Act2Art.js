// Act 2 foreground art: the delivered prop cut-outs (art/background_prompts_act2.md)
// placed on their gameplay spots. Each prop has a dark and a restored image;
// remembering the region cross-fades one into the other. Anchors are measured
// in each image's own pixels (fractions), so the platforms line up with the art.
import { GROUND } from './layout.js';

export const ACT2 = {
  crater: { x: 9740 },
  swing: { x: 9910, anchorY: 176 },
  treehouse: { platform: 380, x1: 10880, x2: 11250 },
  gate: { x: 12050 },
  mill: { x: 12205, lower: [12302, 12387, 487], upper: [12387, 12492, 439], wheel: { x: 12470, y: 404 } },
};

function place(s, key, { anchor, at, height, width, depth }) {
  if (!s.textures.exists(key)) return null;
  const image = s.add.image(at[0], at[1], key).setOrigin(anchor[0], anchor[1]).setDepth(depth);
  const src = s.textures.get(key).getSourceImage();
  image.setDisplaySize(width ?? height * src.width / src.height, height);
  return image;
}

// Dark stays underneath until the restored version takes over, then fades out.
function pair(s, regionId, name, dark, past) {
  const d = place(s, `prop_a2_${name}_dark`, dark);
  const p = place(s, `prop_a2_${name}_restored`, past ?? dark);
  if (!d || !p) return null;
  p.setAlpha(0);
  s.regionVisuals.get(regionId).push({ setAlpha: (a) => { p.setAlpha(a); d.setAlpha(1 - a * .85); } });
  return { dark: d, past: p };
}

export function hasAct2Art(s) { return s.textures.exists('prop_a2_swingset_dark'); }

export function buildAct2Art(s) {
  if (!hasAct2Art(s)) return;
  const A = ACT2;
  pair(s, 'swings', 'crater', { anchor: [.15, .04], at: [A.crater.x, GROUND], height: 222, depth: 9 });
  pair(s, 'swings', 'swingset', { anchor: [.5, 1], at: [A.swing.x, GROUND], height: 400, depth: 12 });
  pair(s, 'treehouse', 'treehouse',
    { anchor: [.12, .65], at: [A.treehouse.x1, A.treehouse.platform], height: 514, depth: 9 },
    { anchor: [.1, .68], at: [A.treehouse.x1, A.treehouse.platform], height: 562, depth: 9 });
  pair(s, 'canal', 'mill', { anchor: [0, 1], at: [A.mill.x, GROUND], height: 270, depth: 9 });
  pair(s, 'canal', 'canal',
    { anchor: [.3, .08], at: [12550, GROUND], height: 353, depth: 8 },
    { anchor: [.37, .02], at: [12550, GROUND], width: 1200, height: 384, depth: 8 });
  // The buried exit: rubble while the gate is shut, the old service arch once open.
  s.act2Gate = {
    rubble: place(s, 'prop_a2_rubble_dark', { anchor: [.5, 1], at: [A.gate.x, GROUND], height: 240, depth: 13 }),
    arch: place(s, 'prop_a2_rubble_restored', { anchor: [.3, 1], at: [A.gate.x, GROUND], height: 270, depth: 13 }),
  };
}

// The swing board rides inside the moving platform's container.
export function dressSwingSeat(s, platform) {
  if (!s.textures.exists('prop_a2_swing_seat_restored')) return false;
  for (const child of platform.block.list) child.setVisible(false);
  const src = s.textures.get('prop_a2_swing_seat_restored').getSourceImage();
  const seat = s.add.image(-24, -4, 'prop_a2_swing_seat_restored').setOrigin(0).setCrop(0, 0, src.width * .84, src.height);
  seat.setScale(200 / src.width);
  platform.block.add(seat);
  platform.edge.setAlpha(0);
  return true;
}

export function tickAct2Art(s) {
  const g = s.act2Gate;
  if (!g?.rubble) return;
  const open = s.run.hasDrawing;
  g.rubble.setVisible(!open); g.arch.setVisible(open);
}
