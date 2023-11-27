import { HotBase, HotInfo } from "../base";

export class Baidu extends HotBase {
    constructor() {
        super("百度", "Baidu");
    }

    async fetch(): Promise<HotInfo[]> {
        const data = await (await window.corsFetch("https://top.baidu.com/api/board?platform=wise&tab=realtime")).json();
        const list = (data?.data?.cards?.[0]?.content || []).map((data: any) => {
            return {
                title: data.query,
                score: +data.hotScore || 0,
                link: "https://www.baidu.com/s?wd=" + data.query,
            };
        });
        return list;
    }
}
