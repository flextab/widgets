/**实现一个简单的事件监听及分发 */

export class Event {
    private events: { [key: string]: any[] } = {};

    on(eventName: string, callback: (...args: any[]) => void) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName: string, callback: (...args: any[]) => void) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].splice(this.events[eventName].indexOf(callback), 1);
    }

    emit(eventName: string, ...args: any[]) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach((callback) => {
            callback(...args);
        });
    }
}
