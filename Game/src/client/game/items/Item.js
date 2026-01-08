import { Entity } from "../core/Entity.js";

export class Item extends Entity{
    constructor(x, y, scale, sprite, scene){
        super(x, y, scale, sprite, scene);

        this.playerGrabbing = null;
        this.playerGrabbingId = null;
    }

    setupOverlap(player, scene) {
        scene.physics.add.overlap(player.gameObject, this.gameObject, () => { player.GrabItem(this) });
    }

    GrabItem(player){
        if(player == null) return;

        if(this.playerGrabbing != null) return;
        if(player.currentItemGrabbing != null) return;
        
        this.playerGrabbing = player;
    }

    ClearPlayer(){
        this.playerGrabbing = null;
        this.playerGrabbingId = null;
    }

    Update(){
        if(this.playerGrabbing != null){
            this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y - 60)
        }
    }
}