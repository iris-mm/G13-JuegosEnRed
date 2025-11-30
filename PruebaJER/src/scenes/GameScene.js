import Phaser from 'phaser';

//importar imagenes
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
// @ts-ignore
import pumpkin1 from '../../assets/sprites/obj calabaza.png';
// @ts-ignore
import pumpkin2 from '../../assets/sprites/obj calabaza 2.png';
// @ts-ignore
import pumpkin3 from '../../assets/sprites/obj calabaza 3.png';
// @ts-ignore
import rock from '../../assets/sprites/obj piedra.png';
//Sonidos
// @ts-ignore
import gameMusic from '../../assets/music_sounds/game_music.mp3';

//importar clases
import { TimerController } from '../game/controllers/TimerController.js';
import { EntitiesController } from '../game/controllers/EntitiesController.js';
import { Candy } from '../game/items/Candy.js';
import { Player } from '../game/player/playerController.js';
import { AudioManager } from '../game/controllers/AudioManager';
import { ThrowableItem } from '../game/items/ThrowableItem.js';
import { CandyBasket } from '../game/controllers/CandyBasket.js';


export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    preload(){
        //Game
        this.load.image('floor', floor);
        this.load.image('game_boundary', game_boundary);
        this.load.image('leaves', leaves);
        this.load.audio('game_music', gameMusic);
        //Items
        this.load.image('candy', candySprite);
        this.load.image('pumpkin1', pumpkin1);
        this.load.image('pumpkin2', pumpkin2);
        this.load.image('pumpkin3', pumpkin3);
        this.load.image('rock', rock);
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
        .setScale(3)
        .setAlpha(0.75);

        //Volumen global
                this.sound.volume = AudioManager.getVolume();
                this.sound.stopAll(); //para que no se superpongan las canciones
                this.music = this.sound.add('game_music', {
                    volume: AudioManager.getVolume(),
                    loop: true
                });
                this.music.play();

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
    
        //Temporizador
        let timerText = this.add.text(600, 100, "45", {fontSize: "48px",color: "#ffffff"})
        .setOrigin(0.5, 0.5);
        timerText.depth = 100;

        this.countdown = new TimerController(this, timerText);
        this.round = 1;
        this.startRound(45000);

        //Acceder a escena de Pausa al pulsar ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        //  Controlador de entidades, lista de entidades que actualiza en 'update'
        this.entitiesController = new EntitiesController();

        //Players
        this.keys1 = this.input.keyboard.addKeys({ //P1
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        this.keys2 = this.input.keyboard.addKeys({ //P2
            up: 'I',
            down: 'K',
            left: 'J',
            right: 'L'
        });


        this.player1 = new Player(100, 400, 0.4, 'zombi', this, this.keys1, 'E');
        this.player2 = new Player(1100, 400, 0.4, 'vampiresa', this, this.keys2, 'O');


        this.entitiesController.AddEntity(this.player1);
        this.entitiesController.AddEntity(this.player2);
        
        //  Candy
        this.candy = new Candy(0.2, 'candy', this);
        this.entitiesController.AddEntity(this.candy);

        //  Throwable Items
        this.item1 = new ThrowableItem(0.3, 'pumpkin1', this)
        this.entitiesController.AddEntity(this.item1);
        this.item2 = new ThrowableItem(0.3, 'pumpkin2', this)
        this.entitiesController.AddEntity(this.item2);
        this.item3 = new ThrowableItem(0.3, 'pumpkin3', this)
        this.entitiesController.AddEntity(this.item3);
        this.item4 = new ThrowableItem(0.3, 'rock', this)
        this.entitiesController.AddEntity(this.item4);
        this.item5 = new ThrowableItem(0.3, 'rock', this)
        this.entitiesController.AddEntity(this.item5);

        //  Baskets
        this.basket1 = new CandyBasket(60, 400, 70, 310, this.player1, this);
        this.basket2 = new CandyBasket(1200 - 60, 400, 1200 - 90, 310, this.player2, this);
    }

    update(){
        this.countdown.update();
        this.entitiesController.Update();
    }

    startRound(seconds) {

        this.countdown.start(seconds, () => this.endRound());
    }

    endRound(){
        this.round++;

        if (this.round > 4) {
            this.scene.start("MenuScene");
            return;
        }

        // Cada ciclo dura 15s menos
        const newDuration = Math.max(0, 45000 - (15000 * (this.round-1)));

        this.startRound(newDuration);
    }
}