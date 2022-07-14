import { PeerId } from "../net/rtc/signaler";
import { Point } from "../util/math";
import { SerializedTabletop } from "./tabletop";

export type GameEvent = { remote?: PeerId } & (
  | TokenAdded
  | TokenManipulated
  | TokenRemoved
  | GridResized
  | StateSync
  | Background
  | TokenReorder
  | Callout
);

export type TokenAdded = {
  type: "token-added";
  id: string;
  loc: Point;
  dim: Point;
  url: string;
};

export type TokenManipulated = {
  type: "token-manipulated";
  tokens: {
    id: string;
    loc: Point;
    dim: Point;
    r: number;
  }[];
};

export type TokenRemoved = {
  type: "token-removed";
  ids: string[];
};

export type GridResized = {
  type: "grid-resized";
  dim: Point;
};

export interface StateSync {
  type: "state-sync";
  tabletop: SerializedTabletop;
}

export type Callout = {
  type: "callout";
  loc: Point;
};

export type TokenReorder = {
  type: "token-reorder";
  id: string;
  idx: "up" | "down" | "top" | "bottom";
};

export type TokenData = {
  loc: Point;
  dim: Point;
  url: string;
  id: string;
  r: number; // degrees!
};

export type Background = {
  type: "bg";
  url: string | null;
};

export const uuidv4 = () => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

export const game_event = (detail: GameEvent): CustomEvent<GameEvent> => {
  return new CustomEvent("game-event", { detail });
};
