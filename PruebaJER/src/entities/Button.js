export class Button {
    constructor(scene, x, y, texture, text, callback, style = {}) {
        this.scene = scene;

        this.style = {
            fontFamily: 'ButtonsFont', 
            fontSize: '29px',            
            color: '#ffffffff',
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
                this.text.setColor('#ffff00'); 
            })
            .on('pointerout', () => {
                this.image.clearTint(); 
                this.text.setColor('#ffffffff'); 
            })
            .on('pointerdown', callback);
    }

    setText(newText) {
        this.text.setText(newText);
    }

    destroy() {
        this.container.destroy();
    }
}
