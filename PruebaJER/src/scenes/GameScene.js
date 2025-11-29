import Phaser from 'phaser';
// @ts-ignore
import floor from '../../assets/stone_tile.png';
// @ts-ignore
import game_boundary from '../../assets/game_boundary.png';
// @ts-ignore
import leaves from '../../assets/leaves_overlay.png';
// @ts-ignore
import candySprite from '../../assets/sprites/caramelo.png';
// @ts-ignore
import vampiresaFront from '../../assets/sprites/vampiresa_front.png';
// @ts-ignore
import vampiresaback from '../../assets/sprites/vampiresa_back.png';
// @ts-ignore
import vampiresaLeft from '../../assets/sprites/vampiresa_left.png';
// @ts-ignore
import vampiresaRight from '../../assets/sprites/vampiresa_right.png';
// @ts-ignore
import zombiFront from '../../assets/sprites/zombi_front.png';
// @ts-ignore
import zombiBack from '../../assets/sprites/zombi_back.png';
// @ts-ignore
import zombiLeft from '../../assets/sprites/zombi_left.png';
// @ts-ignore
import zombiRight from '../../assets/sprites/zombi_right.png';

import { EntitiesController } from '../game/controllers/EntitiesController.js';
import { Candy } from '../game/items/Candy.js';
import { Player } from '../game/player/playerController.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    preload(){
        //Game
        this.load.image('floor', floor);
        this.load.image('game_boundary', game_boundary);
        this.load.image('leaves', leaves);
        //Items
        this.load.image('candy', candySprite);
        //Players
        this.load.image('vampiresa front', vampiresaFront);
        this.load.image('vampiresa back', vampiresaback);
        this.load.image('vampiresa left',  vampiresaLeft);
        this.load.image('vampiresa right', vampiresaRight);
        this.load.image('zombi front',  zombiFront);
        this.load.image('zombi back', zombiBack);
        this.load.image('zombi left',  zombiLeft);
        this.load.image('zombi right', zombiRight);
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

        //Acceder a escena de Pausa al pulsar ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        //  Controlador de entidades, lista de entidades que actualiza en 'update'
        this.entitiesController = new EntitiesController();

        //  Candy
        this.candy = new Candy(0.2, 'candy', this);
        this.entitiesController.AddEntity(this.candy);

        //Players
        this.keys1 = this.input.keyboard.addKeys({ //P1
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        this.keys2 = this.input.keyboard.createCursorKeys(); //P2

        this.player1 = new Player(100, 100, 0.4, 'vampiresa', this, this.keys1);
        this.player2 = new Player(200, 100, 0.4, 'zombi', this, this.keys2);

        this.entitiesController.AddEntity(this.player1);
        this.entitiesController.AddEntity(this.player2);

    }

    update(){
        this.entitiesController.Update();
    }
}