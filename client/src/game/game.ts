import { Resource, ResourceManager, URLString } from "../fs/resource-manager";
import { LocalOrRemoteImage } from "../util/files";
import { Point } from "../util/math";
import { OrderedMap } from "../util/orderedmap";
import { GameEvent, game_event, StateSync, TokenData, uuidv4 } from "./game-events";

export class Game extends EventTarget {
  tokens: OrderedMap<string, TokenData> = new OrderedMap();
  grid_dim: Point = [30, 20];
  #bg?: Resource;
  resources = new ResourceManager();

  get bg(): string | null {
    return this.#bg ? this.resources.get(this.#bg) : null;
  }

  set_bg(img: LocalOrRemoteImage | undefined) {
    const res = img ? this.resources.register(img) : undefined;
    this.apply({
      type: "bg",
      res,
    });

    if (img instanceof Blob) {
      this.dispatchEvent(
        game_event({
          type: "file",
          res_name: res!,
          contents: img,
        })
      );
    }
  }

  add_token(img: LocalOrRemoteImage, t: Omit<TokenData, "res" | "id">) {
    const id = uuidv4();
    const res = this.resources.register(img);
    const token = {
      id,
      res,
      ...t,
    };

    this.apply({
      type: "token-added",
      ...token,
    });

    if (img instanceof Blob) {
      this.dispatchEvent(
        game_event({
          type: "file",
          res_name: res,
          contents: img,
        })
      );
    }
  }

  local_apply(ev: GameEvent) {
    console.log("APPLYING!");
    switch (ev.type) {
      case "token-manipulated":
        for (let t of ev.tokens) {
          let ex_token = this.tokens.get(t.id);
          if (!ex_token) {
            console.error("Update received for nonexistant token", t.id);
            return;
          }
          Object.assign(ex_token, { dim: t.dim, loc: t.loc, r: t.r });
        }
        break;

      case "token-added":
        let token = { id: ev.id, dim: ev.dim, loc: ev.loc, res: ev.res, r: 0 };
        this.tokens.add(ev.id, token);
        break;
      case "grid-resized":
        this.grid_dim = ev.dim;
        break;
      case "token-removed":
        for (let id of ev.ids) {
          const rem_token = this.tokens.get(id);
          if (!rem_token) {
            console.error("Tried to remove nonexistant token", id);
            return;
          }
          this.resources.delete(rem_token.res);
          this.tokens.delete(rem_token.id);
        }

        break;
      case "state-sync":
        console.log("applying #tokens", ev.tokens);
        this.tokens = new OrderedMap();
        for (const t of ev.tokens) {
          this.tokens.add(t.id, t);
        }
        this.grid_dim = ev.grid_dim;
        this.#bg = ev.bg;
        break;

      case "token-reorder":
        const idx = this.tokens.index(ev.id);
        if (idx === undefined) {
          console.error("Tried to reorder non-existant token", ev.id);
          return;
        }

        let target;
        if (ev.idx === "top") {
          target = this.tokens.size - 1;
        } else if (ev.idx === "bottom") {
          target = 0;
        } else if (ev.idx === "up") {
          target = Math.min(this.tokens.size - 1, idx + 1);
        } else {
          target = Math.max(0, idx - 1);
        }

        this.tokens.set_index(ev.id, target);
        break;
      case "file":
        this.resources.register(ev.contents, ev.res_name);
        break;
      case "bg":
        if (this.#bg) {
          this.resources.delete(this.#bg);
        }
        this.#bg = ev.res;
        break;
    }
    this.dispatchEvent(new CustomEvent("updated"));
  }

  remove_token(id: string) {
    this.apply({
      type: "token-removed",
      ids: [id],
    });
  }

  apply(detail: GameEvent) {
    this.local_apply(detail);
    this.dispatchEvent(new CustomEvent("game-event", { detail }));
  }

  set_dim(dim: Point) {
    this.apply({
      type: "grid-resized",
      dim,
    });
  }

  get_state = (): StateSync => {
    return {
      type: "state-sync",
      tokens: [...this.tokens.values()],
      grid_dim: this.grid_dim,
      bg: this.#bg,
    };
  };
}
