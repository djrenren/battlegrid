import { Doc, Map, Array } from "yjs";
import { PeerId } from "../net/rtc/signaler";
import { EventEmitter } from "../util/events";
import { LocalOrRemoteImage } from "../util/files";
import { Point } from "../util/math";
import { consume } from "../util/streams";
import { TypedMap, typed_map } from "../util/yjs";
import { GameEvent, game_event, TokenData } from "./game-events";
import { default_tabletop } from "./tabletop";

const CALLOUT_TIMER = 1500;

type EventMap = {
  "game-event": CustomEvent<GameEvent>;
};

export type Board = TypedMap<{
  width: number;
  height: number;
  bg: string | null;
  tokens: Map<TypedMap<TokenData>>;
  order: Array<string>;
}>;

export class Game extends EventTarget implements EventEmitter<EventMap> {
  doc: Doc;
  callouts = new Set<Point>();

  get board(): Board {
    let b = this.doc.getMap("board");
    return b as any;
  }

  #event_writer: WritableStreamDefaultWriter<GameEvent>;

  constructor() {
    super();

    this.doc = new Doc();

    // Use a stream so that game event processing is allowed to be async
    // but remains ordered.
    const events = new TransformStream<GameEvent, GameEvent>();
    this.#event_writer = events.writable.getWriter();

    consume(events.readable, (ev) => this.#handle_event(ev));
  }

  initialize_board() {
    this.doc.transact(() => {
      this.board.set("width", 30);
      this.board.set("height", 30);
      this.board.set("bg", null);
      this.board.set("tokens", new Map());
      this.board.set("order", new Array<string>());
    });
  }

  async set_bg(img: LocalOrRemoteImage | undefined) {
    const url = img ? await this.#register_resource(img) : null;
    this.apply({
      type: "bg",
      url,
    });
  }

  async add_token(img: LocalOrRemoteImage, t: Omit<TokenData, "url" | "id">) {
    const id = crypto.randomUUID();
    const url = await this.#register_resource(img);
    const token = {
      id,
      url,
      ...t,
    };

    this.apply({
      type: "token-added",
      ...token,
    });
  }

  set_dim(dim: Point) {
    this.apply({
      type: "grid-resized",
      dim,
    });
  }

  async apply(ev: GameEvent) {
    await this.#event_writer.write(ev);
  }

  async #handle_event(ev: GameEvent): Promise<void> {
    console.log("handling event", ev);
    this.doc.transact(() => {
      switch (ev.type) {
        case "token-manipulated":
          for (let t of ev.tokens) {
            let token = this.board.get("tokens").get(t.id);
            if (token === undefined) {
              console.error("Update received for nonexistant token", t.id);
              return;
            }

            token.set("dim", t.dim);
            token.set("r", t.r);
            token.set("loc", t.loc);
          }
          break;

        case "token-added":
          let token = { id: ev.id, dim: ev.dim, loc: ev.loc, url: ev.url, r: 0 };
          console.log(token);
          this.board.get("tokens").set(ev.id, typed_map(token));
          this.board.get("order").push([ev.id]);
          break;
        case "grid-resized":
          this.board.set("width", ev.dim[0]);
          this.board.set("height", ev.dim[1]);
          break;

        case "token-removed":
          for (let id of ev.ids) {
            this.board.get("tokens").delete(id);
          }

          let indices: number[] = [];
          this.board.get("order").forEach((id, idx) => ev.ids.includes(id) && indices.push(idx));
          indices
            .sort()
            .reverse()
            .forEach((i) => {
              this.board.get("order").delete(i);
            });
          break;
        case "state-sync":
          // this.tabletop = deserialize_tbt(ev.tabletop);
          break;

        case "token-reorder":
          // const idx = this.tabletop.tokens.index(ev.id);
          // if (idx === undefined) {
          //   console.error("Tried to reorder non-existant token", ev.id);
          //   return;
          // }

          // let target;
          // if (ev.idx === "top") {
          //   target = this.tabletop.tokens.size - 1;
          // } else if (ev.idx === "bottom") {
          //   target = 0;
          // } else if (ev.idx === "up") {
          //   target = Math.min(this.tabletop.tokens.size - 1, idx + 1);
          // } else {
          //   target = Math.max(0, idx - 1);
          // }

          // this.tabletop.tokens.set_index(ev.id, target);
          // break;
          break;
        case "bg":
          this.board.set("bg", ev.url);
          break;

        case "callout":
          this.callouts.add(ev.loc);
          setTimeout(() => {
            this.callouts.delete(ev.loc);
          }, CALLOUT_TIMER);
          break;
      }
    });
  }

  async #register_resource(img: LocalOrRemoteImage): Promise<string> {
    // URLs are valid resources
    if (typeof img === "string") {
      return img as string;
    }

    let url = new URL(window.location.toString());
    url.search = "";
    let hash = await crypto.subtle.digest("SHA-1", await img.arrayBuffer());
    let id = btoa(String.fromCharCode(...new Uint8Array(hash)));
    console.log("RESOURCE ID: ", id);
    url.pathname = `/resources/${id}`;
    let cache = await caches.open("resources");
    await cache.put(url, new Response(img));
    return url.toString();
  }
}

export interface Game extends EventTarget {
  addEventListener(type: "game-event", listener: (ev: CustomEvent<GameEvent>) => any, capture?: boolean): void;
  addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean): void;
}
