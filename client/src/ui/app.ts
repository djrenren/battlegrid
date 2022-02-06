import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { Point } from "../util/math";
import { DurableSignaler } from "../net/signaling";
import { Server } from "../net/server";
import { GameEvent } from "../game/game-events";
import { Client, GameClient } from "../net/client";
import { Canvas } from "./canvas";

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

  render() {
    return html`
      <section id="toolbar">
        <div>
          Grid:
          <input id="width" type="number" @input=${this.#updateDim} value=${this.dim[0]} /> x
          <input id="height" type="number" @input=${this.#updateDim} value=${this.dim[1]} />
        </div>
        ${this.client ? html`<div>hosting</div>` : html` <button @click=${this.#host}>Host</button> `}
      </section>
      <bg-canvas .width=${this.dim[0]} .height=${this.dim[1]} @game-event=${this.#on_event}></bg-canvas>
    `;
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
    }

    bg-canvas {
      grid-area: viewport;
      z-index: 1;
    }

    input[type="number"] {
      width: 3em;
    }

    #toolbar {
      grid-area: toolbar;
      background: #eee;
      box-shadow: 0 0 4px gray;
      z-index: 2;
      display: flex;
      align-items: center;
    }
  `;

  #updateDim = () => {
    ///@ts-ignore
    this.dim = [this.width?.value ?? 0, this.height?.value ?? 0];
    this.client?.send_event({
      type: "grid-resized",
      dim: this.dim,
    });
  };

  @state()
  client?: GameClient;

  async connectedCallback() {
    super.connectedCallback();
    let target = window.location.hash;
    if (target.length > 0 && (target = target.substring(1))) {
      this.client = await Client.establish(target);
      this.client.on_event = this.#incoming_event;
    }
  }

  #host = async () => {
    try {
      let srv = await Server.establish();
      this.client = srv;
      srv.on_event = this.#incoming_event;
      srv.get_state = this.canvas?.get_state;
      srv.get_images = () => this.canvas!.resources.local;

      window.location.hash = srv.signaler.ident;
      navigator.clipboard.writeText(window.location.toString());
    } catch (e) {
      console.error(e);
    }
  };

  #incoming_event = (ev: GameEvent) => {
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
