import { Entity } from "../core/Entity.js";

export class CandyBasket extends Entity {
    constructor(x, y, textX, textY, playerOwner, scene) {
        super(x, y, 0.15, null, scene)

        this.owner = playerOwner;
        this.candies = 0;

        this.text = scene.add.text(textX, textY, 0, { fontSize: "32px", color: "#ffffff", backgroundColor: "#000000a7" })

        this.gameObject.visible = false;
        scene.physics.add.overlap(
            playerOwner.gameObject,
            this.gameObject,
            () => {
                if (playerOwner.hasCandy) playerOwner.DeliverCandy();
            }
        );

    }

    CheckForCandy() {
        if (!this.owner.hasCandy) return;

        this.text.text = ++this.candies;
        
        // Reset del jugador
        this.owner.hasCandy = false;
        if (this.owner.currentItemGrabbing) {
            this.owner.currentItemGrabbing.Reset();
            this.owner.currentItemGrabbing = null;
        }
        // Notificar al servidor que se entregó un caramelo
        if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
            this.scene.ws.send(JSON.stringify({
                type: 'CANDY_DELIVERED',
                player: this.owner === this.scene.localPlayer ? 'player1' : 'player2'
            }));
    }
        
    }


    Restart() {
        this.candies = 0;
        this.text.text = 0;
    }
}