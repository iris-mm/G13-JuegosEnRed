import { Entity } from "../core/Entity.js";

export class Candy extends Entity{
    constructor(scale, sprite, scene){
        super(-32, -32, scale, sprite, scene);

        this.spawnTime = Phaser.Math.Between(60, 240);
        this.hasSpawned = false;
    }


    Update(){
        if(!this.hasSpawned){
            this.spawnTime--;
            if(this.spawnTime < 0){
                this.MoveTo(Phaser.Math.Between(256, 1200 - 256), Phaser.Math.Between(128, 800 - 128));
                this.hasSpawned = true;
            }
        }
    }
}