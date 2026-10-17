import Phaser from 'phaser';
import { panel, menuText, UI } from '../presentation/ui.js';
import { newSession } from '../world/WorldState.js';
import { REGIONS, regionAt, WORLD_WIDTH, FIVE_HAND, BRIDGE_WORKS, REFUGE } from '../world/layout.js';

export class Pause extends Phaser.Scene {
  constructor() { super('Pause'); }
  init(data) { this.owner = data.owner; this.inventory = !!data.inventory; this.map = !!data.map; this.journal = !!data.journal; }
  create() {
    const source = this.scene.get(this.owner);
    this.add.rectangle(640, 360, 1280, 720, 0x080c15, .88);
    panel(this, 640, 348, 1020, 590, { fixed: false, depth: 0 });
    const text = (y, label, size = 24) => menuText(this, 640, y, label, size);
    const tab = (x, title, data) => menuText(this,x,88,title,17,UI.gold).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.restart({owner:this.owner,...data}));
    tab(310,'I · Satchel',{inventory:true}); tab(510,'M · Map',{map:true}); tab(710,'J · Journal',{journal:true}); tab(910,'Pause',{});
    this.add.image(178,88,this.map?'kit-map':this.journal?'kit-journal':this.inventory?'kit-lantern':'kit-time').setDisplaySize(30,35);

    if (this.map || this.journal) {
      this.explorationView(source, text);
      for (const key of ['ESC', 'M', 'J']) this.input.keyboard.on(`keydown-${key}`, () => this.resume());
      return;
    }
    if (this.inventory) {
      const run = source.run;
      menuText(this,220,140,'Satchel',36).setOrigin(0,.5).setFontFamily(UI.title).setColor(UI.gold);

      const items = [
        { key: 'kit-lantern', title: 'Lantern & sword', owned: run.hasLantern, status: run.hasLantern ? (source.combat.weapon.drawn?'Lantern on ground':'Lantern carried') : 'Missing',
          detail: 'X · Draw sword / retrieve nearby lantern. F · Attack.\nSword: no flame cost. Lantern must stay on the ground.' },
        { key: 'kit-cup', title: 'Ember cup', owned: run.hasEmberCup, status: run.hasEmberCup ? 'Carried' : 'Missing',
          detail: 'Carries a memory ember safely.\nFound in the playground treehouse.' },
        { key: 'kit-flame', title: 'Hearth ember', owned: run.hasHearthEmber, status: run.hasHearthEmber ? 'Protected' : run.rescuedEli ? 'Given to Eli' : 'Missing',
          detail: run.rescuedEli ? 'The warmth has found its way home. Eli remains in the present.' : 'Brings Eli back into the present.\nProtected: combat never consumes this ember.' },
        { key: 'kit-oil', title: 'Lamp oil', owned: run.oil > 0, status: `${run.oil} / 1`,
          detail: 'Q · Restore 35 flame. A full lantern keeps the oil.\nHold R at a fire to refill supplies.' },
        { key: 'kit-journal', title: 'Eli’s drawing', owned: run.hasDrawing, status: run.hasDrawing ? 'Carried' : 'Missing',
          detail: 'Eli’s route leads from the playground to the tower.' },
      ];
      this.cards = items.map((item, i) => {
        const x = 280 + i * 180;
        const card = panel(this, x, 280, 172, 200, { depth: 1, fixed: false, alpha: .8 });
        this.add.image(x, 254, item.key).setDisplaySize(65, 78).setDepth(2).setAlpha(item.owned ? 1 : .22);
        menuText(this, x, 318, item.title, 17, item.owned ? '#e7d8b9' : '#8f8d99').setWordWrapWidth(145).setDepth(2);
        menuText(this, x, 354, item.status, 14, item.owned ? '#d9b675' : '#858392').setDepth(2);
        const hit = this.add.zone(x, 280, 172, 200).setDepth(3).setInteractive({ useHandCursor: true });
        hit.on('pointerover', () => this.select(i)).on('pointerdown', () => this.select(i));
        return { card, item };
      });
      this.selection = this.add.rectangle(280, 280, 172, 200).setStrokeStyle(2, 0xd7b778).setFillStyle(0, 0).setDepth(4);
      this.itemHeading = menuText(this, 225, 422, '', 26, UI.gold).setFontFamily(UI.title).setOrigin(0,.5);
      this.itemDetail = menuText(this,225,474,'',20).setOrigin(0,.5).setAlign('left').setWordWrapWidth(820);
      this.select = (i) => {
        this.selected = (i + items.length) % items.length;
        this.selection.x = 280 + this.selected * 180;
        this.itemHeading.setText(items[this.selected].title);
        this.itemDetail.setText(items[this.selected].detail);
      };
      this.select(0);

      menuText(this,1060,562,'← → Select',15,'#aaa294').setOrigin(1,.5);
      this.button(603, 'Esc · Return', () => this.resume());
      this.input.keyboard.on('keydown-LEFT', () => this.select(this.selected - 1));
      this.input.keyboard.on('keydown-RIGHT', () => this.select(this.selected + 1));
      this.input.keyboard.on('keydown-ESC', () => this.resume());
      this.input.keyboard.on('keydown-I', () => this.resume());
      return;
    }
    menuText(this,220,140,'Paused',36).setOrigin(0,.5).setFontFamily(UI.title).setColor(UI.gold);

