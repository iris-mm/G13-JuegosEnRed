import Phaser from 'phaser';

import { LoginScene } from './scenes/LoginScene.js';
import { MainMenu } from './scenes/MainMenu.js';
import { PlayModeMenu } from './scenes/PlayModeMenu.js';
import { TutorialMenu } from './scenes/TutorialMenu.js';
import { SettingsMenu } from './scenes/SettingsMenu.js';
import { CreditsMenu } from './scenes/CreditsMenu.js';
import { Lobby } from './scenes/Lobby.js';

const _CONFIG = {
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
    scene: [LoginScene, MainMenu, PlayModeMenu, TutorialMenu, SettingsMenu, CreditsMenu, Lobby,],
    backgroundColor: '#000000',
    pixelArt: true,
    dom: {
        createContainer: true
    }
}

const _GAME = new Phaser.Game(_CONFIG);
// Asegurar que comienza en login
_GAME.scene.start('LoginScene');