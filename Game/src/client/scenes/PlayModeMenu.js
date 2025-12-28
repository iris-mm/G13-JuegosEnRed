import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

// @ts-ignore
import IMG_Background from '../../../public/assets/images/MainMenuBackground.jpg';
// @ts-ignore
import SPR_Button from '../../../public/assets/sprites/Button.png';

export class PlayModeMenu extends Phaser.Scene {
    constructor() {
        super('PlayModeMenu');
    }

    preload() {
        this.load.image('IMG_Background', IMG_Background);
        this.load.image('SPR_Button', SPR_Button);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_Background')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(600 - 180, 400, this, 'SPR_Button', "Crear Partida", null);
        new Button(600 + 180, 400, this, 'SPR_Button', "Unirse a Partida", null);
        new Button(600, 550, this, 'SPR_Button', "Local", null);
        new Button(100, 750, this, 'SPR_Button', "Volver", () => this.GoBack());
        
        this.cameras.main.fadeIn(100, 0, 0, 0)
    }

    GoBack(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }
}