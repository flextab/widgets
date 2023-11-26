import { MiniChart } from "./chart.js";
import { reactive, toRaw, ref } from "vue";
import Storage from "local-storage";
import dayjs from "dayjs";

// https://github.com/tkfy920/qstock/blob/master/data/util.py

export class Stock {
    private detail = reactive<any>({});
    private trends = reactive<any>([]);
    private klineData = reactive<any>({});

    get id() {
        return this.config.id;
    }

    private _kLineType: 1 | 5 | 15 | 30 | 60 | 101 | 102 | 103 = 1;
    get kLineType() {
        return this._kLineType;
    }
    set kLineType(v) {
        this._kLineType = v;
    }

    private _kLinePageSize = 100000;
    get kLinePageSize() {
        return this._kLinePageSize || 100000;
    }
    set kLinePageSize(v) {
        this._kLinePageSize = v;
    }

    get name() {
        return this.detail?.f58;
    }

    get code() {
        return this.detail?.f57;
    }

    /**行业 */
    get industry() {
        return this.detail?.f127;
    }

    get tradeMoney() {
        // 成交价
        const n = this.detail?.f43 / 100;
        return isNaN(n) ? "-" : n;
    }

    get tradeLowerMoney() {
        // 最低
        const n = this.detail?.f45 / 100;
        return isNaN(n) ? "-" : n;
    }

    get updown() {
        // 涨跌
        const n = this.detail?.f169 / 100;
        return isNaN(n) ? 0 : n;
    }

    get updownRate() {
        // 涨跌幅
        const n = this.detail?.f170 / 100;
        return isNaN(n) ? 0 : n + "%";
    }

    get openPrice() {
        // 今开
        const n = this.detail?.f46 / 100;
        if (isNaN(n)) {
            return "-";
        }
        return Number(n).toFixed(2);
    }

    get tradeHigherMoney() {
        // 最高
        const n = this.detail?.f44 / 100;
        if (isNaN(n)) {
            return "-";
        }
        return Number(n).toFixed(2);
    }

    get tradeAmount() {
        // 成交量
        if (this.detail?.f47 === "-") {
            return "-";
        }
        return Stock.formatNumber(this.detail.f47);
    }

    get yeasterdayClosePrice() {
        // 昨收
        const n = this.detail?.f60 / 100;
        if (isNaN(n)) {
            return "-";
        }
        return Number(n).toFixed(2);
    }

    get tradeMoneyAmount() {
        if (this.detail?.f48 === "-") {
            return "-";
        }
        return Stock.formatNumber(this.detail?.f48);
    }

    get shakeRate() {
        // 振幅
        const n = this.detail?.f171 / 100;
        if (isNaN(n)) {
            return "-";
        }
        return n + "%";
    }

    get week52High() {
        // 52周最高
        const n = this.detail?.f174 / 100;
        return isNaN(n) ? "-" : n;
    }

    get week52Low() {
        // 52周最低
        const n = this.detail?.f175 / 100;
        return isNaN(n) ? "-" : n;
    }

    get amountRate() {
        // 量比
        const n = this.detail?.f50 / 100;
        return isNaN(n) ? "-" : n + "%";
    }

    constructor(
        private config: {
            id: string;
            enableKline?: boolean;
        }
    ) {
        if (Storage.get(config.id)) {
            const { detail, trends } = JSON.parse(Storage.get(config.id) as string);
            this.set(this.detail, detail);
            this.set(this.trends, trends);
        }
    }

    private set(data: any, newData: any) {
        if (data instanceof Array) {
            data.length = 0;
            data.push(...newData);
        } else {
            Object.keys(data).map((key) => {
                delete data[key];
            });
            Object.assign(data, newData);
        }
    }

    private async getTrends(days: 1 | 5 = 1) {
        const params = new URLSearchParams({
            secid: this.config.id,
            fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
            fields2: "f51,f53,f56,f58",
            iscr: "0",
            iscca: "0",
            ndays: `${days}`,
        });
        const resp = await (await fetch(`https://push2.eastmoney.com/api/qt/stock/trends2/get?${params}`)).json();
        return resp.data;
    }

    private async getDetail() {
        const params = new URLSearchParams({
            secid: this.config.id,
            fields: "f19,f20,f23,f24,f25,f26,f27,f28,f29,f30,f43,f44,f45,f46,f47,f48,f49,f50,f57,f58,f59,f60,f113,f114,f115,f116,f117,f127,f130,f131,f132,f133,f135,f136,f137,f138,f139,f140,f141,f142,f143,f144,f145,f146,f147,f148,f149,f152,f161,f162,f164,f165,f167,f168,f169,f170,f171,f174,f175,f177,f178,f198,f199,f294,f530,f531",
            invt: "2",
        });
        const resp = await (await fetch(`https://push2.eastmoney.com/api/qt/stock/get?${params}`)).json();
        return resp.data;
    }

