import { Entity } from "../core/Entity.js";

export class OnlineSpeedPowerUp extends Entity {
    constructor(x, y, scale, scene, id) {
        super(x, y, scale, 'speed_powerup', scene, true);

        this.id = id;
        this.scene = scene;
        this.active = true;
    }

    setupOverlap(localPlayer, scene) {
        scene.physics.add.overlap(
            this.gameObject,
            localPlayer.gameObject,
            () => this.collect(localPlayer),
            null,
            this
        );
    }

    collect(player) {
        if (!this.active) return;

        this.active = false;

        // Avisar al servidor
        this.scene.send({
            type: 'POWERUP_COLLECTED',
            powerUpId: this.id,
            player: this.scene.playerRole
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
    }
}
