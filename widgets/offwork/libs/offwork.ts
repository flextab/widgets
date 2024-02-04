import { ref, toRaw, isRef } from "vue";
import Images from "../assets/*.png?minimatch";
import lunar from "lunar";
import dayjs from "dayjs";
import Storage from "private-storage";

export enum OffWorkType {
    /**正常 */
    Official = "official",
    /**双休 */
    WeekendBreak = "weekendbreak",
    /**单休周日休息 */
    SingleDayOff = "singledayoff",
}

export interface OffWorkConfig {
    title?: string;
    start: string;
    end: string;
    type?: OffWorkType;
    image?: File;
    workImage?: File;
}

export class OffWorkStatus {
    private now = ref(Date.now());
    private interval: any;

    private type: OffWorkType;
    private start: string;
    private end: string;

    private _image?: File;
    private _workImage?: File;

    constructor(config: OffWorkConfig) {
        this.type = config.type || OffWorkType.Official;
        this.start = config.start;
        this.end = config.end;

        if (config.image) {
            this._image = config.image;
        }
        if (config.workImage) {
            this._workImage = config.workImage;
        }

        this.interval = setInterval(() => {
            this.now.value = Date.now();
        }, 1000);
    }

    get status() {
        return this.format();
    }

    private format() {
        const now = isRef(this.now) ? this.now.value : this.now;
        const [ss, se] = this.start.split(":").map((a) => parseInt(a));
        const [es, ee] = this.end.split(":").map((a) => parseInt(a));
        const start = new Date().setHours(ss, se, 0, 0);
        const end = new Date().setHours(es, ee, 0, 0);
        let working = now > start && now < end;

        if (this.type === OffWorkType.Official) {
            const holiday = lunar.HolidayUtil.getHoliday(dayjs().format("YYYY-MM-DD"));
            if (holiday) {
                if (!holiday.isWork()) {
                    working = false;
                }
            } else if ([5, 6].includes(dayjs().weekday())) {
                working = false;
            }
        } else if (this.type === OffWorkType.SingleDayOff) {
            if (dayjs().weekday() === 6) {
                working = false;
            }
        } else if (this.type === OffWorkType.WeekendBreak) {
            if ([5, 6].includes(dayjs().weekday())) {
                working = false;
            }
        }

        let diff = 0;
        let msg = "休息中";
        if (working) {
            // 秒
            diff = Math.round((end - now) / 1000);
            if (diff > 60 * 60) {
                diff = +(diff / 60 / 60).toFixed(1);
                msg = `${diff}小时`;
            } else if (diff > 60) {
                diff = Math.round(diff / 60);
                msg = `${diff}分钟`;
            } else {
                msg = `${diff}秒`;
            }
        }
        return { working, diff, msg };
    }

    get workImage(): File | string {
        return this._workImage || Images["tired.png"];
    }

    get offImage(): File | string {
        return this._image || Images["off.png"];
    }

    destory() {
        clearInterval(this.interval);
    }

    static getConfig(): OffWorkConfig {
        const img = Storage.get("img") as File;
        const workImg = Storage.get("workImg") as File;
        const data = Storage.get("config") as string;
        if (data) {
            const config = JSON.parse(data) as OffWorkConfig;
            if (img) {
                config.image = img;
            }
            if (workImg) {
                config.workImage = workImg;
            }
            return config;
        } else {
            return {
                start: "09:00",
                end: "18:00",
                type: OffWorkType.Official,
            };
        }
    }

    static setConfig(config: OffWorkConfig) {
        const conf = {
            ...config,
        };
        if (config.image) {
            Storage.set("img", config.image);
        }
        if (config.workImage) {
            Storage.set("workImg", config.workImage);
        }
        delete conf.image;
        delete conf.workImage;

        Storage.set("config", JSON.stringify(conf));
    }
}
