import Storage from "local-storage";

export interface HotInfo {
    title: "string";
    score: number;
    link: "string";
}

export class HotBase {
    constructor(
        public title: string,
        /**设置热搜本地缓存key */
        public key: string
    ) {}

    async fetch(): Promise<HotInfo[]> {
        return [];
    }

    async get(): Promise<HotInfo[]> {
        const { list, timestamp } = this.getCached();
        if (!list.length) {
            list.push(...(await this.fetch()));
            this.save(list);
        } else if (Date.now() - timestamp >= 5 * 60 * 1000) {
            this.fetch().then((list) => this.save(list));
        }
        return list;
    }

    private getCached(): { list: HotInfo[]; timestamp: number } {
        if (Storage.get(this.key)) {
            const { list, timestamp } = JSON.parse(Storage.get(this.key) as string);
            return { list, timestamp };
        }
        return { list: [], timestamp: 0 };
    }

    private save(list: HotInfo[]) {
        Storage.set(
            this.key,
            JSON.stringify({
                list,
                timestamp: +new Date(),
            })
        );
    }
}
