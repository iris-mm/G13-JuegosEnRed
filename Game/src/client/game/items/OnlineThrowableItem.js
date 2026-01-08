import { Item } from "./Item.js";

export class OnlineThrowableItem extends Item {
    /**
     * @param {number} x - Posición X enviada por el servidor
     * @param {number} y - Posición Y enviada por el servidor
     * @param {number} scale 
     * @param {string} sprite 
     * @param {Phaser.Scene} scene 
     * @param {string} id - ID único del caramelo enviado por el servidor
     */
    constructor(x, y, scale, sprite, scene, id) {
        super(x, y, scale, sprite, scene);

        this.id = id;
        this.hasSpawned = true;
    }

    Update() {
        super.Update();
        // No spawn, no spawnTime, nada de random
    }

    OnCollected() {
        this.ClearPlayer();
        this.MoveTo(-64, -64); // ocultarlo mientras llega la nueva posición
        this.hasSpawned = false;

        if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
            this.scene.ws.send(JSON.stringify({
                type: 'REQUEST_CANDY_RESPAWN',
                candyId: this.id
            }));
        }
    }

    setupOverlap(player1, player2, scene) {
        scene.physics.add.overlap(
            this.gameObject,
            player1.gameObject,
            () => this.onPlayerOverlap(player1)
        );

        scene.physics.add.overlap(
            this.gameObject,
            player2.gameObject,
            () => this.onPlayerOverlap(player2)
        );
    }

    onPlayerOverlap(player) {
        if (!player.isLocal) return;

        // Avisar al servidor
        if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
            this.scene.ws.send(JSON.stringify({
                type: "THROWABLE_PICKUP",
                itemId: this.id
            }));

            this.scene.ws.send(JSON.stringify({
                type: "REQUEST_THROWABLE_PICKUP",
                itemId: this.id
            }));

        }
    }




    Reset() {
        this.ClearPlayer();
        // no mover a -64, -64
        // no spawnTime
    }

}
