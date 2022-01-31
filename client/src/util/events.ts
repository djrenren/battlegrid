import { Point } from "./math";

export const is_primary_touch = (ev: PointerEvent): boolean => ev.isPrimary && ev.pointerType === "touch";

export const is_primary_down = (ev: PointerEvent): boolean => ev.isPrimary && ev.pressure > 0;

export const is_non_touch_drag = (ev: PointerEvent): boolean => ev.pointerType !== "touch" && ev.isPrimary && ev.pressure > 0;

export const stop_ev = (ev: Event) => {
  ev.preventDefault();
  ev.stopPropagation();
};

export const screen_to_svg = (ev: PointerEvent): Point => {
  const cursor = new DOMPoint(ev.clientX, ev.clientY);
  const p = cursor.matrixTransform((ev.target! as SVGGraphicsElement).getScreenCTM()!.inverse());
  return [p.x, p.y];
};
