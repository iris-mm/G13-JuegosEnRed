import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuPause from '../../assets/menuPause2.png';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';
import { AudioManager } from '../game/controllers/AudioManager';
// @ts-ignore
import buttonSound from '../../assets/music_sounds/button_sound.mp3';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }
    
    preload(){
        this.load.image('menuPause', menuPause); 
        this.load.image('buttonBackground', buttonBackground);
        this.load.audio('button_sound', buttonSound);
    }

    create(){
        // Fondo gris
        const overlay = this.add.rectangle(600, 400, 1200, 800, 0x000000, 0.5);

        // Fondo centrado
        const bg = this.add.image(600, 400, 'menuPause')
        .setOrigin(0.5);
        // Ajustar la imagen
        bg.displayWidth = 1200;   // ancho del canvas
        bg.displayHeight = 800;  // alto del canvas 
        
        //Volumen global
        this.sound.volume = AudioManager.getVolume();

        // Botón de "Reanudar"
        const resumeButton = new Button(this, 600, 300, 'buttonBackground', 'Reanudar', () => {
            this.scene.stop(); // Detener la escena de pausa
            this.scene.resume('GameScene'); // Reanudar la escena del juego
        }, { fontSize: '25px' });
         

        //Botón volver al menú principal
        const menuButton = new Button(this, 600, 400, 'buttonBackground', 'Menú', () => {
            AudioManager.playButtonSound(this);
            this.scene.stop('GameScene'); // Detener la escena del juego
            this.scene.start('MenuScene'); // Ir al menú principal
        });
        
         //Botón de "Ajustes"
        const configButton = new Button(this, 600, 500, 'buttonBackground', 'Ajustes', () => {
            AudioManager.playButtonSound(this);
            this.scene.launch('ConfigScene', { from: 'PauseScene' }); // Abrir la escena de configuración
            this.scene.pause(); // Pausar la escena de pausa
        });
    }
}