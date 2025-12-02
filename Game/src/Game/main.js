import Phaser from "../../dependencies/phaser/lib/phaser.js"

const _CONFIG = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0 },
            debug: false
        }
    },
    scene: []
}

const _GAME = new Phaser.Game(_CONFIG)