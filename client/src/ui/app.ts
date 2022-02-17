import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { Server } from "../net/server";
import { GameEvent, TokenData } from "../game/game-events";
import { Client, GameClient } from "../net/client";
import { BgDropEvent, Canvas, TokenDropEvent, TokenSelectEvent } from "./canvas";
import "./buymeacoffee";
import { Game } from "../game/game";
import { Resource } from "../fs/resource-manager";
import { ifDefined } from "lit/directives/if-defined.js";
import { max_p } from "../util/math";

@customElement("bg-app")
class App extends LitElement {
  @query("#width", true)
  width?: HTMLInputElement;

  @query("#height", true)
  height?: HTMLInputElement;

  @query("bg-canvas", true)
  canvas?: Canvas;

  @state()
  client?: GameClient;

  @state()
  selection?: TokenData;

  @state()
  host_pending = false;

  #game: Game = new Game();

  render() {
    let error =
      this.client?.status === "error"
        ? html` <div class="message error">
            <div>
              <h1>Error connecting to remote grid</h1>
              <button @click=${this.#try_again}>Try again</button>
              <button @click=${this.#new_local}>New local grid</button>
            </div>
          </div>`
        : null;
    let connecting =
      this.client?.status === "connecting"
        ? html` <div class="message">
            <div>
              <h1>Connecting to grid...</h1>
            </div>
          </div>`
        : null;
    let disconnected =
      this.client?.status === "disconnected"
        ? html` <div class="message">
            <div>
              <h1>Disconnected from host</h1>
              <button @click=${this.#try_again}>Try again</button>
              <button @click=${this.#new_local}>Continue locally</button>
            </div>
          </div>`
        : null;

    let overlay = error || connecting || disconnected;
    return html`
      <section id="toolbar" class="group">
        <div class="group">
          <span>
            Grid:
            <input id="width" type="number" min="1" @input=${this.#updateDim} .value=${this.#game.grid_dim[0] + ""} /> x
            <input id="height" type="number" min="1" @input=${this.#updateDim} .value=${this.#game.grid_dim[1] + ""} />
          </span>
          ${this.host_pending
            ? html`<img src="assets/loading.svg" />`
            : !this.client
            ? html`<button @click=${this.#host}>Host</button>`
            : html`<div>${this.client.server ? `hosting` : this.client.status}</div>`}
          ${this.selection
            ? html`
                <div>
                  <button
                    @click=${() => this.#game.apply({ type: "token-reorder", id: this.selection!.id, idx: "down" })}
                    ?disabled=${this.#game.tokens.index(this.selection.id) === 0}
                  >
                    Move Down
                  </button>
                  <button
                    @click=${() => this.#game.apply({ type: "token-reorder", id: this.selection!.id, idx: "up" })}
                    ?disabled=${this.#game.tokens.index(this.selection.id) === this.#game.tokens.size - 1}
                  >
                    Move Up
                  </button>
                </div>
              `
            : null}
        </div>
        <div class="group">
          <buy-me-a-coffee class="right"></buy-me-a-coffee>
        </div>
      </section>
      <bg-canvas
        bg=${ifDefined(this.#game.bg ?? undefined)}
        selection=${ifDefined(this.selection?.id)}
        width=${this.#game.grid_dim[0]}
        height=${this.#game.grid_dim[1]}
        .tokens=${this.#game.tokens}
        .resources=${this.#game.resources}
        @token-drop=${({ detail }: TokenDropEvent) => this.#game.add_token(detail.img, { loc: detail.loc, r: 0, dim: detail.dim })}
        @bg-drop=${({ detail }: BgDropEvent) => this.#game.set_bg(detail)}
        @token-select=${({ detail }: TokenSelectEvent) => {
          this.selection = detail ? this.#game.tokens.get(detail) : undefined;
        }}
        @game-event=${({ detail }: CustomEvent<GameEvent>) => this.#game.apply(detail)}
      ></bg-canvas>
      ${overlay}
    `;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("client")) {
      document.title = `BattleGrid${this.client && this.client.status === "connected" ? (this.client.server ? "- Hosting" : "- Connected") : ""}`;
    }
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      display: grid;
      grid:
        "toolbar" 30px
        "viewport" 1fr
        / 1fr;
      font-family: inherit;
      --ui-bg: #f9f9fa;
    }

    .message {
      grid-area: 1 / 1 / 3 / 1;
      display: grid;
      align-items: center;
      justify-items: center;
      background: white;
      z-index: 2;
    }

    .right {
      justify-self: end;
    }

    bg-canvas {
      grid-area: viewport;
      z-index: 1;
    }

    input[type="number"] {
      width: 3em;
    }

    .group {
      display: flex;
      align-items: center;
      height: 100%;
      flex-wrap: nowrap;
    }

    #toolbar {
      grid-area: toolbar;
      box-shadow: 0 0 4px gray;
      z-index: 2;
      background: var(--ui-bg);
      justify-content: space-between;
      padding: 0 1em;
      grid-template-rows: unset;
    }
    .group img {
      width: 1em;
      height: 1em;
      object-fit: cover;
      display: inline-block;
    }
  `;

  #updateDim = () => {
    //@ts-ignore
    this.#game.set_dim(max_p([1, 1], [parseInt(this.width?.value) ?? 0, parseInt(this.height?.value) ?? 0]));
  };

  async connectedCallback() {
    super.connectedCallback();
    //@ts-ignore
    this.#game.addEventListener("game-event", this.#on_event);
    this.#game.addEventListener("updated", () => {
      if (this.selection && !this.#game.tokens.has(this.selection.id)) {
        this.selection = undefined;
      }
      this.requestUpdate();
      this.canvas?.requestUpdate();
    });
    let params = new URLSearchParams(window.location.search);
    let game_id = params.get("game");
    if (!game_id) return {};

    let c = new Client(game_id);
    c.on_event = this.#incoming_event;
    c.on_status = () => this.requestUpdate("client");
    this.client = c;
    await c.connect();
  }

  #try_again = () => {
    if (this.client && !this.client.server) {
      (this.client as Client).connect();
    }
  };

  #new_local = () => {
    this.client = undefined;
    window.history.pushState(null, "", window.location.href.split("?")[0]);
  };

  #host = async () => {
    try {
      this.host_pending = true;
      let srv = await Server.establish();
      this.host_pending = false;
      this.client = srv;
      //@ts-ignore
      srv.on_event = this.#incoming_event;
      srv.get_state = this.#game.get_state;
      srv.get_images = () => this.#game.resources.all();

      window.history.pushState({}, "", "?game=" + srv.signaler.ident);
      navigator.clipboard.writeText(window.location.toString());
    } catch (e) {
      console.error(e);
    }
  };

  #incoming_event = (ev: GameEvent) => {
    this.#game.local_apply(ev);
  };

  #on_event = (ev: CustomEvent<GameEvent>) => {
    this.client?.send_event(ev.detail);
  };
}
