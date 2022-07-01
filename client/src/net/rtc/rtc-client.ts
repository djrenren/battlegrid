import { Client } from "../client";
import { Peer } from "./peer";
import { streams } from "./rtc-data-stream";
import { resources } from "./rtc-resource-encoder";
import { DurableSignaler } from "../signaling";

const rw_pair = () => ({
    input: new TransformStream(),
    output: new TransformStream()
});

export type Status = "disconnected" | "connecting" | "connected" | "error";

export class RTCClient implements Client {
  #events = rw_pair();
  #data = rw_pair();

  get events(): ReadableWritablePair {
    return {
        readable: this.#events.input.readable,
        writable: this.#events.output.writable,
    }
  }

  get data(): ReadableWritablePair {
    return {
        readable: this.#data.input.readable,
        writable: this.#data.output.writable,
    }
  }

  #remote_id: string;
  status: Status = "disconnected";

  constructor(remote_id: string) {
    this.#remote_id = remote_id;
  }

  close(): void {

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

    let events = resources(streams(peer.events));
    events.readable.pipeThrough(this.#events.input, {preventClose: true, preventAbort: true, preventCancel: true});
    this.#events.output.readable.pipeTo(events.writable);

    let data = resources(streams(peer.data));
    data.readable.pipeThrough(this.#data.input, {preventClose: true, preventAbort: true, preventCancel: true});
    this.#data.output.readable.pipeTo(data.writable);

    peer.events.onclose = peer.data.onclose = () => this.#set_status('disconnected');
    this.#set_status('connected');
  }

  on_status = () => {};
}

