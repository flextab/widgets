import { Baidu } from "./media/baidu";
import Storage from "storage";
import { Weibo } from "./media/weibo";
import { Zhihu } from "./media/zhihu";
import { Kr36 } from "./media/kr36";

export const HotApi = {
    Baidu: new Baidu(),
    Weibo: new Weibo(),
    Zhihu: new Zhihu(),
    Kr36: new Kr36(),
};

export function getConfig(): string[] {
    const config = Storage.get("config") as string;
    if (config) {
        return JSON.parse(config);
    } else {
        return ["Baidu", "Weibo", "Zhihu", "Kr36"];
    }
}

export function formatNumber(num: number) {
    const unit = ["千/3", "万/4", "千万/7", "亿/8", "万亿/12"].map((a) => {
        return {
            unit: a.split("/")[0],
            num: +a.split("/")[1],
        };
    });
    let i = 0;
    while (unit[i + 1] && num / Math.pow(10, unit[i + 1].num) > 1) {
        i++;
    }
    return `${+(num / Math.pow(10, unit[i].num)).toFixed(2)}${unit[i].unit}`;
}
