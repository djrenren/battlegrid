import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { GameEvent } from "../game/game-events";
import { BgDropEvent, Canvas, TokenDropEvent, TokenSelectEvent } from "./canvas";
import "./buymeacoffee";
import { Game } from "../game/game";
import { ifDefined } from "lit/directives/if-defined.js";
import { max_p } from "../util/math";
import { first } from "../util/iter";
import { Client } from "../net/client";
import { Server } from "../net/server";
import "./util/with-tooltip";
import "./host-toggle";
import "./client-status";
import "./html-canvas";
import { timeout } from "../util/promises";
import { PeerId } from "../net/rtc/signaler";

@customElement("bg-app")
class App extends LitElement {
  @query("#width", true)
  width?: HTMLInputElement;

  @query("#height", true)
  height?: HTMLInputElement;

  @query("html-canvas", false)
  canvas?: Canvas;

  @state()
  client?: Client;

  @state()
  server?: Server;

  @state()
  selection: Set<string> = new Set();

  @state()
  host_pending = false;

  @state()
  client_pending = false;

  game: Game = new Game();

  render() {
    let error =
      this.client?.status.current === "closed"
        ? html` <div class="message error">
            <div>
              <h1>Error connecting to remote grid</h1>
              <button @click=${this.#new_local}>New local grid</button>
            </div>
          </div>`
        : null;
    let connecting = this.client_pending
      ? html` <div class="message">
          <div>
            <h1>Connecting to grid...</h1>
          </div>
        </div>`
      : null;
    let disconnected =
      this.client?.status.current === "closed"
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
          ${this.client
            ? html`<client-status status=${this.client.status.current}></client-status>`
            : html`<host-toggle
                status=${this.server?.signaler.status.current ?? "local"}
                @enable=${this.#host}
                @disable=${this.#unhost}
              ></host-toggle>`}
          <span>
            Grid:
            <input id="width" type="number" min="1" @input=${this.#updateDim} .value=${this.game.board.get("width") + ""} /> x
            <input id="height" type="number" min="1" @input=${this.#updateDim} .value=${this.game.board.get("height") + ""} />
          </span>
          ${this.selection.size === 1
            ? html`
                <div>
                  <button
                    @click=${() => this.game.apply({ type: "token-reorder", id: first(this.selection)!, idx: "down" })}
                    ?disabled=${true /*this.game.tabletop.tokens.index(first(this.selection)!) === 0*/}
                  >
                    Move Down
                  </button>
                  <button
                    @click=${() => this.game.apply({ type: "token-reorder", id: first(this.selection)!, idx: "up" })}
                    ?disabled=${true /*this.game.tabletop.tokens.index(first(this.selection)!) === this.game.tabletop.tokens.size - 1*/}
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
      <html-canvas
        bg=${ifDefined(this.game.board.get("bg") ?? undefined)}
        .selection=${this.selection}
        width=${this.game.board.get("width")}
        height=${this.game.board.get("height")}
        .board=${this.game.board}
        .callouts=${this.game.callouts}
        @token-drop=${({ detail }: TokenDropEvent) => this.game.add_token(detail.img, { loc: detail.loc, r: 0, dim: detail.dim })}
        @bg-drop=${({ detail }: BgDropEvent) => this.game.set_bg(detail)}
        @token-select=${({ detail }: TokenSelectEvent) => {
          this.selection = new Set(detail);
        }}
        @game-event=${({ detail }: CustomEvent<GameEvent>) => this.game.apply(detail)}
      ></html-canvas>
      ${overlay}
    `;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("client")) {
      document.title = `BattleGrid${this.client && this.client.status.current === "open" ? (this.server ? "- Hosting" : "- Connected") : ""}`;
    }
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      display: grid;
      grid:
        "toolbar" 30px
        "viewport" minmax(0, 1fr)
        / minmax(0, 1fr);
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

    html-canvas {
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
    this.game.set_dim(max_p([1, 1], [parseInt(this.width?.value) ?? 0, parseInt(this.height?.value) ?? 0]));
  };

  async connectedCallback() {
    super.connectedCallback();
    console.log(this.game.board);
    this.game.doc.on("update", () => {
      console.log("UPDATEING");
      for (const id of this.selection) {
        this.game.board.get("tokens").has(id) || this.selection.delete(id);
      }
      this.requestUpdate();
      console.log("CANVAS", this.canvas);
      this.canvas?.requestUpdate();
    });
    this.game.doc.on("afterTransaction", () => {
      this.canvas?.requestUpdate();
    });
    // setTimeout( async () => {
    console.log("debug now please");

    let params = new URLSearchParams(window.location.search);
    let game_id = params.get("game") as PeerId | undefined;
    if (!game_id) return await this.#new_local();

    try {
      console.log("new client");
      this.client = new Client(game_id, this.game);
      this.client.status.on("status", () => this.requestUpdate());
      console.log("waiting for connection");
      this.client_pending = true;
      await timeout(this.client.status.connected(), 5000);
      console.log("connected");
    } catch {
      console.log("giving up");
      await this.#new_local();
    } finally {
      this.client_pending = false;
    }

    // }, 2000);
  }

  #new_local = async () => {
    console.log("new local...");
    this.game.initialize_board();
    await this.client?.shutdown();
    this.client && this.client.status.off("status", this.requestUpdate);
    this.client = undefined;
    window.history.pushState(null, "", window.location.href.split("?")[0]);
  };

  #update = () => this.requestUpdate();

  #host = async () => {
    try {
      this.client?.shutdown();
      this.client = undefined;

      this.host_pending = true;
      this.server = new Server(this.game);
      this.server.signaler.status.on("status", this.#update);
      console.log("WAITING");
      await timeout(this.server.signaler.status.connected(), 5000);

      window.history.pushState({}, "", "?game=" + this.server.signaler.peer_id);
      navigator.clipboard.writeText(window.location.toString());
    } catch (e) {
      console.error(e);
      await this.#unhost;
    } finally {
      this.host_pending = false;
    }
  };

  #unhost = async () => {
    let s = this.server;
    this.server = undefined;

    await s?.shutdown();

    window.history.replaceState({}, "", window.location.pathname);
  };
}
