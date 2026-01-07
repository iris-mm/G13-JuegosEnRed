import { Entity } from "../core/Entity.js";

export class SpeedPowerUp extends Entity {
    constructor(x, y, scale, scene) {
        super(x, y, scale, 'speed_powerup', scene, true);

        this.scene = scene;
        this.active = true;

    }

    setupOverlap(player1, player2, scene) {
        scene.physics.add.overlap(
            this.gameObject,
            player1.gameObject,
            () => this.apply(player1),
            null,
            this
        );

        scene.physics.add.overlap(
            this.gameObject,
            player2.gameObject,
            () => this.apply(player2),
            null,
            this
        );
    }

    apply(player) {
        if (!this.active) return;

        this.active = false;
        this.gameObject.setVisible(false);
        this.gameObject.body.enable = false;

        // Aumento velocidad
        const originalSpeed = player.speed;
        player.speed *= 1.5;

        // Duración del efecto 5 segundos
        this.scene.time.delayedCall(5000, () => {
            player.speed = originalSpeed;
            this.respawn();
        });
    }

    respawn() {
        this.MoveTo(
            Phaser.Math.Between(200, 1000),
            Phaser.Math.Between(200, 600)
        );
        this.gameObject.setVisible(true);
        this.gameObject.body.enable = true;
        this.active = true;
    }
}
