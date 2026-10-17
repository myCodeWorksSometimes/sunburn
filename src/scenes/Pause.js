import Phaser from 'phaser';
import { panel, menuText, UI } from '../presentation/ui.js';
import { newSession } from '../world/WorldState.js';
import { REGIONS, regionAt } from '../world/layout.js';

export class Pause extends Phaser.Scene {
  constructor() { super('Pause'); }
  init(data) { this.owner = data.owner; this.inventory = !!data.inventory; this.map = !!data.map; this.journal = !!data.journal; }
  create() {
    const source = this.scene.get(this.owner);
    this.add.rectangle(640, 360, 1280, 720, 0x080c15, .88);
    panel(this, 640, 348, 1020, 590, { fixed: false, depth: 0 });
    const text = (y, label, size = 24) => menuText(this, 640, y, label, size);
    if (this.map || this.journal) {
      this.explorationView(source, text);
      for (const key of ['ESC', 'M', 'J']) this.input.keyboard.on(`keydown-${key}`, () => this.resume());
      return;
    }
    if (this.inventory) {
      const run = source.run;
      text(102, 'THE THINGS WE KEEP', 32).setFontFamily(UI.title).setColor(UI.gold);
      text(149, 'SATCHEL   /   STORY ITEMS AND SUPPLIES', 13).setColor('#9c9caa').setLetterSpacing(3);
      const items = [
        { key: 'item-lantern', title: 'Grandfather’s lantern', owned: run.hasLantern, status: run.hasLantern ? 'CARRIED' : 'NOT FOUND',
          detail: 'An ordinary light with an extraordinary memory.\nE at an old fire: restore its world for 25 flame.   F: lantern sweep, 20 flame.' },
        { key: 'item-cup', title: 'Ember cup', owned: run.hasEmberCup, status: run.hasEmberCup ? '1 / 1  ·  KEY ITEM' : '0 / 1  ·  KEY ITEM',
          detail: 'A vessel made to carry the last warmth of a home.\nFound with Eli’s drawing in the remembered playground treehouse.' },
        { key: 'item-ember', title: 'The hearth’s last ember', owned: run.hasHearthEmber, status: run.hasHearthEmber ? '1 / 1  ·  PROTECTED' : run.rescuedEli ? 'GIVEN TO ELI' : 'NOT YET TAKEN',
          detail: run.rescuedEli ? 'The warmth has found its way home. Eli remains in the present.' : 'An anchor for someone caught between moments.\nSeparate from flame fuel. Attacks and oil can never consume this ember.' },
        { key: 'item-oil', title: 'Lamp oil', owned: run.oil > 0, status: `${run.oil} / 1  ·  SUPPLY`,
          detail: 'Q while playing: restore up to 35 flame. Full flame keeps the vial.\nHold R for two seconds beside a fire to recover health, flame and one vial.' },
        { key: 'item_drawing', title: 'Eli’s drawing', owned: run.hasDrawing, status: run.hasDrawing ? '1 / 1  ·  CLUE' : 'NOT FOUND',
          detail: 'The tower, two brothers and a promise.\nEli led the children from the playground to the clock tower shelter.' },
      ];
      this.cards = items.map((item, i) => {
        const x = 280 + i * 180;
        const card = panel(this, x, 280, 172, 200, { depth: 1, fixed: false, alpha: .8 });
        this.add.image(x, 254, item.key).setDisplaySize(65, 78).setDepth(2).setAlpha(item.owned ? 1 : .22);
        menuText(this, x, 318, item.title, 15, item.owned ? '#e7d8b9' : '#8f8d99').setWordWrapWidth(160).setDepth(2);
        menuText(this, x, 354, item.status, 11, item.owned ? '#d9b675' : '#858392').setDepth(2);
        const hit = this.add.zone(x, 280, 172, 200).setDepth(3).setInteractive({ useHandCursor: true });
        hit.on('pointerover', () => this.select(i)).on('pointerdown', () => this.select(i));
        return { card, item };
      });
      this.selection = this.add.rectangle(280, 280, 172, 200).setStrokeStyle(2, 0xd7b778).setFillStyle(0, 0).setDepth(4);
      this.itemHeading = menuText(this, 640, 416, '', 22, UI.gold).setFontFamily(UI.title);
      this.itemDetail = menuText(this, 640, 462, '', 16);
      this.select = (i) => {
        this.selected = (i + items.length) % items.length;
        this.selection.x = 280 + this.selected * 180;
        this.itemHeading.setText(items[this.selected].title);
        this.itemDetail.setText(items[this.selected].detail);
      };
      this.select(0);
      text(525, `HEALTH  ${run.health} / 3       FLAME  ${run.flame} / 100       OIL  ${run.oil} / 1`, 15).setColor('#aeb4bd');
      text(557, 'Quest items stay with you. Time and danger are paused.', 13).setColor('#9496a1');
      this.button(603, 'I / Esc  —  Return', () => this.resume());
      this.input.keyboard.on('keydown-LEFT', () => this.select(this.selected - 1));
      this.input.keyboard.on('keydown-RIGHT', () => this.select(this.selected + 1));
      this.input.keyboard.on('keydown-ESC', () => this.resume());
      this.input.keyboard.on('keydown-I', () => this.resume());
      return;
    }
    text(161, 'THE EMBERS WAIT', 36).setFontFamily(UI.title).setColor(UI.gold);
    text(211, 'The world is still. Take a breath.', 18).setColor('#a4a6b3');
    this.button(287, 'Esc  —  Resume', () => this.resume());
    this.muteText = this.button(348, '', () => this.mute());
    this.updateMute();
    this.button(409, 'R  —  Begin again', () => this.restart());
    text(535, 'A/D move · Space jump · W/S climb · E interact\nF sweep · Q oil · I satchel · M map · J journal\nHold R at a fire: rest · Enter: advance captions', 17);
    this.input.keyboard.on('keydown-ESC', () => this.resume());
    this.input.keyboard.on('keydown-M', () => this.mute());
    this.input.keyboard.on('keydown-R', event => { if (!event.repeat) this.restart(); });
    this.source = source;
  }
  explorationView(source, text) {
    const run = source.run, goal = source.getGoal();
    text(104, this.map ? 'THE ROAD WE REMEMBER' : 'ROWAN’S JOURNAL', 31).setFontFamily(UI.title).setColor(UI.gold);
    text(153, goal.text, 17).setWordWrapWidth(930);
    if (this.map) {
      const current = source.scene.key === 'World' ? regionAt(source.player.x).id : 'home';
      const target = goal.scene === 'World' ? regionAt(goal.x).id : 'home';
      for (const [row, regions] of [REGIONS.slice(0, 5), REGIONS.slice(5, 8), REGIONS.slice(8)].entries()) {
        const y = 254 + row * 113;
        menuText(this, 640, y - 53, ['PROLOGUE / ACT 1 — THE RUINED VILLAGE', 'ACT 2 — THE PLAYGROUND', 'ACT 3 — THE CLOCK TOWER'][row], 12, '#bda882');
        regions.forEach((r, i) => {
          const w = row ? 242 : 170, x = row ? 360 + i * 280 : 280 + i * 180;
          this.add.rectangle(x, y, w, 76, run.maxXReached >= r.x ? 0x282e3c : 0x171b26).setStrokeStyle(target === r.id ? 2 : 1, target === r.id ? 0xf3cc87 : 0x55515b);
          menuText(this, x, y - 9, r.name, 15, run.maxXReached >= r.x ? '#ded5c5' : '#83828d');
          if (current === r.id) {
            const dotX = x - w / 2 + 12 + (source.player.x - r.x) / r.width * (w - 24);
            this.add.circle(dotX, y + 20, 5, 0x8fced8);
          }
        });
      }
      text(553, `${current === 'home' ? 'You are inside the family home.  ' : ''}${target === 'home' ? 'Objective: family hearth.  ' : ''}Blue: you   ·   Gold frame: objective   ·   Roads can be revisited`, 14).setColor('#b3b8c3');
    } else {
      const entries = [
        ['home-first-memory', 'The lantern wakes old fires. Their memories restore daylight and safe paths.'],
        ['mara-freed', 'Mara was trapped in her stall. Eli came back for the little ones and took them toward the bridge.'],
        ['five-hand-defeated', 'Five-Hand hid its heart under the lantern card. I found it. The market road is open.'],
        ['refuge-reunion', 'Nia: Eli sent the children down the old road when the bell rang. He didn’t come.'],
        ['refuge-hearth', 'Mara spent her hearth’s ember to bring Tomas back from a frozen moment. Their house no longer remembers.'],
        ['act-2', 'Eli went to the playground. The swing crossing returns in remembered time.'],
        ['drawing-found', 'Eli led the children to the clock tower. His drawing and his ember cup were in the treehouse.'],
        ['eli-found', 'Eli answered three knocks. He is alive, trapped at the tower window. An ember from home can bring him back.'],
        ['old-road-open', 'I released the Old Road from the tower side. It runs to the Bridge Refuge.'],
        ['hearth-spent', 'I took our hearth’s last memory. Its ember can bring Eli into the present.'],
        ['sluice-open', 'The canal crossing is secured. The tower’s bells hold back the corruption.'],
        ['act-3', 'Three bells will break the guardian’s wards. Then I can reach Eli.'],
        ['rescue', 'The daylight faded. Eli stayed.'],
        ['view-platform', 'We stood at the tower arches. You can see our house from up there.'],
        ['nia-eli', 'Nia saw Eli at the refuge. The children he saved are safe.'],
        ['home-together', 'I came this time. No more later.'],
      ].filter(([id]) => run.completedStory[id]);
      if (!entries.length) entries.push(['start', 'Find Grandfather’s lantern in the cellar. E interacts; W/S climbs.']);
      entries.slice(-6).forEach(([, line], i) => menuText(this, 640, 224 + i * 53, line, 17).setWordWrapWidth(920));
      text(553, 'E remembers · F sweeps · Q refills · R rests · I inspects inventory', 14).setColor('#a5adbb');
    }
    this.button(604, 'Esc / M / J  —  Return', () => this.resume());
  }
  button(y, label, action) {
    const t = menuText(this, 640, y, label, 21, UI.gold).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#fff0c6')).on('pointerout', () => t.setColor(UI.gold)).on('pointerdown', action); return t;
  }
  updateMute() { this.muteText.setText(`[ M ]  Sound: ${this.registry.get('muted') ? 'off' : 'on'}`); }
  mute() { this.scene.get(this.owner).audio.toggleMute(); this.updateMute(); }
  resume() {
    const source = this.scene.get(this.owner);
    source.requireRelease = true; source.audio.resume(); source.events.emit('game:resumed', {});
    this.scene.resume(this.owner); this.scene.stop();
  }
  restart() {
    this.scene.get(this.owner).audio.resume();
    newSession(this); this.scene.stop(this.owner); this.scene.start('Hearth', { spawnId: 'cellar' });
  }
}