    this.button(242, 'Esc · Resume', () => this.resume());
    this.muteText = this.button(292, '', () => this.mute());
    this.updateMute();
    this.volumeLabels={};
    for(const [channel,y] of [['music',347],['effects',397]]) {
      menuText(this,470,y,channel==='music'?'Music':'Sound effects',19,'#bdb1a0');
      this.volumeLabels[channel]=menuText(this,700,y,'',18,UI.gold);
      for(const [x,amount,label] of [[620,-.1,'−'],[780,.1,'+']]) menuText(this,x,y,label,27,UI.gold).setInteractive({useHandCursor:true}).on('pointerdown',()=>{source.audio.setVolume(channel,source.audio.settings[channel]+amount);this.updateVolumes(source);});
    }
    this.updateVolumes(source);
    this.button(456, 'R · New adventure', () => this.restart());
    this.button(540,'C · Controls',()=>this.showControls());
    this.input.keyboard.on('keydown-C',()=>this.showControls());
    this.input.keyboard.on('keydown-ESC', () => this.resume());
    this.input.keyboard.on('keydown-M', () => this.mute());
    this.input.keyboard.on('keydown-R', event => { if (!event.repeat) this.restart(); });
    this.source = source;
  }
  explorationView(source, text) {
    const run = source.run, goal = source.getGoal();
    menuText(this,220,140,this.map?'Map':'Journal',36).setOrigin(0,.5).setFontFamily(UI.title).setColor(UI.gold);
    text(190, goal.text.replace(/^Act \d: /,''),20).setWordWrapWidth(930);
    if (this.map) {
      const current = source.scene.key === 'World' ? regionAt(source.player.x).id : 'home';
      const target = goal.scene === 'World' ? regionAt(goal.x).id : 'home';
      const scaleX=x=>225+x/WORLD_WIDTH*840;
      // A continuous road, rather than unrelated level cards. Home has its own branch.
      const road=this.add.graphics().lineStyle(3,0x7a6549);
      road.lineBetween(225,332,1065,332);
      for(const r of REGIONS) {
        const x=scaleX(r.x),w=r.width/WORLD_WIDTH*840,seen=run.maxXReached>=r.x;
        this.add.rectangle(x+w/2,332,w-3,54,seen?0x302c28:0x151923).setStrokeStyle(target===r.id?2:1,target===r.id?0xf3cc87:0x655640);
        const names={yard:'Garden',lane:'Lane',square:'Market',bridge:'Refuge\nFoundry',camp:'Fire',swings:'Swings',treehouse:'Treehouse',canal:'Canal','tower-court':'Tower\ncourt','tower-base':'Bell\nworks','tower-crown':'Tower\ncrown'};
        const label=menuText(this,x+w/2,332,names[r.id],16,seen?'#e0cba4':'#85808a').setLineSpacing(3);
        if(label.width>w-8)label.setFontSize(Math.max(10,Math.floor(16*(w-8)/label.width)));
      }
      for(const [a,b,label] of [[0,8800,'PROLOGUE / ACT 1'],[8800,13600,'ACT 2'],[13600,WORLD_WIDTH,'ACT 3']]) menuText(this,scaleX((a+b)/2),238,label,15,UI.gold);
      const px=current==='home'?185:scaleX(source.player.x),py=current==='home'?440:382;
      this.add.image(px,py,'kit-lantern').setDisplaySize(20,26);menuText(this,px,py+26,'You',14,'#9bd3db');
        if(source.combat.weapon.drop&&current!=='home'){
          const lx=scaleX(source.combat.weapon.drop.x);this.add.image(lx,416,'kit-lantern').setDisplaySize(18,23);menuText(this,lx,440,'Lantern',13,UI.gold);
        }
      road.lineBetween(225,332,185,440);menuText(this,185,483,'Home',16,UI.gold);
      this.add.image(185,440,'kit-door').setDisplaySize(31,38);
      if(target==='home')this.add.circle(185,440,26).setStrokeStyle(2,0xf3cc87).setFillStyle(0,0);
      else {const gx=scaleX(goal.x);this.add.triangle(gx,285,-6,-8,6,-8,0,5,0xf3cc87);}
      for(const [x,label] of [[FIVE_HAND.body,'Five-Hand'],[BRIDGE_WORKS.elite,'Braced Shadow'],[REFUGE.hearth,'Refuge']]) {
        const gx=scaleX(x);road.lineBetween(gx,360,gx,432);menuText(this,gx+(label==='Braced Shadow'?55:label==='Refuge'?15:-50),label==='Refuge'?485:448,label,14,'#b29e88');
      }
      if(run.shortcutOpen) {road.lineBetween(185,440,scaleX(3410),440);menuText(this,320,482,'Cellar passage open',11,'#b3c39d');}
      if(run.oldRoadOpen) {road.lineBetween(scaleX(REFUGE.oldRoad),515,scaleX(13880),515);menuText(this,780,537,'OLD ROAD · refuge ↔ tower',12,'#b3c39d');}

    } else {
      const entries = [
        ['home-first-memory', 'The lantern wakes old fires. Their memories restore daylight and safe paths.'],
          ['mara-freed', 'Mara died at the stall. Her memory says Eli led Tomas and Nia to the bridge.'],
        ['five-hand-defeated', 'Five-Hand hid its heart under the lantern card. I found it. The market road is open.'],
        ['braced-defeated', 'The braced shadow broke itself on the barrier. The bridge works are open.'],
        ['bridge-brake', 'Gears aligned and the brake set. The bridge fire can hold the deck now.'],
          ['refuge-reunion', 'Tomas and Nia are tethered to their fire. Secure the bridge, then guide them with the lantern.'],
          ['refugees-rescued', 'I led them across myself. They remain alive when the memory fades.'],
        ['refuge-hearth', 'Mara is a dead record. Tomas and Nia are still tethered to the crossing; my lantern can guide them across the secured bridge.'],
        ['act-2', 'Eli went to the playground. The swing crossing returns in remembered time.'],
        ['drawing-found', 'Eli led the children to the clock tower. His drawing and his ember cup were in the treehouse.'],
        ['eli-found', 'Eli answered three knocks. He is alive, trapped at the tower window. An ember from home can bring him back.'],
        ['old-road-open', 'I released the Old Road from the tower side. It runs to the Bridge Refuge.'],
        ['hearth-spent', 'I took our hearth’s last memory. Its ember can bring Eli into the present.'],
        ['sluice-open', 'The canal crossing is secured. The tower’s bells hold back the corruption.'],
        ['act-3', 'Three bells will break the guardian’s wards. Then I can reach Eli.'],
        ['rescue', 'The daylight faded. Eli stayed.'],
        ['view-platform', 'We stood at the tower arches. You can see our house from up there.'],
        ['nia-eli', run.refugeesRescued?'Tomas and Nia made it across. Eli is with me. We are going home.':'The refuge remains a memory. Eli is with me. We are going home.'],
        ['home-together', 'I came this time. No more later.'],
      ].filter(([id]) => run.completedStory[id]);
      if (!entries.length) entries.push(['start', 'Find Grandfather’s lantern in the cellar. E interacts; W/S climbs.']);
      const pages=Math.ceil(entries.length/5);this.journalPage=pages-1;
      const lines=Array.from({length:5},(_,i)=>menuText(this,640,258+i*54,'',20).setWordWrapWidth(830).setOrigin(0,.5).setAlign('left'));
      const count=menuText(this,640,516,'',13,UI.gold);
      const show=()=>{lines.forEach((line,i)=>line.setText(entries[this.journalPage*5+i]?.[1]??''));count.setText(`${this.journalPage+1} / ${pages}`);};
      const turn=dir=>{this.journalPage=(this.journalPage+dir+pages)%pages;show();};
      menuText(this,420,516,'← Earlier',15,UI.gold).setInteractive({useHandCursor:true}).on('pointerdown',()=>turn(-1));
      menuText(this,860,516,'Later →',15,UI.gold).setInteractive({useHandCursor:true}).on('pointerdown',()=>turn(1));
      this.input.keyboard.on('keydown-LEFT',()=>turn(-1));this.input.keyboard.on('keydown-RIGHT',()=>turn(1));show();

    }
    this.button(604, 'Esc · Return', () => this.resume());
  }
  button(y, label, action) {
    const t = menuText(this, 640, y, label, 21, UI.gold).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#fff0c6')).on('pointerout', () => t.setColor(UI.gold)).on('pointerdown', action); return t;
  }
  showControls() {
    if(this.controlPanel?.active)return;
    const box=this.add.container(0,0).setDepth(20);
    box.add(this.add.rectangle(640,360,1280,720,0x080b12,.85).setInteractive());
    box.add(panel(this,640,350,760,460,{depth:0,fixed:false}));
    box.add(menuText(this,640,170,'Controls',32,UI.gold).setFontFamily(UI.title));
    const rows=[['A / D','Move'],['Space','Jump'],['W / S','Climb'],['E','Interact / remember'],['F / X','Attack / draw sword'],['Q','Use oil'],['Hold R','Rest at a fire'],['I / M / J','Satchel / map / journal']];
    rows.forEach(([key,label],i)=>{const x=i<4?340:680,y=240+(i%4)*58;box.add(menuText(this,x,y,key,18,UI.gold).setOrigin(0,.5));box.add(menuText(this,x+100,y,label,18).setOrigin(0,.5));});
    box.add(menuText(this,640,526,'Close',20,UI.gold).setInteractive({useHandCursor:true}).on('pointerdown',()=>box.destroy(true)));
    this.controlPanel=box;
  }
  updateVolumes(source) { for(const channel of ['music','effects']) this.volumeLabels[channel].setText(`${Math.round(source.audio.settings[channel]*100)}%`); }
  updateMute() { this.muteText.setText(`M · Sound ${this.scene.get(this.owner).audio.muted ? 'off' : 'on'}`); }
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
