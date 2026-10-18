// One authored eight-second farewell, independent of frame rate.
export const ECHO_FAREWELL_MS = 8000;
export function echoStage(ms) {
  if(ms<1800)return {frame:0,next:1,mix:ms/1800,ash:0};
  if(ms<3400)return {frame:1,next:2,mix:(ms-1800)/1600,ash:0};
  if(ms<4700)return {frame:2,next:2,mix:0,ash:0}; // let the recognition land
  if(ms<5800)return {frame:2,next:3,mix:(ms-4700)/1100,ash:0};
  if(ms<6800)return {frame:3,next:4,mix:(ms-5800)/1000,ash:(ms-5800)/2200};
  return {frame:4,next:5,mix:Math.min(1,(ms-6800)/1200),ash:Math.min(1,(ms-5800)/2200)};
}

export function makeEchoDissolution(scene,npc) {
  const row={mara:0,tomas:1,nia:2}[npc.who]*6,x=npc.x,y=npc.baseY;
  const layers=[0,1].map(()=>scene.add.sprite(x,y,'echo-motion',row).setOrigin(.5,1).setDisplaySize(96*npc.visibleHeight/112,npc.visibleHeight).setDepth(23));
  // Fixed seeds keep individual ash flecks continuous and make pause exact.
  const flakes=Array.from({length:42},(_,i)=>({
    sprite:scene.add.rectangle(x,y,3+i%3,2+i%2, i%2?0xd1c9b9:0x928b96).setDepth(26).setVisible(false),
    delay:i%7*130,ox:((i*37)%53)-26,oy:12+(i*19)%78,
  }));
  return {
    update(ms){
      const st=echoStage(ms);
      layers[0].setFrame(row+st.frame).setAlpha(1-st.mix);
      layers[1].setFrame(row+st.next).setAlpha(st.mix);
      for(const f of flakes){
        const t=Math.max(0,ms-5800-f.delay)/1000;
        f.sprite.setVisible(t>0).setPosition(x+f.ox+100*t+55*t*t,y-f.oy-35*t+Math.sin(t*4+f.ox)*9)
          .setAlpha(Math.max(0,1-t/2.5)).setRotation(t*.4);
      }
    },
    destroy(){for(const layer of layers)layer.destroy();for(const f of flakes)f.sprite.destroy();},
  };
}
