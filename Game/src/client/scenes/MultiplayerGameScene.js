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
import desconectionScreenImg from '../../../public/assets/images/Disconection.jpg';

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

//CONTROLES/BOTONES
// @ts-ignore
import controlWASD from '../../../public/assets/images/ControlsWASD.png';
// @ts-ignore
import controlIJLK from '../../../public/assets/images/ControlsIJKL.png';
// @ts-ignore
import SPR_Button from '../../../public/assets/sprites/Button.png';

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
// @ts-ignore
import SFX_ButtonPress from '../../../public/assets/sfx/ButtonPress.mp3';

//CLASES
import { Player } from '../../client/game/player/playerController.js';
import { AudioManager } from '../../client/managers/AudioManager.js';
import { EntitiesController } from '../../client/game/controllers/EntitiesController.js';
import { Candy } from '../../client/game/items/Candy.js';
import { ThrowableItem } from '../../client/game/items/ThrowableItem.js';
import { CandyBasket } from '../../client/game/controllers/CandyBasket.js';
import { SpeedPowerUp } from '../../client/game/items/SpeedPowerUp.js';
import { OnlineCandy } from '../../client/game/items/OnlineCandy.js';
import { Button } from '../ui/Button.js';

export class MultiplayerGameScene extends Phaser.Scene {
    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        this.ws = data.ws;                 // WebSocket
        this.playerRole = data.playerRole; // 'player1' | 'player2'
        this.gameStarted = false;
        this.gameEnded = false;

