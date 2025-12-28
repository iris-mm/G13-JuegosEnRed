import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { AudioManager } from '../managers/AudioManager.js';

// @ts-ignore
import IMG_Background from '../../../public/assets/images/MainMenuBackground.jpg';
// @ts-ignore
import SPR_Button from '../../../public/assets/sprites/Button.png';
// @ts-ignore
import SFX_ButtonPress from '../../../public/assets/sfx/ButtonPress.mp3';
// @ts-ignore
import MUSIC_MainMenu from '../../../public/assets/music/MainMenu.mp3';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('IMG_Background', IMG_Background);
        this.load.image('SPR_Button', SPR_Button);
        this.load.audio('SFX_ButtonPress', SFX_ButtonPress);
        this.load.audio('MUSIC_MainMenu', MUSIC_MainMenu);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_Background')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(600, 450, this, 'SPR_Button', "Jugar", () => this.StartPlay());
        new Button(600 - 300, 700, this, 'SPR_Button', "Tutorial", () => this.StartTutorial());
        new Button(600, 700, this, 'SPR_Button', "Ajustes", () => this.StartSettings());
        new Button(600 + 300, 700, this, 'SPR_Button', "Créditos", () => this.StartCredits());

        //Volumen global
        this.sound.volume = AudioManager.GetVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('MUSIC_MainMenu', {
            volume: AudioManager.GetVolume(),
            loop: true
        });
        this.music.play();

        this.cameras.main.fadeIn(100, 0, 0, 0)
    }


    StartPlay(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('Lobby'))
    }
    
    StartTutorial(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('TutorialMenu'))
    }
    
    StartSettings(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('SettingsMenu'))
    }
    
    StartCredits(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('CreditsMenu'))
    }
}