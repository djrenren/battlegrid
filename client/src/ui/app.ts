import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { Point } from "../util/math";
import {DurableSignaler} from "../net/signaling";

@customElement("bg-app")
class App extends LitElement {
  @state()
  dim: Point = [40, 30];

  @query("#width", true)
  width?: HTMLInputElement;

  @query("#height", true)
  height?: HTMLInputElement;


  render() {
    return html`
      <section id="toolbar">
        <div>
          Grid:
          <input id="width" type="number" @input=${this.updateDim} value=${this.dim[0]} /> x
          <input id="height" type="number" @input=${this.updateDim} value=${this.dim[1]} />
        </div>
        ${this._signaler ? 
            html`<div>hosting</div>`:
            html`
                <button @click=${this.#host}>Host</button>
            `

        }
      </section>
      <bg-canvas .width=${this.dim[0]} .height=${this.dim[1]}></bg-canvas>
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

  updateDim = () => {
    ///@ts-ignore
    this.dim = [this.width?.value ?? 0, this.height?.value ?? 0];
  };

  @state()
  _signaler?: DurableSignaler;

  #host = async () => {
    try {
        this._signaler = await DurableSignaler.establish(new URL("ws://192.168.1.77:8080"));
        window.location.hash = this._signaler.ident;
        navigator.clipboard.writeText(window.location.toString());
    } catch(e) {
        console.error(e);
    }
  }
}
