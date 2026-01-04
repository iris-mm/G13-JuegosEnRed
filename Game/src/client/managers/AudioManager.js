export const AudioManager = {
    volume: 0.1,

    SetVolume(v) {
        this.volume = v;
    },

    GetVolume() {
        return this.volume;
    },

    Play(audio, scene) {
        scene.sound.play(audio, { volume: this.volume });
    }
};