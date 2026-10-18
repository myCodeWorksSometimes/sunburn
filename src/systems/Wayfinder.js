import Phaser from 'phaser';
import {navigationHint} from '../world/NavigationHints.js';
import {FONT} from './Captions.js';
import {panel} from '../presentation/ui.js';

export class Wayfinder{
  constructor(scene){
    this.scene=scene;this.stalled=0;this.forced=0;this.lastKey='';this.best=Infinity;
    this.marker=scene.add.graphics().setDepth(33);
    this.frame=panel(scene,820,214,710,50,{depth:112,alpha:.92}).setVisible(false);
    this.text=scene.add.text(820,214,'',{fontFamily:FONT,fontSize:'16px',color:'#ecd1a0',align:'center',lineSpacing:2,wordWrap:{width:655}}).setOrigin(.5).setScrollFactor(0).setDepth(113).setVisible(false);
  }
  update(delta){
    const s=this.scene,p=s.player;this.marker.clear();
    if(Phaser.Input.Keyboard.JustDown(s.keys.help))this.forced=8500;
    this.forced=Math.max(0,this.forced-delta);
    const hint=navigationHint({run:s.run,x:p.x,feet:p.feet,memory:s.memory.usable?s.memory.fire?.regionId:null,weapon:s.combat.weapon,swingX:s.swingPlatform.zone.x});
    const id=`${hint.y}/${hint.text}`,distance=Math.hypot(hint.x-p.x,hint.y-p.feet);
    if(id!==this.lastKey){this.lastKey=id;this.best=distance;this.stalled=0;}
    // A few pixels of back-and-forth do not hide help. Genuine forward progress does.
    if(distance<this.best-55){this.best=distance;this.stalled=0;}else this.stalled+=delta;
    const visible=(this.stalled>8000||this.forced>0)&&!s.cinematic.active&&!s.dead&&!s.captions.busy&&!s.activeBossHud?.visible;
    this.frame.setVisible(visible);this.text.setVisible(visible);
    if(!visible)return;
    this.text.setText(`${hint.text}  ·  H: help`);
    this.frame.resizePanel(710,Math.max(48,this.text.height+24));
    const cam=s.cameras.main,screenX=hint.x-cam.scrollX;
    const x=Phaser.Math.Clamp(screenX,45,1235)+cam.scrollX;
    const y=Phaser.Math.Clamp(hint.y-35,290,525),pulse=.65+.25*Math.sin(s.time.now/210);
    this.marker.lineStyle(2,0xf7ce85,pulse).strokeCircle(x,y,13);
    if(screenX<45||screenX>1235){const d=screenX<45?-1:1;this.marker.fillStyle(0xf7ce85,pulse).fillTriangle(x+d*8,y,x-d*4,y-6,x-d*4,y+6);}
    else this.marker.lineStyle(3,0xf7ce85,pulse).lineBetween(x-6,y-3,x,y+4).lineBetween(x,y+4,x+6,y-3);
  }
}
