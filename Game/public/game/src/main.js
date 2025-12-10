import Phaser from 'phaser';

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
    scene: [MainMenu],
    backgroundColor: '#000000',
    pixelArt: true
}

const _GAME = new Phaser.Game(_CONFIG);