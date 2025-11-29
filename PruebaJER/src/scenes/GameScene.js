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
        // this.physics.add.collider(player, boundary);

        const leaves = this.add.image(600, 400, 'leaves')
        .setScale(3);

        //Bases de jugadores. Cuando se colisione con ellas + tengan caramelo, se hará callback!
            // Base azul izquierda - PLAYER 1
            // Base roja derecha - PLAYER 2
        const base_SIZE = 96;
        const offset = 33; //offset por el gameboundary, para que salga la base entera

        const blueBase = this.add.rectangle((base_SIZE/2) + offset , 400, base_SIZE, base_SIZE, 0x3e3eac)
        .setAlpha(0.5);
        const redBase = this.add.rectangle((1200 - base_SIZE / 2) - offset, 400, base_SIZE, base_SIZE, 0xA30000)
        .setAlpha(0.5);

        // Añadir colider cuando player esté hecho y la función de añadir punto también!
        // this.physics.add.overlap(this.player1, blueBase, addPoint);
        // this.physics.add.overlap(this.player2, redBase, addPoint);

    }

    update(){

    }
}