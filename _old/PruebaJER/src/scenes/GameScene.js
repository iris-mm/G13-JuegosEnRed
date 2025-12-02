import Phaser from 'phaser';

//importar imagenes
//JUEGO
// @ts-ignore
import floor from '../../assets/stone_tile.png';
// @ts-ignore
import game_boundary from '../../assets/game_boundary.png';
// @ts-ignore
import leaves from '../../assets/leaves_overlay.png';
// @ts-ignore

//ITEMS
import candySprite from '../../assets/sprites/caramelo.png';
// @ts-ignore
import pumpkin1 from '../../assets/sprites/obj calabaza.png';
// @ts-ignore
import pumpkin2 from '../../assets/sprites/obj calabaza 2.png';
// @ts-ignore
import pumpkin3 from '../../assets/sprites/obj calabaza 3.png';
// @ts-ignore
import rock from '../../assets/sprites/obj piedra.png';

//PERSONAJES
//Para el idle (temporal)
// @ts-ignore
import vampiresaFrontEst from '../../assets/sprites/vampiresa_front.png';
// @ts-ignore
import zombiFrontEst from '../../assets/sprites/zombi_front.png';
//Animaciones
// @ts-ignore
import vampiresaFront from '../../assets/sprites/Spritesheets/SS_vampiresa_front.png';
// @ts-ignore
import vampiresaback from '../../assets/sprites/Spritesheets/SS_vampiresa_back.png';
// @ts-ignore
import vampiresaLeft from '../../assets/sprites/Spritesheets/SS_vampiresa_left.png';
// @ts-ignore
import vampiresaRight from '../../assets/sprites/Spritesheets/SS_vampiresa_right.png';
// @ts-ignore
import zombiFront from '../../assets/sprites/Spritesheets/SS_zombie_front.png';
// @ts-ignore
import zombiBack from '../../assets/sprites/Spritesheets/SS_zombie_back.png';
// @ts-ignore
import zombiLeft from '../../assets/sprites/Spritesheets/SS_zombie_left.png';
// @ts-ignore
import zombiRight from '../../assets/sprites/Spritesheets/SS_zombie_right.png';

//SONIDOS
// @ts-ignore
import gameMusic from '../../assets/music_sounds/game_music.mp3';
// @ts-ignore
import timerAlert from '../../assets/music_sounds/timer_alert.mp3';

//CLASES
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
        this.load.audio('timer_alert', timerAlert);
        //Items
        this.load.image('candy', candySprite);
        this.load.image('pumpkin1', pumpkin1);
        this.load.image('pumpkin2', pumpkin2);
        this.load.image('pumpkin3', pumpkin3);
        this.load.image('rock', rock);
        //Players
        //para el idle (temporal)
        this.load.image('vampiresa_frontEst', vampiresaFrontEst);
        this.load.image('zombi_frontEst', zombiFrontEst);
        //
        this.load.spritesheet('vampiresa_front', vampiresaFront, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_back', vampiresaback, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_left',  vampiresaLeft, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_right', vampiresaRight, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_front',  zombiFront, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_back', zombiBack, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_left',  zombiLeft, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_right', zombiRight, { frameWidth: 256, frameHeight: 256 });
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
        //Animaciones
        //Vampiresa
        this.anims.create({
            key: 'vampiresa_front_anim',
            frames: this.anims.generateFrameNumbers('vampiresa_front', { start: 0, end: 3 }),
            frameRate: 6, //Velocidad animación
            repeat: -1 //Se repite en bucle
        });
        this.anims.create({
            key: 'vampiresa_back_anim',
            frames: this.anims.generateFrameNumbers('vampiresa_back', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'vampiresa_left_anim',
            frames: this.anims.generateFrameNumbers('vampiresa_left', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'vampiresa_right_anim',
            frames: this.anims.generateFrameNumbers('vampiresa_right', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        //Zombie
        this.anims.create({
            key: 'zombi_front_anim',
            frames: this.anims.generateFrameNumbers('zombi_front', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'zombi_back_anim',
            frames: this.anims.generateFrameNumbers('zombi_back', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'zombi_left_anim',
            frames: this.anims.generateFrameNumbers('zombi_left', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'zombi_right_anim',
            frames: this.anims.generateFrameNumbers('zombi_right', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        //Controles
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

        //Instanciar jugadores
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

        this.player1Score = 0;
        this.player1ScoreText = this.add.text(100, 100, "0", {fontSize: "48px",color: "#ffffff"});
        this.player2Score = 0;
        this.player2ScoreText = this.add.text(1200 - 100, 100, "0", {fontSize: "48px",color: "#ffffff"});
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

        if(this.basket1.candies > this.basket2.candies) {
            this.player1ScoreText.text = ++this.player1Score;
        }
        else if(this.basket1.candies < this.basket2.candies) {
            this.player2ScoreText.text = ++this.player2Score;
        }

        this.basket1.Restart();
        this.basket2.Restart();

        // Si es la última ronda, mostrar GameOver
        if (this.round > 4) {
            const msgGameOver = this.add.text(600, 350, `FIN DE LA PARTIDA`, {
                fontSize: "48px",
                fontStyle: "bold",
                color: "#ff0000ff",
                backgroundColor: "#000000a7",
            }).setOrigin(0.5);

            let winnerText = "";
            if (this.player1Score > this.player2Score) {
                winnerText = "¡Gana Jugador 1!";
            } else if (this.player2Score > this.player1Score) {
                winnerText = "¡Gana Jugador 2!";
            } else {
                winnerText = "¡Empate!";
            }

            const msgWinner = this.add.text(600, 450, winnerText, {
                fontSize: "36px",
                fontStyle: "bold",
                color: "#ffffff",
                backgroundColor: "#000000a7",
            }).setOrigin(0.5);

            this.time.delayedCall(3000, () => {
                msgGameOver.destroy();
                msgWinner.destroy();
                this.scene.start("MenuScene");
            });

            return;
        }

        const msgRound = this.add.text(600, 400, `Ronda ${this.round - 1} terminada`, {
            fontSize: "48px",
            fontStyle: "bold",
            color: "#ffffff",
            backgroundColor: "#000000a7",
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            msgRound.destroy();
            const newDuration = Math.max(0, 45000 - (15000 * (this.round - 1)));
            this.startRound(newDuration);
        });
    }


}