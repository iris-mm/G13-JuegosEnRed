import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuPause from '../../assets/menuPause2.png';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';


export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }
    
    preload(){
        this.load.image('menuPause', menuPause); 
        this.load.image('buttonBackground', buttonBackground);
    }

    create(){
        // Fondo centrado
        const bg = this.add.image(600, 400, 'menuPause')
        .setOrigin(0.5);
        // Ajustar la imagen
        bg.displayWidth = 1200;   // ancho del canvas
        bg.displayHeight = 800;  // alto del canvas 
        
        
        // Botón de "Reanudar"
        const resumeButton = new Button(this, 600, 300, 'buttonBackground', 'Reanudar', () => {
            this.scene.stop(); // Detener la escena de pausa
            this.scene.resume('GameScene'); // Reanudar la escena del juego
        });
         

        //Botón volver al menú principal
        const menuButton = new Button(this, 600, 400, 'buttonBackground', 'Menú', () => {
            this.scene.stop('GameScene'); // Detener la escena del juego
            this.scene.start('MenuScene'); // Ir al menú principal
        });
        
    }
}