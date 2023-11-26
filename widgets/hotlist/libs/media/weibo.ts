import { HotBase, HotInfo } from "../base";

export class Weibo extends HotBase {
    constructor() {
        super("微博", "Weibo", 5 * 60 * 1000);
    }

    async get(): Promise<HotInfo[]> {
        const cachedList = this.getCached();
        if (cachedList.length) return cachedList;
        const data = await (await window.corsFetch("https://weibo.com/ajax/side/hotSearch")).json();
        const list = (data?.data.realtime || []).map((data: any) => {
            return {
                title: data.word,
                score: +data.raw_hot || 0,
                link: "https://s.weibo.com/weibo?q=" + data.query,
            };
        });
        this.save(list);
        return list;
    }
}
