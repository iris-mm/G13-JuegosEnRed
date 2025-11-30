import { Item } from "./Item";

export class ThrowableItem extends Item{
    constructor(scale, sprite, scene){
        super(-128, -128, scale, sprite, scene);

        scene.physics.add.overlap(scene.player1.gameObject, this.gameObject, (player) => { if(this.throwOwner != null && this.throwOwner != scene.player1) scene.player1.KnockOut(); } );
        scene.physics.add.overlap(scene.player2.gameObject, this.gameObject, (player) => { if(this.throwOwner != null && this.throwOwner != scene.player2) scene.player2.KnockOut(); } );

        this.MoveTo(Phaser.Math.Between(256, 1200 - 256), Phaser.Math.Between(128, 800 - 128));

        this.throwSpeedX = 0;
        this.throwSpeedY = 0;

        this.isThrown = false;
        this.throwOwner = null;
    }

    Throw(xDir, yDir){
        console.log("thrown")

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
        let speedX = this.throwSpeedX > 0 ? this.throwSpeedX : -this.throwSpeedX;
        let speedY = this.throwSpeedY > 0 ? this.throwSpeedY : -this.throwSpeedY;

        if(speedX < 1 && speedY < 1){
            this.throwOwner = null;
            this.isThrown = false;
            return;
        }

        const resistance = 0.9;
        this.Move(this.throwSpeedX *= resistance, this.throwSpeedY *= resistance);
    }
}