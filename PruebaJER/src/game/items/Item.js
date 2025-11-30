import { Entity } from "../core/Entity.js";

export class Item extends Entity{
    constructor(x, y, scale, sprite, scene){
        super(x, y, scale, sprite, scene);

        this.playerGrabbing = null;

        scene.physics.add.overlap(scene.player1.gameObject, this.gameObject, () => { scene.player1.GrabItem(this) } );
        scene.physics.add.overlap(scene.player2.gameObject, this.gameObject, () => { scene.player2.GrabItem(this) } );
    }

    GrabItem(player){
        if(player == null) return;
        if(this.playerGrabbing != null) return;

        this.playerGrabbing = player;
    }

    ClearPlayer(){
        this.playerGrabbing = null;
    }

    Update(){
        if(this.playerGrabbing){
            this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y - 60)
        }
    }
}