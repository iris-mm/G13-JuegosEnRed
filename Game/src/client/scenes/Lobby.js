import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { connectionManager } from '../../client/managers/ConnectionManager.js';

// @ts-ignore
import IMG_DefaultBackground from '../../../public/assets/images/DefaultBackground.png';
// @ts-ignore
import SPR_Vampire from '../../../public/assets/sprites/Vampire.png';
// @ts-ignore
import SPR_Zombie from '../../../public/assets/sprites/Zombie.png';

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
        this.youText = this.add.text(300, 120, "Tú", {fontSize: "32px"}).setOrigin(0.5);

        this.player2Icon = this.add.image(1200 - 300, 300, 'SPR_Zombie');
        this.enemyText = this.add.text(1200 - 300, 120, "Rival", {fontSize: "32px"}).setOrigin(0.5);

        this.stateText = this.add.text(600, 500, "...", {fontSize: "32px"}).setOrigin(0.5);

        this.cameras.main.fadeIn(100, 0, 0, 0);

        this.connectionListener = (data) => { this.UpdateSceneOnConnection(data); }
        connectionManager.addListener(this.connectionListener)

        this.socket = null;
        this.connectToServer();

        // Status text
        this.statusText = this.add.text(1200 / 2, 800 / 2 - 50, 'Connecting to server...', {
        fontSize: '24px',
        color: '#ffff00'
        }).setOrigin(0.5);
    }

    Leave(){
        this.Shutdown();
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }

    UpdateSceneOnConnection(data){
        try {
            if (data.connected) {
                this.startButton=this.add.text(600, 600, '¡Rival encontrado! (${data.count})', {
                    color: '#00ff00',
                });
                this.startButton.on('pointerdown', () => {
                    this.socket.send(JSON.stringify({
                         type: 'PLAYER_READY' }));
                });

                // this.startButton.setPosition(600, 600)
                // this.stateText.setText(`¡Rival encontrado! (${data.count})`);
                // this.stateText.setColor('#00ff00');
                // this.startButton.on('pointerdown', () => {
                //     this.socket.send(JSON.stringify({
                //          type: 'PLAYER_READY' })));
                
            } else {
                this.startButton.setPosition(-128, -128)
                this.stateText.setText('Esperando rival...');
                this.stateText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[Lobby] Error updating connection display:', error);
        }
    }

    Shutdown() {
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
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
                console.error('WebSocket error:', error);
                this.statusText.setText('Connection error!');
                this.statusText.setColor('#ff0000');
            };
            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                if (this.scene.isActive('LobbyScene')) {
                    this.statusText.setText('Connection lost!');
                    this.statusText.setColor('#ff0000');
                }
            };
        } catch (error) {
            console.error('Error connecting to server:', error);
            this.statusText.setText('Failed to connect!');
            this.statusText.setColor('#ff0000');

        }
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'START_GAME':
                console.log('Game starting in room:', data.roomId);
                this.scene.start('PlayModeMenu', { 
                    roomId: data.roomId,
                    role: data.role, 
                    socket: this.ws });
                break;

            default:
                console.log('Unknown server message type:', data.type);
        }
    }
    
}