import { GameEvent } from "./game-events";

export interface GameClient {
  send(ev: GameEvent): void;
  on_event?(ev: GameEvent): void;
}