    private async getKLine(opt: {
        /** 1分钟 5分钟 15分钟 30分钟 60分钟 101日K 102周K 103月K */
        klt: 1 | 5 | 15 | 30 | 60 | 101 | 102 | 103;
        /** 每页数量 */
        lmt?: number;
        /** 页码 */
        fgt?: number;
        /** 结束时间 */
        end: string;
    }) {
        const params = new URLSearchParams({
            secid: this.config.id,
            klt: `${opt.klt}`,
            lmt: `${opt.lmt || 100000}`,
            fqt: `${opt.fgt || 1}`,
            end: `${opt.end}`,
            iscca: "1",
            fields1: "f1,f2,f3,f4,f5",
            fields2: "f51,f52,f53,f54,f55,f56,f57",
        });
        const resp = await (await fetch(`https://push2his.eastmoney.com/api/qt/stock/kline/get?${params}`)).json();
        return resp.data;
    }

    private async getTrade() {
        const params = new URLSearchParams({
            secid: this.config.id,
            fields1: "f1,f2,f3,f4,f5",
            fields2: "f51,f52,f53,f54,f55",
            pos: "-14",
            iscca: "1",
            invt: "2",
        });
        const resp = await (await fetch(`https://push2.eastmoney.com/api/qt/stock/details/get?${params}`)).json();
        return resp.data;
    }

    async update() {
        const [detail, trendsData, klineData] = await Promise.all([
            this.getDetail(),
            this.getTrends(),
            this.getKLine({
                klt: this.kLineType,
                lmt: this.kLinePageSize,
                end: dayjs().format("YYYYMMDD"),
            }),
        ]);
        this.set(this.detail, detail);
        this.set(this.klineData, klineData);
        this.set(this.trends, trendsData.trends);

        Storage.set(
            this.config.id,
            JSON.stringify({
                detail: toRaw(this.detail),
                trends: toRaw(this.trends),
                klineType: this.kLineType,
                klineData: toRaw(this.klineData),
            })
        );
    }

    getTrendsChart(): string {
        if (this.trends.length && this.code) {
            let market = "ab";
            const [num] = this.config.id.split(".");
            if (["105", "106", "107"].includes(num)) {
                market = "us";
            } else if (["116", "128"].includes(num)) {
                market = "hk";
            } else {
                market = "global";
            }
            return new MiniChart().getSvgStr(
                this.trends
                    .map((s: string) => {
                        const [, price] = s.split(",");
                        return price;
                    })
                    .join(","),
                this.tradeLowerMoney,
                {
                    // 市场分类，沪深 ab、港股 hk、美股 us
                    market: "ab",
                    status: Number(this.updown) > 0 ? "up" : "down",
                    w: 100,
                    h: 50,
                }
            );
        } else {
            return "";
        }
    }

    getKLineData() {
        if (!this.klineData?.klines?.length) {
            return [];
        }
        return this.klineData.klines;
    }

    static formatNumber(num: number) {
        const units = ["", "万", "亿", "万亿"];
        let index = 0;
        while (num >= Math.pow(10, 4)) {
            num /= Math.pow(10, 4);
            index++;
        }
        return +Number(num).toFixed(2) + units[index];
    }

    static async getInfoList(ids: string[]): Promise<
        Record<
            string,
            {
                price: string;
                updownRate: string;
                up: boolean;
            }
        >
    > {
        const res = await (
            await fetch(
                `https://push2.eastmoney.com/api/qt/ulist.np/get?${new URLSearchParams({
                    fltt: "2",
                    fields: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f15,f16,f17,f18,f19,f20,f21,f22,f23,f24,f25,f26,f27,f28,f29,f30,f31,f32,f33,f34,f35,f36,f37,f38,f39,f40,f41,f42,f43,f44,f45,f46,f47,f48,f49,f50,f115",
                    secids: ids.join(","),
                })}`
            )
        ).json();
        return (res?.data?.diff || []).map((item: any) => {
            return {
                price: item.f2,
                updownRate: `${item.f3 > 0 ? "+" : ""}${item.f3}%`,
                up: item.f3 > 0,
            };
        }, {});
    }

    static DOWN_COLOR = "#0AAB62";
    static UP_COLOR = "#f73131";
}
