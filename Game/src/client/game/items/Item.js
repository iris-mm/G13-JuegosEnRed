import { Entity } from "../core/Entity.js";

export class Item extends Entity{
    constructor(x, y, scale, sprite, scene){
        super(x, y, scale, sprite, scene);

        this.playerGrabbing = null;

    }

    setupOverlap(player1, player2, scene) {
        scene.physics.add.overlap(player1.gameObject, this.gameObject, () => { player1.GrabItem(this) });
        scene.physics.add.overlap(player2.gameObject, this.gameObject, () => { player2.GrabItem(this) });
    }

    

    GrabItem(player){
        console.log('🧪 GrabItem llamado con:', Item);
        if(player == null) return;

        if(this.playerGrabbing != null) return;
        if(player.currentItemGrabbing != null) return;
        
        this.playerGrabbing = player;
    }

    ClearPlayer(){
        this.playerGrabbing = null;
    }

    Update(){
        if(this.playerGrabbing != null){
            this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y - 60)
        }
    }
}