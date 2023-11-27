import { HotBase, HotInfo } from "../base";

export class Kr36 extends HotBase {
    constructor() {
        super("36氪", "36Kr");
    }

    async fetch(): Promise<HotInfo[]> {
        const data = await (
            await window.corsFetch("https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ partner_id: "wap", timestamp: 1701010407542, param: { siteId: 1, platformId: 2 } }),
            })
        ).json();
        const list = (data?.data?.hotRankList || []).map((data: any) => {
            return {
                title: data.templateMaterial.widgetTitle,
                score: +data.templateMaterial.statRead || 0,
                link: "https://www.36kr.com/p/" + data.itemId,
            };
        });
        return list;
    }
}
