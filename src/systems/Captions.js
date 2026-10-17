import { panel } from '../presentation/ui.js';
// Bottom-of-screen story captions with a typewriter effect.

export const FONT = 'Trebuchet MS, sans-serif';

export class Captions {
  constructor(scene, depth = 100) {
    this.scene = scene;
    const { width, height } = scene.scale;
    // The cellar's walk line is y650: bottom captions would hide its pickups,
    // hands and feet. Give the interior a clear upper caption band instead.
    const captionY = scene.scene.key === 'Hearth' ? 212 : height - 70;
    this.box = panel(scene,width/2,captionY,width-240,72,{depth,alpha:.95}).setAlpha(0);
    this.text = scene.add
      .text(190, captionY, '', { fontFamily: FONT, fontSize: '21px', color: '#f3e6d0', align: 'left', resolution:2, fixedWidth:900, lineSpacing:6, wordWrap: { width: 900 } })
      .setOrigin(0,0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);
    this.queue = [];
    this.busy = false;
  }

  // lines: string | { text, speaker?, hold? }
  say(...lines) {
    for (const l of lines) this.queue.push(typeof l === 'string' ? { text: l } : l);
    if (!this.busy) this.next();
  }

  clear() {
    this.queue = [];
    this.timer?.remove();
    this.typer?.remove();
    this.busy = false;
    this.scene.tweens.killTweensOf([this.box,this.text]);
    this.box.setAlpha(0);this.text.setText('').setAlpha(0);
  }

  next() {
    const line = this.queue.shift();
    if (!line) {
      this.busy = false;
      this.scene.tweens.add({ targets: [this.box, this.text], alpha: 0, duration: 400 });
      return;
    }
    this.busy = true;
    this.scene.tweens.killTweensOf([this.box, this.text]);
    const full = line.speaker ? `${line.speaker}: ${line.text}` : line.text;
    this.full = full;
    this.text.setText('').setAlpha(1).setColor(line.color || '#f3e6d0');
    this.box.setAlpha(.95);
    let i = 0;
    this.typer = this.scene.time.addEvent({
      delay: 28,
      repeat: full.length - 1,
      callback: () => this.text.setText(full.slice(0, ++i)),
    });
    const hold = line.hold ?? 1400 + full.length * 45;
    this.timer = this.scene.time.delayedCall(full.length * 28 + hold, () => this.next());
  }

  advance() {
    if (!this.busy) return;
    if (this.text.text !== this.full) { this.typer?.remove(); this.text.setText(this.full); }
    else { this.timer?.remove(); this.next(); }
  }
}

// Small floating "[E] Do thing" hint used for interactables.
export class Prompt {
  constructor(scene) {
    this.key = scene.add.image(0, 0, 'ui_key_e').setScale(0.42).setOrigin(1, 1).setDepth(90).setVisible(false);
    this.text = scene.add
      .text(0, 0, '', { fontFamily: FONT, fontSize: '20px', color: '#ffe6a8', stroke: '#000000', strokeThickness: 4 })
      .setOrigin(0, 1)
      .setDepth(90)
      .setVisible(false);
  }

  show(x, y, label) {
    this.text.setText(label);
    const w = this.key.displayWidth + 6 + this.text.width;
    const left = x - w / 2;
    this.key.setPosition(left + this.key.displayWidth, y + 4).setVisible(true);
    this.text.setPosition(left + this.key.displayWidth + 6, y).setVisible(true);
  }

  hide() {
    this.key.setVisible(false);
    this.text.setVisible(false);
  }
}
