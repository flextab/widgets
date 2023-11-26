import LocalStorage from "local-storage";
import Storage from "storage";
import PrivateStorage from "private-storage";

export interface StockInfo {
    code: string;
    id: string;
    marketType: string;
    market: string;
    type: string;
    typeName: string;
    name: string;
}

class Store {
    private defaultList = [
        {
            code: "000001",
            name: "上证指数",
            id: "1.000001",
            market: "1",
            type: "5",
            typeName: "指数",
        },
        {
            code: "NDX",
            name: "纳斯达克",
            id: "100.NDX",
            marketType: "_UI",
            market: "100",
            type: "11",
            typeName: "指数",
        },
    ];

    get list(): StockInfo[] {
        const txt = Storage.get("stock_list") as string;
        const list = txt ? JSON.parse(txt) : [];
        if (!list.length) {
            list.push(...this.defaultList);
        }
        return list;
    }

    set list(value) {
        Storage.set("stock_list", JSON.stringify(value || []));
    }

    setCache(id: string, data: any) {
        PrivateStorage.set(id, JSON.stringify(data));
    }

    getCache(id: string) {
        const txt = PrivateStorage.get(id) as string;
        return txt ? JSON.parse(txt) : null;
    }
}

export const store = new Store();
