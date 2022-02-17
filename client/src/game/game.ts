import { Resource, ResourceManager, URLString } from "../fs/resource-manager";
import { LocalOrRemoteImage } from "../util/files";
import { Point } from "../util/math";
import { OrderedMap } from "../util/orderedmap";
import { GameEvent, StateSync, TokenData, uuidv4 } from "./game-events";

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
    this.#local_dispatch({
      type: "bg",
      res,
    });
  }

  add_token(img: LocalOrRemoteImage, t: Omit<TokenData, "res" | "id">) {
    const id = uuidv4();
    const res = this.resources.register(img);
    const token = {
      id,
      res,
      ...t,
    };

    this.#local_dispatch({
      type: "token-added",
      ...token,
    });
  }

  apply(ev: GameEvent) {
    console.log("APPLYING!");
    switch (ev.type) {
      case "token-manipulated":
        let ex_token = this.tokens.get(ev.id);
        if (!ex_token) {
          console.error("Update received for nonexistant token", ev.id);
          return;
        }
        Object.assign(ex_token, { dim: ev.dim, loc: ev.loc, r: ev.r });
        break;

      case "token-added":
        let token = { id: ev.id, dim: ev.dim, loc: ev.loc, res: ev.res, r: 0 };
        this.tokens.add(ev.id, token);
        break;
      case "grid-resized":
        this.grid_dim = ev.dim;
        break;
      case "token-removed":
        const rem_token = this.tokens.get(ev.id);
        if (!rem_token) {
          console.error("Tried to remove nonexistant token", ev.id);
          return;
        }
        this.resources.delete(rem_token.res);
        this.tokens.delete(rem_token.id);

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
    this.#local_dispatch({
      type: "token-removed",
      id,
    });
  }

  #local_dispatch(detail: GameEvent) {
    this.apply(detail);
    this.dispatchEvent(new CustomEvent("game-event", { detail }));
  }

  set_dim(dim: Point) {
    this.#local_dispatch({
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
