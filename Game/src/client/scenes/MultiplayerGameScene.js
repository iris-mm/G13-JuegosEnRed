import Phaser from 'phaser';

//importar imagenes
//JUEGO
// @ts-ignore
import floor from '../../../public/assets/sprites/stone_tile.png';
// @ts-ignore
import game_boundary from '../../../public/assets/sprites/game_boundary.png';
// @ts-ignore
import leaves from '../../../public/assets/sprites/leaves_overlay.png';
// @ts-ignore

//ITEMS
import candySprite from '../../../public/assets/sprites/caramelo.png';
// @ts-ignore
import pumpkin1 from '../../../public/assets/sprites/obj calabaza.png';
// @ts-ignore
import pumpkin2 from '../../../public/assets/sprites/obj calabaza 2.png';
// @ts-ignore
import pumpkin3 from '../../../public/assets/sprites/obj calabaza 3.png';
// @ts-ignore
import rock from '../../../public/assets/sprites/obj piedra.png';

//CONTROLES
// @ts-ignore
import controlWASD from '../../../public/assets/images/ControlsWASD.png';
// @ts-ignore
import controlIJLK from '../../../public/assets/images/ControlsIJKL.png';

//POWER UPS
// @ts-ignore
import speedPowerUpSprite from '../../../public/assets/sprites/obj_foco_def.png';

//PERSONAJES
//Para el idle (temporal)
// @ts-ignore
import vampiresaFrontEst from '../../../public/assets/sprites/vampiresa_front.png';
// @ts-ignore
import zombiFrontEst from '../../../public/assets/sprites/zombie_front.png';
//Animaciones
// @ts-ignore
import vampiresaFront from '../../../public/assets/sprites/Spritesheets/SS_vampiresa_front.png';
// @ts-ignore
import vampiresaback from '../../../public/assets/sprites/Spritesheets/SS_vampiresa_back.png';
// @ts-ignore
import vampiresaLeft from '../../../public/assets/sprites/Spritesheets/SS_vampiresa_left.png';
// @ts-ignore
import vampiresaRight from '../../../public/assets/sprites/Spritesheets/SS_vampiresa_right.png';
// @ts-ignore
import zombiFront from '../../../public/assets/sprites/Spritesheets/SS_zombie_front.png';
// @ts-ignore
import zombiBack from '../../../public/assets/sprites/Spritesheets/SS_zombie_back.png';
// @ts-ignore
import zombiLeft from '../../../public/assets/sprites/Spritesheets/SS_zombie_left.png';
// @ts-ignore
import zombiRight from '../../../public/assets/sprites/Spritesheets/SS_zombie_right.png';

//SONIDOS
// @ts-ignore
import gameMusic from '../../../public/assets/music/game_music.mp3';
// @ts-ignore
import timerAlert from '../../../public/assets/music/timer_alert.mp3';

//CLASES
import { Player } from '../../client/game/player/playerController.js';
import { AudioManager } from '../../client/managers/AudioManager.js';
import { EntitiesController } from '../../client/game/controllers/EntitiesController.js';
import { Candy } from '../../client/game/items/Candy.js';
import { ThrowableItem } from '../../client/game/items/ThrowableItem.js';
import { CandyBasket } from '../../client/game/controllers/CandyBasket.js';
import { SpeedPowerUp } from '../../client/game/items/SpeedPowerUp.js';

export class MultiplayerGameScene extends Phaser.Scene {
    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        this.ws = data.ws;                 // WebSocket
        this.playerRole = data.playerRole; // 'player1' | 'player2'
        this.gameStarted = false;
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
        //Controls
        this.load.image('controlWASD', controlWASD);
        this.load.image('controlIJLK', controlIJLK);
        //Power Ups
        this.load.image('speed_powerup', speedPowerUpSprite);
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

    create() {
        // Escenario igual que GameScene
        this.add.tileSprite(0, 0, 1200, 800, 'floor').setOrigin(0,0).setScale(3);
        const boundary = this.physics.add.image(600, 400, 'game_boundary').setScale(3).setImmovable(true);
        this.add.image(600, 400, 'leaves').setScale(3).setAlpha(0.75);

        // Audio
        this.sound.volume = AudioManager.GetVolume();
        this.sound.stopAll();
        this.music = this.sound.add('game_music', { volume: AudioManager.GetVolume(), loop: true });
        this.music.play();

        // Controladores
        this.entitiesController = new EntitiesController();

        // Instanciar jugadores
        if(this.playerRole === 'player1') {
            this.localPlayer  = new Player(100, 400, 0.4, 'zombi', this, null); // input después
            this.remotePlayer = new Player(1100, 400, 0.4, 'vampiresa', this, null);
        } else {
            this.localPlayer  = new Player(1100, 400, 0.4, 'vampiresa', this, null);
            this.remotePlayer = new Player(100, 400, 0.4, 'zombi', this, null);
        }

        this.entitiesController.AddEntity(this.localPlayer);
        this.entitiesController.AddEntity(this.remotePlayer);

        // Items, candy baskets, power-ups
        this.candy = new Candy(0.2, 'candy', this);
        this.entitiesController.AddEntity(this.candy);

        // Agregar throwable items
        this.items = [
            new ThrowableItem(0.3, 'pumpkin1', this),
            new ThrowableItem(0.3, 'pumpkin2', this),
            new ThrowableItem(0.3, 'pumpkin3', this),
            new ThrowableItem(0.3, 'rock', this),
            new ThrowableItem(0.3, 'rock', this)
        ];
        this.items.forEach(item => this.entitiesController.AddEntity(item));

        this.basket1 = new CandyBasket(60, 400, 70, 310, this.localPlayer, this);
        this.basket2 = new CandyBasket(1200 - 60, 400, 1200 - 90, 310, this.remotePlayer, this);

        this.speedPowerUp = new SpeedPowerUp(600, 400, 0.3, this);
        this.entitiesController.AddEntity(this.speedPowerUp);

        // ======================
        // INPUT LOCAL
        // ======================
        // El jugador local usa WASD
        this.keys = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        // ======================
        // WEBSOCKET
        // ======================
        this.setupWebSocket();

        // Avisar al servidor que estamos listos
        this.send({ type: 'playerReady' });
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'startGame':
                    this.gameStarted = true;
                    break;

                case 'playerMove':
                    // Actualizar posición del jugador remoto
                    this.remotePlayer.sprite.setPosition(data.x, data.y);
                    break;

                case 'gameOver':
                    this.endGame(data.winner);
                    break;

                // otros casos según lo que envíe tu server
            }
        };

        this.ws.onclose = () => this.endGame('disconnect');
        this.ws.onerror = () => this.endGame('disconnect');
    }

    send(msg) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    update() {
        if(!this.gameStarted) return;

        // Actualizar local
        this.localPlayer.Update();

        // Enviar posición al server
        this.send({
            type: 'playerMove',
            x: this.localPlayer.sprite.x,
            y: this.localPlayer.sprite.y
        });

        // Actualizar todo lo demás
        this.entitiesController.Update();
    }

    endGame(reason) {
        const text = reason === 'disconnect' ? 'Jugador desconectado' : 'Fin de la partida';
        this.add.text(600, 400, text, { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        this.time.delayedCall(3000, () => this.scene.start('MenuScene'));
    }

    shutdown() {
        if(this.ws) this.ws.close();
    }
}
