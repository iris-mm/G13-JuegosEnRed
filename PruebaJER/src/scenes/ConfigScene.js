import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuConfig from '../../assets/menuAjustes.jpg';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';
import { AudioManager } from '../game/controllers/AudioManager';
// @ts-ignore
import configMusic from '../../assets/music_sounds/config_music.mp3';
// @ts-ignore
import gameMusic from '../../assets/music_sounds/game_music.mp3';

export class ConfigScene extends Phaser.Scene {
    constructor() {
        super('ConfigScene');
    }
    
    preload(){
        this.load.image('menuConfig', menuConfig);
        this.load.image('buttonBackground', buttonBackground);
        this.load.audio('config_music', configMusic);
        this.load.audio('game_music', gameMusic);
    }

    init(data){
        this.openedFrom = data?.from||'MenuScene'; //MenuScene o PauseScene
    }

    create(){
        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuConfig')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        //Volumen global
        this.sound.volume = AudioManager.getVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('config_music', {
            volume: AudioManager.getVolume(),
            loop: true
        });
        this.music.play();

        //Botón de "Volver" según desde dónde se abrió la escena
        if(this.openedFrom === 'MenuScene'){
            //Botón volver al menú principal
            const menuButton = new Button(this, 600, 500, 'buttonBackground', 'Menú', () => {
                this.scene.stop(); // Detener la escena de configuración
                this.scene.stop('PauseScene'); // Asegurarse de detener la escena de pausa si estaba abierta
                this.scene.start('MenuScene'); // Ir al menú principal
            });
        }else if(this.openedFrom === 'PauseScene'){
            //Botón volver al menú de pausa
            const pauseButton = new Button(this, 600, 500, 'buttonBackground', 'Volver', () => {
                this.scene.stop(); // Detener la escena de configuración
                this.sound.stopAll();
                this.scene.resume('PauseScene'); // Volver a la escena de pausa
                this.sound.volume = AudioManager.getVolume();
                this.music = this.sound.add('game_music', {
                    volume: AudioManager.getVolume(),
                    loop: true
                });
                this.music.play();
            });
        }

        
        //Texto de "Volumen"
        this.add.text(500, 350, 'Volumen:', {
            fontSize: '32px',
            color: '#2c2a2aff'
        }).setOrigin(0.5);

        //Barra de volumen
        const barX = 600;
        const barY = 400;
        const barWidth = 300;
        const barHeight = 20;
        //Barra base
        const volumeBar = this.add.rectangle(barX, barY, barWidth, barHeight, 0x888888);
        //Volumen inicial
        let currentVolume = AudioManager.getVolume();
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
            AudioManager.setVolume(currentVolume);
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
            AudioManager.setVolume(currentVolume);
            this.sound.setVolume(currentVolume);
            //Actualizar la posición del handle y la barra de volumen
            handle.x = barX - barWidth / 2 + currentVolume * barWidth;
            volumeIndicator.width = currentVolume * barWidth;
        });

        

    }
}