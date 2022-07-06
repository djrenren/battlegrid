import { map } from "../util/iter";
import { Point } from "../util/math";
import { OrderedMap } from "../util/orderedmap";
import { Branded } from "../util/string";
import { TokenData } from "./game-events";

export type Tabletop = {
  tokens: OrderedMap<string, TokenData>;
  grid_dim: Point;
  bg: string | null;
};

export type SerializedTabletop = Branded<"tabletop">;

export const default_tabletop = (): Tabletop => ({
  tokens: new OrderedMap(),
  grid_dim: [30, 20] as Point,
  bg: null,
});

export const serialize_tbt = (t: Tabletop): SerializedTabletop =>
  JSON.stringify({
    ...t,
    tokens: [...map(t.tokens.values(), (t) => ({ ...t }))],
  }) as SerializedTabletop;

export const deserialize_tbt = (t: SerializedTabletop): Tabletop => {
  let p = JSON.parse(t) as any;
  let om = new OrderedMap();
  p.tokens.forEach((t: TokenData) => om.add(t.id, t));
  return {
    ...p,
    tokens: om,
  };
};
