import { HotBase, HotInfo } from "../base";

export class Weibo extends HotBase {
    constructor() {
        super("微博", "Weibo");
    }

    async fetch(): Promise<HotInfo[]> {
        const data = await (await window.corsFetch("https://weibo.com/ajax/side/hotSearch")).json();
        const list = (data?.data.realtime || []).map((data: any) => {
            return {
                title: data.word,
                score: +data.raw_hot || 0,
                link: "https://s.weibo.com/weibo?q=" + data.word,
            };
        });
        return list;
    }
}
