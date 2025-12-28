import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { AudioManager } from '../managers/AudioManager.js';

// @ts-ignore
import IMG_SettingsBackground from '../../../assets/images/SettingsBackground.jpg';
// @ts-ignore
import SPR_Button from '../../../assets/sprites/Button.png';
// @ts-ignore
import MUSIC_Settings from '../../../assets/music/Settings.mp3';

export class SettingsMenu extends Phaser.Scene {
    constructor() {
        super('SettingsMenu');
    }

    preload() {
        this.load.image('IMG_SettingsBackground', IMG_SettingsBackground);
        this.load.image('SPR_Button', SPR_Button);
        this.load.audio('MUSIC_Settings', MUSIC_Settings);
    }

    create() {
        //Volumen global
        this.sound.volume = AudioManager.GetVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('MUSIC_Settings', {
            volume: AudioManager.GetVolume(),
            loop: true
        });
        this.music.play();

        const bg = this.add.image(600, 400, 'IMG_SettingsBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(100, 750, this, 'SPR_Button', "Volver", () => this.GoBack());

        this.cameras.main.fadeIn(100, 0, 0, 0);

        //Texto de "Volumen"
        this.add.text(600, 365, 'Volumen', {
            fontSize: '32px',
            color: '#2c2a2aff',
            
        }).setOrigin(0.5);

        //Barra de volumen
        const barX = 600;
        const barY = 400;
        const barWidth = 300;
        const barHeight = 20;
        //Barra base
        const volumeBar = this.add.rectangle(barX, barY, barWidth, barHeight, 0x888888);
        //Volumen inicial
        let currentVolume = AudioManager.GetVolume();
        this.sound.volume = currentVolume;
        //Barra de relleno
        const volumeIndicator = this.add.rectangle(barX - barWidth / 2 + (currentVolume * barWidth) / 2, barY, currentVolume * barWidth, barHeight,0x222222);
        //Hacer barra interactiva
        const handle = this.add.circle(
            barX - barWidth / 2 + currentVolume * barWidth, barY, 12, 0xffffff
        )
        .setInteractive({ draggable: true });

        //Poder arrastrar el handle
        this.input.setDraggable(handle);
        handle.on('drag', (pointer, dragX, dragY) => {
            //Limitar el movimiento del handle dentro de la barra
            const minX = barX - barWidth / 2;
            const maxX = barX + barWidth / 2;
            if (dragX < minX) dragX = minX;
            if (dragX > maxX) dragX = maxX;
            handle.x = dragX;
            //Actualizar volumen basado en la posición del handle
            currentVolume = (handle.x - minX) / barWidth;
            AudioManager.SetVolume(currentVolume);
            this.sound.setVolume(currentVolume);
            //Actualizar la barra de volumen
            volumeIndicator.width = currentVolume * barWidth;
        });

        //Click en la barra para mover el handle
        volumeBar.setInteractive();
        volumeBar.on('pointerdown', (pointer) => {
            const localX = pointer.x - (barX - barWidth / 2);
            //Actualizar volumen basado en la posición del click
            currentVolume = Phaser.Math.Clamp(localX / barWidth, 0, 1);
            AudioManager.SetVolume(currentVolume);
            this.sound.setVolume(currentVolume);
            //Actualizar la posición del handle y la barra de volumen
            handle.x = barX - barWidth / 2 + currentVolume * barWidth;
            volumeIndicator.width = currentVolume * barWidth;
        });
    }


    GoBack(){
        //Botón de "Volver" según desde dónde se abrió la escena
        if(this.openedFrom === 'MenuScene'){
            this.scene.stop(); // Detener la escena de configuración
            this.scene.stop('PauseScene'); // Asegurarse de detener la escena de pausa si estaba abierta
            this.scene.start('MenuScene'); // Ir al menú principal
        }
        else if(this.openedFrom === 'PauseScene'){
            this.scene.stop(); // Detener la escena de configuración
            this.sound.stopAll();
            this.scene.resume('PauseScene'); // Volver a la escena de pausa
            this.sound.volume = AudioManager.GetVolume();
            this.music = this.sound.add('MUSIC_Game', {
                volume: AudioManager.GetVolume(),
                loop: true
            });
            this.music.play();
        }

        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }

    Init(data){
        this.openedFrom = data?.from || 'MenuScene'; // MenuScene o PauseScene
    }
}