import { ThrowableItem } from "../items/ThrowableItem.js";
import { Entity } from "../core/Entity.js";

export class Player extends Entity {
    constructor(x, y, scale, characterName, scene, cursors, grabItemKey) {
        super(x, y, scale, `${characterName} front`, scene); //Default sprite

        this.scene = scene;
        this.speed = 200;      
        this.characterName = characterName;
        this.cursors = cursors;

        this.grabItemKey = grabItemKey;
        this.currentItemGrabbing = null;

        this.hasInteractedWithItems = false;
        this.hasUpdatedItemInteraction = false;
        this.scene.input.keyboard.on(`keydown-${this.grabItemKey}`, () => this.grabItemInputOn = true );
        this.scene.input.keyboard.on(`keyup-${this.grabItemKey}`, () => this.grabItemInputOn = false );
    }

    Update() {
        this.Movement();
        this.ItemInputs();
    }

    Movement(){
        this.vx = 0;
        this.vy = 0;

        if (this.cursors.left.isDown){
            this.vx = -this.speed;
            this.gameObject.setTexture(`${this.characterName} left`);
        } 
        if (this.cursors.right.isDown){
            this.vx = this.speed;
            this.gameObject.setTexture(`${this.characterName} right`);
        } 
        if (this.cursors.up.isDown){
            this.vy = -this.speed;
            this.gameObject.setTexture(`${this.characterName} back`);
        } 
        if (this.cursors.down.isDown){
            this.vy = this.speed;
            this.gameObject.setTexture(`${this.characterName} front`);
        } 

        this.Move(
            this.vx * this.scene.game.loop.delta / 1000,
            this.vy * this.scene.game.loop.delta / 1000
        );
    }

    ItemInputs(){
        if(!this.hasUpdatedItemInteraction){
            if(this.grabItemInputOn){
                this.hasInteractedWithItems=true;
                this.hasUpdatedItemInteraction=true;
            }
        }else this.hasInteractedWithItems = false;

        if(!this.grabItemInputOn){
            this.hasUpdatedItemInteraction = false;
            this.hasInteractedWithItems = false;
        }
    }

    GrabItem(item){
        if(!this.hasInteractedWithItems) return;
        if(this.currentItemGrabbing != null){
            if(this.currentItemGrabbing instanceof ThrowableItem){
                this.currentItemGrabbing.Throw(this.vx, this.vy);
                this.currentItemGrabbing = null;
            }
            return;
        }

        this.currentItemGrabbing = item;
        item.GrabItem(this)
    }
}