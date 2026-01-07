import { Entity } from "../core/Entity.js";

export class CandyBasket extends Entity{
    constructor(x, y, textX, textY, playerOwner, scene){
        super(x, y, 0.15, null, scene)

        this.owner = playerOwner;
        this.candies = 0;

        this.text = scene.add.text(textX, textY, 0, {fontSize: "32px",color: "#ffffff",  backgroundColor: "#000000a7"})

        this.gameObject.visible = false;
        scene.physics.add.overlap(playerOwner.gameObject, this.gameObject, () => this.CheckForCandy())
    }

    CheckForCandy(){
        if(!this.owner.hasCandy) return;

        this.text.text = ++this.candies;

        this.owner.hasCandy = false;
        this.owner.currentItemGrabbing.Reset();
        this.owner.currentItemGrabbing = null;
    }

    Restart(){
        this.candies = 0;
        this.text.text = 0;
    }
}