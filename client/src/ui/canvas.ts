import { css, html, LitElement, svg } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { add_c, add_p, clamp_p, div_c, eq_p, max_p, min_p, mul_c, mul_p, Point, sub_p } from "../util/math";
import { is_primary_down, stop_ev } from "../util/events";
import { Viewport } from "./viewport";
import { getImage } from "../util/files";
import { GameEvent, game_event, StateSync, TokenData, uuidv4 } from "../game/game-events";
import { ResourceManager } from "../fs/resource-manager";

const PIXEL_SCALE = 3;
const GRID_SIZE = 24 * PIXEL_SCALE; // scale-dependent px
const LINE_WIDTH = 0.5 * PIXEL_SCALE; // scale-dependent px
const HANDLE_SIZE = 8 * PIXEL_SCALE; // scale-independent px
const CANVAS_RADIUS = 5 * PIXEL_SCALE;
const ROTATE_DISTANCE = 10 * PIXEL_SCALE;
const ROTATE_SIZE = HANDLE_SIZE / 2;
const PADDING = 20 * PIXEL_SCALE;
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 40;

  @property({ type: Number })
  height = 10;

  @state()
  bg?: string;

  @query("root", true)
  root?: SVGElement;

  @query("bg-viewport", true)
  viewport?: Viewport;

  tokens: Map<string, TokenData> = new Map([]);

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
    let new_dim: Point, new_origin: Point, new_r: number;
    if (selected) {
      new_origin = add_p(selected.loc, this._selection_transform.move);
      new_dim = add_p(selected.dim, this._selection_transform.resize);
      new_r = selected.r + this._selection_transform.r;
    }
    return html`
      <bg-viewport
        @pointerup=${this.#unfocus}
        @dragstart=${stop_ev}
        @dragenter=${this.#drag_enter}
        @dragleave=${this.#drag_leave}
        @dragstop=${this.#drag_leave}
        @dragover=${this.#drag_over}
        @drop=${this.#drop}
      >
        <svg id="root" width=${width + PADDING * 2} height=${height + PADDING * 2}>
          <defs>
            <clipPath id="canvasClip">
              <rect width=${width} height=${height} rx=${CANVAS_RADIUS}></rect>
            </clipPath>
            <pattern id="pat" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height=${GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${LINE_WIDTH} height="100%" fill="#d3d3d3"></rect>
              <rect class="gridline" width="100%" height=${LINE_WIDTH} fill="#d3d3d3"></rect>
            </pattern>
          </defs>
          <g transform=${`translate(${PADDING} ${PADDING})`}>
            <rect class="shadow" width=${width} height=${height} fill="white" rx=${CANVAS_RADIUS}></rect>
            <g style="clip-path: url(#canvasClip)">
              ${this.bg ? svg`<image href=${this.resources.get(this.bg)} width=${width} height=${height} preserveAspectRatio="none" />` : null}
              <rect width=${width} height=${height} fill="url(#pat)" opacity="0.75" pointer-events="none"></rect>

              ${repeat(
                this.tokens.values(),
                (t) => t.id,
                (t, index) => {
                  const url = this.resources.get(t.res);
                  const s = this.selection === t.id;
                  let r = s ? new_r : t.r;
                  const width = (s ? new_dim[0] : t.dim[0]) - LINE_WIDTH;
                  const height = (s ? new_dim[1] : t.dim[1]) - LINE_WIDTH;
                  const x = (s ? new_origin[0] : t.loc[0]) + LINE_WIDTH / 2;
                  const y = (s ? new_origin[1] : t.loc[1]) + LINE_WIDTH / 2;
                  return svg`
                <svg viewBox="0 0 1 1" x=${x} y=${y} width=${width} height=${height} fill=${url ? 'transparent' : 'white'} preserveAspectRatio="none">
                  <image
                      id=${t.id}
                      class="token"
                      width="1"
                      height="1"
                      @mousedown=${this.#focus}
                      href=${url || "assets/loading.svg"}
                      style=${`transform: rotate(${r}deg)`}
                      preserveAspectRatio=${url ? "none" : ""}
                  ></image>
                </svg>
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
                shapeRendering="geometricPrecision"
                ></rect>
          `
              : null}
            ${selected
              ? svg`
            <svg
              id="selection"
              @pointerdown=${this.#selection_drag_start}
              @pointermove=${this.#selection_drag}
              @pointerup=${this.#selection_drag_end}
              @click=${stop_ev}
              x=${new_origin![0]}
              y=${new_origin![1]}
              width=${new_dim![0]}
              height=${new_dim![1]}
              shapeRendering="geometricPrecision"
            >
            <rect
                class="selection-box"
                width="100%"
                height="100%"
                @click=${stop_ev}
                fill="transparent"
            ></rect>
            <g style=${`transform-origin: center; transform: rotate(${new_r!}deg) translateY(${Math.sign((new_r!-180) % 180) * (new_dim![0] - new_dim![1])/2}px)` }>
              <line class="ro" x1="50%" x2="50%" y2=${-ROTATE_DISTANCE}></line>
              <circle class="ro handle" cx="50%" cy=${-ROTATE_DISTANCE} r=${ROTATE_SIZE / 2}></circle>
            </g>
            <line class="rn" x2="100%"></line>
            <line class="rw" y2="100%"></line>
            <line class="re" x1="100%" x2="100%" y2="100%"></line>
            <line class="rs" y1="100%" x2="100%" y2="100%"></line>
            <rect class="handle rn rw"></rect>
            <rect class="handle rn re" x="100%"></rect>
            <rect class="handle rs rw" y="100%"></rect>
            <rect class="handle rs re" x="100%" y="100%"></rect>
            </svg>`
              : null}
          </g>
        </svg>
      </bg-viewport>
      <div
        id="bg-drop"
        class=${this.hovering ?? ""}
        @dragenter=${this.#drag_enter}
        @dragover=${this.#bg_drag_over}
        @dragleave=${this.#drag_leave}
        @drop=${this.#bg_drop}
      >
        <div id="bg-drop-label" @drop=${this.#bg_drop}>Set Background</div>
      </div>
    `;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    const root = super.createRenderRoot();
    return root;
  }

  @state()
  _drop_hint?: Point;

  @state()
  hovering?: "canvas" | "bg";

  #drag_depth = 0;
  #drag_enter = (ev: DragEvent) => {
    stop_ev(ev);
    this.#drag_depth++;
  };
  #drag_over = (ev: DragEvent) => {
    stop_ev(ev);
    this._drop_hint = clamp_p([0, 0], mul_c([this.width - 1, this.height - 1], GRID_SIZE), this.#screen_to_svg(ev).map(occupied_cell) as Point);
    this.hovering = "canvas";
  };

  #drag_leave = (ev: DragEvent) => {
    if (--this.#drag_depth <= 0) {
      this._drop_hint = undefined;
      this.hovering = undefined;
    }
  };

  #bg_drag_over = (ev: DragEvent) => {
    stop_ev(ev);
    this._drop_hint = undefined;
    this.hovering = "bg";
  };

  #bg_drop = async (ev: DragEvent) => {
    stop_ev(ev);
    try {
      const img = await getImage(ev);
      const res = "blob" in img ? this.resources.register(img.blob) : img.url;
      this.bg = res;
      this.dispatchEvent(
        game_event({
          type: "bg",
          res,
        })
      );
      if ("blob" in img) {
        this.dispatchEvent(
          game_event({
            type: "file",
            name: res,
            contents: img.blob,
          })
        );
      }
    } catch (e) {}
    this.hovering = undefined;
  };

  #drop = async (ev: DragEvent) => {
    stop_ev(ev);
    console.log(ev);
    try {
      const img = await getImage(ev);
      const res = "blob" in img ? this.resources.register(img.blob) : img.url;
      const id = uuidv4();

      this.tokens.set(id, {
        loc: this._drop_hint!,
        dim: [GRID_SIZE, GRID_SIZE],
        id,
        res,
        r: 0,
      });
      this.dispatchEvent(
        game_event({
          type: "token-added",
          loc: this._drop_hint!,
          id,
          res,
        })
      );
      if ("blob" in img) {
        this.dispatchEvent(
          game_event({
            type: "file",
            name: res,
            contents: img.blob,
          })
        );
      }
    } catch (e) {}
    this._drop_hint = undefined;
    this.hovering = undefined;
  };

  /** Selection handling */
  @state()
  selection?: string;

  #focus = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.selection = (ev.target! as SVGElement).id;
  };

  #unfocus = (ev: PointerEvent) => {
    this.selection = undefined;
  };

  #drag_offset?: Point;
  #selection_drag_start = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    stop_ev(ev);
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    this.#drag_offset = this.#screen_to_svg(ev) as Point;
  };

  @state()
  _selection_transform = { move: [0, 0] as Point, resize: [0, 0] as Point, r: 0 };
  #selection_drag = (ev: PointerEvent) => {
    if (!is_primary_down(ev)) return;
    if (!this.#drag_offset) {
      this.#selection_drag_start(ev);
    }
    stop_ev(ev);
    const grid_loc = clamp_p([0, 0], [this.width * GRID_SIZE, this.height * GRID_SIZE], this.#screen_to_svg(ev));
    const selection = this.tokens.get(this.selection!)!;
    const dim = selection.dim;
    const loc = selection.loc;
    const classes = (ev.target as SVGGraphicsElement).classList;
    let move = [0, 0] as Point;
    let resize = [0, 0] as Point;
    let r = 0;

    if (classes.contains("rn")) {
      resize[1] = loc[1] - grid_loc[1];
      move[1] = nearest_corner(grid_loc[1]) - loc[1];
    }

    if (classes.contains("rw")) {
      resize[0] = loc[0] - grid_loc[0];
      move[0] = nearest_corner(grid_loc[0]) - loc[0];
    }

    if (classes.contains("rs")) {
      resize[1] = nearest_corner(grid_loc[1]) - dim[1] - loc[1];
    }

    if (classes.contains("re")) {
      resize[0] = nearest_corner(grid_loc[0]) - dim[0] - loc[0];
    }

    if (classes.contains("ro")) {
      const center = add_p(loc, div_c(dim, 2));
      const rel = sub_p(grid_loc, center);
      const angle = Math.atan2(rel[0], -rel[1]);
      const deg = (angle * 180) / Math.PI;
      r = Math.round(deg / 90) * 90 - (selection.r % 360);
    }

    if (classes.contains("selection-box")) {
      move = sub_p(grid_loc, this.#drag_offset!).map(nearest_corner) as Point;
    } else {
      // Don't let top-left drags cause movement pas the dimensions
      move = min_p(add_c(dim, -GRID_SIZE), move);
      // Constrain the transform from making anything smaller than a grid
      resize = max_p(add_c(mul_c(dim, -1), GRID_SIZE), resize.map(nearest_corner) as Point);
    }

    if (r !== this._selection_transform.r || !eq_p(move, this._selection_transform.move) || !eq_p(resize, this._selection_transform.resize)) {
      this._selection_transform = { move, resize, r };
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          id: selection.id,
          loc: add_p(selection.loc, move),
          dim: add_p(selection.dim, resize),
          r: selection.r + r,
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
        Object.assign(ex_token, { dim: ev.dim, loc: ev.loc, r: ev.r });
        break;

      case "token-added":
        this.tokens.set(ev.id, { id: ev.id, dim: [GRID_SIZE, GRID_SIZE], loc: ev.loc, res: ev.res, r: 0 });
        break;
      case "token-removed":
        if (!this.tokens.delete(ev.id)) {
          console.error("Tried to remove nonexistant token", ev.id);
          return;
        }
        break;
      case "state-sync":
        console.log("applying tokens", ev.tokens);
        this.tokens = new Map(ev.tokens.map((t) => [t.id, t]));
        this.bg = ev.bg;
        break;
      case "file":
        this.resources.register(ev.contents, ev.name);
        this.requestUpdate();
        break;
      case "bg":
        this.bg = ev.res;
        break;
    }

    this.requestUpdate();
  }

  #selection_drag_end = (ev: PointerEvent) => {
    stop_ev(ev);
    const el = this.tokens.get(this.selection!);
    if (el) {
      el.loc = add_p(el.loc, this._selection_transform.move);
      el.dim = add_p(el.dim, this._selection_transform.resize);
      el.r += this._selection_transform.r;
      console.log("el.r", el.r);
    }
    this._selection_transform = { move: [0, 0], resize: [0, 0], r: 0 };
    this.#drag_offset = undefined;
  };

  // Normally we'd use SVG machinery but it's broken in one browser...
  // ... I'll let you guess who...
  // ... it's safari
  #screen_to_svg = (ev: { clientX: number; clientY: number }): Point => {
    return sub_p(this.viewport!.coordToLocal([ev.clientX, ev.clientY]), [PADDING, PADDING]);
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
      s.loc = clamp_p([0, 0], sub_p(this.#dim, s.dim), add_p(s.loc, move));
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          id: s.id,
          loc: s.loc,
          dim: s.dim,
          r: s.r,
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
      bg: this.bg,
    };
  };

  resources = new ResourceManager();

  static styles = css`
    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
    }

    #root {
      backface-visibility: hidden;
    }

    #bg-drop {
      position: absolute;
      right: 5px;
      bottom: -60px;
      display: inline-block;
      height: 50px;
      transition: bottom 250ms;
      background: var(--ui-bg);
      border-radius: 5px 5px 0 0;
      display: grid;
      padding: 5px;
      grid: 1fr 1fr;
      text-align: center;
      display: none;
    }

    #bg-drop.canvas,
    #bg-drop.bg {
      bottom: 0;
      box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
      display: block;
    }

    #bg-drop-label {
      --color: gray;
      padding: 0 1em;
      border: 2px solid var(--color);
      color: var(--color);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .bg > #bg-drop-label {
      --color: blue;
    }

    svg {
      overflow: visible;
    }

    .shadow {
      stroke-width: ${LINE_WIDTH};
      stroke: rgba(0, 0, 0, 0.2);
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
    }

    .drop_hint {
      transition: none;
      pointer-events: none;
      fill: gray;
    }

    .selection-box, line.ro {
      stroke: var(--selection-color);
      stroke-width: 1px;
      filter: drop-shadow(0px 0px 2px var(--selection-color));
    }

    .selection-box:hover {
      cursor: move;
    }

    .rn, .rs, .re,.rw {
      stroke-width: ${HANDLE_SIZE};
      vector-effect: non-scaling-stroke;
      stroke: transparent;
    }

    .handle {
      stroke-width: 1px;
      fill: var(--selection-color);
      stroke: white;
    }


    rect.handle {
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;
      transform: translate(${-HANDLE_SIZE/2}px, ${-HANDLE_SIZE/2}px)
    }

    .ro.handle {
      cursor: crosshair;
    }

    .rn.re, .rs.rw {
      cursor: nesw-resize;
    }

    .rn.rw, .rs.re {
      cursor: nwse-resize;
    }

    .rn, .rs {
      cursor: row-resize;
    }

    .re, .rw {
      cursor: col-resize;
    }

    bg-viewport::part(background) {
      background-color: #ededf0;
    }

    bg-viewport::part(bar) {
      background: rgb(75, 75, 75);
      border: 1px solid white;
      opacity: 0.75;
      --thickness: 10px;
    }

    bg-viewport::part(bar):hover {
      opacity: 1;
    }

    .token {
      transform-box: fill-box;
      transform-origin: center;
    }
  `;
}

const nearest_corner = (n: number) => Math.round(n / GRID_SIZE) * GRID_SIZE;
const occupied_cell = (n: number) => n - (n % GRID_SIZE);
