import { Entity } from "../core/Entity.js";

export class Candy extends Entity{
    constructor(x, y, sprite, scene){
        super(x, y, sprite, scene);

        this.spawnTime = 60 + (Math.random() * 180);
        this.hasSpawned = false;
        this.MoveTo(-16, -16);
    }


    Update(){
        if(!this.hasSpawned) this.spawnTime--;
        if(this.spawnTime == 0){
            this.MoveTo(32 + Math.random() * (600 - 32), 32 + Math.random() * (400 - 32));
            this.hasSpawned = true;
        }
    }
}