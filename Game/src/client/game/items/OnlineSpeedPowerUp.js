import { Entity } from "../core/Entity.js";

export class OnlineSpeedPowerUp extends Entity {
    constructor(x, y, scale, scene, id) {
        super(x, y, scale, 'speed_powerup', scene, true);

        this.scene = scene;
        this.id = id;
        this.active = true;

        this.gameObject.body.setAllowGravity(false);
        this.gameObject.body.setSize(
            this.gameObject.width * scale,
            this.gameObject.height * scale
        );
        this.gameObject.body.setOffset(
            (this.gameObject.width - this.gameObject.body.width) / 2,
            (this.gameObject.height - this.gameObject.body.height) / 2
        );

        this.gameObject.body.setEnable(true);
        this.gameObject.setVisible(true);

    }

    setupOverlap(localPlayer, scene) {
        scene.physics.add.overlap(
            this.gameObject,
            localPlayer.gameObject,
            () => this.onCollected(),
            null,
            this
        );
    }

    onCollected() {
        if (!this.active) return;

        this.active = false;

        // Avisar al servidor. NO aplicar efecto aquí
        this.scene.send({
            type: 'POWERUP_COLLECTED',
            powerUpId: this.id
        });
    }

    deactivate() {
        this.active = false;
        this.gameObject.setVisible(false);
        this.gameObject.body.enable = false;
    }

    activate(x, y) {
        this.MoveTo(x, y);
        this.gameObject.setVisible(true);
        this.gameObject.body.enable = true;
        this.active = true;

        this.gameObject.body.updateFromGameObject();
    }
}
