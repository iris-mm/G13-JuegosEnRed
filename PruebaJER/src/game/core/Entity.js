export class Entity{
    constructor(x, y, scale, sprite, scene){
        this.x = x;
        this.y = y;
        this.sprite = sprite;

        this.scene = scene;

        this.gameObject = scene.add.image(x, y, sprite)
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