import { AudioManager } from "./AudioManager";

export class TimerController{
    constructor (scene, text){
        this.scene = scene;
        this.text = text;

        //Cuenta de rondas
        this.cycles = 0;        // cuántas veces ha terminado
        this.maxCycles = 3;     // máximo de repeticiones
    }

    start(duration, callback){
        //Si ya existe, destruir el actual
        this.stop();

        this.duration = duration;
        this.alertPlayed = false;
        this.timerEvent = this.scene.time.addEvent(
        {delay:duration, 
        loop: false,
        callback: () => {
            callback();
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

        //Sonido de alerta cuando quedan 10 segundos o menos
          if (seconds <= 5 && !this.alertPlayed) {
            const timerAlert = this.scene.sound.add('timer_alert');
            timerAlert.play({ volume: AudioManager.getVolume() * 4 });
            this.alertPlayed = true;
        }
    }
}