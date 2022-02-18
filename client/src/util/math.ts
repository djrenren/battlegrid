export type Point = [number, number];

export const add_p = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
export const add_c = (a: Point, c: number): Point => add_p(a, [c, c]);

export const sub_p = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];

export const mul_c = (a: Point, c: number): Point => [a[0] * c, a[1] * c];
export const mul_p = (a: Point, b: Point): Point => [a[0] * b[0], a[1] * b[1]];

export const div_p = (a: Point, b: Point): Point => [a[0] / b[0], a[1] / b[1]];
export const div_c = (a: Point, c: number): Point => [a[0] / c, a[1] / c];

export const gt_p = (a: Point, b: Point): boolean => a[0] > b[0] && a[1] > b[1];
export const lt_p = (a: Point, b: Point): boolean => a[0] < b[0] && a[1] < b[1];

export const max_p = (a: Point, b: Point): Point => [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
export const min_p = (a: Point, b: Point): Point => [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
export const clamp_p = (min: Point, max: Point, p: Point): Point => max_p(min, min_p(max, p));
export const abs_p = (a: Point): Point => [Math.abs(a[0]), Math.abs(a[1])];

export const eq_p = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1];

export type BBox = { start: Point; end: Point };

export const intersect = (a: BBox, b: BBox): boolean =>
  !(b.start[0] > a.end[0] || b.end[0] < a.start[0] || b.start[1] > a.end[1] || b.end[1] < a.start[1]);
