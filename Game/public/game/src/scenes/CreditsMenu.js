import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { AudioManager } from '../managers/AudioManager.js';

// @ts-ignore
import IMG_CreditsBackground from '../../assets/images/CreditsBackground.jpg';
// @ts-ignore
import SPR_Button from '../../assets/sprites/Button.png';
// @ts-ignore
import MUSIC_Credits from '../../assets/music/Credits.mp3';
// @ts-ignore
import IMG_Logo from '../../assets/images/Logo.png';

export class CreditsMenu extends Phaser.Scene {
    constructor() {
        super('CreditsMenu');
    }

    preload() {
        this.load.image('IMG_Logo', IMG_Logo);
        this.load.image('IMG_CreditsBackground', IMG_CreditsBackground);
        this.load.image('SPR_Button', SPR_Button);
        this.load.audio('MUSIC_Credits', MUSIC_Credits);
    }

    create() {
        //Volumen global
        this.sound.volume = AudioManager.GetVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('MUSIC_Credits', {
            volume: AudioManager.GetVolume(),
            loop: true
        });
        this.music.play();

        this.cameras.main.setBackgroundColor('#000000');
        //Logo inicial
        const logoImg = this.add.image( this.cameras.main.width / 2,
        this.cameras.main.height / 2,'IMG_Logo').setOrigin(0.5).setAlpha(0).setScale(0.3);

                this.tweens.add({
            targets: logoImg,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: logoImg,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            logoImg.destroy();
                            this.ShowCreditsMenu();
                        }
                    });
                });
            }
        });
    }


    GoBack(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }

    ShowCreditsMenu(){
        const bg = this.add.image(600, 400, 'IMG_CreditsBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

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
            'Assets de sprites GameScene: 13th CandyWeb',
            'Assets pantallas: Canva',
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

        this.cameras.main.fadeIn(300, 0, 0, 0)

        new Button(100, 750, this, 'SPR_Button', "Volver", () => this.GoBack());
    }
}