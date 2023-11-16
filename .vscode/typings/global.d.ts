declare module "vue-grid-layout";
declare module "virtual:svg-icons-names" {
    type names = string[];
    const ids: names;
    export default ids;
}
declare module "virtual:flextab-widgets:list" {
    const names: {
        id: string;
        title: string;
        version: number;
        url: string;
    }[];
    export default names;
}

/**会同步至服务器的存储，所有相同卡片共享，卡片删除数据不删除 */
declare module "storage" {
    export interface Store {}
    const store: Store;
    export default store;
}
/**会同步至服务器的私有存储，如果界面上的卡片删除，则数据也删除 */
declare module "private-storage" {
    export interface Store {}
    const store: Store;
    export default store;
}
/**离线存储，所有相同卡片共享，卡片删除数据不删除 */
declare module "local-storage" {
    export interface Store {}
    const store: Store;
    export default store;
}
/**离线私有存储，如果界面上的卡片删除，则数据也删除 */
declare module "private-local-storage" {
    export interface Store {}
    const store: Store;
    export default store;
}

declare module "widget" {
    export function openDialog(
        page: string,
        params?: Record<string, any> | null,
        config?: {
            title?: string;
        }
    );
    export function setTitle(title: string): void;
    export function exitDialog(): void;
    export function getFavicon(url: string): Promise<Response>;

    export const params: Record<string, any>;
    export const mode: "appstore" | "content";
    export const bridge: import("./event").Emitter;
}

// svg icon names
declare type SVGIcons =
    | "add"
    | "arrow-down"
    | "check"
    | "close"
    | "cross"
    | "edit"
    | "empty"
    | "error-fill"
    | "error"
    | "exit"
    | "info-fill"
    | "info"
    | "loading"
    | "search"
    | "setting"
    | "success-fill"
    | "success"
    | "theme"
    | "user"
    | "warning-fill"
    | "warning";

interface window {
    corsFetch: {
        (url: RequestInfo | URL, init?: RequestInit): Promise<Response>;
        XCORS_REQUEST_HEADERS: string;
        withCustomHeaders: (data: Record<string, string> | Headers) => (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    };
    Serializer: {
        stringify: (data: any) => string;
        async: (data: any) => Promise<string>;
        parse: (value: string) => any;
    };
}

declare module "*?minimatch" {
    const value: Record<string, string>;
    export default value;
}
