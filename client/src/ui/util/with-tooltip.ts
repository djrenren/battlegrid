import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("with-tooltip")
class WithTooltip extends LitElement {
  @property()
  text = "";

  @state()
  mousex: number = 0;

  @state()
  mousey: number = 0;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("mousemove", this.#mousemove);
  }

  disconnectedCallback(): void {
    this.removeEventListener("mousemove", this.#mousemove);
  }

  #mousemove = (ev: MouseEvent) => {
    this.mousex = ev.pageX;
    this.mousey = ev.pageY;
  };

  render() {
    console.log("Rendering");
    return html`
      <slot></slot>
      <div
        id="message"
        style=${styleMap({
          left: `${this.mousex + 8}px`,
          top: `${this.mousey + 10}px`,
        })}
      >
        ${this.text}
      </div>
    `;
  }

  static styles?: CSSResultGroup | undefined = css`
    :host {
      display: inline-block;
      position: relative;
      width: fit-content;
      height: fit-content;
    }

    div {
      font-size: 0.8em;
      display: none;
      opacity: 0;
      position: fixed;
      background: black;
      color: white;
      border-radius: 3px;
      padding: 0.25em 0.5em;
      white-space: nowrap;
      width: max-content;
    }

    @keyframes appear {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    :host(:hover) div {
      display: block;
      animation: appear 250ms linear forwards 750ms;
    }
  `;
}
