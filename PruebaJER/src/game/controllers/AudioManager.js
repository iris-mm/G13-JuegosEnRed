export const AudioManager = {
    volume: 0.5,
    setVolume(v) {
        this.volume = v;
    },
    getVolume() {
        return this.volume;
    },
    playButtonSound(scene) {
        scene.sound.play("button_sound", { volume: this.volume });
    }
};

