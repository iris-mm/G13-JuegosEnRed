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

        // El jugador sabe cómo entregar el candy
        this.owner.DeliverCandy();
    }


    Restart() {
        this.candies = 0;
        this.text.text = 0;
    }
}