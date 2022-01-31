import { css, html, LitElement, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { mul_c } from "../util/math";
import { stop_ev } from "../util/events";

const GRID_SIZE = 24; // scale-dependent px
const LINE_WIDTH = 0.5; // scale-dependent px
const HANDLE_SIZE = 5; // scale-independent px
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 20;

  @property({ type: Number })
  height = 10;

  tokens: Map<string, TokenData> = new Map([
    [
      "1",
      {
        x: 48,
        y: 48,
        height: 48,
        width: 48,
        res: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        id: "1",
      },
    ],
  ]);

  constructor() {
    super();
  }

  get #dim() {
    return mul_c([this.width, this.height], GRID_SIZE);
  }

  render() {
    let width = this.width * GRID_SIZE;
    let height = this.height * GRID_SIZE;
    let selected = this.tokens.get(this.selection!);
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
        }
      </style>
      <bg-viewport style="width: 100%; height: 100%">
        <svg width=${width} height=${height} @click=${this.#unfocus}>
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
            this.tokens.values(),
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
          ${selected
            ? svg`
            <rect
                class="selection"
                x=${selected.x}
                y=${selected.y}
                width=${selected.width}
                height=${selected.height}
                fill="transparent"
                @click=${stop_ev}
            ></rect>
            <line id="r-n" x1=${selected.x} y1=${selected.y} x2=${selected.x + selected.width} y2=${selected.height}></line>
            <line id="r-w" x1=${selected.x} y1=${selected.y} x2=${selected.x} y2=${selected.y + selected.height}></line>
            <line id="r-e" x1=${selected.x + selected.width} y1=${selected.y} x2=${selected.x + selected.width} y2=${
                selected.y + selected.height
              }></line>
            <line id="r-s" x1=${selected.x} y1=${selected.y + selected.height} x2=${selected.x + selected.width} y2=${
                selected.height + selected.height
              }></line>
            <rect id="r-nw" class="handle" x=${selected.x - HANDLE_SIZE / 2} y=${selected.y - HANDLE_SIZE / 2} width=${HANDLE_SIZE + "px"} height=${
                HANDLE_SIZE + "px"
              }></rect>
            <rect id="r-ne" class="handle" x=${selected.x + selected.width - HANDLE_SIZE / 2} y=${
                selected.y - HANDLE_SIZE / 2
              } width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
            <rect id="r-sw" class="handle" x=${selected.x - HANDLE_SIZE / 2} y=${
                selected.y + selected.height - HANDLE_SIZE / 2
              } width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
            <rect id="r-se" class="handle" x=${selected.x + selected.width - HANDLE_SIZE / 2} y=${
                selected.y + selected.height - HANDLE_SIZE / 2
              } width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
          `
            : null}
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
      --selection-color: cornflowerblue;
    }

    :host,
    svg {
      border-radius: 3px;
    }

    .token {
      position: absolute;
    }

    .selection {
      stroke: var(--selection-color);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      filter: drop-shadow(0px 0px 2px var(--selection-color));
    }

    .selection:active {
      cursor: move;
    }

    .handle {
      vector-effect: non-scaling-size;
      fill: white;
      stroke: var(--selection-color);
    }

    #r-n,
    #r-s,
    #r-e,
    #r-w {
      stroke-width: ${HANDLE_SIZE};
      vector-effect: non-scaling-stroke;
      stroke: transparent;
    }

    #r-ne,
    #r-sw {
      cursor: nesw-resize;
    }
    #r-nw,
    #r-se {
      cursor: nwse-resize;
    }

    #r-n,
    #r-s {
      cursor: row-resize;
    }

    #r-e,
    #r-w {
      cursor: col-resize;
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
