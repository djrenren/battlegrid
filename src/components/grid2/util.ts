
interface Unit<T> {
    _unitBrand: T
}
export type Coord<T> = [number & Unit<T>, number & Unit<T>] & Unit<'coord'>
export type Offset<T> = [number & Unit<T>, number & Unit<T>] & Unit<'offset'>
export type Pair<T> = Coord<T> | Offset<T>

export function add<T>(a: Offset<T>, b: Offset<T>): Offset<T>;
export function add<T>(a: Coord<T>, b: Offset<T>): Coord<T>
export function add<T>(a: [number, number], b: [number,number]): [number,number] {
    return [a[0] + b[0], a[1] + b[1]] as any;
}

export function sub<T>(a: Offset<T>, b: Offset<T>): Offset<T>;
export function sub<T>(a: Coord<T>, b: Offset<T>): Coord<T>
export function sub<T>(a: [number, number], b: [number,number]): [number,number] {
    return [a[0] - b[0], a[1] - b[1]] as any;
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function coord_clamp<T, P extends Pair<T>>(val: P, min: [number, number], max: [number, number]): P {
    return [
        Math.max(min[0], Math.min(max[0], val[0])),
        Math.max(min[1], Math.min(max[1], val[1])),
    ] as P;
}