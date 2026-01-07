import { ThrowableItem } from "../items/ThrowableItem.js";
import { Entity } from "../core/Entity.js";
import { Candy } from "../items/Candy.js";
import { OnlineCandy } from "../items/OnlineCandy.js";

export class Player extends Entity {
    constructor(x, y, scale, characterName, scene, cursors, grabItemKey, isLocal = true) {
        super(x, y, scale, `${characterName}_frontEst`, scene, true); //Default player al iniciar

        this.scene = scene;
        this.speed = 200;
        this.characterName = characterName;
        this.cursors = cursors;

        this.grabItemKey = grabItemKey;
         if (grabItemKey) {
            this.grabKey = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes[grabItemKey]
            );
        }
        this.currentItemGrabbing = null;
        this.isLocal = isLocal;
        this.hasCandy = false;

        this.hasInteractedWithItems = false;
        this.hasUpdatedItemInteraction = false;
        this.grabItemInputOn = false;
        /*this.scene.input.keyboard.on(`keydown-${this.grabItemKey}`, () => this.grabItemInputOn = true );
        this.scene.input.keyboard.on(`keyup-${this.grabItemKey}`, () => this.grabItemInputOn = false );
        */
        this.itemInteractionCooldown = 0;

        this.facingX = 0;
        this.facingY = 0;

        this.hasCandy = false;

        
        this.knockOutTimer = 0;

