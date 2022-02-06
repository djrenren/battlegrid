import { css, html, LitElement, svg } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { add_c, add_p, eq_p, max_p, min_p, mul_c, Point, sub_p } from "../util/math";
import { is_primary_down, stop_ev } from "../util/events";
import { Viewport } from "./viewport";
import { getImage } from "../util/files";
import { GameEvent, game_event, StateSync, TokenData, uuidv4 } from "../game/game-events";

const GRID_SIZE = 24; // scale-dependent px
const LINE_WIDTH = 0.5; // scale-dependent px
const HANDLE_SIZE = 5; // scale-independent px
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 40;

  @property({ type: Number })
  height = 10;

  @query("root", true)
  root?: SVGElement;

  @query("bg-viewport", true)
  viewport?: Viewport;

  tokens: Map<string, TokenData> = new Map([
    [
      "1",
      {
        loc: [48, 48],
        dim: [48, 48],
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

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.#keydown);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#keydown);
  }
  render() {
    let [width, height] = this.#dim;
    let selected = this.tokens.get(this.selection!);
    let left: number, right: number, top: number, bot: number;
    let new_dim: Point, new_origin: Point;
    if (selected) {
      new_origin = add_p(selected.loc, this._selection_transform.move);
      new_dim = add_p(selected.dim, this._selection_transform.resize);

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
      <bg-viewport style="width: 100%; height: 100%" @click=${this.#unfocus}>
        <svg
          id="root"
          width=${width}
          height=${height}
          @dragstart=${stop_ev}
          @dragleave=${this.#drag_leave}
          @dragover=${this.#drag_over}
          @drop=${this.#drop}
        >
          <defs>
            <clipPath id="canvasClip">
              <rect x="0" y="0" width=${width} height=${height} rx="5" />
            </clipPath>
            <pattern id="pat" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height=${GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect class="gridline" x="0" y="0" width=${LINE_WIDTH} height="100%" fill="grey" opacity="1"></rect>
              <rect class="gridline" x="0" y="0" width="100%" height=${LINE_WIDTH} fill="grey" opacity="1"></rect>
            </pattern>
            <image id="loading" href="/assets/loading.svg" />
          </defs>
          <g style="clip-path: url(#canvasClip)">
            <rect class="shadow" x="0" y="0" width=${width} height=${height} fill="white"></rect>

            <rect x="0" y="0" width=${width} height=${height} fill="url(#pat)" pointer-events="none"></rect>

            ${repeat(
              this.tokens.values(),
              (t) => t.id,
              (t, index) => {
                let url = this.images.get(t.res);
                return svg`
                <image
                    id=${t.id}
                    x=${(this.selection === t.id ? new_origin[0] : t.loc[0]) + LINE_WIDTH / 2}
                    y=${(this.selection === t.id ? new_origin[1] : t.loc[1]) + LINE_WIDTH / 2}
                    @click=${this.#focus}
                    width=${(this.selection === t.id ? new_dim[0] : t.dim[0]) - LINE_WIDTH}
                    height=${(this.selection === t.id ? new_dim[1] : t.dim[1]) - LINE_WIDTH}
                    href=${url || "assets/loading.svg"}
                    preserveAspectRatio=${url ? "none" :  ""}
                />
                `;
              }
            )}
          </g>
          ${this._drop_hint
            ? svg`
            <rect
                class="drop_hint"
                x=${this._drop_hint[0]}
                y=${this._drop_hint[1]}
                width=${GRID_SIZE}
                height=${GRID_SIZE}
                ></rect>
          
          `
            : null}
          <svg
            @pointerdown=${this.#selection_drag_start}
            @pointermove=${this.#selection_drag}
            @pointerup=${this.#selection_drag_end}
            @click=${stop_ev}
          >
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

  @state()
  _drop_hint?: Point;
  #drag_over = (ev: DragEvent) => {
    stop_ev(ev);
    this._drop_hint = this.#screen_to_svg(ev).map(occupied_cell) as Point;
  };

  #drag_leave = (ev: DragEvent) => {
    this._drop_hint = undefined;
  };

  #drop = async (ev: DragEvent) => {
    stop_ev(ev);
    console.log(ev);
    try {
      const res = await getImage(ev);

      const id = uuidv4();
      const res_id = uuidv4();
      this.images.set(res_id, res);
      this.tokens.set(id, {
        loc: this._drop_hint!,
        dim: [GRID_SIZE, GRID_SIZE],
        id,
        res: res_id,
      });
      this.dispatchEvent(
        game_event({
          type: "token-added",
          loc: this._drop_hint!,
          id,
          res: res_id,
        })
      );
      if (res.substring(0, 5) === "blob:") {
        this.dispatchEvent(
          game_event({
            type: "file",
            name: res_id,
            contents: await (await fetch(res)).blob(),
          })
        );
      }
    } catch (e) {}
    this._drop_hint = undefined;
  };

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

  #drag_offset: Point = [0, 0];
  #selection_drag_start = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    stop_ev(ev);
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    this.#drag_offset = this.#screen_to_svg(ev) as Point;
  };

  @state()
  _selection_transform = { move: [0, 0] as Point, resize: [0, 0] as Point };
  #selection_drag = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    stop_ev(ev);
    const grid_loc = max_p([0, 0], min_p([this.width * GRID_SIZE, this.height * GRID_SIZE], this.#screen_to_svg(ev)));
    const selection = this.tokens.get(this.selection!)!;
    const dim = selection.dim;
    const loc = selection.loc;
    const id = (ev.target as SVGGraphicsElement).id!;
    let move = [0, 0] as Point;
    let resize = [0, 0] as Point;

    if (new Set(["r-n", "r-ne", "r-nw"]).has(id)) {
      resize[1] = loc[1] - grid_loc[1];
      move[1] = nearest_corner(grid_loc[1]) - loc[1];
    }

    if (new Set(["r-w", "r-nw", "r-sw"]).has(id)) {
      resize[0] = loc[0] - grid_loc[0];
      move[0] = nearest_corner(grid_loc[0]) - loc[0];
    }

    if (new Set(["r-s", "r-se", "r-sw"]).has(id)) {
      resize[1] = nearest_corner(grid_loc[1]) - dim[1] - loc[1];
    }

    if (new Set(["r-e", "r-se", "r-ne"]).has(id)) {
      resize[0] = nearest_corner(grid_loc[0]) - dim[0] - loc[0];
    }

    if (id === "mover") {
      move = sub_p(grid_loc, this.#drag_offset).map(nearest_corner) as Point;
    } else {
      // Don't let top-left drags cause movement pas the dimensions
      move = min_p(add_c(dim, -GRID_SIZE), move);
      // Constrain the transform from making anything smaller than a grid
      resize = max_p(add_c(mul_c(dim, -1), GRID_SIZE), resize.map(nearest_corner) as Point);
    }

    if (!eq_p(move, this._selection_transform.move) || !eq_p(resize, this._selection_transform.resize)) {
      this._selection_transform = { move, resize };
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          id: selection.id,
          loc: add_p(selection.loc, move),
          dim: add_p(selection.dim, resize),
        })
      );
    }
  };

  async apply(ev: GameEvent) {
    console.log("APPLYING TO CANVAS", ev);
    switch (ev.type) {
      case "token-manipulated":
        let ex_token = this.tokens.get(ev.id);
        if (!ex_token) {
          console.error("Update received for nonexistant token", ev.id);
          return;
        }
        Object.assign(ex_token, { dim: ev.dim, loc: ev.loc });
        break;

      case "token-added":
        this.tokens.set(ev.id, { id: ev.id, dim: [GRID_SIZE, GRID_SIZE], loc: ev.loc, res: ev.res });
        break;
      case "token-removed":
        if (!this.tokens.delete(ev.id)) {
          console.error("Tried to remove nonexistant token", ev.id);
          return;
        }
        break;
      case "state-sync":
        this.tokens = new Map(ev.tokens.map((t) => [t.id, t]));
        break;
      case "file":
        this.images.set(ev.name, URL.createObjectURL(ev.contents));
    }

    this.requestUpdate();
  }

  #selection_drag_end = (ev: PointerEvent) => {
    stop_ev(ev);
    const el = this.tokens.get(this.selection!);
    if (el) {
      el.loc = add_p(el.loc, this._selection_transform.move);
      el.dim = add_p(el.dim, this._selection_transform.resize);
    }
    this._selection_transform = { move: [0, 0], resize: [0, 0] };
  };

  // Normally we'd use SVG machinery but it's broken in one browser...
  // ... I'll let you guess who...
  // ... it's safari
  #screen_to_svg = (ev: { clientX: number; clientY: number }): Point => {
    return this.viewport!.coordToLocal([ev.clientX, ev.clientY]);
  };

  #keydown = (ev: KeyboardEvent) => {
    if (!this.selection) return;

    // Backspace
    if (ev.keyCode === 8) {
      this.tokens.delete(this.selection);
      this.dispatchEvent(
        game_event({
          type: "token-removed",
          id: this.selection!,
        })
      );

      this.selection = undefined;
      stop_ev(ev);
      return;
    }

    let s = this.tokens.get(this.selection)!;
    const movements: { [key: string]: Point } = {
      ArrowUp: [0, -GRID_SIZE],
      ArrowDown: [0, GRID_SIZE],
      ArrowLeft: [-GRID_SIZE, 0],
      ArrowRight: [GRID_SIZE, 0],
    };

    let move: Point | undefined = movements[ev.key];
    if (move) {
      s.loc = min_p(sub_p(this.#dim, s.dim), max_p([0, 0], add_p(s.loc, move)));
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          id: s.id,
          loc: s.loc,
          dim: s.dim,
        })
      );
      this.requestUpdate();
      stop_ev(ev);
    }
  };

  get_state = (): StateSync => {
    return {
      type: "state-sync",
      tokens: [...this.tokens.values()],
      grid_dim: [this.width, this.height],
    };
  };

  images: Map<string, string> = new Map();
  async #register_image(name: string, contents: Blob) {
    let url = await URL.createObjectURL(contents);
    this.images.set(name, url);
  }

  static styles = css`
    :host {
      font-size: 0.25in;
      position: relative;
      display: inline-block;
      box-sizing: content-box !important;
      --selection-color: cornflowerblue;
      --spinner-size: 0.5;
    }

    svg {
      overflow: visible;
    }

    .drop_hint {
      transition: none;
      pointer-events: none;
      fill: gray;
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
      /* opacity: 0.75; */
      --thickness: 10px;
    }

    bg-viewport::part(bar):hover {
      opacity: 1;
    }
  `;
}

const nearest_corner = (n: number) => Math.round(n / GRID_SIZE) * GRID_SIZE;
const occupied_cell = (n: number) => n - (n % GRID_SIZE);
