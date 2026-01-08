import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

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

        this.startButton = new Button(600, 600, this, 'SPR_Button', "Comenzar", () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'PLAYER_READY' }));
                this.startButton.setPosition(-128, -128); // ocultar botón tras pulsar
                this.stateText.setText('Esperando que el rival esté listo...');
                this.stateText.setColor('#ffff00');
            }
        });
        this.startButton.setPosition(-128, -128); // oculto al inicio

        new Button(600, 750, this, 'SPR_Button', "Salir", () => this.Leave());

        this.player1Icon = this.add.image(1200 - 300, 300, 'SPR_Vampire');
        this.player1Name = this.add.text(300, 120, "...", { fontSize: "32px" }).setOrigin(0.5);

        this.player2Icon = this.add.image(300, 300, 'SPR_Zombie');
        this.player2Name = this.add.text(1200 - 300, 120, "...", { fontSize: "32px" }).setOrigin(0.5);

        this.stateText = this.add.text(600, 500, "...", { fontSize: "32px" }).setOrigin(0.5);

        this.cameras.main.fadeIn(100, 0, 0, 0);

        this.stateText.setText(`Esperando rival...`);
        this.stateText.setColor('#ff0000');
        this.startButton.setPosition(-128, -128)

        this.socket = null;
        this.connectToServer();


    }

    Leave() {
        this.LeaveQueue();
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }


    connectToServer() {
        try {
            // Connect to WebSocket server (same host as web server)
            const wsUrl = `ws://${window.location.host}`;

            this.ws = new WebSocket(wsUrl);
            this.ws.inLobby = true;

            this.ws.onopen = () => {
                console.log('Connected to WebSocket server');
                // Join matchmaking queue
                this.ws.send(JSON.stringify({ type: 'JOIN_QUEUE', userId: localStorage.getItem('userId') }));
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
            this.stateText.setText('# Fallo al conectar #');
            this.stateText.setColor('#ff0000');

        }
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'playerNotConnected':
            case 'playerDisconnected':
                this.stateText.setText(`Esperando rival...`);
                this.stateText.setColor('#ff0000');
                this.startButton.setPosition(-128, -128)

                this.player1Name.setText("...");
                this.player2Name.setText("...");

                this.socket = null;
                this.connectToServer();
                break;

            case 'gameStart':
                this.stateText.setText(`¡Rival encontrado!`);
                this.stateText.setColor('#00ff00');
                this.startButton.setPosition(600, 600); // Ahora sí es clicable

                let player1Username = "TÚ";
                let player2Username = "TÚ";

                fetch(`/api/users/${data.enemyId}`)
                    .then(res => {
                        if (!res.ok) throw new Error();
                        return res.json();
                    })
                    .then(user => {
                        if (data.role == "player1") player2Username = user.username; else player1Username = user.username;

                        this.player1Name.setText(player1Username);
                        this.player2Name.setText(player2Username);
                    })
                    .catch(() => {
                        console.warn('No se pudo cargar el usuario');
                    });

                break;

            case 'START_GAME':
                console.log('Game starting in room:', data.roomId);

                // IMPORTANTE: desactivar el handler del Lobby
                this.ws.onmessage = null;

                // Desactivar handler del Lobby
                this.ws.onmessage = null;

                // Parar la escena Lobby
                this.scene.stop('Lobby');

                // Iniciar la escena del juego
                this.scene.start('MultiplayerGameScene', {
                    ws: this.ws,
                    roomId: data.roomId,
                    playerRole: data.role,
                });

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