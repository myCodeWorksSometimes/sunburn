// Bottom-of-screen story captions with a typewriter effect.

export const FONT = '"Pixelify Sans", monospace';

export class Captions {
  constructor(scene, depth = 100) {
    this.scene = scene;
    const { width, height } = scene.scale;
    this.box = scene.add.rectangle(width / 2, height - 70, width - 240, 64, 0x000000, 0.55).setScrollFactor(0).setDepth(depth).setAlpha(0);
    this.text = scene.add
      .text(width / 2, height - 70, '', { fontFamily: FONT, fontSize: '26px', color: '#f3e6d0', align: 'center', wordWrap: { width: width - 300 } })
      .setOrigin(0.5)
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
    this.scene.tweens.add({ targets: [this.box, this.text], alpha: 0, duration: 200 });
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
    this.text.setText('').setAlpha(1).setColor(line.color || '#f3e6d0');
    this.box.setAlpha(0.55);
    let i = 0;
    this.typer = this.scene.time.addEvent({
      delay: 28,
      repeat: full.length - 1,
      callback: () => this.text.setText(full.slice(0, ++i)),
    });
    const hold = line.hold ?? 1400 + full.length * 45;
    this.timer = this.scene.time.delayedCall(full.length * 28 + hold, () => this.next());
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
