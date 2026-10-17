import { FONT } from '../systems/Captions.js';

// Registered pixel-art survivors, with distinct civilian silhouettes.
const LOOKS = {
  mara: { texture: 'npc-mara', label: 'Mara', height: 98 },
  tomas: { texture: 'npc-tomas', label: 'Tomas', height: 102 },
  nia: { texture: 'npc-nia', label: 'Nia', height: 70 },
};

// A living survivor: stands on the ground, faces Rowan, and can walk off-screen.
export class Npc {
  constructor(scene, who, x, y, { visible = true } = {}) {
    const look = LOOKS[who];
    this.scene = scene; this.who = who; this.baseY = y; this.visibleHeight=look.height;
    this.sprite = scene.add.sprite(x, y, look.texture, 0).setOrigin(0.5, 1).setDepth(19);
    if(!scene.anims.exists(`${look.texture}-walk`)) scene.anims.create({key:`${look.texture}-walk`,frames:scene.anims.generateFrameNumbers(look.texture,{frames:[1,2]}),frameRate:5,repeat:-1});
    this.label = scene.add.text(x, y - this.visibleHeight - 12, look.label, {
      fontFamily: FONT, fontSize: '14px', color: '#e8d6b4', stroke: '#11101b', strokeThickness: 2, resolution: 2,
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
      s.play(`npc-${this.who}-walk`,true);
      const dx = this.walking.x - s.x, step = this.walking.speed * delta / 1000;
      s.setFlipX(dx < 0);
      if (Math.abs(dx) <= step) {
        s.x = this.walking.x;
        if (this.walking.hide) this.setVisible(false);
        this.walking = null;
      } else s.x += Math.sign(dx) * step;
    } else {
      s.anims.stop();s.setFrame(0);
      if(player&&Math.abs(player.x-s.x)<260)s.setFlipX(player.x<s.x);
    }
    s.y = this.baseY;
    this.label.setPosition(s.x, s.y - this.visibleHeight - 12);
  }
}
