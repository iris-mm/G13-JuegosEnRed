import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

// @ts-ignore
import IMG_Background from '../../assets/images/MainMenuBackground.jpg';
// @ts-ignore
import SPR_Button from '../../assets/sprites/Button.png';
// @ts-ignore
import SFX_ButtonPress from '../../assets/sfx/ButtonPress.mp3';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('IMG_Background', IMG_Background);
        this.load.image('SPR_Button', SPR_Button);
        this.load.audio('SFX_ButtonPress', SFX_ButtonPress);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_Background')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(600, 400, this, 'SPR_Button', "Jugar", () => this.StartPlay());
        new Button(600 - 300, 700, this, 'SPR_Button', "Tutorial", () => this.StartTutorial());
        new Button(600, 700, this, 'SPR_Button', "Ajustes", () => this.StartSettings());
        new Button(600 + 300, 700, this, 'SPR_Button', "Créditos", () => this.StartCredits());
    }


    StartPlay(){
        this.scene.start('PlayModeMenu');
    }
    
    StartTutorial(){
        this.scene.start('TutorialMenu');
    }
    
    StartSettings(){
        this.scene.start('SettingsMenu');
    }
    
    StartCredits(){
        this.scene.start('CreditsMenu');
    }
}