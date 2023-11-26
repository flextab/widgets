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
        public key: string,
        /**开启缓存，设置缓存时间，单位ms */
        protected duration: number
    ) {}

    async get(): Promise<HotInfo[]> {
        return [];
    }

    protected getCached(): HotInfo[] {
        if (Storage.get(this.key)) {
            const { list, timestamp } = JSON.parse(Storage.get(this.key) as string);
            if (+new Date() - timestamp < this.duration) {
                return list;
            }
        }
        return [];
    }

    protected save(list: HotInfo[]) {
        Storage.set(
            this.key,
            JSON.stringify({
                list,
                timestamp: +new Date(),
            })
        );
    }
}
