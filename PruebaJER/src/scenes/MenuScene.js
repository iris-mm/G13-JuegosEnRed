import Phaser from 'phaser';

//importar imágenes
// @ts-ignore
import menuBackground from '../../assets/fondo menus.png';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
// @ts-ignore
import title from '../../assets/Crepusculones.png';

//importar clases
import { Button } from '../entities/Button.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuBackground', menuBackground); 
        this.load.image('buttonBackground', buttonBackground);
        this.load.image('title', title);
    }

    create() {
        // Fondo centrado
        this.add.image(400, 300, 'menuBackground');

        // Título
        this.add.image(565, 350, 'title').setScale(0.7);

        // botones usando la clase Button
        const playButton = new Button(
            this,
            250,
            350,
            'buttonBackground',  
            'Jugar',
            () => { this.scene.start('GameScene'); }
        );

        const settingsButton = new Button(
            this,
            250,
            475,
            'buttonBackground',  
            'Ajustes',
            () => { 
                this.scene.stop('PauseScene'); 
                this.scene.start('ConfigScene',{ from: 'MenuScene' }); }
        );
        
        const creditsButton = new Button(
            this,
            250,
            600,
            'buttonBackground',  
            'Créditos',
            () => { this.scene.start('CreditsScene'); }
        );
    }
}
