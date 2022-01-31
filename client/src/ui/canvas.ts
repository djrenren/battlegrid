import { css, html, LitElement, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { mul_c } from "../util/math";

const GRID_SIZE = 24;
const LINE_WIDTH = 0.5;
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 20;

  @property({ type: Number })
  height = 10;

  tokens: TokenData[] = [
    {
      x: 48,
      y: 48,
      height: 48,
      width: 48,
      res: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      id: "1",
    },
  ];

  constructor() {
    super();
    this.addEventListener("click", this.#unfocus);
  }

  get #dim() {
    return mul_c([this.width, this.height], GRID_SIZE);
  }

  render() {
    let width = this.width * GRID_SIZE;
    let height = this.height * GRID_SIZE;
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
        }
      </style>
      <bg-viewport style="width: 100%; height: 100%">
        <svg width=${width} height=${height}>
          <defs>
            <pattern id="pat" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" x="0" y="0" width=${LINE_WIDTH} height="100%" fill="grey" opacity="1"></rect>
            </pattern>
            <pattern id="pat2" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="100%" height=${GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect class="gridline" x="0" y="0" width="100%" height=${LINE_WIDTH} fill="grey" opacity="1"></rect>
            </pattern>
          </defs>
          <rect class="shadow" x="0" y="0" width=${width} height=${height} fill="white" rx="5"></rect>

          <rect x="0" y="0" width=${width} height=${height} fill="url(#pat)" rx="5" pointer-events="none"></rect>
          <rect x="0" y="0" width=${width} height=${height} fill="url(#pat2)" rx="5" pointer-events="none"></rect>

          ${repeat(
            this.tokens,
            (t) => t.id,
            (t, index) => svg`
                <image
                    id=${t.id}
                    x=${t.x + LINE_WIDTH / 2}
                    y=${t.y + LINE_WIDTH / 2}
                    @click=${this.#focus}
                    width=${t.width - LINE_WIDTH}
                    height=${t.height - LINE_WIDTH}
                    href=${"https://www.researchgate.net/profile/Donald-Bailey-5/publication/224624453/figure/fig1/AS:393833717223438@1470908683517/Original-colour-bar-static-test-image-used-in-analogue-television-II-METHODOLOGY.png"}
                    preserveAspectRatio="none"
                />
                `
          )}
        </svg>
      </bg-viewport>
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
    this.selection = (ev.target! as SVGElement).id;
  };
  #unfocus = () => {
    this.selection = undefined;
  };

  static styles = css`
    :host {
      font-size: 0.25in;
      position: relative;
      display: inline-block;
      box-sizing: content-box !important;
    }

    :host,
    svg {
      border-radius: 3px;
    }

    .token {
      position: absolute;
    }

    .selected {
      border: 3px solid blue;
    }

    bg-viewport::part(background) {
      background-color: #dbdbdb;
      background-image: url("https://www.transparenttextures.com/patterns/45-degree-fabric-dark.png");
      background-size: calc(var(--scale) * 315px);
      /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
    }

    bg-viewport::part(bar) {
      background: rgb(75, 75, 75);
      opacity: 0.75;
      --thickness: 10px;
    }

    bg-viewport::part(bar):hover {
      opacity: 1;
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
