import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 100, 'PONG', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 320, 'Local 2 Player', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setStyle({ fill: '#7bffc1ff' }))
        .on('pointerout', () => localBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not Available)', {
            fontSize: '24px',
            color: '#ad32ffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => onlineBtn.setStyle({ fill: '#ca9ee7ff' }))
        .on('pointerout', () => onlineBtn.setStyle({ fill: '#ad32ffff' }))
    }
}