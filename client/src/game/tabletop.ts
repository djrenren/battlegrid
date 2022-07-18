import { Array, Doc, Map } from "yjs";
import { Point } from "../util/math";
import { Branded } from "../util/string";
import { TypedMap, typed_map } from "../util/yjs";

export type Tabletop = TypedMap<{
  tokens: Map<TokenData>;
  order: Array<string>;
  grid_dim: Point;
  bg: string | null;
}>;

export type TokenData = TypedMap<{
  loc: Point;
  dim: Point;
  url: string;
  id: string;
  r: number; // degrees!
}>;

export type SerializedTabletop = Branded<"tabletop">;

export const default_tabletop = (): Tabletop =>
  typed_map({
    tokens: new Map(),
    order: new Array(),
    grid_dim: [30, 40],
    bg: null as null | string,
  });
