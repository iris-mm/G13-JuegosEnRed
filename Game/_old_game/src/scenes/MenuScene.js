import Phaser from 'phaser';

//importar imágenes
// @ts-ignore
import menuBackground from '../../public/assets/MainMenu2.jpg';
// @ts-ignore
import buttonBackground from '../../public/assets/boton piedra.png';

//importar clases
import { Button } from '../entities/Button.js';
import { AudioManager } from '../game/controllers/AudioManager.js';

//importar sonidos
// @ts-ignore
import mainMusic from '../../public/assets/music_sounds/main_music.mp3';
// @ts-ignore
import buttonSound from '../../public/assets/music_sounds/button_sound.mp3';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuBackground', menuBackground); 
        this.load.image('buttonBackground', buttonBackground);
        this.load.audio('main_music', mainMusic);
        this.load.audio('button_sound', buttonSound);

        const font = new FontFace('ButtonsFont','url(Fuentes/alagard_font.ttf)');

        font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        });
    }

    create() {
        // Fondo centrado y ajustado a 1200x800
        const bg = this.add.image(600, 400, 'menuBackground')
        .setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        //Volumen global
        this.sound.volume = AudioManager.getVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('main_music', {
            volume: AudioManager.getVolume(),
            loop: true
        });
        this.music.play();

        // botones usando la clase Button
        const playButton = new Button(
            this,
            350,
            350,
            'buttonBackground',  
            'Jugar',
            () => {AudioManager.playButtonSound(this); this.scene.start('GameScene'); }
        );

        const settingsButton = new Button(
            this,
            350,
            500,
            'buttonBackground',  
            'Ajustes',
            () => {
                AudioManager.playButtonSound(this); 
                this.scene.stop('PauseScene'); 
                this.scene.start('ConfigScene',{ from: 'MenuScene' }); }
        );
        
        const creditsButton = new Button(
            this,
            350,
            650,
            'buttonBackground',  
            'Créditos',
            () => {AudioManager.playButtonSound(this); this.scene.start('CreditsScene'); }
        );
    }
}
