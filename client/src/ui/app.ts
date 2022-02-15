import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { Point } from "../util/math";
import { Server } from "../net/server";
import { GameEvent } from "../game/game-events";
import { Client, GameClient } from "../net/client";
import { Canvas } from "./canvas";
import "./buymeacoffee";

@customElement("bg-app")
class App extends LitElement {
  @state()
  dim: Point = [40, 30];

  @query("#width", true)
  width?: HTMLInputElement;

  @query("#height", true)
  height?: HTMLInputElement;

  @query("bg-canvas", true)
  canvas?: Canvas;

  @state()
  client?: GameClient;

  @state()
  host_pending = false;

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
          <input id="width" type="number" @input=${this.#updateDim} value=${this.dim[0]} /> x
          <input id="height" type="number" @input=${this.#updateDim} value=${this.dim[1]} />
        </span>
        ${this.host_pending
          ? html`<img src="assets/loading.svg" />`
          : !this.client
          ? html`<button @click=${this.#host}>Host</button>`
          : html`<div>${this.client.server ? `hosting` : this.client.status}</div>`}
        </div>
        <div class="group">
          <buy-me-a-coffee class="right"></buy-me-a-coffee>
        </div>
      </section>
      <bg-canvas .width=${this.dim[0]} .height=${this.dim[1]} @game-event=${this.#on_event}></bg-canvas>
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
    `
  ;

  #updateDim = () => {
    ///@ts-ignore
    this.dim = [this.width?.value ?? 0, this.height?.value ?? 0];
    this.client?.send_event({
      type: "grid-resized",
      dim: this.dim,
    });
  };

  async connectedCallback() {
    super.connectedCallback();

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
      srv.on_event = this.#incoming_event;
      srv.get_state = this.canvas?.get_state;
      srv.get_images = () => this.canvas!.resources.all();

      window.history.pushState({}, "", "?game=" + srv.signaler.ident);
      navigator.clipboard.writeText(window.location.toString());
    } catch (e) {
      console.error(e);
    }
  };

  #incoming_event = (ev: GameEvent) => {
    console.log("APPLOY!", this.canvas);
    if (ev.type === "state-sync") {
      this.dim = ev.grid_dim;
    }

    if (ev.type === "grid-resized") {
      this.dim = ev.dim;
    } else {
      this.canvas?.apply(ev);
    }
  };

  #on_event = (ev: CustomEvent<GameEvent>) => {
    this.client?.send_event(ev.detail);
  };

}