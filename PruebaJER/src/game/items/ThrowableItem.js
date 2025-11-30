import { Item } from "./Item";

export class ThrowableItem extends Item{
    constructor(scale, sprite, scene){
        super(-128, -128, scale, sprite, scene);

        this.MoveTo(Phaser.Math.Between(256, 1200 - 256), Phaser.Math.Between(128, 800 - 128));
    }

    Throw(xDir, yDir){

        this.grabCooldown = 60;
        this.GrabItem(null)
    }

    Update(){
        super.Update();
    }
}