import { HotBase, HotInfo } from "../base";

export class Zhihu extends HotBase {
    constructor() {
        super("知乎", "Zhihu");
    }

    async fetch(): Promise<HotInfo[]> {
        const data = await (await window.corsFetch("https://www.zhihu.com/api/v4/creators/rank/hot?domain=0&period=hour")).json();
        const list = (data?.data || []).map((data: any) => {
            return {
                title: data.question.title,
                score: +data.reaction.pv || 0,
                link: data.question.url,
            };
        });
        return list;
    }
}