        this.candy = null;

    }

    preload() {
        //Game
        this.load.image('floor', floor);
        this.load.image('game_boundary', game_boundary);
        this.load.image('leaves', leaves);
        this.load.audio('game_music', gameMusic);
        this.load.audio('timer_alert', timerAlert);
        this.load.audio('SFX_ButtonPress', SFX_ButtonPress);
        //Items
        this.load.image('candy', candySprite);
        this.load.image('pumpkin1', pumpkin1);
        this.load.image('pumpkin2', pumpkin2);
        this.load.image('pumpkin3', pumpkin3);
        this.load.image('rock', rock);
        //Controls y Botones
        this.load.image('controlWASD', controlWASD);
        this.load.image('controlIJLK', controlIJLK);
        this.load.image('SPR_Button', SPR_Button);
        //Power Ups
        this.load.image('speed_powerup', speedPowerUpSprite);
        //Players
        //para el idle (temporal)
        this.load.image('vampiresa_frontEst', vampiresaFrontEst);
        this.load.image('zombi_frontEst', zombiFrontEst);
        //
        this.load.spritesheet('vampiresa_front', vampiresaFront, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_back', vampiresaback, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_left', vampiresaLeft, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('vampiresa_right', vampiresaRight, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_front', zombiFront, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_back', zombiBack, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_left', zombiLeft, { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('zombi_right', zombiRight, { frameWidth: 256, frameHeight: 256 });

        //Desconection image
        this.load.image('disconectionScreen', desconectionScreenImg);

        //Cargar fuente
        const font = new FontFace('ButtonsFont', 'url(fonts/alagard_font.ttf)');
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        });
    }

    create() {
        // Escenario igual que GameScene
        this.add.tileSprite(0, 0, 1200, 800, 'floor').setOrigin(0, 0).setScale(3);
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
        this.keys1 = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        this.keys2 = this.input.keyboard.addKeys({ up: 'I', down: 'K', left: 'J', right: 'L' });

        if (this.playerRole === 'player1') {

            this.localPlayer = new Player(100, 400, 0.4, 'zombi', this, this.keys1, 'E', true);
            this.remotePlayer = new Player(1100, 400, 0.4, 'vampiresa', this, null, null, false);

        } else if (this.playerRole === 'player2') {

            this.localPlayer = new Player(1100, 400, 0.4, 'vampiresa', this, this.keys2, 'O', true);
            this.remotePlayer = new Player(100, 400, 0.4, 'zombi', this, null, null, false);

        }

        this.entitiesController.AddEntity(this.localPlayer);
        this.entitiesController.AddEntity(this.remotePlayer);

        // Items, candy baskets, power-ups
        /* this.candy = new Candy(0.2, 'candy', this);
         this.entitiesController.AddEntity(this.candy);*/

        // Agregar throwable items
        this.items = [
            new ThrowableItem(0.3, 'pumpkin1', this),
            new ThrowableItem(0.3, 'pumpkin2', this),
            new ThrowableItem(0.3, 'pumpkin3', this),
            new ThrowableItem(0.3, 'rock', this),
            new ThrowableItem(0.3, 'rock', this)
        ];
        this.items.forEach(item => this.entitiesController.AddEntity(item));
        this.items.forEach(item => item.setupOverlap(this.localPlayer, this.remotePlayer, this));

        this.basket1 = new CandyBasket(60, 400, 70, 310, this.localPlayer, this);
        this.basket2 = new CandyBasket(1200 - 60, 400, 1200 - 90, 310, this.remotePlayer, this);

        this.speedPowerUp = new SpeedPowerUp(600, 400, 0.3, this);
        this.entitiesController.AddEntity(this.speedPowerUp);
        this.speedPowerUp.setupOverlap(this.localPlayer, this.remotePlayer, this);


        // ======================
        // INPUT LOCAL
        // ======================

        // ======================
        // WEBSOCKET
        // ======================
        this.setupWebSocket();

        // Avisar al servidor que estamos listos
        this.send({ type: 'PLAYER_READY' });

        this.ws.inLobby = false;
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            if (this.gameEnded) return;
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'START_GAME':
                    console.log('START_GAME recibido');
                    this.gameStarted = true;
                    break;

                case 'PLAYER_MOVED':
                    // Solo mover al jugador REMOTO
                    if (data.player !== this.playerRole) {

                        this.remotePlayer.MoveTo(data.x, data.y);
                    }
                    break;

                case 'CANDY_SPAWN':
                    console.log('CANDY_SPAWN recibido', data.candy);
                    if (!this.candy) {
                        this.candy = new OnlineCandy(
                            data.candy.x,
                            data.candy.y,
                            0.2,
                            'candy',
                            this,
                            data.candy.id
                        );
                        this.entitiesController.AddEntity(this.candy);
                        this.candy.setupOverlap(this.localPlayer, this.remotePlayer, this);
                    } else {
                        this.candy.MoveTo(data.candy.x, data.candy.y);
                        this.candy.hasSpawned = true;
                    }
                    break;



                case 'gameOver':
                    this.endGame(data.winner);
                    break;

                case 'playerDisconnected':
                    this.handleDisconnect();
                    break;
            }
        };


    }

    setupWebSocketListeners() {
        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (!this.gameEnded) {
                this.handleDisconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (!this.gameEnded) {
                this.handleDisconnect();
            }
        };
    }

    handleDisconnect() {
        console.error('EJECUTANDO HANDLE DISCONNECT');
        this.gameEnded = true;
        this.gameStarted = false;
        //Para todas las entidades

        this.add.text(400, 250, 'El otro jugador se ha desconectado', {
            fontSize: '48px',
            color: '#ff0000ff'
        }).setOrigin(0.5);

        this.createMenuButton();
    }

    createMenuButton() {
        const menuButton = this.add.text(600, 400, 'Volver al menú', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                this.scene.start('MainMenu');
            });
        this.gameEnded = true;
        this.gameStarted = false;
        this.physics.pause();
        //Para todas las entidades

        this.showDisconnectScreen();
    }

    showDisconnectScreen() {
        // Mostrar imagen de desconexión
        const bg = this.add.image(600, 400, 'disconectionScreen');
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(880, 600, this, 'SPR_Button', 'Menú', () => {
            this.scene.start('MainMenu');
        }
        );
    }

    send(msg) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    update() {
        if (!this.gameStarted || this.gameEnded) return;

        // Actualizar local
        this.localPlayer.Update();

        // Enviar posición al server
        this.send({
            type: 'PLAYER_MOVE',
            player: this.playerRole,
            x: this.localPlayer.x,
            y: this.localPlayer.y
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
        if (this.ws) this.ws.close();
    }
}
