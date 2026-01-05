import Phaser from 'phaser';
import { Button } from '../ui/Button.js';
import { AudioManager } from '../managers/AudioManager.js';

// @ts-ignore
import IMG_Background from '../../../public/assets/images/MainMenuBackground.jpg';
// @ts-ignore
import SPR_Button from '../../../public/assets/sprites/Button.png';
// @ts-ignore
import SFX_ButtonPress from '../../../public/assets/sfx/ButtonPress.mp3';
// @ts-ignore
import MUSIC_MainMenu from '../../../public/assets/music/MainMenu.mp3';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }
    
    preload () {
        this.load.image('IMG_Background', IMG_Background);
        this.load.image('SPR_Button', SPR_Button);
        this.load.audio('SFX_ButtonPress', SFX_ButtonPress);
        this.load.audio('MUSIC_MainMenu', MUSIC_MainMenu);

        const font = new FontFace('ButtonsFont','url(fonts/alagard_font.ttf)');

        font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        });
    }

    create () {

        console.log('LOGIN SCENE CREATE');

        // Fondo
        const bg = this.add.image(600, 400, 'IMG_Background')
        bg.setOrigin(0.5);
        bg.displayWidth = 1200;
        bg.displayHeight = 800;

        //Volumen global
        this.sound.volume = AudioManager.GetVolume();
        this.sound.stopAll(); //para que no se superpongan las canciones
        this.music = this.sound.add('MUSIC_MainMenu', {
            volume: AudioManager.GetVolume(),
            loop: true
        });
        this.music.play();

        // Introducir usuario
        const INPUT_WIDTH = 420;
        const INPUT_HEIGHT = 50;
        const MAX_LENGTH = 12;

        let username = '';
        let focused = false;

        const inputBg = this.add.rectangle(600, 300, INPUT_WIDTH, INPUT_HEIGHT, 0xffffff)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true });

        const inputText = this.add.text(600 - INPUT_WIDTH / 2 + 12, 300, '', {
            fontFamily: 'ButtonsFont',
            fontSize: '28px',
            color: '#000000'
        }).setOrigin(0, 0.5);

        // Línea vertical de escritura
        const line = this.add.rectangle( inputText.x + 2, 300, 2, 30, 0x000000);

        // Parpadeo
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {line.visible = focused;}
        });

        inputBg.on('pointerdown', () => {
            focused = true;
            this.input.manager.canvas.style.cursor = 'text';
        });

        this.input.on('pointerdown', (pointer, objects) => {
            if (!objects.includes(inputBg)) {
            focused = false;
            this.input.manager.canvas.style.cursor = 'default';
            }
        });

        // Teclado
        this.input.keyboard.on('keydown', (event) => {
            if (!focused) return;

            if (event.key === 'Backspace') {
                username = username.slice(0, -1);
            } 
            else if (event.key.length === 1 && username.length < MAX_LENGTH) {
            username += event.key;
            }

            inputText.setText(username);

            // Mover la línea con texto
            line.x = inputText.x + inputText.width + 4;
        });


        // Botón de inicio de sesión

        new Button(600, 420, this, 'SPR_Button', 'Login',() => 
            {
                if (!username.trim()) return; // Si no hay nombre, devolver

                // Crear usuario
                fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                })
                .then(res => res.json())
                .then(user => {
                    localStorage.setItem('userId', user.id);
                    this.StartMenu();
                });
            }
        );

        // Auto login
        const userId = localStorage.getItem('userId');

        if (userId) {
            fetch(`/api/users/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error();
                this.StartMenu();
            })
            .catch(() => {
            localStorage.removeItem('userId');
            });
        }
        

        this.add.text(600, 250, 'Introduce tu nombre', {
            fontFamily: 'ButtonsFont',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    StartMenu(){
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('MainMenu'))
    }
}
