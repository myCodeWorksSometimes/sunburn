export const GROUND = 560;
export const WORLD_WIDTH = 18000;
export const REGIONS = [
  { id: 'yard', act: 'Prologue', name: 'The garden', x: 0, width: 1550, art: 'p2_yard', paintGround: 508 },
  { id: 'lane', act: 'Act 1', name: 'Village lane', x: 1550, width: 1650, art: 'a1_lane', paintGround: 555 },
  { id: 'square', act: 'Act 1', name: 'Market square', x: 3200, width: 1650, art: 'a1_square', paintGround: 545 },
  { id: 'bridge', act: 'Act 1', name: 'The broken bridge', x: 4850, width: 1650, art: 'a1_bridge', paintGround: 410 },
  { id: 'camp', act: 'Act 1', name: 'Village campfire', x: 6500, width: 1700, art: 'a1_campfire', paintGround: 545 },
  { id: 'swings', act: 'Act 2', name: 'The playground', x: 8200, width: 1600, art: 'p2_yard', paintGround: 508 },
  { id: 'treehouse', act: 'Act 2', name: 'The treehouse', x: 9800, width: 1600, art: 'a1_campfire', paintGround: 545 },
  { id: 'canal', act: 'Act 2', name: 'Canal road', x: 11400, width: 1600, art: 'a1_bridge', paintGround: 410 },
  { id: 'tower-court', act: 'Act 3', name: 'Tower courtyard', x: 13000, width: 1600, art: 'a1_square', paintGround: 545 },
  { id: 'tower-base', act: 'Act 3', name: 'The bell mechanisms', x: 14600, width: 1700, art: 'a1_lane', paintGround: 555 },
  { id: 'tower-crown', act: 'Act 3', name: 'The clock tower', x: 16300, width: 1700, art: 'a1_square', paintGround: 545 },
];
export const SPAWNS = {
  front: { x: 185, y: GROUND },
  yard: { x: 490, y: GROUND },
  lane: { x: 1710, y: GROUND },
  square: { x: 3520, y: GROUND },
  shortcut: { x: 3410, y: GROUND },
  bridge: { x: 5190, y: GROUND },
  farBank: { x: 6170, y: GROUND },
  camp: { x: 6870, y: GROUND },
  playground: { x: 8510, y: GROUND },
  swingBank: { x: 9530, y: GROUND },
  treehouse: { x: 9920, y: GROUND },
  passage: { x: 11100, y: GROUND },
  canal: { x: 11600, y: GROUND },
  canalBank: { x: 12420, y: GROUND },
  courtyard: { x: 13250, y: GROUND },
  mechanisms: { x: 14820, y: GROUND },
  crown: { x: 16500, y: GROUND },
};
export const BRIDGE_GAP = { x1: 5480, x2: 6040 };
export const YARD_GAP = { x1: 720, x2: 830 };
export const CAMP_GAP = { x1: 7800, x2: 8120 };
export const SWING_GAP = { x1: 9160, x2: 9460 };
export const CANAL_GAP = { x1: 11900, x2: 12310 };
export const GAPS = [YARD_GAP, BRIDGE_GAP, CAMP_GAP, SWING_GAP, CANAL_GAP];
export const RELAYS = [
  { id: 'tower-relay-1', regionId: 'tower-court', x: 13760, floor: 440 },
  { id: 'tower-relay-2', regionId: 'tower-base', x: 15460, floor: 380 },
  { id: 'tower-relay-3', regionId: 'tower-crown', x: 16780, floor: 500 },
];
export const FIRES = [
  { id: 'yard-fire', regionId: 'yard', x: 490, floor: GROUND, duration: 14000, spawnId: 'yard' },
  { id: 'lane-fire', regionId: 'lane', x: 1710, floor: GROUND, duration: 14000, spawnId: 'lane' },
  { id: 'square-fire', regionId: 'square', x: 3520, floor: GROUND, duration: 18000, spawnId: 'square' },
  { id: 'bridge-fire', regionId: 'bridge', x: 5190, floor: GROUND, duration: 9000, spawnId: 'bridge' },
  { id: 'camp-fire', regionId: 'camp', x: 6870, floor: GROUND, duration: 20000, spawnId: 'camp' },
  { id: 'swing-fire', regionId: 'swings', x: 8510, floor: GROUND, duration: 16000, spawnId: 'playground' },
  { id: 'treehouse-fire', regionId: 'treehouse', x: 9920, floor: GROUND, duration: 20000, spawnId: 'treehouse' },
  { id: 'canal-fire', regionId: 'canal', x: 11600, floor: GROUND, duration: 16000, spawnId: 'canal' },
  { id: 'court-fire', regionId: 'tower-court', x: 13250, floor: GROUND, duration: 18000, spawnId: 'courtyard' },
  { id: 'mechanism-fire', regionId: 'tower-base', x: 14820, floor: GROUND, duration: 20000, spawnId: 'mechanisms' },
  { id: 'crown-fire', regionId: 'tower-crown', x: 16500, floor: GROUND, duration: 22000, spawnId: 'crown' },
];
export function regionAt(x) { return REGIONS.find(r => x >= r.x && x < r.x + r.width) || REGIONS.at(-1); }
export function worldPoint(origin, point) { return { x: origin.x + point.x, y: (origin.y || 0) + point.y }; }
