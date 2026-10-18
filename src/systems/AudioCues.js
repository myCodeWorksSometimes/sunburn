// Bundled CC0 recordings/composition. Provenance: public/audio/LICENSES.md.
const SETTINGS = 'embers-audio-v1';
import {BOSS_PROFILES,BOSS_GAIN,BOSS_COOLDOWN} from './BossAudio.js';
export function audioSettings() {
  try { return { music: .32, effects: .65, muted: false, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; }
  catch { return { music: .32, effects: .65, muted: false }; }
}
export class AudioCues {
  constructor(scene) {
    this.scene = scene; this.settings = audioSettings(); this.paused = false; this.stepClock = 0; this.lastCue = new Map();
    this.effects = new Map();
    this.bossVoices=new Map();
    this.music = scene.sound.add('audio-score', { loop: true, volume: 0 });
    this.fire = scene.sound.add('audio-fire', { loop: true, volume: 0 });
    this.bossbed=scene.sound.add('audio-bossbed',{loop:true,volume:0});
    this.bossScores=new Map(BOSS_PROFILES.map(p=>[p,scene.sound.add(`audio-${p}-score`,{loop:true,volume:0})]));
    this.scoreLevels=new Map(BOSS_PROFILES.map(p=>[p,0]));
    this.applySettings();
    scene.events.once('shutdown', () => this.destroy());
  }
  get muted() { return this.settings.muted; }
  unlock() {
    this.scene.sound.unlock?.();
    this.scene.sound.context?.resume?.();
    if (!this.music.isPlaying && !this.paused) this.music.play();
    if (!this.fire.isPlaying && !this.paused) this.fire.play();
    if (!this.bossbed.isPlaying && !this.paused) this.bossbed.play();
    for(const sound of this.bossScores.values())if(!sound.isPlaying&&!this.paused)sound.play();
  }
  bossCue(profile,event) {
    if(this.muted||this.paused||!BOSS_PROFILES.includes(profile)||!(event in BOSS_GAIN))return;
    const id=`${profile}-${event}`,now=this.scene.time.now;
    if(now-(this.lastCue.get(id)??-Infinity)<BOSS_COOLDOWN[event])return;
    const previous=this.bossVoices.get(profile);
    if(event==='idle'&&previous?.isPlaying)return;
    previous?.destroy();
    this.lastCue.set(id,now);const sound=this.playEffect(id,BOSS_GAIN[event]);
    if(sound){this.bossVoices.set(profile,sound);sound.once('destroy',()=>{if(this.bossVoices.get(profile)===sound)this.bossVoices.delete(profile);});}
  }
  cue(id) {
    if (this.muted || this.paused) return;
    const cues = {
      ignite: ['fire', .7], warning: ['knock', .3], notice: ['monster-hit', .27], knock: ['knock', .7],
      take: ['take', .6], death: ['monster-death', .7], rescue: ['take', .8],
      'boss-intro': ['monster-roar', .8], 'monster-roar': ['monster-roar', .65],
      'monster-hit': ['monster-hit', .65], 'monster-death': ['monster-death', .75],
      impact: ['impact', .8], sweep: ['sweep', .65], door: ['door', .65],
      stalk:['stalk',.48],snarl:['snarl',.65],lunge:['lunge',.75],summon:['summon',.75],
      blade:['blade',.55],machinery:['machinery',.5],'memory-surge':['memory-surge',.42],'memory-break':['memory-break',.4],
      'rowan-hurt':['rowan-hurt',.7],
    };
    const [key, volume] = cues[id] || ['impact', .3];
    const now = this.scene.time.now;
    if (now - (this.lastCue.get(id) ?? -Infinity) < 160) return;
    this.lastCue.set(id, now);
    this.playEffect(key,volume);
  }
  playEffect(key, volume, absoluteKey=false) {
    if(this.muted || this.paused)return;
    const sound=this.scene.sound.add(absoluteKey?key:`audio-${key}`,{volume:volume*this.settings.effects});
    this.effects.set(sound,volume);
    sound.once('complete',()=>sound.destroy());
    sound.once('destroy',()=>this.effects.delete(sound));
    sound.play();
    return sound;
  }
  update(delta) {
    if (this.paused) return;
    const { scene, settings } = this;
    const boss=scene.enemies?.find(e=>e.alive&&e.restorationImmune&&!e.dormant&&Math.abs(e.x-scene.player.x)<1000&&e.state!=='waiting');
    const profile=boss?.id==='five-hand'?'fivehand':boss?.id==='braced-shadow'?'braced':boss?.id==='bell-warden'?'warden':null;
    const danger = !!profile;
    // Smooth tension transitions instead of a cheerful melody or abrupt cut.
    this.tension=(this.tension??0)+((danger?1:0)-(this.tension??0))*Math.min(1,delta/900);
    this.music.setVolume(settings.muted ? 0 : settings.music * .7*(1-this.tension*.85)*(scene.memory?.usable ? .45 : 1));
    this.bossbed.setVolume(settings.muted?0:settings.music*this.tension*.15);
    for(const [p,sound]of this.bossScores){
      const level=this.scoreLevels.get(p)+((p===profile?1:0)-this.scoreLevels.get(p))*Math.min(1,delta/1200);
      this.scoreLevels.set(p,level);sound.setVolume(settings.muted?0:settings.music*level*.85);
    }
    if(boss&&['idle','observe','select','recovery','recover'].includes(boss.state))this.bossCue(profile,'idle');
    const proximity = Math.max(0, ...scene.fires.filter(f => f.lit).map(f => 1 - Math.hypot(scene.player.x - f.x, scene.player.feet - f.floor) / 500));
    this.fire.setVolume(settings.muted ? 0 : proximity * settings.effects * .55);
    this.stepClock += delta;
    const p = scene.player;
    if (!settings.muted && !p.frozen && p.body.blocked.down && Math.abs(p.body.velocity.x) > 30 && this.stepClock > 310) {
      this.stepClock = 0;
      this.playEffect(scene.scene.key === 'Hearth' ? 'step-wood' : 'step-stone', .25);
    }
  }
  applySettings() {
    this.music.setMute(this.muted);this.fire.setMute(this.muted);this.bossbed.setMute(this.muted);
    for(const sound of this.bossScores.values())sound.setMute(this.muted);
    for(const [sound,gain] of this.effects)sound.setMute(this.muted).setVolume(gain*this.settings.effects);
  }
  pause() { this.paused = true; this.music.pause(); this.fire.pause();this.bossbed.pause();for(const sound of this.bossScores.values())sound.pause();for(const sound of this.effects.keys())sound.pause(); }
  resume() { this.paused = false; this.music.resume(); this.fire.resume();this.bossbed.resume();for(const sound of this.bossScores.values())sound.resume();for(const sound of this.effects.keys())sound.resume(); this.unlock(); }
  save() { try { localStorage.setItem(SETTINGS, JSON.stringify(this.settings)); } catch { /* Private storage may be unavailable. */ } }
  toggleMute() { this.settings.muted = !this.muted; this.applySettings(); this.save(); }
  setVolume(channel, value) {
    if (channel === 'music' || channel === 'effects') {
      this.settings[channel] = Math.max(0, Math.min(1, value));
      if(channel==='music')this.music.setVolume(this.settings.music);
      this.applySettings();this.save();
    }
  }
  destroy() { this.music.destroy(); this.fire.destroy();this.bossbed.destroy();for(const sound of this.bossScores.values())sound.destroy();for(const sound of this.effects.keys())sound.destroy(); this.effects.clear(); }
}
