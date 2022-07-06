import { ResourceMessage } from "../net/resources/service-worker-protocol";
import { EventEmitter } from "../util/events";
import { LocalOrRemoteImage } from "../util/files";
import { Point } from "../util/math";
import { consume } from "../util/streams";
import { GameEvent, game_event, TokenData } from "./game-events";
import { default_tabletop, deserialize_tbt } from "./tabletop";

const CALLOUT_TIMER = 1500;

type EventMap = {
  "game-event": CustomEvent<GameEvent>;
};
export class Game extends EventTarget implements EventEmitter<EventMap> {
  tabletop = default_tabletop();
  callouts = new Set<Point>();

  #event_writer: WritableStreamDefaultWriter<GameEvent>;

  constructor() {
    super();

    // Use a stream so that game event processing is allowed to be async
    // but remains ordered.
    const events = new TransformStream<GameEvent, GameEvent>();
    this.#event_writer = events.writable.getWriter();

    consume(events.readable, (ev) => this.#handle_event(ev));
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
    switch (ev.type) {
      case "token-manipulated":
        for (let t of ev.tokens) {
          let ex_token = this.tabletop.tokens.get(t.id);
          if (!ex_token) {
            console.error("Update received for nonexistant token", t.id);
            return;
          }
          Object.assign(ex_token, { dim: t.dim, loc: t.loc, r: t.r });
        }
        break;

      case "token-added":
        let token = { id: ev.id, dim: ev.dim, loc: ev.loc, url: ev.url, r: 0 };
        this.tabletop.tokens.add(ev.id, token);
        break;
      case "grid-resized":
        this.tabletop.grid_dim = ev.dim;
        break;
      case "token-removed":
        for (let id of ev.ids) {
          const rem_token = this.tabletop.tokens.get(id);
          if (!rem_token) {
            console.error("Tried to remove nonexistant token", id);
            return;
          }
          this.tabletop.tokens.delete(rem_token.id);
        }

        break;
      case "state-sync":
        this.tabletop = deserialize_tbt(ev.tabletop);
        break;

      case "token-reorder":
        const idx = this.tabletop.tokens.index(ev.id);
        if (idx === undefined) {
          console.error("Tried to reorder non-existant token", ev.id);
          return;
        }

        let target;
        if (ev.idx === "top") {
          target = this.tabletop.tokens.size - 1;
        } else if (ev.idx === "bottom") {
          target = 0;
        } else if (ev.idx === "up") {
          target = Math.min(this.tabletop.tokens.size - 1, idx + 1);
        } else {
          target = Math.max(0, idx - 1);
        }

        this.tabletop.tokens.set_index(ev.id, target);
        break;
      case "bg":
        this.tabletop.bg = ev.url;
        break;

      case "callout":
        this.callouts.add(ev.loc);
        setTimeout(() => {
          this.callouts.delete(ev.loc);
        }, CALLOUT_TIMER);
        break;
    }

    // Notify that the game state has been altered
    this.dispatchEvent(game_event(ev));
  }

  async #register_resource(img: LocalOrRemoteImage): Promise<string> {
    // URLs are valid resources
    if (typeof img === "string") {
      return img as string;
    }

    let url = new URL(window.location.toString());
    url.search = "";
    let id = crypto.randomUUID();
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
