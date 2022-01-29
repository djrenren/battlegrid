import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { Token } from "./token";

const GRID_SIZE = 48;

@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 20;

  @property({ type: Number })
  height = 10;

  tokens: TokenData[] = [
    {
      x: 2,
      y: 4,
      height: 1,
      width: 1,
      res: "test",
      id: "1",
    },
  ];

  constructor() {
    super();
    this.addEventListener("click", this.#unfocus);
  }

  render() {
    return html`
      <style>
        :host {
          width: ${em(this.width)};
          height: ${em(this.height)};
        }
      </style>
      ${repeat(
        this.tokens,
        (t) => t.id,
        (t, index) => html`
          <bg-token
            class=${"token" + (this.selection === t.id ? " selected" : "")}
            @click=${this.#focus}
            id=${t.id}
            style=${styleMap({
                // transform: `translate(${em(t.x)}, ${em(t.y)})`,
              position: "absolute",
              top: em(t.x),
              left: em(t.y),
              width: em(t.width),
              height: em(t.height),
            })}
            res=${t.res}
          />
        `
      )}

      <div
        style=${styleMap({
          position: "absolute",
          "--thickness": "calc(1px / var(--scale))",
        //   transform: `translate(${em(0.25)}, ${em(0.25)})`,
          transition: "transform 1ms",
          left: em(0.25),
          top: em(0.25)
          width: em(0.5),
          height: em(0.5),
          background: "transparent",
          overflow: "visible",
          zIndex: "10000",
            // border: "var(--thickness) solid black",
        })}
      >
        <div
          style=${styleMap({
            position: "absolute",
            left: "calc(-1 * var(--thickness))",
            right: "calc(-1 * var(--thickness))",
            top: "calc(-1 * var(--thickness))",
            bottom: "calc(-1 * var(--thickness))",
            boxShadow: "0 0 var(--thickness) blue"
          })}
        ></div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style="position: absolute; vector-effect: non-scaling-stroke; pointer-events: none"
      >
        <defs>
          <pattern
            id="pat"
            x="-0.5"
            y="-0.5"
            width=${GRID_SIZE}
            height="100%"
            patternUnits="userSpaceOnUse"
          >
            <rect
              class="gridline"
              x="0"
              y="0"
              width="1"
              height="100%"
              fill="grey"
              opacity="1"
            ></rect>
          </pattern>
          <pattern
            id="pat2"
            x="-0.5"
            y="-0.5"
            width="100%"
            height=${GRID_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <rect
              class="gridline"
              x="0"
              y="0"
              width="100%"
              height="1"
              fill="grey"
              opacity="1"
            ></rect>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pat)"></rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pat2)"></rect>
      </svg>
    `;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    const root = super.createRenderRoot();
    return root;
  }

  @state()
  selection?: string;

  #focus = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log("focus");
    this.selection = (ev.target! as Token).id;
  };
  #unfocus = () => {
    this.selection = undefined;
  };

  static styles = css`
    :host {
      font-size: 0.25in;
      position: relative;
      background: white;
      display: inline-block;
      box-sizing: content-box !important;
    }

    :host, svg {
      border-radius: 3px;
    }

    .token {
      position: absolute;
    }

    .selected {
      border: 3px solid blue;
    }
  `;
}

const em = (n: number) => n * GRID_SIZE + "px";
type TokenData = {
  x: number;
  y: number;
  width: number;
  height: number;
  res: string;
  id: string;
};
