import { FileStore } from "./files";

const audios = {
    get bg() {
        return FileStore.getFile("assets/sounds/wish-bg.ogg");
    },
    get beep() {
        return FileStore.getFile("assets/sounds/beep.ogg");
    },
    get bookflip() {
        return FileStore.getFile("assets/sounds/bookflip.mp3");
    },
    get click() {
        return FileStore.getFile("assets/sounds/click.ogg");
    },
    get close() {
        return FileStore.getFile("assets/sounds/close.ogg");
    },
    get changeBanner() {
        return FileStore.getFile("assets/sounds/changebanner.ogg");
    },
    get fiveStar() {
        return FileStore.getFile("assets/sounds/reveal-5star.ogg");
    },
    get roll() {
        return FileStore.getFile("assets/sounds/roll.ogg");
    },
};

type SoundType = Exclude<keyof typeof audios, "bg">;

class SoundManager {
    private bg = new Audio();
    private sound?: HTMLAudioElement;
    isMuted = false;

    playBg() {
        if (this.isMuted) return;
        if (this.bg.src !== audios.bg) {
            this.bg.src = audios.bg;
            this.bg.loop = true;
        }
        this.bg.play();
    }

    muted(muted = true) {
        this.isMuted = muted;
        this.pause();
    }

    playSound(type: SoundType) {
        if (this.isMuted) return;
        if (this.sound) {
            this.sound.volume = 0.5;
        }
        this.sound = new Audio();
        this.sound.src = audios[type];
        this.sound.play();
    }

    pause() {
        this.bg.pause();
        if (this.sound) {
            this.sound.pause();
        }
    }
}

export const SoundPlayer = new SoundManager();
