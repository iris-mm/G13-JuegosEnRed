import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { connectionManager } from '../../client/managers/ConnectionManager.js';

// @ts-ignore
import IMG_DefaultBackground from '../../../public/assets/images/DefaultBackground.png';
// @ts-ignore
import SPR_Vampire from '../../../public/assets/sprites/vampiresa_front.png';
// @ts-ignore
import SPR_Zombie from '../../../public/assets/sprites/zombie_front.png';

export class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    preload() {
        this.load.image('IMG_DefaultBackground', IMG_DefaultBackground);
        this.load.image('SPR_Vampire', SPR_Vampire);
        this.load.image('SPR_Zombie', SPR_Zombie);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_DefaultBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        this.startButton = new Button(-128, -128, this, 'SPR_Button', "Comenzar", null);
        new Button(600, 750, this, 'SPR_Button', "Salir", () => this.Leave());
        
        this.player1Icon = this.add.image(300, 300, 'SPR_Vampire');
        this.youText = this.add.text(300, 120, "...", {fontSize: "32px"}).setOrigin(0.5);

        this.player2Icon = this.add.image(1200 - 300, 300, 'SPR_Zombie');
        this.enemyText = this.add.text(1200 - 300, 120, "...", {fontSize: "32px"}).setOrigin(0.5);

        this.stateText = this.add.text(600, 500, "...", {fontSize: "32px"}).setOrigin(0.5);

        this.cameras.main.fadeIn(100, 0, 0, 0);

        this.stateText.setText(`Esperando rival...`);
        this.stateText.setColor('#ff0000');
        this.startButton.setPosition(-128, -128)

        this.socket = null;
        this.connectToServer();
    }

    Leave(){
        this.LeaveQueue();
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }

    
    connectToServer() {
        try {
            // Connect to WebSocket server (same host as web server)
            const wsUrl = `ws://${window.location.host}`;

            this.ws= new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('Connected to WebSocket server');
                // Join matchmaking queue
                this.ws.send(JSON.stringify({ type: 'JOIN_QUEUE' }));
            };
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleServerMessage(data);
                } catch (error) {
                    console.error('Error parsing server message:', error);
                }
            };
            

            this.ws.onerror = (error) => {
                this.startButton.setPosition(-128, -128)
                console.error('WebSocket error:', error);
                this.stateText.setText('# Error de conexión #');
                this.stateText.setColor('#ff0000');
            };
            this.ws.onclose = () => {
                this.startButton.setPosition(-128, -128)
                console.log('WebSocket connection closed');
                if (this.scene.isActive('LobbyScene')) {
                    this.stateText.setText('# Conexión perdida #');
                    this.stateText.setColor('#ff0000');
                }
            };
        } catch (error) {
            this.startButton.setPosition(-128, -128)
            console.error('Error connecting to server:', error);
            this.stateText.setText('# Fallo al conectar#');
            this.stateText.setColor('#ff0000');

        }
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'playerDisconnected':
                this.stateText.setText(`Esperando rival...`);
                this.stateText.setColor('#ff0000');
                this.startButton.setPosition(-128, -128)

                this.socket = null;
                this.connectToServer();
                break;

            case 'gameStart':
                this.stateText.setText(`¡Rival encontrado!`);
                this.stateText.setColor('#00ff00');
                this.startButton.setPosition(600, 600)
                this.startButton.container.on('pointerdown', () => {
                    this.socket.send(JSON.stringify({
                         type: 'PLAYER_READY' }));
                });
                break;

            case 'START_GAME':
                console.log('Game starting in room:', data.roomId);
                this.scene.start('GameScene', { 
                    roomId: data.roomId,
                    role: data.role, 
                    socket: this.ws });
                break;

            default:
                console.log('Unknown server message type:', data.type);
        }
    }
    
    LeaveQueue() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
        this.ws.close();
      }
    }
}