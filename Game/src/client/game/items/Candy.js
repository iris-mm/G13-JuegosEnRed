import { Item } from "./Item.js";

export class Candy extends Item{
    constructor(scale, sprite, scene){
        super(-64, -64, scale, sprite, scene);

        this.Reset();
    }

    OnCollected() {
        this.ClearPlayer();
        this.MoveTo(-64, -64); 
        this.hasSpawned = false;
    } 
    Update(){
        super.Update();

        if(!this.hasSpawned){
            this.spawnTime--;
            if(this.spawnTime < 0){
                this.MoveTo(Phaser.Math.Between(256, 1200 - 256), Phaser.Math.Between(128, 800 - 128));
                this.hasSpawned = true;
            }
        }
    }

    Reset(){
        this.MoveTo(-64, -64);
        
        this.spawnTime = Phaser.Math.Between(60, 240);
        this.hasSpawned = false;
        
        this.ClearPlayer();
    }
}