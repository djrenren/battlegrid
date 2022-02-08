import { GameEvent } from "../game/game-events";
import { Peer } from "./peer";
import { read_stream, write_stream } from "./rtc-data-stream";
import { decoder, encoder } from "./rtc-message-protocol";
import { Server } from "./server";
import { DurableSignaler } from "./signaling";


export type Status = "disconnected" | "connecting" | "connected" | "error";
export interface GameClient {
  get status(): Status;
  on_event: (ev: GameEvent) => void;
  send_event(ev: GameEvent): Promise<void>;
  get server(): Server | undefined;
}

export class Client implements GameClient {
  #writer?: WritableStreamDefaultWriter;
  #reader?: ReadableStreamDefaultReader;
  #remote_id: string;
  status: Status = "disconnected";
  server = undefined;

  constructor(remote_id: string) {
      this.#remote_id = remote_id;
  }

  #set_status(s: Status) {
      this.status = s;
      setTimeout(this.on_status, 0);
  }

  async connect() {
    this.#set_status("connecting")
    let peer;
    try {
        let sig = await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));
        peer = await new Promise<Peer>(async (resolve, reject) => {
            sig.addEventListener('error', reject, {once: true});
            let peer = await sig.connect_to(this.#remote_id);
            peer.data.onopen = () => resolve(peer);
        });
    } catch(e) {
        console.log("error");
        this.#set_status('error');
        return;
    };

    let reader = read_stream(peer.data).pipeThrough(decoder()).getReader();
    let enc = encoder();

    enc.readable.pipeTo(write_stream(peer.data));
    this.#writer = enc.writable.getWriter();
    this.#set_status("connected");
    (async () => {
      let ev, done;
      while (({ value: ev, done } = await reader.read()) && !done) {
        this.on_event(ev as GameEvent);
      }

        this.#set_status("disconnected");
    })();
  }

  on_event = (_: GameEvent) => {};
  on_status = () => {};

  async send_event(ev: GameEvent) {
    this.#writer?.write(ev);
  }
}
