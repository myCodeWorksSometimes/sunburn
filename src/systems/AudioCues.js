// Bundled CC0 recordings/composition. Provenance: public/audio/LICENSES.md.
const SETTINGS = 'embers-audio-v1';
export function audioSettings() {
  try { return { music: .32, effects: .65, muted: false, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; }
  catch { return { music: .32, effects: .65, muted: false }; }
}
export class AudioCues {
  constructor(scene) {
    this.scene = scene; this.settings = audioSettings(); this.paused = false; this.stepClock = 0; this.lastCue = new Map();
    this.effects = new Map();
    this.music = scene.sound.add('audio-score', { loop: true, volume: 0 });
    this.fire = scene.sound.add('audio-fire', { loop: true, volume: 0 });
    this.applySettings();
    scene.events.once('shutdown', () => this.destroy());
  }
  get muted() { return this.settings.muted; }
  unlock() {
    this.scene.sound.unlock?.();
    this.scene.sound.context?.resume?.();
    if (!this.music.isPlaying && !this.paused) this.music.play();
    if (!this.fire.isPlaying && !this.paused) this.fire.play();
  }
  cue(id) {
    if (this.muted || this.paused) return;
    const cues = {
      ignite: ['fire', .7], warning: ['knock', .3], notice: ['monster-hit', .27], knock: ['knock', .7],
      take: ['take', .6], death: ['monster-death', .7], rescue: ['take', .8],
      'boss-intro': ['monster-roar', .8], 'monster-roar': ['monster-roar', .65],
      'monster-hit': ['monster-hit', .65], 'monster-death': ['monster-death', .75],
      impact: ['impact', .8], sweep: ['sweep', .65], door: ['door', .65],
    };
    const [key, volume] = cues[id] || ['impact', .3];
    const now = this.scene.time.now;
    if (now - (this.lastCue.get(id) ?? -Infinity) < 160) return;
    this.lastCue.set(id, now);
    this.playEffect(key,volume);
  }
  playEffect(key, volume) {
    if(this.muted || this.paused)return;
    const sound=this.scene.sound.add(`audio-${key}`,{volume:volume*this.settings.effects});
    this.effects.set(sound,volume);
    sound.once('complete',()=>sound.destroy());
    sound.once('destroy',()=>this.effects.delete(sound));
    sound.play();
  }
  update(delta) {
    if (this.paused) return;
    const { scene, settings } = this;
    const danger = scene.cinematic?.active || scene.enemies?.some(e => e.alive && e.restorationImmune && Math.abs(e.x - scene.player.x) < 550);
    this.music.setVolume(settings.muted ? 0 : settings.music * (danger ? .75 : 1));
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
    this.music.setMute(this.muted);this.fire.setMute(this.muted);
    for(const [sound,gain] of this.effects)sound.setMute(this.muted).setVolume(gain*this.settings.effects);
  }
  pause() { this.paused = true; this.music.pause(); this.fire.pause(); for(const sound of this.effects.keys())sound.pause(); }
  resume() { this.paused = false; this.music.resume(); this.fire.resume(); for(const sound of this.effects.keys())sound.resume(); this.unlock(); }
  save() { try { localStorage.setItem(SETTINGS, JSON.stringify(this.settings)); } catch { /* Private storage may be unavailable. */ } }
  toggleMute() { this.settings.muted = !this.muted; this.applySettings(); this.save(); }
  setVolume(channel, value) {
    if (channel === 'music' || channel === 'effects') {
      this.settings[channel] = Math.max(0, Math.min(1, value));
      if(channel==='music')this.music.setVolume(this.settings.music);
      this.applySettings();this.save();
    }
  }
  destroy() { this.music.destroy(); this.fire.destroy(); for(const sound of this.effects.keys())sound.destroy(); this.effects.clear(); }
}
