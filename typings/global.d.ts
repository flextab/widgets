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
    export interface Store {
        get(name: string): number | string | boolean | File;
        set(name: string, value: number | string | boolean | File): void;
        del(name: string): void;
        on(name: strong, cb: (data: { type: "change"; value: number | string | boolean | File } | { type: "delete" }) => void): void;
        off(name: string, cb: any): void;
    }
    const store: Store;
    export default store;
}
/**会同步至服务器的私有存储，如果界面上的卡片删除，则数据也删除 */
declare module "private-storage" {
    export interface Store {
        get(name: string): number | string | boolean | File;
        set(name: string, value: number | string | boolean | File): void;
        del(name: string): void;
        on(name: strong, cb: (data: { type: "change"; value: number | string | boolean | File } | { type: "delete" }) => void): void;
        off(name: string, cb: any): void;
    }
    const store: Store;
    export default store;
}
/**离线存储，所有相同卡片共享，卡片删除数据不删除 */
declare module "local-storage" {
    export interface Store {
        get(name: string): number | string | boolean | File;
        set(name: string, value: number | string | boolean | File): void;
        del(name: string): void;
        on(name: strong, cb: (data: { type: "change"; value: number | string | boolean | File } | { type: "delete" }) => void): void;
        off(name: string, cb: any): void;
    }
    const store: Store;
    export default store;
}
/**离线私有存储，如果界面上的卡片删除，则数据也删除 */
declare module "private-local-storage" {
    export interface Store {
        get(name: string): number | string | boolean | File;
        set(name: string, value: number | string | boolean | File): void;
        del(name: string): void;
        on(name: strong, cb: (data: { type: "change"; value: number | string | boolean | File } | { type: "delete" }) => void): void;
        off(name: string, cb: any): void;
    }
    const store: Store;
    export default store;
}

declare module "widget" {
    interface ContextMenuItem {
        label?: string;
        disabled?: string;
        onClick?: () => void;
        type?: "submenu" | "group";
        children?: ContextMenuItem[];
    }
    export function openDialog(
        page: string,
        params?: Record<string, any> | null,
        config?: {
            title?: string;
        }
    );
    /**设置组件标题 */
    export function setTitle(title: string): void;
    /**设置弹框页面的标题 */
    export function setPageTitle(title?: string): void;
    export function exitDialog(): void;
    export function getFavicon(url: string): Promise<Response>;
    export function setContextMenu(menus: ContextMenuItem[]): void;
    /**设置弹框是否支持全屏化，默认为true */
    export function enableFullscreen(enable?: boolean): void;

    export const params: Record<string, any>;
    export const mode: "appstore" | "content";
    export const bridge: import("./src/utils/event").Emitter;
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

interface CorsFetch {
    setRequestHeaders(data: Record<string, string>): CorsFetch;
    setResponseHeaders(data: Record<string, string>): CorsFetch;
    fetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
interface Window {
    corsFetch: {
        (url: RequestInfo | URL, init?: RequestInit): Promise<Response>;
        withCustomHeaders: (data: Record<string, string>) => (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
        setRequestHeaders(data: Record<string, string>): CorsFetch;
        setResponseHeaders(data: Record<string, string>): CorsFetch;
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

declare module "*.scss" {
    const src: string;
    export default src;
}
declare module "*.less" {
    const src: string;
    export default src;
}
declare module "*.css" {
    const src: string;
    export default src;
}
declare module "*.png" {
    const src: string;
    export default src;
}
declare module "*.jpg" {
    const src: string;
    export default src;
}
declare module "*.jpeg" {
    const src: string;
    export default src;
}
declare module "*.gif" {
    const src: string;
    export default src;
}
declare module "*.svg" {
    const src: string;
    export default src;
}
declare module "*.ico" {
    const src: string;
    export default src;
}
declare module "*.webp" {
    const src: string;
    export default src;
}
