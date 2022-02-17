import { Resource } from "../fs/resource-manager";
import { Point } from "../util/math";

export type GameEvent = TokenAdded | TokenManipulated | TokenRemoved | GridResized | StateSync | FileResponse | Background | TokenReorder;

export type TokenAdded = {
  type: "token-added";
  id: string;
  loc: Point;
  dim: Point;
  res: Resource;
};

export type TokenManipulated = {
  type: "token-manipulated";
  id: string;
  loc: Point;
  dim: Point;
  r: number;
};

export type TokenRemoved = {
  type: "token-removed";
  id: string;
};

export type GridResized = {
  type: "grid-resized";
  dim: Point;
};

export type StateSync = {
  type: "state-sync";
  tokens: TokenData[];
  grid_dim: Point;
  bg?: Resource;
};

export type TokenReorder = {
  type: "token-reorder";
  id: string;
  idx: "up" | "down" | "top" | "bottom";
};

export type TokenData = {
  loc: Point;
  dim: Point;
  res: Resource;
  id: string;
  r: number; // degrees!
};

export type Background = {
  type: "bg";
  res?: Resource;
};

export type FileResponse = {
  type: "file";
  res_name: string;
  contents: Blob;
};

export const uuidv4 = () => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

export const game_event = (detail: GameEvent): CustomEvent<GameEvent> => new CustomEvent("game-event", { detail });
