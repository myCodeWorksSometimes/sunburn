export const GROUND = 560;
export const WORLD_WIDTH = 17470;
export const REGIONS = [
  { id: 'yard', act: 'Prologue', name: 'The garden', x: 0, width: 1550, art: 'p2_yard', paintGround: 508 },
  { id: 'lane', act: 'Act 1', name: 'Village lane', x: 1550, width: 1650, art: 'a1_lane', paintGround: 555 },
  { id: 'square', act: 'Act 1', name: 'Market square', x: 3200, width: 1650, art: 'a1_square', paintGround: 545 },
  { id: 'bridge', act: 'Act 1', name: 'Bridge Refuge', x: 4850, width: 3250, art: 'a1_bridge', paintGround: 410 },
  { id: 'camp', act: 'Act 1', name: 'Village campfire', x: 8100, width: 700, art: 'a1_campfire', paintGround: 545 },
  { id: 'swings', act: 'Act 2', name: 'The playground', x: 8800, width: 1600, art: 'a2_swings', fallback: 'p2_yard', artGround: 0.68, paintGround: 508 },
  { id: 'treehouse', act: 'Act 2', name: 'The treehouse', x: 10400, width: 1600, art: 'a2_treehouse', fallback: 'a1_campfire', artGround: 0.73, paintGround: 545 },
  { id: 'canal', act: 'Act 2', name: 'Canal road', x: 12000, width: 1600, art: 'a2_canal', fallback: 'a1_bridge', artGround: 0.72, paintGround: 410 },
  // Act 3 areas are whole paintings that move with Rowan (art/background_prompts_act3.md):
  // each is exactly one painting wide, and `feet` is Rowan's floor line in its pixels.
  { id: 'tower-court', act: 'Act 3', name: 'Tower courtyard', x: 13600, width: 1290, art: 'a3_courtyard', fallback: 'a1_square', paintGround: 545, whole: true, feet: 580 },
  { id: 'tower-base', act: 'Act 3', name: 'The bell mechanisms', x: 14890, width: 1290, art: 'a3_mechanisms', fallback: 'a1_lane', paintGround: 555, whole: true, feet: 580 },
  { id: 'tower-crown', act: 'Act 3', name: 'The clock tower', x: 16180, width: 1290, art: 'a3_landing', fallback: 'a1_square', paintGround: 545, whole: true, feet: 580 },
];
export const SPAWNS = {
  front: { x: 225, y: GROUND },
  yard: { x: 490, y: GROUND },
  lane: { x: 1710, y: GROUND },
  square: { x: 3250, y: GROUND },
  shortcut: { x: 3410, y: GROUND },
  refuge: { x: 5350, y: GROUND },
  oldRoadWest: { x: 4935, y: GROUND },
  bridge: { x: 7440, y: GROUND },
  farBank: { x: 8050, y: GROUND },
  camp: { x: 8120, y: GROUND },
  playground: { x: 9110, y: GROUND },
  swingBank: { x: 10130, y: GROUND },
  treehouse: { x: 10520, y: GROUND },
  passage: { x: 11700, y: GROUND },
  canal: { x: 12200, y: GROUND },
  canalBank: { x: 13020, y: GROUND },
  oldRoadEast: { x: 13880, y: GROUND },
  courtyard: { x: 14000, y: GROUND },
  mechanisms: { x: 14990, y: GROUND },
  crown: { x: 16290, y: GROUND },
};
// Campaign Act 1 positions. The stall's roof is reached from the square's
// restored steps (top tread 3520–3640 at y380). The court is further east.
export const MARA_STALL = { x1: 3630, x2: 3870, roof: 385, shutter: 3790, release: 3815, exitGate: 4830 };
// Five-Hand: rooted at the market exit; five card slots hover over the arena.
export const FIVE_HAND = { body: 4785, slots: [4140, 4270, 4400, 4530, 4660], cardY: 405, arenaStart: 4080 };
// barrier keeps Rowan out of the bridge fire's reach until Tomas has spoken.
export const REFUGE = { oldRoad: 4910, nia: 5060, hearth: 5350, tomas: 5500, mara: 5205, barrier: 5580 };
// Campaign Scene 10: Eli behind a lattice window high on the tower, seen from the
// courtyard; the Old Road's east door and its release beside it.
export const TOWER_WINDOW = { x: 14230, y: 190, knock: 14230 };
export const OLD_ROAD_EAST = { door: 13848, release: 13760 };
// Act 3 surfaces, measured on the restored paintings (they can only be stood on
// in remembered time). Painting pixel (px, py) → world (area x + px, py − 20).
export const A3 = {
  courtSteps: [[14045, 14185, 495], [14185, 14390, 410], [14340, 14585, 300]],
  baseSteps: [[15050, 15130, 520], [15130, 15210, 477], [15210, 15640, 430]],
  crownLedge: [16410, 16680, 452],
  // The stair to Eli rises after the fight, onto the painted gallery.
  eliSteps: [[16760, 16830, 485], [16830, 16925, 415]],
  gallery: [16928, 17395, 345],
  eli: 17000, view: 17150, oldRoadHome: 16370,
  warden: { x: 16830, minX: 16460, maxX: 17360 },
  // Painted bells, for the glow once each one is rung.
  bells: { 'tower-relay-1': [14668, 145], 'tower-relay-2': [15465, 270], 'tower-relay-3': [16545, 325] },
};
// Bridge works (CAMPAIGN Scene 7), in the space before the bridge fire: the
// Braced Shadow's arena, a crate to dodge onto, the cracked barrier and the gear bay.
export const BRIDGE_WORKS = { arenaMin: 6100, arenaMax: 7030, elite: 6460, crate: [6860, 7000], barrier: 7060,
  leverA: 7150, leverB: 7240, brake: 7350, bigGear: { x: 7190, y: 397, r: 53 }, smallGear: { x: 7280, y: 397, r: 37 } };
