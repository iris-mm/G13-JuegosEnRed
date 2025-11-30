export class Entity{
    constructor(x, y, scale, sprite, scene, useSprite = false){
        this.x = x;
        this.y = y;
        this.sprite = sprite;

        this.scene = scene;

        if(useSprite){
            this.gameObject = scene.physics.add.sprite(x, y, sprite)
    
        }else{
            this.gameObject = scene.physics.add.image(x, y, sprite)
        }
        
        this.gameObject.setScale(scale);
    }

    //  Mueve la entidad a una posicion
    MoveTo(x, y){
        this.x = x;
        this.y = y;
        this.UpdateBodyCoords();
    }

    //  Mueve a la entidad 'x' e 'y' unidades
    Move(x, y){
        this.x += x;
        this.y += y;
        this.UpdateBodyCoords();
    }

    UpdateBodyCoords(){
        this.gameObject.x = this.x;
        this.gameObject.y = this.y;
    }

    //  Actualiza la entidad
    Update(){
    }
}