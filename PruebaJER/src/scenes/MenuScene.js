import Phaser from 'phaser';
// @ts-ignore
import menuBackground from '../assets/pantalla_de_inicio.jpeg';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Carga la imagen desde el import
        this.load.image('menuBackground', menuBackground);
    }

    create() {
        // Fondo centrado
        this.add.image(400, 300, 'menuBackground');

        // Título
        this.add.text(400, 100, 'CREPUSCULONES', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botón Jugar
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
          .on('pointerout', () => onlineBtn.setStyle({ fill: '#ad32ffff' }));
    }
}
