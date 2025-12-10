export class EntitiesController {
    constructor(){
        this.entities = [];
    }

    AddEntity(entity){
        this.entities.push(entity);
    }

    Update(){
        this.entities.forEach(element => {
            element.Update();
        });
    }
}