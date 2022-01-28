export type Point = [number, number];

export const add_p = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
export const add_c = (a: Point, c: number): Point => add_p(a, [c, c]);

export const sub_p = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];

export const mul_c = (a: Point, c: number): Point => [a[0] * c, a[1] * c];
export const mul_p = (a: Point, b: Point): Point => [a[0] * b[0], a[1] * b[1]];

export const div_p = (a: Point, b: Point): Point => [a[0] / b[0], a[1] / b[1]];
export const div_c = (a: Point, c: number): Point => [a[0] / c, a[1] / c];

export const max_p = (a: Point, b: Point): Point => [
  Math.max(a[0], b[0]),
  Math.max(a[1], b[1]),
];
export const min_p = (a: Point, b: Point): Point => [
  Math.min(a[0], b[0]),
  Math.min(a[1], b[1]),
];
