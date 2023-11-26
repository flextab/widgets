type CallbackFunction = (...args: any[]) => void;
export declare class Emitter {
    private listeners;
    on(name: string, fn: CallbackFunction): void;
    emit(name: string, ...args: any[]): void;
    off(name: string, fn: CallbackFunction): void;
    clear(name?: string): void;
}
declare const _default: Emitter;
export default _default;
