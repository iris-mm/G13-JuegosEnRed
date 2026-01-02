import { AudioManager } from "../managers/AudioManager.js";

export class Button {
    constructor(x, y, scene, texture, text, callback, style = {}, fontSize = 29) {
        this.scene = scene;

        this.style = {
            fontFamily: 'ButtonsFont', 
            fontSize: `${fontSize}px`,            
            color: '#ffffff',
            ...style
        };


        this.image = scene.add.image(0, 0, texture);
        this.text = scene.add.text(0, 0, text, this.style).setOrigin(0.5);

        this.container = scene.add.container(x, y, [this.image, this.text]);
        this.container.setSize(this.image.width, this.image.height);
        this.container.setScale(1.5); // escalar fondo y texto


        this.container.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.image.setTint(0xffff00); 
                this.text.setColor('#ffffdd');
                this.text.setScale(1.2);
            })
            .on('pointerout', () => {
                this.image.clearTint(); 
                this.text.setColor('#ffffffff');
                this.text.setScale(1);
            })
            .on('pointerdown', () => {
                AudioManager.Play('SFX_ButtonPress', this.scene);
            callback();
            });
    }

    setText(newText) {
        this.text.setText(newText);
    }

    setPosition(x, y){
        this.container.setPosition(x, y)
    }

    destroy() {
        this.container.destroy();
    }
}
