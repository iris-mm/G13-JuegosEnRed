import { Entity } from "../core/Entity.js";

export class Item extends Entity{
    constructor(x, y, scale, sprite, scene){
        super(x, y, scale, sprite, scene);

        this.playerGrabbing = null;

        scene.physics.add.overlap(scene.player1.gameObject, this.gameObject, () => { scene.player1.GrabItem(this) } );
        scene.physics.add.overlap(scene.player2.gameObject, this.gameObject, () => { scene.player2.GrabItem(this) } );

        this.grabCooldown = 0;
    }

    GrabItem(player){
        if(player == null) this.playerGrabbing = null;

        if(this.playerGrabbing != null) return;
        if(this.grabCooldown > 0) return;

        this.playerGrabbing = player;
    }

    Update(){
        if(this.grabCooldown > 0) this.grabCooldown--;

        if(this.playerGrabbing){
            this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y - 60)
        }
    }
}