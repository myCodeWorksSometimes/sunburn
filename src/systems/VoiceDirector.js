// Bundled local synthetic reads. Manifest keys match authored subtitles exactly.
import {audioSettings} from './AudioCues.js';
export class VoiceDirector {
  constructor(scene){
    this.scene=scene;this.lines=scene.cache.json.get('voice-manifest')??{};
    const pause=()=>this.sound?.pause(),resume=()=>this.sound?.resume();
    scene.events.once('shutdown',()=>{this.stop();scene.events.off('pause',pause);scene.events.off('resume',resume);});
    scene.events.on('pause',pause);scene.events.on('resume',resume);
  }
  stop(){this.sound?.destroy();this.sound=null;}
  speak(line){
    this.stop();
    if(!line.speaker)return 0;
    const key=`${line.speaker}|${line.text}`,path=this.lines[key];
    if(!path)return 0;
    const id=`voice-${path.split('/').at(-1).replace('.ogg','')}`;
    const s=this.scene;
    if(!s.cache.audio.exists(id))return 0;
    const settings=s.audio?.settings??audioSettings();
    if(settings.muted)return 0;
    this.sound=s.audio?s.audio.playEffect(id,.8,true):s.sound.add(id,{volume:settings.effects*.8});
    if(!s.audio){this.sound.play();this.sound.once('complete',()=>this.stop());}
    return (this.sound?.duration??0)*1000;
  }
  memoryLaugh(){
    const s=this.scene;
    if(!s.cache.audio.exists('voice-eli-chuckle'))return;
    // The echo is often visible during Rowan's first line. A quiet, short laugh
    // remains audible underneath it instead of being silently discarded.
    if(s.time.now-(this.lastLaugh??-Infinity)<2500)return;
    this.lastLaugh=s.time.now;s.audio?.playEffect('voice-eli-chuckle',.28,true);
  }
}
