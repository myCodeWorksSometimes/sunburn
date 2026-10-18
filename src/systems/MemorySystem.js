import { BALANCE } from '../world/balance.js';
import { fieldContains } from './RestorationField.js';

export const WARMUP_MS = 1200;

// Updated from the scene's simulation delta: pause freezes every phase, including cooldown.
export class MemorySystem {
  constructor(scene) {
    this.scene = scene;
    this.phase = 'idle';
    this.fire = null;
    this.alpha = 0;
    this.remaining = 0;
    this.elapsed = 0;
    this.cooldowns = new Map();
  }

  canActivate(fire) {
    return (!this.fire || this.fire.id !== fire.id) && !(this.cooldowns.get(fire.id) > 0);
  }

  activate(fire) {
    if (!this.canActivate(fire)) return false;
    this.cancel('replaced');
    this.fire = { ...fire, x: fire.x ?? this.scene.player?.x ?? 0, floor: fire.floor ?? this.scene.player?.feet ?? 560 };
    this.lastEndReason=null;
    this.phase = 'warming';
    this.elapsed = 0;
    this.remaining = fire.duration;
    this.scene.events.emit('fire:ignited', { fireId: fire.id, regionId: fire.regionId, x: fire.x, y: fire.floor });
    this.scene.memoryShock=380;
    this.scene.audio?.cue('memory-surge');
    this.scene.cameras?.main.shake(240,.0025);
    return true;
  }

  get usable() { return this.phase === 'active' || this.phase === 'warning' || (this.phase === 'fading' && this.alpha > 0.5); }
  isRestored(regionId) { return this.fire?.regionId === regionId && this.usable; }
  isRestoredAt(_regionId,x,y) { return this.phase!=='idle' && fieldContains(this.fire,this.alpha,x,y); }

  cancel(reason = 'cancelled') {
    const fire = this.fire;
    // Clear logical state before refreshing colliders. Otherwise a cancellation
    // during the active phase leaves invisible restored surfaces enabled.
    this.fire = null;
    this.phase = 'idle';
    this.alpha = 0;
    this.remaining = 0;
    this.elapsed = 0;
    if (fire) {
      this.lastEndReason=reason;
      // Phaser may already have released bodies/mask textures during shutdown.
      // A departing scene needs logical cleanup, not another presentation pass.
      if(reason!=='shutdown')this.scene.setMemoryVisual(fire.regionId, 0, false);
      this.cooldowns.set(fire.id, BALANCE.memoryCooldown);
      this.scene.events.emit('memory:ended', { fireId: fire.id, regionId: fire.regionId, reason });
      if(reason!=='shutdown')this.scene.onMemoryEnded?.(fire, reason);
    }
  }

  update(delta) {
    for (const [id, left] of this.cooldowns) {
      if (left <= delta) this.cooldowns.delete(id); else this.cooldowns.set(id, left - delta);
    }
    if (!this.fire) return;
    this.elapsed += delta;
    if (this.phase === 'warming') {
      this.alpha = Math.min(1, this.elapsed / WARMUP_MS);
      if (this.alpha === 1) {
        this.phase = 'active';
        this.elapsed = 0;
        this.scene.events.emit('memory:ready', { fireId: this.fire.id, regionId: this.fire.regionId, durationMs: this.fire.duration });
        this.scene.onMemoryReady?.(this.fire);
      }
    } else if (this.phase === 'active' || this.phase === 'warning') {
      this.remaining = Math.max(0, this.remaining - delta);
      if (this.remaining <= 3000 && this.phase === 'active') {
        this.phase = 'warning';
        this.scene.events.emit('memory:ending', { fireId: this.fire.id, regionId: this.fire.regionId, remainingMs: this.remaining });
        this.scene.audio?.cue('warning');
      }
      if (!this.remaining) { this.phase = 'fading'; this.elapsed = 0; }
    } else if (this.phase === 'fading') {
      this.alpha = Math.max(0, 1 - this.elapsed / 650);
      if (!this.alpha) { this.cancel('expired'); return; }
    }
    if (this.fire) this.scene.setMemoryVisual(this.fire.regionId, this.alpha, this.usable);
  }
}
