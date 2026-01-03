import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { connectionManager } from '../../client/managers/ConnectionManager.js';

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

        this.startButton = new Button(-128, -128, this, 'SPR_Button', "Comenzar", null);
        new Button(600, 750, this, 'SPR_Button', "Salir", () => this.Leave());
        
        this.player1Icon = this.add.image(300, 300, 'SPR_Vampire');
        this.youText = this.add.text(300, 120, "Tú", {fontSize: "32px"}).setOrigin(0.5);

        this.player2Icon = this.add.image(1200 - 300, 300, 'SPR_Zombie');
        this.enemyText = this.add.text(1200 - 300, 120, "Rival", {fontSize: "32px"}).setOrigin(0.5);

        this.stateText = this.add.text(600, 500, "...", {fontSize: "32px"}).setOrigin(0.5);

        this.cameras.main.fadeIn(100, 0, 0, 0);

        this.connectionListener = (data) => { this.UpdateSceneOnConnection(data); }
        connectionManager.addListener(this.connectionListener)
    }

    Leave(){
        this.Shutdown();
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }

    UpdateSceneOnConnection(data){
        try {
            if (data.connected) {
                this.startButton.setPosition(600, 600)
                this.stateText.setText(`¡Rival encontrado! (${data.count})`);
                this.stateText.setColor('#00ff00');
            } else {
                this.startButton.setPosition(-128, -128)
                this.stateText.setText('Esperando rival...');
                this.stateText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[Lobby] Error updating connection display:', error);
        }
    }

    Shutdown() {
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}