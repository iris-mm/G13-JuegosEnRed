import { Item } from "./Item.js";

export class OnlineCandy extends Item {
    /**
     * @param {number} x - Posición X enviada por el servidor
     * @param {number} y - Posición Y enviada por el servidor
     * @param {number} scale 
     * @param {string} sprite 
     * @param {Phaser.Scene} scene 
     * @param {string} id - ID único del caramelo enviado por el servidor
     */
    constructor(x, y, scale, sprite, scene, id) {
        super(x, y, scale, sprite, scene);

        this.id = id;
        this.hasSpawned = true;  
    }
 
    Update() {
        super.Update();
        // No spawn, no spawnTime, nada de random
    }

    Reset() {
        this.ClearPlayer();
        // no mover a -64, -64
        // no spawnTime
    }
}
