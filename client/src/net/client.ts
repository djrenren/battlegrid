import { ResourceManager } from "../fs/resource-manager";
import { FileResponse, GameEvent } from "../game/game-events";
import { Peer } from "./peer";
import { read_stream, write_stream } from "./rtc-data-stream";
import { decoder, encoder, proto_pair } from "./rtc-message-protocol";
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
  #event_writer?: WritableStreamDefaultWriter;
  #data_writer?: WritableStreamDefaultWriter;

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
    this.#set_status("connecting");
    let peer;
    try {
      let sig = await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com"));
      peer = await new Promise<Peer>(async (resolve, reject) => {
        sig.addEventListener("error", reject, { once: true });
        let peer = await sig.connect_to(this.#remote_id);
        peer.data.onopen = () => resolve(peer);
      });
    } catch (e) {
      console.log("error");
      this.#set_status("error");
      return;
    }
    let events = proto_pair(peer.events);
    this.#event_writer = events.writable.getWriter();
    let event_reader = events.readable.getReader();

    let data = proto_pair(peer.data);
    this.#data_writer = data.writable.getWriter();
    let data_reader = data.readable.getReader();

    this.#set_status("connected");
    (async () => {
      let ev, done;

      while (({ value: ev, done } = await data_reader.read()) && !done) {
        console.log("DATA", ev);
        this.on_event(ev as GameEvent);
      }

      console.log("dccccc");
      this.#set_status("disconnected");
    })();

    (async () => {
      let ev, done;

      while (({ value: ev, done } = await event_reader.read()) && !done) {
        console.log("EVENT!", ev);
        this.on_event(ev as GameEvent);
      }

      console.log("dccccc");
      this.#set_status("disconnected");
    })();
  }

  on_event = (_: GameEvent) => {};
  on_status = () => {};

  async send_event(ev: GameEvent) {
    let sink = ev.type === "file" ? this.#data_writer : this.#event_writer;
    sink?.write(ev);
  }
}
