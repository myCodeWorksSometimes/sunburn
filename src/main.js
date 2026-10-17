import Phaser from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Title } from './scenes/Title.js';
import { Intro } from './scenes/Intro.js';
import { Home } from './scenes/Home.js';
import { Yard } from './scenes/Yard.js';
import { End } from './scenes/End.js';
import { A1Lane, A1Square, A1Bridge, A1Campfire } from './scenes/Act1.js';
import { World } from './scenes/World.js';
import { Hearth } from './scenes/Hearth.js';
import { Pause } from './scenes/Pause.js';
import { Credits } from './scenes/Credits.js';

const debug = new URLSearchParams(location.search).has('debug');

async function start() {
  window.game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'game',
    width: 1280,
    height: 720,
    backgroundColor: '#050308',
    pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { gravity: { y: 1500 }, debug } },
    // ?test keeps the loop running in hidden/background tabs (automated play-testing).
    fps: { forceSetTimeOut: new URLSearchParams(location.search).has('test'), target: 60 },
    scene: [Boot, Title, Intro, Home, Yard, A1Lane, A1Square, A1Bridge, A1Campfire, World, Hearth, Pause, Credits, End],
  });
}

start();
