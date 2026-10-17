import { FONT } from '../systems/Captions.js';

// Placeholder looks for the campaign's living survivors until real sheets exist.
// Adults reuse the hero sheet, Nia reuses Eli's; tints and labels tell them apart.
const LOOKS = {
  mara: { texture: 'hero_idle', frame: 0, tint: 0xe0a8b8, scale: 0.92, label: 'MARA' },
  tomas: { texture: 'hero_idle', frame: 2, tint: 0x9fb8d8, scale: 1, label: 'TOMAS' },
  nia: { texture: 'brother', frame: 0, tint: 0xf2c6d6, scale: 0.85, label: 'NIA' },
};

// A living survivor: stands on the ground, faces Rowan, and can walk off-screen.
export class Npc {
  constructor(scene, who, x, y, { visible = true } = {}) {
    const look = LOOKS[who];
    this.scene = scene; this.who = who; this.baseY = y;
    this.sprite = scene.add.sprite(x, y, look.texture, look.frame).setOrigin(0.5, 1).setScale(look.scale).setTint(look.tint).setDepth(19);
    this.label = scene.add.text(x, y - this.sprite.displayHeight - 8, look.label, {
      fontFamily: FONT, fontSize: '13px', color: '#e8d6b4', stroke: '#11101b', strokeThickness: 4,
    }).setOrigin(0.5, 1).setDepth(24);
    this.walking = null;
    this.setVisible(visible);
  }

  get x() { return this.sprite.x; }

  setVisible(on) {
    this.sprite.setVisible(on); this.label.setVisible(on);
    return this;
  }

  get visible() { return this.sprite.visible; }

  // Walks to x at a steady pace, then optionally hides (leaving the scene).
  walkTo(x, { hide = false, speed = 140 } = {}) {
    this.walking = { x, hide, speed };
  }

  tick(delta, player) {
    if (!this.visible) return;
    const s = this.sprite;
    if (this.walking) {
      const dx = this.walking.x - s.x, step = this.walking.speed * delta / 1000;
      s.setFlipX(dx < 0);
      if (Math.abs(dx) <= step) {
        s.x = this.walking.x;
        if (this.walking.hide) this.setVisible(false);
        this.walking = null;
      } else s.x += Math.sign(dx) * step;
    } else if (player && Math.abs(player.x - s.x) < 260) s.setFlipX(player.x < s.x);
    // Small breathing bob so placeholders read as people rather than props.
    s.y = this.baseY - Math.abs(Math.sin(this.scene.time.now / 520 + s.x)) * 1.5;
    this.label.setPosition(s.x, s.y - s.displayHeight - 8);
  }
}
