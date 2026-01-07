import { Item } from "./Item.js";

export class OnlineCandy extends Item {
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

    setupOverlap(player, otherPlayer, scene) {
    // Detecta colisión del caramelo con un jugador
    scene.physics.add.overlap(player.gameObject, this.gameObject, () => {
        // Solo si el jugador no tiene ya un caramelo y este caramelo está disponible
        if (!player.hasCandy && this.hasSpawned) {
            this.hasSpawned = false;        // caramelo ya no está en el mapa
            this.holder = player;           // referencia a quién lo lleva
            player.hasCandy = true;         // el jugador ahora tiene un caramelo
            player.currentItemGrabbing = this; // referencia al caramelo que lleva
        }
    });
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
    player.currentItemGrabbing = this;

    // Auto-recoger si quieres que no haya tecla
    if (player.grabItemInputOn) {
        player.GrabItem(this);
    }
}

    
    Reset() {
        this.ClearPlayer();
        // no mover a -64, -64
        // no spawnTime
    }

}
