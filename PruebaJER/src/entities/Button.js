export class Button {
    constructor(scene, x, y, texture, text, style, callback) {
        this.scene = scene;

        this.style = {
            fontFamily: 'ButtonsFont', 
            fontSize: '24px',            
            color: '#00ff00'                        
        };

        this.image = scene.add.image(0, 0, texture);
        this.text = scene.add.text(0, 0, text, style).setOrigin(0.5);

        this.container = scene.add.container(x, y, [this.image, this.text]);
        this.container.setSize(this.image.width, this.image.height);
        this.container.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.image.setTint(0xaaaaaa))
            .on('pointerout', () => this.image.clearTint())
            .on('pointerdown', callback);
    }

    setText(newText) {
        this.text.setText(newText);
    }

    destroy() {
        this.container.destroy();
    }
}
