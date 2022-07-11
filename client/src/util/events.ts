export const is_primary_touch = (ev: PointerEvent): boolean => ev.isPrimary && ev.pointerType === "touch";

export const is_primary_down = (ev: PointerEvent): boolean => ev.isPrimary && (ev.pointerType === "touch" || ev.pressure > 0);
export const is_mouse_down = (ev: PointerEvent): boolean => ev.pointerType === "mouse" && ev.buttons === 1 && ev.pressure > 0;
export const is_non_touch_drag = (ev: PointerEvent): boolean => ev.pointerType !== "touch" && ev.isPrimary && ev.pressure > 0;

export const stop_ev = (ev: Event) => {
  ev.preventDefault();
  ev.stopPropagation();
};

type CustomEventType<T extends Event> = T extends CustomEvent<infer U> ? U : never;
export const window_ev = <N extends keyof WindowEventMap>(name: N, detail: CustomEventType<WindowEventMap[N]>): WindowEventMap[N] =>
  new CustomEvent(name, { detail }) as any;

export interface EventEmitter<EventMap> extends EventTarget {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener<K extends keyof EventMap>(type: K, listener: (ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener<K extends keyof EventMap>(type: K, listener: (ev: EventMap[K]) => any, options?: boolean | EventListenerOptions): void;
}

export function waitFor<K extends string, E, ET extends EventEmitter<{ K: E }>>(type: K, target: ET): Promise<E> {
  return new Promise<E>((resolve) => {
    target.addEventListener(type, (e) => resolve(e as any), { once: true });
  });
}
