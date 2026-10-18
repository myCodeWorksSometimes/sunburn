// A doorway is a depth transition, not a raised platform. Walk to its threshold
// and disappear inside the aperture before changing scenes. Scene-owned tweens
// are discarded on shutdown, including a testing jump during this transition.
export function enterPassage(s,{x,threshold=540},destination,spawnId){
  if(s.leaving||s.dead)return false;
  if(s.combat.weapon.drawn){s.notice('Retrieve your lantern before entering the passage.');return false;}
  const p=s.player;s.leaving=true;s.cancelRest(true);p.cancelAction();p.stopClimb();
  p.frozen=true;p.setVelocity(0);p.body.enable=false;
  p.setFlipX(x<p.x);p.play('hero-walk');s.captions.clear();
  s.contactShadow.setVisible(false);
  s.tweens.add({targets:p,x,y:threshold,duration:650,ease:'Sine.inOut',onComplete:()=>{
    s.tweens.add({targets:p,alpha:0,duration:200,onComplete:()=>{s.leaving=false;s.goTo(destination,spawnId);}});
  }});
  return true;
}
