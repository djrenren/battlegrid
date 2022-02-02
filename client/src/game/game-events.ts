import { Point } from "../util/math";

export type GameEvent = TokenAdded | TokenManipulated | TokenRemoved;

export type TokenAdded = {
  type: "token-added";
  id: string;
  loc: Point;
  res: string; // base64 encoded image
};

export type TokenManipulated = {
  type: "token-manipulated";
  id: string;
  loc: Point;
  dim: Point;
};

export type TokenRemoved = {
  type: "token-removed";
  id: string;
};

export const uuidv4 = () => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

export const game_event = (detail: GameEvent): CustomEvent => new CustomEvent("game-event", { detail });
