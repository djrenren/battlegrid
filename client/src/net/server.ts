import { GameEvent, StateSync } from "../game/game-events";
import { DurableSignaler } from "./signaling";
import { read_stream, write_stream } from "./rtc-data-stream";
import { decoder, encoder } from "./rtc-message-protocol";
import { Status, GameClient } from "./client";

export class Server implements GameClient {
  signaler: DurableSignaler;
  status: Status = "connected";
  server = this;

  #writers: Set<WritableStreamDefaultWriter> = new Set();
  constructor(signaler: DurableSignaler) {
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
      let reader = read_stream(peer.data).pipeThrough(decoder());

      let enc = encoder();
      enc.readable.pipeTo(write_stream(peer.data));

      const writer = enc.writable.getWriter();
      this.#writers.add(writer);

      console.log("Getting state");
      if (this.get_state) {
        writer.write(this.get_state());
      }

      console.log("writing images");
      for (const [name, url] of this.get_images ? this.get_images().entries() : []) {
        console.log(name, url);
        writer.write({
          type: "file",
          name,
          contents: await (await fetch(url)).blob(),
        });
      }

      (async () => {
        let iter = reader.getReader();

        let ev: any, done: boolean;
        while (({ value: ev, done } = await iter.read()) && !done) {
          console.log("EVENT!", ev);
          // This returns a promise, but we won't await it because we don't want to cause
          // deadlock with writers
          await ev_write.write({ author: writer, ev });
        }
        this.#writers.delete(writer);
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
    await Promise.all(
      Array.from(this.#writers)
        .filter((w) => w !== author)
        .map((w) => w.write(ev))
    );
  }

  static async establish(): Promise<Server> {
    return new Server(await DurableSignaler.establish(new URL("wss://battlegrid-signaling.herokuapp.com/")));
  }

  on_event: (ev: any) => any = () => {};
  get_state?: () => StateSync;
  get_images?: () => Map<string, string>;
}
