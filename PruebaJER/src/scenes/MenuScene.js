import Phaser from 'phaser';

//importar imagenes
// @ts-ignore
import menuBackground from '../../assets/MainMenu2.jpg';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';

//importar clases
import { Button } from '../entities/Button.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuBackground', menuBackground); 
        this.load.image('buttonBackground', buttonBackground);
    }

    create() {
        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuBackground')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        // botones usando la clase Button
        const playButton = new Button(
            this,
            350,
            350,
            'buttonBackground',  
            'Jugar',
            () => { this.scene.start('GameScene'); }
        );

        const settingsButton = new Button(
            this,
            350,
            500,
            'buttonBackground',  
            'Opciones',
            () => { 
                this.scene.stop('PauseScene'); 
                this.scene.start('ConfigScene',{ from: 'MenuScene' }); }
        );
        
        const creditsButton = new Button(
            this,
            350,
            650,
            'buttonBackground',  
            'Créditos',
            () => { this.scene.start('CreditsScene'); }
        );


        /*// Botón Jugar
        const localBtn = this.add.text(400, 320, 'Jugar', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerover', () => localBtn.setStyle({ fill: '#7bffc1ff' }))
          .on('pointerout', () => localBtn.setStyle({ fill: '#00ff00' }))
          .on('pointerdown', () => this.scene.start('GameScene'));

        // Botón Online (no disponible)
        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not Available)', {
            fontSize: '24px',
            color: '#ad32ffff',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerover', () => onlineBtn.setStyle({ fill: '#ca9ee7ff' }))
          .on('pointerout', () => onlineBtn.setStyle({ fill: '#ad32ffff' }));*/
    }
}
