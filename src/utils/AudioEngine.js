export default class AudioEngine {
    constructor() {
        this.sounds = {};
        this.volume = parseFloat(localStorage.getItem('soundVolume')) || 0.5;
        this.soundToggle = localStorage.getItem('soundToggle') || 'on';
    }

    loadSound(id, audio) {
        this.sounds[id] = audio;
    }

    play(id, loop = false) {
        if (this.soundToggle === 'on') {
            const sound = this.sounds[id];
            if (sound) {
                sound.volume = this.volume;
                sound.loop = loop;
                sound.currentTime = 0;
                sound.play();
            }
        }
    }

    stop(id) {
        const sound = this.sounds[id];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}