import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuBackground from '../../assets/fondo menus.png';
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
        // Fondo centrado
        this.add.image(400, 300, 'menuBackground');

        // Título
        this.add.text(400, 100, 'CREPUSCULONES', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // botones usando la clase Button
        const playButton = new Button(
            this,
            400,
            300,
            'buttonBackground',  
            'Jugar',
            () => { this.scene.start('GameScene'); }
        );

        const settingsButton = new Button(
            this,
            400,
            400,
            'buttonBackground',  
            'Opciones',
            () => { this.scene.start('GameScene'); }
        );
        
        const exitButton = new Button(
            this,
            400,
            500,
            'buttonBackground',  
            'Salir',
            () => { this.scene.start('GameScene'); }
        );

        // Carga las fuentes
        document.fonts.ready.then(() => {
        // @ts-ignore
        this.playButton.label.setFontFamily('ButtonsFont');
        });


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
