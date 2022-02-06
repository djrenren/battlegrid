import { GameEvent } from "../game/game-events";
import { Peer } from "./peer";
import { read_stream, write_stream } from "./rtc-data-stream";
import { decoder, encoder } from "./rtc-message-protocol";
import { DurableSignaler } from "./signaling";

export interface GameClient {
  on_event: (ev: GameEvent) => void;
  send_event(ev: GameEvent): Promise<void>;
}

export class Client implements GameClient {
  #writer: WritableStreamDefaultWriter;

  constructor(peer: Peer) {
    let reader = read_stream(peer.data).pipeThrough(decoder()).getReader();

    let enc = encoder();
    enc.readable.pipeTo(write_stream(peer.data));
    this.#writer = enc.writable.getWriter();

    (async () => {
      let ev, done;
      while (({ value: ev, done } = await reader.read()) && !done) {
        this.on_event(ev as GameEvent);
      }
    })();
  }

  static async establish(remote_id: string) {
    let sig = await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));
    let peer = await sig.connect_to(remote_id);
    return new Client(peer);
  }

  on_event = (_: GameEvent) => {};

  async send_event(ev: GameEvent) {
    debugger;
    this.#writer.write(ev);
  }
}
