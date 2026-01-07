import Phaser from 'phaser';
//importar imagenes
// @ts-ignore
import menuCred from '../../public/assets/menuCreditos.jpg';
// @ts-ignore
import logoImg from '../../public/assets/logo.png';
// @ts-ignore
import buttonBackground from '../../public/assets/boton piedra.png';
//importar clases Button
import { Button } from '../entities/Button.js';
//importar para los sonidos
import { AudioManager } from '../game/controllers/AudioManager.js';
// @ts-ignore
import creditsMusic from '../../public/assets/music_sounds/credits_music.mp3';
// @ts-ignore
import buttonSound from '../../public/assets/music_sounds/button_sound.mp3';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }
    
    preload(){
        this.load.image('logoImg', logoImg);
        this.load.image('menuCred', menuCred);
        this.load.image('buttonBackground', buttonBackground);
        this.load.audio('credits_music', creditsMusic);
        this.load.audio('button_sound', buttonSound);
    }

    create(){
        //Volumen global
        this.sound.volume = AudioManager.getVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('credits_music', {
            volume: AudioManager.getVolume(),
            loop: true
        });
        this.music.play();

        this.cameras.main.setBackgroundColor('#000000');
        //Logo inicial
        const logoImg=this.add.image( this.cameras.main.width / 2,
        this.cameras.main.height / 2,'logoImg').setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: logoImg,
            alpha: 1,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: logoImg,
                        alpha: 0,
                        duration: 2000,
                        ease: 'Power2',
                        onComplete: () => {
                            logoImg.destroy();
                            this.showCreditsMenu();
                        }
                    });
                });
            }
        });
    }

    showCreditsMenu(){  
        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuCred')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;
        //Botón volver al menú principal
        const menuButton = new Button(this, 600, 600, 'buttonBackground', 'Menú', () => {
            AudioManager.playButtonSound(this);
            this.scene.start('MenuScene'); // Ir al menú principal
        });

        // Array con los nombres
        const creditsGrupo = [
            'Grupo 13 - Juegos en Red', 
            'Marta de Miguel Tapia',
            'Ángel Younes Karim Mérida',
            'Sara Mesa Pacheco',
            'Claudia Morago Amigo',
            'Iris Muñoz Montero',
            '',
        ];

        const creditsOthers=[
            'public/assets de sprites GameScene: 13th CandyWeb',
            'public/assets pantallas: Canva',
            'Música y efectos de sonido: FreeSound',
        ];

        // Altura inicial para el primer nombre 
        let startY = 250;
        const spacing = 50; // espacio vertical entre nombres

        // Crear cada nombre centrado
        creditsGrupo.forEach((name, index) => {
            this.add.text(600, startY + index * spacing, name, {
                fontSize: '32px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        });
        creditsOthers.forEach((name, index) => {
            this.add.text(600, startY + (creditsGrupo.length + index) * spacing +85, name, {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        });


    }
}