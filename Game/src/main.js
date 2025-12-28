import Phaser from 'phaser';

import { MainMenu } from './client/scenes/MainMenu.js';
import { PlayModeMenu } from './client/scenes/PlayModeMenu.js';
import { TutorialMenu } from './client/scenes/TutorialMenu.js';
import { SettingsMenu } from './client/scenes/SettingsMenu.js';
import { CreditsMenu } from './client/scenes/CreditsMenu.js';

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