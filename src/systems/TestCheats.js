import {CheatBuffer,testRunFor} from '../world/TestRoutes.js';
import {WorldState,readSave,SAVE_KEY} from '../world/WorldState.js';

// Recognize a typed code in any game screen, including an already-open map.
// Once the distinctive prefix is entered, I/E/Q stop acting as game controls.
export function installTestCheats(game){
  if(game.testCheats)return;
  const buffer=new CheatBuffer();let paused=[],previousRun=null,expiry=null,candidate=null;
  const badge=document.createElement('div');badge.setAttribute('role','status');
  Object.assign(badge.style,{position:'fixed',bottom:'12px',left:'12px',padding:'8px 12px',background:'#11141ef5',border:'1px solid #b89a64',color:'#f0d4a3',fontFamily:'"Pixelify Sans", sans-serif',fontSize:'16px',zIndex:50,display:'none',pointerEvents:'none'});
  document.body.append(badge);
  const restoreCandidate=()=>{
    const active=game.registry.get('worldState');
    // A/F/Q overlap normal controls before the prefix becomes distinctive.
    // Restore the pre-typing run/save before switching to an isolated test run.
    if(active&&!active.testMode&&candidate){
      Object.assign(active,JSON.parse(candidate.run));
      try{candidate.save==null?localStorage.removeItem(SAVE_KEY):localStorage.setItem(SAVE_KEY,candidate.save);}catch{}
    }
    candidate=null;
  };
  const resume=()=>{restoreCandidate();for(const s of paused){s.combat?.cancel();s.scene.resume();s.audio?.resume();s.input.keyboard?.resetKeys();}paused=[];badge.style.display='none';};
  const jump=code=>{
    const active=game.registry.get('worldState');if(active&&!active.testMode)previousRun=active;
    restoreCandidate();
    let route;
    if(code==='afaqback'){
      const run=previousRun??readSave()??new WorldState();route={run,...run.checkpoint,name:'Normal adventure restored'};
    }else route=testRunFor(code);
    if(!route)return;
    for(const s of game.scene.getScenes(false))if(s.scene.isActive()||s.scene.isPaused())game.scene.stop(s.scene.key);
    paused=[];badge.style.display='none';game.registry.set('worldState',route.run);
    game.scene.start(route.scene,{spawnId:route.spawnId});
    game.events.emit('test:route',{code,scene:route.scene,spawnId:route.spawnId});
  };
  const keydown=event=>{
    if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target?.closest?.('input,textarea,[contenteditable="true"]'))return;
    const wasArmed=buffer.armed,code=buffer.feed(event.key,performance.now());
    if(buffer.value==='a'){
      const run=game.registry.get('worldState');
      let save=null;try{save=localStorage.getItem(SAVE_KEY);}catch{}
      candidate=run&&!run.testMode?{run:JSON.stringify(run),save}:null;
    }
    if(wasArmed||buffer.armed||code){event.preventDefault();event.stopImmediatePropagation();}
    if(buffer.armed&&!paused.length){
      paused=game.scene.getScenes(true).slice();
      for(const s of paused){s.input.keyboard?.resetKeys();s.audio?.pause();s.scene.pause();}
    }
    clearTimeout(expiry);
    if(code){jump(code);return;}
    if(!buffer.armed){if(paused.length)resume();else if(!buffer.value)candidate=null;return;}
    badge.textContent=`Test code: ${buffer.value}   ·   Esc cancels`;badge.style.display='block';
    expiry=setTimeout(()=>{buffer.reset();resume();},2500);
  };
  const keyup=event=>{if(buffer.armed){event.preventDefault();event.stopImmediatePropagation();}};
  window.addEventListener('keydown',keydown,true);window.addEventListener('keyup',keyup,true);
  game.testCheats={jump};
  game.events.once('destroy',()=>{clearTimeout(expiry);window.removeEventListener('keydown',keydown,true);window.removeEventListener('keyup',keyup,true);badge.remove();});
}
