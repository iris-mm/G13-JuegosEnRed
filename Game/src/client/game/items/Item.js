import { Entity } from "../core/Entity.js";

export class Item extends Entity {
    constructor(x, y, scale, sprite, scene){
        super(x, y, scale, sprite, scene);

        this.playerGrabbing = null;

        // Detectar colisiones con los jugadores
        scene.physics.add.overlap(scene.player1.gameObject, this.gameObject, () => { scene.player1.GrabItem(this) } );
        scene.physics.add.overlap(scene.player2.gameObject, this.gameObject, () => { scene.player2.GrabItem(this) } );
    }

    GrabItem(player){
        if(player == null) return;
        if(this.playerGrabbing != null) return;
        if(player.currentItemGrabbing != null) return;
        
        this.playerGrabbing = player;
        player.currentItemGrabbing = this;

        // Enviar al servidor que este item ha sido agarrado
        if(this.scene && this.scene.send) {
            this.scene.send({
                type: 'ITEM_ACTION',
                action: {
                    type: 'grabItem',
                    id: this.gameObject.texture.key, // o usa un id único si lo tienes
                    playerId: player.role, // depende de cómo identifiques a los jugadores
                    x: this.x,
                    y: this.y
                }
            });
        }
    }

    ClearPlayer(){
        if(this.playerGrabbing) this.playerGrabbing.currentItemGrabbing = null;
        this.playerGrabbing = null;
    }

    Update(){
        if(this.playerGrabbing != null){
            this.MoveTo(this.playerGrabbing.x, this.playerGrabbing.y - 60);
        }
    }

    MoveTo(x, y){
        this.x = x;
        this.y = y;

        if(this.gameObject){
            this.gameObject.setPosition(x, y);
        }

        // Enviar al servidor que el item se ha movido (por spawn o lanzamiento)
        if(this.scene && this.scene.send){
            this.scene.send({
                type: 'ITEM_ACTION',
                action: {
                    type: 'moveItem',
                    id: this.gameObject.texture.key,
                    x: this.x,
                    y: this.y
                }
            });
        }
    }
}
