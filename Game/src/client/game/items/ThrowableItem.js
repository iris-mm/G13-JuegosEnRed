import { Item } from "./Item.js";

export class ThrowableItem extends Item{
    constructor(scale, sprite, scene){
        super(-128, -128, scale, sprite, scene);

        this.MoveTo(Phaser.Math.Between(256, 1200 - 256), Phaser.Math.Between(128, 800 - 128));

        this.throwSpeedX = 0;
        this.throwSpeedY = 0;

        this.isThrown = false;
        this.throwOwner = null;
    }

    setupOverlap(player1, player2, scene) {
        super.setupOverlap(player1, player2, scene);
        scene.physics.add.overlap(
            player1.gameObject,
            this.gameObject,
            () => {
                if (this.throwOwner && this.throwOwner !== player1) {
                    player1.KnockOut();
                }
            }
        );

        scene.physics.add.overlap(
            player2.gameObject,
            this.gameObject,
            () => {
                if (this.throwOwner && this.throwOwner !== player2) {
                    player2.KnockOut();
                }
            }
        );
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

    Update(){
        super.Update();
        this.ThrowMovement();
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