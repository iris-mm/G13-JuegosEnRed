import Phaser from 'phaser';
import { Player } from '../../client/game/player/playerController.js';
import { AudioManager } from '../../client/managers/AudioManager.js';

/**
 * ESCENA MULTIJUGADOR ONLINE
 * - Un jugador local
 * - Un jugador remoto
 * - Comunicación por WebSocket
 * - El servidor decide cuándo empieza y cuándo acaba
 */
export class MultiplayerGameScene extends Phaser.Scene {
    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        // 🔹 AÑADIDO: datos del lobby
        this.ws = data.ws;
        this.playerRole = data.playerRole; // 'player1' | 'player2'
        this.gameStarted = false;
    }

    create() {

        this.add.rectangle(600, 400, 1200, 800, 0x1a1a2e);

        // ======================
        // INPUT LOCAL
        // ======================
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        // ======================
        // JUGADORES
        // ======================
        if (this.playerRole === 'player1') {
            this.localPlayer  = new Player(100, 400, 0.4, 'zombi', this, this.keys);
            this.remotePlayer = new Player(1100, 400, 0.4, 'vampiresa', this, null);
        } else {
            this.localPlayer  = new Player(1100, 400, 0.4, 'vampiresa', this, this.keys);
            this.remotePlayer = new Player(100, 400, 0.4, 'zombi', this, null);
        }

        // 🔹 IMPORTANTE: el remoto NO tiene input
       // this.remotePlayer.DisableInput?.();

        // ======================
        // WEBSOCKET
        // ======================
        this.setupWebSocket();

        // Avisar al server de que estoy listo
        this.send({
            type: 'playerReady'
        });

    }

    // ======================
    // WEBSOCKET HANDLING
    // ======================
    setupWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {

                case 'startGame':
                    this.gameStarted = true;
                    break;

                case 'playerMove':
                    // 🔹 Movimiento del jugador remoto
                    this.remotePlayer.MoveTo(data.x, data.y);
                    break;

                case 'gameOver':
                    this.endGame(data.winner);
                    break;
            }
        };

        this.ws.onclose = () => {
            this.endGame('disconnect');
        };
    }

    send(msg) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    // ======================
    // UPDATE
    // ======================
    update() {
        if (!this.gameStarted) return;

        // Movimiento local (igual que en local)
        this.localPlayer.Update();

        // 🔹 AÑADIDO: enviar estado al servidor
        this.send({
            type: 'playerMove',
            x: this.localPlayer.sprite.x,
            y: this.localPlayer.sprite.y
        });
    }

    // ======================
    // FIN DE PARTIDA
    // ======================
    endGame(reason) {
        this.add.text(600, 400,
            reason === 'disconnect' ? 'Jugador desconectado' : 'Fin de la partida',
            { fontSize: '48px', color: '#ffffff' }
        ).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.scene.start('MenuScene');
        });
    }

    shutdown() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
