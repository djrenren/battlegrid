import { Map } from "yjs";

export interface TypedMap<Shape> {
  size: number;
  get<K extends keyof Shape & string>(k: K): Shape[K];
  set<K extends keyof Shape & string>(k: K, v: Shape[K]): void;
  keys(): IterableIterator<keyof Shape>;
  values(): IterableIterator<Shape[keyof Shape]>;
  delete<K extends keyof Shape & string>(k: K): void;
  forEach(f: (arg0: Shape[keyof Shape], arg1: keyof Shape, arg2: TypedMap<Shape>) => void): Shape;
  has(key: keyof Shape): boolean;
  clear(): void;
  clone(): TypedMap<Shape>;
  [Symbol.iterator](): IterableIterator<Entries<Shape>>;
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function typed_map<Shape>(s: Shape): TypedMap<Shape> {
  let x = new Map();
  for (let [k, v] of Object.entries(s)) {
    x.set(k, v);
  }
  return x as any;
}
