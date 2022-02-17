export const is_primary_touch = (ev: PointerEvent): boolean => ev.isPrimary && ev.pointerType === "touch";

export const is_primary_down = (ev: PointerEvent): boolean => ev.isPrimary && (ev.pointerType === "touch" || ev.pressure > 0);

export const is_non_touch_drag = (ev: PointerEvent): boolean => ev.pointerType !== "touch" && ev.isPrimary && ev.pressure > 0;

export const stop_ev = (ev: Event) => {
  ev.preventDefault();
  ev.stopPropagation();
};

type CustomEventType<T extends Event> = T extends CustomEvent<infer U> ? U : never;
export const window_ev = <N extends keyof WindowEventMap>(name: N, detail: CustomEventType<WindowEventMap[N]>): WindowEventMap[N] =>
  new CustomEvent(name, { detail }) as any;
