import { ThrowableItem } from "../items/ThrowableItem.js";
import { Entity } from "../core/Entity.js";

export class Player extends Entity {
    constructor(x, y, scale, characterName, scene, cursors, grabItemKey) {
        super(x, y, scale, `${characterName}_frontEst`, scene, true); //Default player al iniciar

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
        let moving = false;

        if (this.cursors.left.isDown){
            this.vx = -this.speed;
            this.gameObject.anims.play(`${this.characterName}_left_anim`, true);
            moving = true;
        } 
        if (this.cursors.right.isDown){
            this.vx = this.speed;
            this.gameObject.anims.play(`${this.characterName}_right_anim`, true);
            moving = true;
        } 
        if (this.cursors.up.isDown){
            this.vy = -this.speed;
            this.gameObject.anims.play(`${this.characterName}_back_anim`, true);
            moving = true;
        } 
        if (this.cursors.down.isDown){
            this.vy = this.speed;
            this.gameObject.anims.play(`${this.characterName}_front_anim`, true);
            moving = true;
        } 
        if(!moving){this.gameObject.setTexture(`${this.characterName}_frontEst`)}

        this.Move(
            this.vx * this.scene.game.loop.delta / 1000,
            this.vy * this.scene.game.loop.delta / 1000
        );

        //Para que no se salga del mapa
        const halfWidth = this.gameObject.displayWidth / 2;
        const halfHeight = this.gameObject.displayHeight / 2;

        if(this.x < halfWidth) this.MoveTo(halfWidth, this.y);
        if(this.x > this.scene.sys.game.config.width - halfWidth) this.MoveTo(this.scene.sys.game.config.width - halfWidth, this.y);
        if(this.y < halfHeight) this.MoveTo(this.x, halfHeight);
        if(this.y > this.scene.sys.game.config.height - halfHeight) this.MoveTo(this.x, this.scene.sys.game.config.height - halfHeight);
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