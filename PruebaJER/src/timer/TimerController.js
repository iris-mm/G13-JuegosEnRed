export class TimerController{
    constructor (scene, text){
        this.scene = scene;
        this.text = text;
    }

    start(duration = 45000){
        //Si ya existe, destruir el actual
        this.stop();

        this.duration = duration;

        this.timerEvent = this.scene.time.addEvent(
        {delay:duration, 
        loop: false,
        callback: () => {
            // Timer terminado: reiniciar con 15 segundos menos
            const nextDuration = Math.max(0, this.duration - 10000);
            this.start(nextDuration);
        }});
    }

    stop(){
        if(this.timerEvent){
            this.timerEvent.destroy();
            this.timerEvent = undefined;
        }
    }

    update(){
        //Si no existe, volver
        if (!this.timerEvent || this.duration <= 0){
            return
        }

        const elapsed = this.timerEvent.getElapsed();
        const remaining = this.duration - elapsed;

        // Evitar negativo
        const seconds = Math.max(0, remaining / 1000);

        this.text.text = `${seconds.toFixed(2)}`;
    }
}