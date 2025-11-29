import Phaser from 'phaser';
// @ts-ignore
import floor from '../../assets/stone_tile.png';
// @ts-ignore
import game_boundary from '../../assets/game_boundary.png';
// @ts-ignore
import leaves from '../../assets/leaves_overlay.png';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    preload(){
        this.load.image('floor', floor);
        this.load.image('game_boundary', game_boundary);
        this.load.image('leaves', leaves);
    }

    create(){
        //Escenario
        const floor = this.add.tileSprite(0, 0, 1200, 800, 'floor') 
            .setOrigin(0,0) 
            .setScale(3) 
            .setDepth(0);
        const boundary = this.physics.add.image(600, 400, 'game_boundary') // 1200/2 y 800/2 para que esté en el centro
            .setScale(3)
            .setImmovable(true);
        const leaves = this.add.image(600, 400, 'leaves')
            .setScale(3);
    }
}