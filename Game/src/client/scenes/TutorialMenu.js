import Phaser from 'phaser';
import { Button } from '../ui/Button.js';

// @ts-ignore
import IMG_DefaultBackground from '../../../public/assets/images/DefaultBackground.png';
// @ts-ignore
import SPR_Button from '../../../public/assets/sprites/Button.png';
// @ts-ignore
import vampiresaFrontEst from '../../../public/assets/sprites/vampiresa_front.png';
// @ts-ignore
import zombiFrontEst from '../../../public/assets/sprites/zombie_front.png';
// @ts-ignore
import controlWASD from '../../../public/assets/images/ControlsWASD.png';
// @ts-ignore
import controlIJLK from '../../../public/assets/images/ControlsIJKL.png';

export class TutorialMenu extends Phaser.Scene {
    constructor() {
        super('TutorialMenu');
    }

    preload() {
        this.load.image('IMG_DefaultBackground', IMG_DefaultBackground);
        this.load.image('SPR_Button', SPR_Button);
        this.load.image('SPR_Vampire', vampiresaFrontEst);
        this.load.image('SPR_Zombie', zombiFrontEst);
        this.load.image('controlWASD', controlWASD);
        this.load.image('controlIJLK', controlIJLK);
    }

    create() {
        const bg = this.add.image(600, 400, 'IMG_DefaultBackground')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        this.player1Icon = this.add.image(350, 450, 'SPR_Zombie');
        this.player2Icon = this.add.image(1200 - 350, 450, 'SPR_Vampire');

        this.controlsUI1= this.add.image(190, 100, 'controlWASD')
        .setOrigin(0,0)
        .setDepth(100)
        .setScale(0.35);
        this.controlsUI2= this.add.image(700, 100, 'controlIJLK')
        .setOrigin(0,0)
        .setDepth(100)
        .setScale(0.35);


        new Button(100, 750, this, 'SPR_Button', "Volver", () => this.GoBack());

        
        this.cameras.main.fadeIn(100, 0, 0, 0)
    }


    GoBack(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }
}