import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuConfig from '../../assets/menuAjustes.jpg';
// @ts-ignore
import buttonBackground from '../../assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';


export class ConfigScene extends Phaser.Scene {
    constructor() {
        super('ConfigScene');
    }
    
    preload(){
        this.load.image('menuConfig', menuConfig);
        this.load.image('buttonBackground', buttonBackground);
    }

    create(){
        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuConfig')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        //Botón volver al menú principal
        const menuButton = new Button(this, 600, 500, 'buttonBackground', 'Menú', () => {
            this.scene.start('MenuScene'); // Ir al menú principal
        });
        
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
        let currentVolume = this.sound.volume;
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
            this.sound.setVolume(currentVolume);
            //Actualizar la posición del handle y la barra de volumen
            handle.x = barX - barWidth / 2 + currentVolume * barWidth;
            volumeIndicator.width = currentVolume * barWidth;
        });

        

    }
}