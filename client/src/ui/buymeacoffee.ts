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
              <iframe
                class=${this._loaded ? "loaded" : ""}
                allow="payment"
                src="https://ko-fi.com/djrenren/?hidefeed=true&widget=true&embed=true&preview=true"
                title="djrenren"
                @load=${this.#iframe_load}
              ></iframe>
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
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    iframe {
      border: none;
      display: block;
      opacity: 0;
      width: 100%;
      height: 100%;
      transition: opacity 0.5s linear;
    }

    #container {
      border-radius: 5px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
      position: absolute;
      width: 350px;
      height: 525px;
      bottom: -535px;
      right: 0;
      animation-name: fade;
      animation-duration: 0.5s;
      animation-direction: backwards;
      background: url("assets/loading.svg") center/100px no-repeat, #ededf0;
      overflow: hidden;
    }

    iframe.loaded {
      opacity: 1;
    }

    @keyframes fade {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `;
}
