// Transient combat equipment. The quest lantern is never a disposable item.
export class WeaponState {
  constructor() { this.reset(); }
  reset() { this.drawn = false; this.drop = null; this.combo = 0; }
  draw(x, floor, allowed) {
    if (!allowed || this.drawn) return false;
    this.drawn = true; this.drop = { x, floor }; this.combo = 0; return true;
  }
  retrieve(x, feet) {
    if (!this.drawn || !this.drop || Math.hypot(x-this.drop.x,feet-this.drop.floor)>80) return false;
    this.reset(); return true;
  }
  get carrying() { return !this.drawn; }
}
