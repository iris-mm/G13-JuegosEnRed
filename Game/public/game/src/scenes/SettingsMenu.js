import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

// @ts-ignore
import IMG_SettingsBackground from '../../assets/images/SettingsBackground.jpg';
// @ts-ignore
import SPR_Button from '../../assets/sprites/Button.png';

export class SettingsMenu extends Phaser.Scene {
    constructor() {
        super('SettingsMenu');
    }

    preload() {
        this.load.image('IMG_SettingsBackground', IMG_SettingsBackground);
        this.load.image('SPR_Button', SPR_Button);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_SettingsBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(100, 750, this, 'SPR_Button', "Volver", () => this.GoBack());
    }


    GoBack(){
        this.scene.start('MainMenu');
    }
}