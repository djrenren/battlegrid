import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { stop_ev } from "../util/events";

@customElement("buy-me-a-coffee")
export class BuyMeACoffee extends LitElement {
  @state()
  _state = false;

  @state()
  _loaded = false;

  render() {
    return html`
      <button @click=${this._buy}>Buy Me A Coffee</button>
      ${this._state
        ? html`
            <div id="container">
                <iframe class=${this._loaded ? 'loaded' :  ''} allow="payment" src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true" title="djrenren" @load=${this.#iframe_load}></iframe>
            </div>
          `
        : null}
    `;
  }

  _buy = (ev: MouseEvent) => {
    console.log("CLICK");
    stop_ev(ev);
    this._state = true;
    document.addEventListener("click", this.#close, { capture: true });
  };

  #close = (ev: MouseEvent) => {
    stop_ev(ev);
    this._state = false;
    document.removeEventListener("click", this.#close, { capture: true });
  };

  #iframe_load = (ev: Event) => {
    this._loaded = true;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    iframe {
      position: absolute;
      border: none;
      display: block;
      width: 350px;
      height: 525px;
      bottom: -535px;
      opacity: 0;
      left: 0;
      border-radius: 5px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
      background: #ededf0;
      transition: opacity 0.5s linear;
    }

    iframe.loaded {
        opacity: 1;
    }
  `;
}
