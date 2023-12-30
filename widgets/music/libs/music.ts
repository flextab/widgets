import Storage from "local-storage";
import { Event } from "./event";
import { LrcParser } from "./lrc.js";
import { reactive } from "vue";

const MusicUrl = "https://api.ikrong.com/ex/song/pub/all?albumId=0ELOQo";

export interface MusicInfo {
    name: string;
    author: string;
    id: string;
    lrc: string;
    lrcText: string;
    normal: string;
    pic: string;
    quality?: string;
}

class MusicCollection {
    list: MusicInfo[] = reactive([]);

    constructor() {
        const list = Storage.get("list") as string;
        if (list) {
            this.list = JSON.parse(list);
        }
    }

    private async request() {
        const resp = await (await fetch(MusicUrl)).json();
        if (resp.code === 0) {
            const locals = this.list.reduce((data, item) => {
                data[item.id] = true;
                return data;
            }, {} as Record<string, boolean>);
            this.list.unshift(...((resp.data || []) as MusicInfo[]).filter((item) => !locals[item.id]));
            Storage.set("list", JSON.stringify(resp.data));
        }
    }

    async getList() {
        if (!this.list.length) {
            await this.request();
        } else {
            this.request();
        }
        return this.list;
    }
}

export const Collection = new MusicCollection();

export enum PlayMode {
    List = "list",
    Single = "single",
    Random = "random",
}

// 实现一个音乐播放器，支持播放、暂停、下一首、上一首等
class MusicPlayer extends Event {
    private audio = new Audio();
    private lrcText = "";
    private _inited = false;
    src: string = "";
    duration: number = 0;
    currentTime: number = 0;
    paused = true;
    volume = 0;
    loading = false;

    mode: PlayMode = PlayMode.List;

    lyric = new LrcParser();

    init() {
        if (this._inited) return;
        this.audio.autoplay = false;
        this.audio.pause();
        this._inited = true;
        const that = this;
        this.volume = this.audio.volume;
        this.restoreStatus();
        this.audio.addEventListener("ended", () => {
            that.emit("next", "programatic");
        });
        this.audio.addEventListener("canplay", () => {
            that.duration = that.audio.duration;
            this.loading = false;
        });
        this.audio.addEventListener("error", (e) => {
            that.emit("next", "programatic");
        });
        this.audio.addEventListener("durationchange", () => {
            that.duration = that.audio.duration;
        });
        this.audio.addEventListener("timeupdate", () => {
            if (!that.audio) return;
            that.loading = false;
            that.paused = that.audio.paused;
            that.currentTime = that.audio.currentTime;
            that.emit("timeupdate", that.currentTime);
        });
        this.audio.addEventListener("playing", () => {
            that.paused = that.audio.paused;
        });
        this.audio.addEventListener("volumechange", () => {
            that.volume = that.audio.volume;
        });
        this.audio.addEventListener("loadstart", () => {
            that.loading = true;
        });
        this.audio.addEventListener("loadeddata", () => {
            that.loading = false;
        });
        this.audio.addEventListener("loadedmetadata", () => {
            //
        });
        this.audio.addEventListener("waiting", () => {
            that.loading = true;
        });
        this.audio.addEventListener("suspend", () => {
            //
        });
        this.audio.addEventListener("stalled", () => {
            that.loading = true;
        });
    }

    play(url?: string) {
        if (url) {
            this.audio.src = url;
            this.src = url;
            this.duration = 0;
            this.lrcText = "";
            this.lyric.clear();
        }
        this.audio.play();
        this.saveStatus();
    }

    pause() {
        this.audio.pause();
    }

    /**单位秒 */
    seek(time: number) {
        if (!this.audio.seeking) {
            this.audio.currentTime = time;
        }
    }

    /**音量 0-1 */
    setVolume(v: number) {
        this.volume = v;
        this.audio.volume = v;
        this.saveStatus();
    }

    setLyric(content: string) {
        this.lrcText = content;
        this.lyric.load(content);
        this.saveStatus();
    }

    switchMode() {
        switch (this.mode) {
            case PlayMode.List:
                this.mode = PlayMode.Single;
                break;
            case PlayMode.Single:
                this.mode = PlayMode.Random;
                break;
            case PlayMode.Random:
                this.mode = PlayMode.List;
                break;
        }
        this.saveStatus();
    }

    saveStatus() {
        Storage.set("lrcText", this.lrcText);
        Storage.set("src", this.src);
        Storage.set("volume", this.volume);
        Storage.set("mode", this.mode);
    }

    restoreStatus() {
        this.src = (Storage.get("src") as string) || "";
        this.volume = (Storage.get("volume") as number) || 1;
        this.mode = (Storage.get("mode") as PlayMode) || PlayMode.List;
        this.lrcText = Storage.get("lrcText") as string;

        if (this.lrcText) {
            this.lyric.load(this.lrcText);
        }
        if (this.src) {
            this.audio.src = this.src;
        }
        this.audio.volume = this.volume;
    }
}

export const Player = new MusicPlayer();
