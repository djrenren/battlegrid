import { GameEvent, StateSync } from "../game/game-events";
import { DurableSignaler } from "./signaling";
import { Status, GameClient } from "./client";
import { proto_pair } from "./rtc-message-protocol";

export class Server implements GameClient {
  signaler: DurableSignaler;
  get status(): Status {
    return "connected";
  }
  server = this;
  #event_writers: Set<WritableStreamDefaultWriter> = new Set();
  #data_writers: Set<WritableStreamDefaultWriter> = new Set();

  private constructor(signaler: DurableSignaler) {
    this.signaler = signaler;
    let { readable, writable } = new TransformStream({
      start() {},
      transform(chunk, controller) {
        console.log("TF STREAM");
        controller.enqueue(chunk);
      },
      flush() {},
    });

    let ev_read = readable.getReader();
    let ev_write = writable.getWriter();

    this.signaler.addEventListener("peer", async ({ detail: peer }) => {
      let events = proto_pair(peer.events);
      let data = proto_pair(peer.data);

      const event_writer = events.writable.getWriter();
      const data_writer = data.writable.getWriter();

      this.#event_writers.add(event_writer);
      this.#data_writers.add(data_writer);

      console.log("Getting state");
      if (this.get_state) {
        console.log("state", this.get_state());
        event_writer.write(this.get_state());
      }
      console.log("writing images");
      for (const [res_name, url] of this.get_images ? this.get_images() : []) {
        console.log(res_name, url);
        data_writer.write({
          type: "file",
          res_name,
          contents: await (await fetch(url)).blob(),
        });
      }

      // Loop for data events
      (async () => {
        let iter = events.readable.getReader();
        let ev: any, done: boolean;
        while (({ value: ev, done } = await iter.read()) && !done) {
          // This returns a promise, but we won't await it because we don't want to cause
          // deadlock with writers
          await ev_write.write({ author: event_writer, ev });
        }
        this.#event_writers.delete(event_writer);
      })();

      (async () => {
        let iter = data.readable.getReader();
        let ev: any, done: boolean;
        while (({ value: ev, done } = await iter.read()) && !done) {
          // This returns a promise, but we won't await it because we don't want to cause
          // deadlock with writers
          await ev_write.write({ author: event_writer, ev });
        }
        this.#data_writers.delete(data_writer);
      })();
    });

    // Handles the events in order
    (async () => {
      let ev: any, done: boolean;
      let author: any;
      while (
        ({
          value: { author, ev },
          done,
        } = await ev_read.read()) &&
        !done
      ) {
        await this.send_event(ev, author);
        this.on_event(ev);
      }
    })();
  }

  async send_event(ev: GameEvent, author?: WritableStreamDefaultWriter) {
    let sink = ev.type === "file" ? this.#data_writers : this.#event_writers;
    await Promise.all(
      Array.from(sink)
        .filter((w) => w !== author)
        .map((w) => w.write(ev))
    );
  }

  static async establish(): Promise<Server> {
    return new Server(await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")));
  }

  on_event: (ev: any) => any = () => {};
  get_state?: () => StateSync;
  get_images?: () => IterableIterator<[string, string]>;
}
