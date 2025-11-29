import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuCred from '../../assets/menuCreditos.jpg';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }
    
    preload(){
        this.load.image('menuCred', menuCred);
        this.load.image('buttonBackground', buttonBackground);
    }

    create(){

        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuCred')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;
        //Botón volver al menú principal
        const menuButton = new Button(this, 600, 700, 'buttonBackground', 'Menú', () => {
            this.scene.start('MenuScene'); // Ir al menú principal
        });
        
    }
}