        // Escuchar tecla de recoger
        if (this.grabItemKey) {
            this.scene.input.keyboard.on(`keydown-${this.grabItemKey}`, () => this.grabItemInputOn = true);
            this.scene.input.keyboard.on(`keyup-${this.grabItemKey}`, () => this.grabItemInputOn = false);
        }


    }

    Update() {
        super.Update();

        if (!this.isLocal) return;

        this.Movement();
        this.ItemInputs();

        // CheckPickup ahora depende de que grabKey esté presionada
        this.CheckPickup();

        // Para objetos que se lanzan
        if(this.currentItemGrabbing && this.currentItemGrabbing instanceof ThrowableItem) {
            this.GrabItem(this.currentItemGrabbing);
        }
    }


    Movement(){
        if(!this.cursors) return;
        if (this.isLocal) {
            this.Movement();
            this.ItemInputs();
            if (this.currentItemGrabbing) this.GrabItem(this.currentItemGrabbing)
        }

    }

    Movement() {
        if (!this.cursors) return;

        this.vx = 0;
        this.vy = 0;
        let moving = false;

        this.facingX = 0;
        this.facingY = 0;

        //Para que soporte las diagonales, primero se detecta la dirección
        if (this.cursors.left?.isDown) {
            this.vx = -this.speed; this.facingX = -1; moving = true;
        }
        if (this.cursors.right?.isDown) {
            this.vx = this.speed; this.facingX = 1; moving = true;
        }
        if (this.cursors.up?.isDown) {
            this.vy = -this.speed; this.facingY = -1; moving = true;
        }
        if (this.cursors.down?.isDown) {
            this.vy = this.speed; this.facingY = 1; moving = true;
        }
        //y luego se elige la animación del personaje
        let animation = null;
        if (moving) {
            if (this.vx !== 0 && this.vy !== 0) { //condición de la diagonal
                animation = this.vx > 0 ? `${this.characterName}_right_anim` : `${this.characterName}_left_anim`;
            } else if (this.vx !== 0) { //mvto normal izq/dcha
                animation = this.vx > 0 ? `${this.characterName}_right_anim` : `${this.characterName}_left_anim`;
            } else if (this.vy !== 0) { //mvto normal arriba/abajo
                animation = this.vy > 0 ? `${this.characterName}_front_anim` : `${this.characterName}_back_anim`;
            }
        }
        if (animation) this.gameObject.anims.play(animation, true); //Se ejecuta la animación si el personaje se está moviendo
        else this.gameObject.setTexture(`${this.characterName}_frontEst`); //si no, idle

        if (this.knockOutTimer > 0) {
            this.knockOutTimer--
            this.vx = 0
            this.vy = 0
            this.facingX = 0
            this.facingY = 0
        }

        this.Move(
            this.vx * this.scene.game.loop.delta / 1000,
            this.vy * this.scene.game.loop.delta / 1000
        );

        //Para que no se salga del mapa
        const halfWidth = this.gameObject.displayWidth / 2;
        const halfHeight = this.gameObject.displayHeight / 2;

        if (this.x < halfWidth) this.MoveTo(halfWidth, this.y);
        if (this.x > this.scene.sys.game.config.width - halfWidth) this.MoveTo(this.scene.sys.game.config.width - halfWidth, this.y);
        if (this.y < halfHeight) this.MoveTo(this.x, halfHeight);
        if (this.y > this.scene.sys.game.config.height - halfHeight) this.MoveTo(this.x, this.scene.sys.game.config.height - halfHeight);
    }

    ItemInputs() {
        if (this.knockOutTimer > 0) {
            this.hasUpdatedItemInteraction = false
            this.hasInteractedWithItems = false
            return;
        }

        if (!this.hasUpdatedItemInteraction) {
            if (this.grabItemInputOn) {
                this.hasInteractedWithItems = true;
                this.hasUpdatedItemInteraction = true;
            }
        } else this.hasInteractedWithItems = false;

        if (!this.grabItemInputOn) {
            this.hasUpdatedItemInteraction = false;
            this.hasInteractedWithItems = false;
        }

        if (this.itemInteractionCooldown > 0) this.itemInteractionCooldown--;
    }

    CheckPickup() {
    // Solo actuamos si el jugador presiona la tecla de recoger
    if (!this.grabItemInputOn||!this.grabKey.isDown) return;

    // Si ya tienes un objeto, no puedes recoger otro
    if (this.currentItemGrabbing) return;

    // Recorremos todas las entidades del escenario
    const entities = this.scene.entitiesController.entities;

    for (let entity of entities) {
        // Solo caramelos
        if (!(entity instanceof Candy || entity instanceof OnlineCandy)) continue;
        if (!entity.hasSpawned) continue;

        //  Verificar si estamos "cerca" del caramelo
        const dx = Math.abs(this.x - entity.x);
        const dy = Math.abs(this.y - entity.y);
        const distanceThreshold = 50; // ajusta según el tamaño del sprite

        if (dx < distanceThreshold && dy < distanceThreshold) {
            //  Solo si estamos cerca y presionando la tecla
            this.currentItemGrabbing = entity;
            this.hasCandy = true;

            // Si es OnlineCandy, avisamos que fue recogido
            if (entity instanceof OnlineCandy) {
                entity.OnCollected();
                // Opcional: avisar al servidor que se recogió
                if (this.scene.ws && this.scene.ws.readyState === WebSocket.OPEN) {
                    this.scene.ws.send(JSON.stringify({
                        type: 'POINT',
                        candyId: entity.id
                    }));
                }
            }

            break; // Solo recoger uno a la vez
        }
    }

}
    GrabItem(item) {
        if (this.itemInteractionCooldown > 0) return;

        if (!this.hasInteractedWithItems) return;

        if (this.currentItemGrabbing != null) {
            if (this.currentItemGrabbing instanceof ThrowableItem) {
                this.currentItemGrabbing.Throw(this.facingX, this.facingY);
                this.currentItemGrabbing = null;
                this.itemInteractionCooldown = 3;
            }
            return;
        }

        if (item.playerGrabbing != null) return;

        item.GrabItem(this);
        this.currentItemGrabbing = item;

        this.itemInteractionCooldown = 3;

         if (this.isLocal && item instanceof OnlineCandy) {
            this.hasCandy = true;
            if (this.scene.send) {
                this.scene.send({
                    type: 'CANDY_PICKUP',
                    candyId: item.id,
                });
            }
        }

        this.hasCandy = this.currentItemGrabbing instanceof Candy || this.currentItemGrabbing instanceof OnlineCandy;
    }

    // Llamar cuando el jugador sujeta un caramelo
    DeliverCandy() {
    if (!this.hasCandy) return;

    const candy = this.currentItemGrabbing;
    if (!candy) return;

    this.hasCandy = false;
    this.currentItemGrabbing = null;

    candy.Reset();

    if (this.isLocal) {
        console.log(
            'CANDY_DELIVERED enviado al server, candyId:',
            candy.id
        );

        this.scene.send({
            type: 'CANDY_DELIVERED',
            candyId: candy.id,
        });
    }
}


    KnockOut() {
        if (this.knockOutTimer > 0) return;

        this.knockOutTimer = 100;

        if (this.currentItemGrabbing != null) {
            this.currentItemGrabbing.MoveTo(this.x, this.y)
            this.currentItemGrabbing.ClearPlayer();
            this.currentItemGrabbing = null;
            this.hasCandy = false;
        }
    }
}