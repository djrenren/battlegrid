import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { GameEvent } from "../game/game-events";
import { BgDropEvent, Canvas, TokenDropEvent, TokenSelectEvent } from "./canvas";
import "./buymeacoffee";
import { Game } from "../game/game";
import { ifDefined } from "lit/directives/if-defined.js";
import { max_p } from "../util/math";
import { first } from "../util/iter";
import { Client } from "../net/client";
import { Server } from "../net/server";
import { PeerId } from "../net/peer";

@customElement("bg-app")
class App extends LitElement {
  @query("#width", true)
  width?: HTMLInputElement;

  @query("#height", true)
  height?: HTMLInputElement;

  @query("bg-canvas", true)
  canvas?: Canvas;

  @state()
  client?: Client;

  @state()
  server?: Server;

  @state()
  selection: Set<string> = new Set();

  @state()
  host_pending = false;

  #game: Game = new Game();

  render() {
    let error =
      this.client?.status === "closed"
        ? html` <div class="message error">
            <div>
              <h1>Error connecting to remote grid</h1>
              <button @click=${this.#new_local}>New local grid</button>
            </div>
          </div>`
        : null;
    let connecting =
      this.client?.status === "checking"
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
            <input id="width" type="number" min="1" @input=${this.#updateDim} .value=${this.#game.tabletop.grid_dim[0] + ""} /> x
            <input id="height" type="number" min="1" @input=${this.#updateDim} .value=${this.#game.tabletop.grid_dim[1] + ""} />
          </span>
          ${this.selection.size === 1
            ? html`
                <div>
                  <button
                    @click=${() => this.#game.apply({ type: "token-reorder", id: first(this.selection)!, idx: "down" })}
                    ?disabled=${this.#game.tabletop.tokens.index(first(this.selection)!) === 0}
                  >
                    Move Down
                  </button>
                  <button
                    @click=${() => this.#game.apply({ type: "token-reorder", id: first(this.selection)!, idx: "up" })}
                    ?disabled=${this.#game.tabletop.tokens.index(first(this.selection)!) === this.#game.tabletop.tokens.size - 1}
                  >
                    Move Up
                  </button>
                </div>
              `
            : null}
        </div>
        <div class="group">
          ${this.host_pending
            ? html`<img src="assets/loading.svg" />`
            : !this.client && !this.server
            ? html`<button @click=${this.#host}>Host</button>`
            : html`<div>${this.server ? `hosting` : this.client!.status}</div>`}
          <buy-me-a-coffee class="right"></buy-me-a-coffee>
        </div>
      </section>
      <bg-canvas
        bg=${ifDefined(this.#game.tabletop.bg ?? undefined)}
        .selection=${this.selection}
        width=${this.#game.tabletop.grid_dim[0]}
        height=${this.#game.tabletop.grid_dim[1]}
        .tokens=${this.#game.tabletop.tokens}
        .callouts=${this.#game.callouts}
        @token-drop=${({ detail }: TokenDropEvent) => this.#game.add_token(detail.img, { loc: detail.loc, r: 0, dim: detail.dim })}
        @bg-drop=${({ detail }: BgDropEvent) => this.#game.set_bg(detail)}
        @token-select=${({ detail }: TokenSelectEvent) => {
          this.selection = new Set(detail);
        }}
        @game-event=${({ detail }: CustomEvent<GameEvent>) => this.#game.apply(detail)}
      ></bg-canvas>
      ${overlay}
    `;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("client")) {
      document.title = `BattleGrid${this.client && this.client.status === "connected" ? (this.server ? "- Hosting" : "- Connected") : ""}`;
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
    this.#game.addEventListener("game-event", () => {
      for (const id of this.selection) {
        this.#game.tabletop.tokens.has(id) || this.selection.delete(id);
      }
      this.requestUpdate();
      this.canvas?.requestUpdate();
    });
    let params = new URLSearchParams(window.location.search);
    let game_id = params.get("game") as PeerId | undefined;
    if (!game_id) return {};

    try {
      this.client = await Client.establish(game_id, this.#game);
    } catch {
      this.#new_local();
    }
  }

  #new_local = () => {
    this.client?.shutdown();
    this.client = undefined;
    window.history.pushState(null, "", window.location.href.split("?")[0]);
  };

  #host = async () => {
    try {
      this.host_pending = true;
      this.server = await Server.establish(this.#game);
      this.client?.shutdown();
      this.client = undefined;
      this.host_pending = false;
      window.history.pushState({}, "", "?game=" + this.server.signaler.peer_id);
      navigator.clipboard.writeText(window.location.toString());
    } catch (e) {
      console.error(e);
    }
  };
}
