// Small original synthesized feedback. Final sound assets/mix are a later production pass.
let context;
export class AudioCues {
  constructor(scene) { this.scene = scene; }
  get muted() { return !!this.scene.registry.get('muted'); }
  unlock() {
    try { context ??= new (window.AudioContext || window.webkitAudioContext)(); context.resume(); } catch { /* Sound is optional on unsupported devices. */ }
  }
  cue(id) {
    if (this.muted || !context || context.state !== 'running') return;
    const notes = { ignite: [220, 330, 440], warning: [170, 130], notice: [95, 75], knock: [270, 270], take: [330, 440, 660], death: [110, 65], rescue: [330, 440, 550, 660] }[id] || [220];
    notes.forEach((hz, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const at = context.currentTime + i * 0.16;
      osc.type = id === 'notice' ? 'triangle' : 'sine';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.045, at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.13);
      osc.connect(gain); gain.connect(context.destination);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.start(at); osc.stop(at + 0.15);
    });
  }
  pause() { context?.suspend(); }
  resume() { context?.resume(); }
  toggleMute() { this.scene.registry.set('muted', !this.muted); }
}
