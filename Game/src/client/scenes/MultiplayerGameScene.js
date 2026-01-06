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
        this.ws = data.socket;
        this.playerRole = data.role;

        this.gameStarted = true;
        this.gameEnded = false;

        // AÑADIDO PARA ITEMS: almacenar items que vengan del servidor
        this.remoteItems = new Map(); // id -> item instancia
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

        // AÑADIDO PARA ITEMS: escuchar mensajes de items desde el servidor
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'initialItems') {
                this.createItemsFromServer(data.items);
            }
            if (data.type === 'itemUpdate') {
                this.updateItemFromServer(data.item);
            }
        };

        // Instanciar jugadores
 /*       if(this.playerRole === 'player1') {
            this.localPlayer  = new Player(100, 400, 0.4, 'zombi', this, null); // input después
            this.remotePlayer = new Player(1100, 400, 0.4, 'vampiresa', this, null);
        } else {
            this.localPlayer  = new Player(1100, 400, 0.4, 'vampiresa', this, null);
            this.remotePlayer = new Player(100, 400, 0.4, 'zombi', this, null);
        }

       this.entitiesController.AddEntity(this.localPlayer);
        this.entitiesController.AddEntity(this.remotePlayer);

        // Alias de los jugadores para que funcionen con los parámetros existentes en las clases
       this.player1 = this.localPlayer;
        this.player2 = this.remotePlayer;
        */

        ///PERSONAJES TEMPORAL
        this.player1 = { x: 0, y: 0, gameObject: { x: 0, y: 0 } };
        this.player2 = { x: 0, y: 0, gameObject: { x: 0, y: 0 } };

        this.player1 = {
            x: 0,
            y: 0,
            gameObject: this.add.sprite(100, 100, 'zombi_frontEst')
        };
        this.player2 = {
            x: 0,
            y: 0,
            gameObject: this.add.sprite(100, 100, 'zombi_frontEst')
        };


        //  Candy
        this.candy = new Candy(0.2, 'candy', this);
        this.entitiesController.AddEntity(this.candy);
        console.log(this.candy.sprite);


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
        this.player1ScoreText = this.add.text(100, 100, "0", {fontSize: "48px",color: "#ffffff",  backgroundColor: "#000000a7"});
        this.player2Score = 0;
        this.player2ScoreText = this.add.text(1200 - 100, 100, "0", {fontSize: "48px",color: "#ffffff",  backgroundColor: "#000000a7"});

        // Power Up
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
        this.ws.addEventListener('message', (event) => {
    if(this.gameEnded) return;

    const data = JSON.parse(event.data);

    // --- Mensajes de items ---
    if (data.type === 'initialItems') {
        this.createItemsFromServer(data.items);
    }
    if (data.type === 'itemUpdate') {
        this.updateItemFromServer(data.item);
    }

    // --- Otros mensajes del juego ---
    switch(data.type) {
        case 'startGame':
            this.gameStarted = true;
            break;
        case 'playerMove':
            // actualiza la posición del jugador remoto
            //this.player1.gameObject.moveTo(data.x, data.y);
            break;
        case 'gameOver':
            this.endGame(data.winner);
            break;
        case 'playerDisconnected':
            this.handleDisconnect();
            break;
    }
});

        // Avisar al servidor que estamos listos
        this.send({ type: 'playerReady' });

        this.ws.inLobby = false;
    }

     // AÑADIDO PARA ITEMS
    createItemsFromServer(items) {
        items.forEach(it => {
            let itemInstance;
            switch(it.type){
                case 'Candy':
                    itemInstance = new Candy(0.2, it.id, this);
                    break;
                case 'Throwable':
                    itemInstance = new ThrowableItem(0.3, it.id, this);
                    break;
                case 'PowerUp':
                    itemInstance = new SpeedPowerUp(it.x, it.y, 0.3, this);
                    break;
            }

            if(itemInstance){
                itemInstance.gameObject = this.add.sprite(it.x, it.y, it.id).setScale(0.3); // por si no se usa sprite interno
                this.entitiesController.AddEntity(itemInstance);
                this.remoteItems.set(it.id, itemInstance);
            }
        });
    }

    // AÑADIDO PARA ITEMS
    updateItemFromServer(itemData){
        const item = this.remoteItems.get(itemData.id);
        if(!item) return;

        // Actualizar posición y estado de quien lo agarra
        item.x = itemData.x;
        item.y = itemData.y;

        if(item.gameObject) {
            item.gameObject.setPosition(itemData.x, itemData.y);
        }

        item.playerGrabbing = itemData.grabbedBy || null;
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            if(this.gameEnded) return;
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'startGame':
                    this.gameStarted = true;
                    break;

                case 'playerMove':
                    // Actualizar posición del jugador remoto
                    this.player1.sprite.setPosition(data.x, data.y);
                    break;

                case 'gameOver':
                    this.endGame(data.winner);
                    break;

                case 'playerDisconnected':
                    this.handleDisconnect();
                    break;
                // otros casos según lo que envíe tu server
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
        this.gameEnded=true;
        this.gameStarted=false;
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
            if(this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.scene.start('MainMenu');
        });
    }

    send(msg) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    update() {
        if(!this.gameStarted||this.gameEnded) return;

        /*// Actualizar local
        this.localPlayer.Update();

        // Enviar posición al server
        this.send({
            type: 'playerMove',
            x: this.localPlayer.sprite.x,
            y: this.localPlayer.sprite.y
        });*/

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
