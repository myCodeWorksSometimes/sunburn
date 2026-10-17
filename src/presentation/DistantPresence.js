// A distant silhouette behind the skyline/architecture. It never adds collision
// or a surprise foreground attack; simulation time also freezes with pause.
export class DistantPresence {
  constructor(scene){
    this.scene=scene;this.time=0;
    this.sprite=scene.add.sprite(1000,525,'boss-motion',12).setOrigin(.5,1).setDisplaySize(650,650).setTint(0x252331).setAlpha(.38).setScrollFactor(0,1).setDepth(-10.5);
  }
  update(delta){
    this.time+=delta;
    this.sprite.setVisible(this.scene.player.x>1300&&this.scene.player.x<8800);
    this.sprite.x=1300-(this.time/80)%1900;
    this.sprite.setFrame(12+Math.floor(this.time/420)%6).setFlipX(true);
  }
}