export const BRIDGE_GAP = { x1: 7550, x2: 7970 };
export const YARD_GAP = { x1: 780, x2: 1100 };
export const CAMP_GAP = { x1: 8400, x2: 8720 };
export const SWING_GAP = { x1: 9760, x2: 10060 };
export const CANAL_GAP = { x1: 12550, x2: 12850 };
export const GAPS = [YARD_GAP, BRIDGE_GAP, CAMP_GAP, SWING_GAP, CANAL_GAP];
export const RELAYS = [
  { id: 'tower-relay-1', regionId: 'tower-court', x: 14560, floor: 300 },
  { id: 'tower-relay-2', regionId: 'tower-base', x: 15465, floor: 430 },
  { id: 'tower-relay-3', regionId: 'tower-crown', x: 16545, floor: 452 },
];
export const FIRES = [
  { id: 'yard-fire', regionId: 'yard', x: 490, floor: GROUND, duration: 14000, spawnId: 'yard' },
  { id: 'lane-fire', regionId: 'lane', x: 1710, floor: GROUND, duration: 14000, spawnId: 'lane' },
  { id: 'square-fire', regionId: 'square', x: 3250, floor: GROUND, duration: 18000, spawnId: 'square' },
  { id: 'bridge-fire', regionId: 'bridge', x: 7440, floor: GROUND, radius: 800, duration: 16000, spawnId: 'bridge' },
  { id: 'camp-fire', regionId: 'camp', x: 8120, floor: GROUND, radius: 720, duration: 20000, spawnId: 'camp' },
  { id: 'swing-fire', regionId: 'swings', x: 9110, floor: GROUND, radius: 1060, duration: 16000, spawnId: 'playground' },
  { id: 'treehouse-fire', regionId: 'treehouse', x: 10520, floor: GROUND, radius: 900, duration: 20000, spawnId: 'treehouse' },
  { id: 'canal-fire', regionId: 'canal', x: 12200, floor: GROUND, duration: 16000, spawnId: 'canal' },
  { id: 'court-fire', regionId: 'tower-court', x: 14000, floor: GROUND, duration: 18000, spawnId: 'courtyard' },
  { id: 'mechanism-fire', regionId: 'tower-base', x: 14990, floor: GROUND, duration: 20000, spawnId: 'mechanisms' },
  { id: 'crown-fire', regionId: 'tower-crown', x: 16290, floor: GROUND, duration: 22000, spawnId: 'crown' },
];
export function regionAt(x) { return REGIONS.find(r => x >= r.x && x < r.x + r.width) || REGIONS.at(-1); }
export function worldPoint(origin, point) { return { x: origin.x + point.x, y: (origin.y || 0) + point.y }; }
