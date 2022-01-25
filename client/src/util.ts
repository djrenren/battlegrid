export class EnhancedTarget extends EventTarget {
    constructor() {
        super();
    }
    #listeners: Map<string, [EventListener | EventListenerObject, boolean | EventListenerOptions | undefined][]> = new Map();
    addEventListener(type: string, listener: EventListener | EventListenerObject, options?: boolean | EventListenerOptions) { 
        if (!this.#listeners.has(type)) {
            this.#listeners.set(type, [[listener, options]]);
        } else {
            this.#listeners.get(type)?.push([listener, options]);
        }
        super.addEventListener(type, listener, options)
    }
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions): void {
        this.#listeners.set(type, (this.#listeners.get(type) ?? []).filter(l => l[0] !== callback && l[1] !== options) as any);
    }
    removeAllEventListeners() {
        for (let [type, values] of this.#listeners) {
            for (let v of values) {
                super.removeEventListener(type, v[0], v[1]);
            }
        }
        this.#listeners.clear();
    }
}