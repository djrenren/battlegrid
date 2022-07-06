import { GameEvent } from "../game/game-events";
import { streams } from "../util/rtc";
import { json, pipe } from "../util/streams";

export type PeerId = string & { __brand: "PeerId" };

export class Peer {
  id: PeerId;
  rtc: RTCPeerConnection;
  events: ReadableStream<GameEvent>;
  events_dc: RTCDataChannel;
  #event_writer: WritableStreamDefaultWriter<GameEvent>;

  constructor(id: PeerId, rtc: RTCPeerConnection) {
    this.id = id;
    this.rtc = rtc;

    this.events_dc = rtc.createDataChannel("events", { negotiated: true, id: 1 });
    let { readable, writable } = json<GameEvent>(streams(this.events_dc) as ReadableWritablePair<string, string>);
    this.events = readable;
    this.#event_writer = writable.getWriter();
    this.rtc.ondatachannel = (ev) => this.ondatachannel(ev);
  }

  write_event(ev: GameEvent) {
    ev.remote = this.id;
    return this.#event_writer.write(ev);
  }

  ondatachannel = (ev: RTCDataChannelEvent) => {};

  datachannel(name: string, init?: RTCDataChannelInit): Promise<RTCDataChannel> {
    return new Promise((resolve, reject) => {
      let dc = this.rtc.createDataChannel(name, init);
      dc.addEventListener(
        "open",
        () => {
          dc.removeEventListener("error", reject);
          resolve(dc);
        },
        { once: true }
      );
      dc.addEventListener("error", reject, { once: true });
    });
  }
}
