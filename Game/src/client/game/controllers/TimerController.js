import { AudioManager } from "../../../client/managers/AudioManager.js";

export class TimerController{
    constructor (scene, text){
        this.scene = scene;
        this.text = text;

        this.remainingTime = 100;
        this.canCountDown = true;

        //Cuenta de rondas
        this.cycles = 0;        // cuántas veces ha terminado
        this.maxCycles = 3;     // máximo de repeticiones
    }

    disableCountdown(){
        this.canCountDown = false;
        this.stop();
    }

    set(time){
        this.remainingTime = time;
    }
    setNotCooldownEvent(callback){
        this.notCooldownEvent = callback;
    }

    start(duration, callback){
        //Si ya existe, destruir el actual
        this.stop();

        if(!this.canCountDown) return;

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
        if (this.canCountDown && (!this.timerEvent || this.duration <= 0)){
            return;
        }

        if(this.canCountDown){
            const elapsed = this.timerEvent.getElapsed();
            this.remainingTime = this.duration - elapsed;
        }

        // Evitar negativo
        const seconds = Math.max(0, this.remainingTime / 1000);

        this.text.text = `${seconds.toFixed(2)}`;

        //Sonido de alerta cuando quedan 10 segundos o menos
        if (seconds <= 5 && !this.alertPlayed) {
            const timerAlert = this.scene.sound.add('timer_alert');
            timerAlert.play({ volume: AudioManager.GetVolume() * 4 });
            this.alertPlayed = true;
        }

        if(seconds <= 0 && this.notCooldownEvent){
            this.notCooldownEvent();
            this.notCooldownEvent = null;
        }
    }
}