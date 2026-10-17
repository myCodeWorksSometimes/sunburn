import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { AudioCues } from '../src/systems/AudioCues.js';

class Sound extends EventEmitter {
  constructor(key,config){super();this.key=key;this.volume=config.volume;this.isPlaying=false;this.isPaused=false;this.destroyed=false;}
  setMute(mute){this.mute=mute;return this;}
  setVolume(volume){this.volume=volume;return this;}
  play(){this.isPlaying=true;return true;}
  pause(){if(this.isPlaying){this.isPlaying=false;this.isPaused=true;}return this;}
  resume(){if(this.isPaused){this.isPlaying=true;this.isPaused=false;}return this;}
  destroy(){this.isPlaying=false;this.destroyed=true;this.emit('destroy');}
}
function setup(){
  const sounds=[],scene={time:{now:1000},events:new EventEmitter(),sound:{add(key,config){const sound=new Sound(key,config);sounds.push(sound);return sound;}}};
  return {scene,sounds,audio:new AudioCues(scene)};
}

test('active creature clips pause/resume and mute immediately with the loops',()=>{
  const {audio,sounds}=setup();audio.unlock();audio.cue('monster-roar');const voice=sounds.at(-1);
  assert.equal(voice.isPlaying,true);
  audio.pause();assert.equal(voice.isPaused,true);assert.equal(audio.music.isPaused,true);
  assert.equal(audio.bossbed.isPaused,true);
  audio.toggleMute();assert.equal(voice.mute,true);assert.equal(audio.music.mute,true);
  assert.equal(audio.bossbed.mute,true);
  audio.resume();assert.equal(voice.isPlaying,true);assert.equal(voice.mute,true);
  audio.toggleMute();assert.equal(voice.mute,false);
});

test('effects volume changes apply to already-playing clips without restarting',()=>{
  const {audio,sounds}=setup();audio.cue('monster-roar');const voice=sounds.at(-1);
  audio.setVolume('effects',.2);assert.equal(voice.volume,.65*.2);assert.equal(voice.isPlaying,true);
  audio.setVolume('effects',2);assert.equal(voice.volume,.65);
  audio.setVolume('effects',-2);assert.equal(voice.volume,0);
});

test('completed clips and scene shutdown release all owned sound instances',()=>{
  const {audio,sounds,scene}=setup();audio.cue('monster-roar');const voice=sounds.at(-1);
  voice.emit('complete');assert.equal(audio.effects.size,0);assert.equal(voice.destroyed,true);
  scene.time.now+=200;audio.cue('sweep');const sweep=sounds.at(-1);
  scene.events.emit('shutdown');
  assert.equal(audio.effects.size,0);assert.equal(sweep.destroyed,true);
  assert.equal(audio.music.destroyed,true);assert.equal(audio.fire.destroyed,true);
});
