import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

// @ts-ignore
import IMG_DefaultBackground from '../../../public/assets/images/DefaultBackground.png';
// @ts-ignore
import SPR_Vampire from '../../../public/assets/sprites/Vampire.png';
// @ts-ignore
import SPR_Zombie from '../../../public/assets/sprites/Zombie.png';

export class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    preload() {
        this.load.image('IMG_DefaultBackground', IMG_DefaultBackground);
        this.load.image('SPR_Vampire', SPR_Vampire);
        this.load.image('SPR_Zombie', SPR_Zombie);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_DefaultBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        new Button(600, 600, this, 'SPR_Button', "Comenzar", null);
        new Button(600, 750, this, 'SPR_Button', "Volver", () => this.GoBack());
        
        this.player1Icon = this.add.image(300, 300, 'SPR_Vampire');
        this.youText = this.add.text(300, 120, "Tú", {fontSize: "32px"}).setOrigin(0.5, 0.5);

        this.player2Icon = this.add.image(1200 - 300, 300, 'SPR_Zombie');
        this.enemyText = this.add.text(1200 - 300, 120, "Rival", {fontSize: "32px"}).setOrigin(0.5, 0.5);

        this.cameras.main.fadeIn(100, 0, 0, 0);
    }

    GoBack(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }
}