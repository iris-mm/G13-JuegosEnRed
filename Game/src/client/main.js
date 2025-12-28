import Phaser from 'phaser';

import { MainMenu } from './scenes/MainMenu.js';
import { PlayModeMenu } from './scenes/PlayModeMenu.js';
import { TutorialMenu } from './scenes/TutorialMenu.js';
import { SettingsMenu } from './scenes/SettingsMenu.js';
import { CreditsMenu } from './scenes/CreditsMenu.js';

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
    scene: [MainMenu, PlayModeMenu, TutorialMenu, SettingsMenu, CreditsMenu],
    backgroundColor: '#000000',
    pixelArt: true
}

const _GAME = new Phaser.Game(_CONFIG);