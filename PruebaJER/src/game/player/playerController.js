import { Entity } from "../core/Entity.js";

export class Player extends Entity {
    constructor(x, y, scale, characterName, scene, cursors) {
        super(x, y, scale, `${characterName} front`, scene); //Default sprite

        this.scene = scene;
        this.speed = 200;      
        this.cursors = cursors;
        this.characterName = characterName; 
    }

     Update() {
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown){
            vx = -this.speed;
            this.gameObject.setTexture(`${this.characterName} left`);
        } 
        if (this.cursors.right.isDown){
            vx = this.speed;
            this.gameObject.setTexture(`${this.characterName} right`);
        } 
        if (this.cursors.up.isDown){
            vy = -this.speed;
            this.gameObject.setTexture(`${this.characterName} back`);
        } 
        if (this.cursors.down.isDown){
            vy = this.speed;
            this.gameObject.setTexture(`${this.characterName} front`);
        } 

        this.Move(
            vx * this.scene.game.loop.delta / 1000,
            vy * this.scene.game.loop.delta / 1000
        );
    }
}