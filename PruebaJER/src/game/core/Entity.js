export class Entity{
    constructor(x, y, sprite, scene){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    //  Mueve la entidad a una posicion
    MoveTo(x, y){
        this.x = x;
        this.y = y;
    }

    //  Mueve a la entidad 'x' e 'y' unidades
    Move(x, y){
        this.x += x;
        this.y += y;
    }

    //  Actualiza la entidad
    Update(){
    }
}