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

        this.throwSpeedX = 0;
        this.throwSpeedY = 0;

        this.isThrown = false;
        this.throwOwner = null;
    }

    Update() {
        super.Update();
        this.ThrowMovement();
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

    setupOverlap(player, playerRole, scene) {
        scene.physics.add.overlap(
                this.gameObject,
                player.gameObject,
                () => this.onPlayerOverlap(player, playerRole)
            );

        scene.physics.add.overlap(
            player.gameObject,
                this.gameObject,
                () => {
                    if (this.throwOwner && this.throwOwner !== player) {
                        player.KnockOut();
                    }
                }
        );
    }

    onPlayerOverlap(player, picker) {
        if(!player.grabKey || !player.grabKey.isDown) return;
        if(player.hasThrowable && this.playerGrabbing != null) return;

        // Avisar al servidor
        if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
            this.scene.ws.send(JSON.stringify({
                type: "THROWABLE_PICKUP",
                itemId: this.id,
                picker
            }));

            this.scene.ws.send(JSON.stringify({
                type: "REQUEST_THROWABLE_PICKUP",
                itemId: this.id,
                picker
            }));
        }

        this.playerGrabbingId = picker
    }
    Reset() {
        this.ClearPlayer();
        // no mover a -64, -64
        // no spawnTime
    }

    CheckThrow(){
        if(!this.playerGrabbing.grabKey.isDown) return;
        
        if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
            this.scene.ws.send(JSON.stringify({
                type: "THROW_ITEM",
                itemId: this.id,
                owner: this.playerGrabbingId
            }));
        }
        this.playerGrabbing.hasThrowable = null;
        this.playerGrabbing.currentItemGrabbing = null;
        this.playerGrabbingId = null;
    }

    ThrowItem(data){
        this.Throw(data.owner.facingX, data.owner.facingY)
        this.Reset();
    }

    Throw(xDir, yDir){
        if(this.playerGrabbing == null) return;

        const throwForce = 30;
        this.throwSpeedX = throwForce * (xDir > 0 ? 1 : xDir == 0 ? 0 : -1);
        this.throwSpeedY = throwForce * (yDir > 0 ? 1 : yDir == 0 ? 0 : -1);

        this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y)
        
        this.isThrown = true;
        this.throwOwner = this.playerGrabbing;
        this.ClearPlayer();
    }

    ThrowMovement(){
        if(Math.abs(this.throwSpeedX) < 1 && Math.abs(this.throwSpeedY) < 1){
            this.throwOwner = null;
            this.isThrown = false;
            return;
        }

        const resistance = 0.9;
        this.Move(this.throwSpeedX *= resistance, this.throwSpeedY *= resistance);

        if(this.x < 50 || this.x > 1200 - 50) {
            this.throwSpeedX *= -1;
            this.Move(5 * Math.sign(this.throwSpeedX), 0)
        }
        if(this.y < 50 || this.y > 800 - 50) {
            this.throwSpeedY *= -1;
            this.Move(0, 5 * Math.sign(this.throwSpeedY))
        }
    }
}
