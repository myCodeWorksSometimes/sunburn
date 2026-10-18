import { panel, menuText, UI } from './ui.js';
export function bossHud(s,name) {
  const bg=panel(s,640,183,390,76,{depth:120});
  const title=menuText(s,640,163,name,18,UI.gold).setDepth(121);
  const rail=s.add.rectangle(640,180,330,6,0x312838).setDepth(121);
  const fill=s.add.rectangle(475,180,330,6,0xa878ba).setOrigin(0,.5).setDepth(122);
  const status=menuText(s,640,203,'',14,'#c1b5c7').setDepth(122);
  for(const o of[bg,title,rail,fill,status])o.setVisible(false);
  const api={visible:false,update(visible,hp,max,line){
    api.visible=visible;
    if(visible)s.activeBossHud=api;else if(s.activeBossHud===api)s.activeBossHud=null;
    for(const o of[bg,title,rail,fill,status])o.setVisible(visible);
    fill.width=330*Math.max(0,hp/max);status.setText(line);
  }};
  return api;
}
