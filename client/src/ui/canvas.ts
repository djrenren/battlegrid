import { css, html, LitElement, svg } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { add_c, add_p, max_p, min_p, mul_c, Point, sub_p } from "../util/math";
import { is_primary_down, screen_to_svg, stop_ev } from "../util/events";

const GRID_SIZE = 24; // scale-dependent px
const LINE_WIDTH = 0.5; // scale-dependent px
const HANDLE_SIZE = 5; // scale-independent px
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 20;

  @property({ type: Number })
  height = 10;

  @query("root", true)
  root?: SVGElement;

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
    let left: number, right: number, top: number, bot: number;
    let new_dim: Point, new_origin: Point;
    if (selected) {
      new_origin = add_p([selected.x, selected.y], this._selection_transform.move);
      new_dim = add_p([selected.width, selected.height] as Point, this._selection_transform.resize);

      left = new_origin[0];
      right = new_origin[0] + new_dim[0];
      top = new_origin[1];
      bot = new_origin[1] + new_dim[1];
    }
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
        }
      </style>
      <bg-viewport style="width: 100%; height: 100%">
        <svg id="root" width=${width} height=${height} @click=${this.#unfocus} @dragstart=${stop_ev}>
          <defs>
            <clipPath id="canvasClip">
                <rect x="0" y="0" width=${width} height=${height} rx="5" />
            </clipPath>
            <pattern id="pat" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" x="0" y="0" width=${LINE_WIDTH} height="100%" fill="grey" opacity="1"></rect>
            </pattern>
            <pattern id="pat2" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="100%" height=${GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect class="gridline" x="0" y="0" width="100%" height=${LINE_WIDTH} fill="grey" opacity="1"></rect>
            </pattern>
          </defs>
          <g style="clip-path: url(#canvasClip)">
          <rect class="shadow" x="0" y="0" width=${width} height=${height} fill="white"></rect>

          <rect x="0" y="0" width=${width} height=${height} fill="url(#pat)" pointer-events="none"></rect>
          <rect x="0" y="0" width=${width} height=${height} fill="url(#pat2)"pointer-events="none"></rect>

          ${repeat(
            this.tokens.values(),
            (t) => t.id,
            (t, index) => svg`
                <image
                    id=${t.id}
                    x=${(this.selection === t.id ? new_origin[0] : t.x) + LINE_WIDTH / 2}
                    y=${(this.selection === t.id ? new_origin[1] : t.y) + LINE_WIDTH / 2}
                    @click=${this.#focus}
                    width=${(this.selection === t.id ? new_dim[0] : t.width) - LINE_WIDTH}
                    height=${(this.selection === t.id ? new_dim[1] : t.height) - LINE_WIDTH}
                    href=${"https://www.researchgate.net/profile/Donald-Bailey-5/publication/224624453/figure/fig1/AS:393833717223438@1470908683517/Original-colour-bar-static-test-image-used-in-analogue-television-II-METHODOLOGY.png"}
                    preserveAspectRatio="none"
                />
                `
          )}
          </g>
          <svg @pointerdown=${this.#selection_drag_start} @pointermove=${this.#selection_drag} @pointerup=${this.#selection_drag_end}>
            ${selected
              ? svg`
            <rect
                id="mover"
                class="selection"
                x=${left!}
                y=${top!}
                width=${new_dim![0]}
                height=${new_dim![1]}
                fill="transparent"
                @click=${stop_ev}
            ></rect>
            <line id="r-n" x1=${left!} y1=${top!} x2=${right!} y2=${top!}></line>
            <line id="r-w" x1=${left!} y1=${top!} x2=${left!} y2=${bot!}></line>
            <line id="r-e" x1=${right!} y1=${top!} x2=${right!} y2=${bot!}></line>
            <line id="r-s" x1=${left!} y1=${bot!} x2=${right!} y2=${bot!}></line>
            <rect id="r-nw" class="handle" x=${left! - HANDLE_SIZE / 2} y=${top! - HANDLE_SIZE / 2} width=${HANDLE_SIZE + "px"} height=${
                  HANDLE_SIZE + "px"
                }></rect>
            <rect id="r-ne" class="handle" x=${right! - HANDLE_SIZE / 2} y=${
                  top! - HANDLE_SIZE / 2
                } width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
            <rect id="r-sw" class="handle" x=${left! - HANDLE_SIZE / 2} y=${bot! - HANDLE_SIZE / 2} width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
            <rect id="r-se" class="handle" x=${right! - HANDLE_SIZE / 2} y=${
                  bot! - HANDLE_SIZE / 2
                } width=${HANDLE_SIZE} height=${HANDLE_SIZE}></rect>
          `
              : null}
          </svg>
        </svg>
      </bg-viewport>
    `;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    const root = super.createRenderRoot();
    return root;
  }

  /** Selection handling */
  @state()
  selection?: string;

  #focus = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.selection = (ev.target! as SVGElement).id;
  };

  #unfocus = () => {
    this.selection = undefined;
  };

  #drag_origin: Point = [0, 0];
  #selection_drag_start = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    this.#drag_origin = screen_to_svg(ev);
  };

  @state()
  _selection_transform = { move: [0, 0] as Point, resize: [0, 0] as Point };
  #selection_drag = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    stop_ev(ev);
    let offset = sub_p(max_p([0, 0], min_p([this.width * GRID_SIZE, this.height * GRID_SIZE], screen_to_svg(ev))), this.#drag_origin);

    offset = [offset[0] - (offset[0] % GRID_SIZE), offset[1] - (offset[1] % GRID_SIZE)];
    const id = (ev.target as SVGGraphicsElement).id!;
    let move = [0, 0] as Point;
    let resize = [0, 0] as Point;

    if (new Set(["r-n", "r-ne", "r-nw"]).has(id)) {
      resize[1] = -offset[1];
      move[1] = offset[1];
    }

    if (new Set(["r-w", "r-nw", "r-sw"]).has(id)) {
      resize[0] = -offset[0];
      move[0] = offset[0];
    }

    if (new Set(["r-s", "r-se", "r-sw"]).has(id)) {
      resize[1] = offset[1];
    }

    if (new Set(["r-e", "r-se", "r-ne"]).has(id)) {
      resize[0] = offset[0];
    }

    if (id === "mover") {
      move = offset;
    } else {
        const selection = this.tokens.get(this.selection!)!;
        const dim = [selection.width, selection.height] as Point;
        // Don't let top-left drags cause movement pas the dimensions
        move = min_p(add_c(dim, -GRID_SIZE), move);
        // Constrain the transform from making anything smaller than a grid
        resize = max_p(add_c(mul_c(dim, -1), GRID_SIZE), resize);
    }

    this._selection_transform = { move, resize };
  };

  #selection_drag_end = (ev: PointerEvent) => {
    stop_ev(ev);
    (ev.target as SVGElement).releasePointerCapture(ev.pointerId);
    const el = this.tokens.get(this.selection!);
    if (el) {
      el.x += this._selection_transform.move[0];
      el.y += this._selection_transform.move[1];
      el.width += this._selection_transform.resize[0];
      el.height += this._selection_transform.resize[1];
    }
    this._selection_transform = { move: [0, 0], resize: [0, 0] };
  };

  static styles = css`
    :host {
      font-size: 0.25in;
      position: relative;
      display: inline-block;
      box-sizing: content-box !important;
      --selection-color: cornflowerblue;
    }
    svg * {
      transition: all 200ms ease-out;
    }

    svg {
        overflow: visible;
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
