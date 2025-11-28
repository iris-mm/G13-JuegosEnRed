import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { ConfigScene } from './scenes/ConfigScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, PauseScene, CreditsScene, ConfigScene],
    backgroundColor: '#47ddffff',
    pixelArt: true
}

const game = new Phaser.Game(config);