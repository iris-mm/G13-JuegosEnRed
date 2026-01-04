import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuPause from '../../../public/assets/images/PauseBackground.png';
// @ts-ignore
import buttonBackground from '../../../public/assets/sprites/Button.png';
//importar clases Button
import { Button } from '../ui/Button.js';
import { AudioManager } from '../../client/managers/AudioManager.js';
// @ts-ignore
import buttonSound from '../../../public/assets/sfx/ButtonPress.mp3';

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
        this.sound.volume = AudioManager.GetVolume();

        // Botón de "Reanudar"
        const resumeButton = new Button(600, 300, this, 'buttonBackground', 'Reanudar', () => {
            this.scene.stop(); // Detener la escena de pausa
            this.scene.resume('GameScene'); // Reanudar la escena del juego
        }, { fontSize: '23px' });
         

        //Botón volver al menú principal
        const menuButton = new Button(600, 425, this, 'buttonBackground', 'Menú', () => {
            //AudioManager.Play(this);
            this.scene.stop('GameScene'); // Detener la escena del juego
            this.scene.start('MainMenu'); // Ir al menú principal
        });
        
         //Botón de "Ajustes"
        const configButton = new Button(600, 550, this, 'buttonBackground', 'Ajustes', () => {
            //AudioManager.Play(this);
            this.scene.launch('SettingsMenu', { from: 'PauseScene' }); // Abrir la escena de configuración
            this.scene.bringToTop('SettingsMenu');
            //this.scene.pause(); // Pausar la escena de pausa
        });
    }
}