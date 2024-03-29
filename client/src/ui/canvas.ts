import { css, html, LitElement, svg } from "lit";
import { customElement, eventOptions, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { abs_p, add_c, add_p, BBox, clamp_p, div_c, eq_p, intersect, max_p, min_p, mul_c, Point, sub_p } from "../util/math";
import { is_mouse_down, is_primary_down, is_primary_touch, stop_ev, window_ev } from "../util/events";
import { getImage, LocalOrRemoteImage } from "../util/files";
import { GameEvent, game_event, StateSync, TokenData, uuidv4 } from "../game/game-events";
import { Board, Game } from "../game/game";
import { OrderedMap } from "../util/orderedmap";
import { filter, map } from "../util/iter";
import { PPZ } from "./ppp";
import { styleMap } from "lit/directives/style-map.js";
import { TypedMap } from "../util/yjs";

const PIXEL_SCALE = 1;
const GRID_SIZE = 72 * PIXEL_SCALE; // scale-dependent px
const LINE_WIDTH = 0.5 * PIXEL_SCALE; // scale-dependent px
const HANDLE_SIZE = 8 * PIXEL_SCALE; // scale-independent px
const CANVAS_RADIUS = 5 * PIXEL_SCALE;
const ROTATE_DISTANCE = 10 * PIXEL_SCALE;
const ROTATE_SIZE = HANDLE_SIZE / 2;
const PADDING = 20 * PIXEL_SCALE;
const CALLOUT_DIM = GRID_SIZE;

type SelectionBox = {
  index: number;
  bbox: BBox;
};
@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  readonly width = 30;

  @property({ type: Number })
  readonly height = 40;

  @property()
  readonly bg?: string;

  @property({ attribute: false })
  //@ts-ignore
  readonly board: Board;

  @property({ attribute: false })
  readonly selection: Set<string> = new Set();

  @property({ attribute: false })
  readonly callouts: Set<Point> = new Set();

  #sbox?: { pin: Point; mouse: Point };

  @property({ attribute: false })
  sel_bbox?: BBox;

  @query("root", true)
  root?: SVGElement;

  @query("p-p-z", true)
  viewport?: PPZ;

  #mouse_loc?: Pick<MouseEvent, "clientX" | "clientY">;

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
    console.log("canvas render");
    if (!this.board) return html``;
    let [width, height] = this.#dim;
    let sbbox = this.#selection_bbox();
    let selected = this.selection.size === 1 ? this.board.get("tokens").get(this.selection.values().next().value) : undefined;
    return html`
      <p-p-z
        @pointerdown=${this.#sbox_start}
        @pointermove=${this.#sbox_move}
        @pointerup=${this.#sbox_stop}
        @pointerleave=${() => (this.#mouse_loc = undefined)}
        @dragstart=${stop_ev}
        @dragenter=${this.#drag_enter}
        @dragleave=${this.#drag_leave}
        @dragstop=${this.#drag_leave}
        @dragover=${this.#drag_over}
        @drop=${this.#drop}
      >
        <svg
          id="root"
          width=${width + PADDING * 2}
          height=${height + PADDING * 2}
          style=${styleMap({
            width: `${width + PADDING * 2}px`,
            height: `${height + PADDING * 2}px`,
          })}
        >
          <defs>
            <clipPath id="canvasClip">
              <rect width=${width} height=${height} rx=${CANVAS_RADIUS}></rect>
            </clipPath>
            <pattern id="horiz" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="100%" height=${GRID_SIZE} patternUnits="userSpaceOnUse">
              <rect class="gridline" width="100%" height=${LINE_WIDTH} fill="#d3d3d3" shape-rendering="geometricPrecision"></rect>
            </pattern>
            <pattern id="vert" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height="100%" patternUnits="userSpaceOnUse">
              <rect class="gridline" width=${LINE_WIDTH} height="100%" fill="#d3d3d3" shape-rendering="geometric precision"></rect>
            </pattern>
            <pattern id="loading" patternUnits="userSpaceOnUse" width="1" height="1">
              <rect width="1" height="1" fill="white"></rect>
              <image href="assets/loading.svg" width="1" height="1" />
            </pattern>
          </defs>
          <svg x=${PADDING} y=${PADDING} width=${width} height=${height} id="surface">
            <rect class="shadow" width="100%" height="100%" fill="white" rx=${CANVAS_RADIUS}></rect>
            <svg clip-path="url(#canvasClip)">
              ${this.bg
                ? svg`<image href=${this.bg} width="100%" height="100%" preserveAspectRatio="none" style="will-change: transform"></image>`
                : null}
              <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
              <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
              <svg id="tokens">
                ${repeat(
                  this.board.get("order") ?? [],
                  (t) => t,
                  (tid, index) => {
                    const t = this.board.get("tokens").get(tid)!;
                    const [width, height] = add_c(t.get("dim"), -LINE_WIDTH);
                    const [x, y] = add_c(t.get("loc"), LINE_WIDTH / 2);
                    return html`
                      <svg
                        viewBox="0 0 1 1"
                        x=${x}
                        y=${y}
                        width=${width}
                        height=${height}
                        fill="transparent"
                        preserveAspectRatio="none"
                        @pointerdown=${this.#mouse_focus}
                        @pointerup=${this.#touch_focus}
                      >
                        <image
                          id=${tid}
                          class="token"
                          width="1"
                          height="1"
                          href=${t.get("url")}
                          style=${`transform: rotate(${t.get("r")}deg)`}
                          preserveAspectRatio="none"
                          @load=${mark_loaded}
                        ></image>
                        <rect width="1" height="1" class="loading"></rect>
                      </svg>

                      ${sbbox?.index === index
                        ? svg`<rect
                            class="selection-drag-target"
                            x=${sbbox.bbox.start[0]}
                            y=${sbbox.bbox.start[1]}
                            width=${sbbox.bbox.end[0] - sbbox.bbox.start[0]}
                            height=${sbbox.bbox.end[1] - sbbox.bbox.start[1]}
                            fill="transparent"
                            @touchmove=${this.prevent_safari_scroll}
                            @pointerdown=${this.selection_drag_start}
                            @pointermove=${this.selection_drag}
                            @pointerup=${this.selection_drag_end}
                        ></rect>`
                        : null}
                    `;
                  }
                )}
              </svg>
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
            </svg>
            ${this.#sbox
              ? svg`
              <rect id="sbox"
                x=${Math.min(this.#sbox.pin[0], this.#sbox.mouse[0])}
                y=${Math.min(this.#sbox.pin[1], this.#sbox.mouse[1])}
                width=${Math.abs(this.#sbox.pin[0] - this.#sbox.mouse[0])}
                height=${Math.abs(this.#sbox.pin[1] - this.#sbox.mouse[1])}
                ></rect>
              `
              : null}
            ${repeat(
              this.callouts,
              (id) => id,
              (point) => {
                const [x, y] = sub_p(point, [CALLOUT_DIM / 2, CALLOUT_DIM / 2]);

                return svg`
                  <image href="assets/callout.svg" x=${x} y=${y} width=${CALLOUT_DIM} height=${CALLOUT_DIM}></image>
                `;
              }
            )}
            ${sbbox
              ? svg`
            <svg
              id="selection"
              x=${sbbox.bbox.start[0]}
              y=${sbbox.bbox.start[1]}
              width=${sbbox.bbox.end[0] - sbbox.bbox.start[0]}
              height=${sbbox.bbox.end[1] - sbbox.bbox.start[1]}
              @touchmove=${this.prevent_safari_scroll}
              @pointerdown=${this.selection_drag_start}
              @pointermove=${this.selection_drag}
              @pointerup=${this.selection_drag_end}>
              <rect class="selection-box" width="100%" height="100%"  ></rect>
            ${
              selected
                ? svg`
            <g style=${`transform-origin: center; transform: rotate(${selected.get("r")}deg) translateY(${
              (Math.sign((selected.get("r") - 180) % 180) * (selected.get("dim")[0] - selected.get("dim")[1])) / 2
            }px)`}>
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
            </g>
            </svg>`
                : null
            }`
              : null}
          </svg>
        </svg>
      </p-p-z>
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

    const local = this.#screen_to_svg(ev);
    const cell = local.map(occupied_cell);
    const max = mul_c(add_c([this.width, this.height], -1), GRID_SIZE);
    this._drop_hint = clamp_p([0, 0], max, cell as Point);
    this.hovering = "canvas";
  };

  #drag_leave = (ev: DragEvent) => {
    if (--this.#drag_depth <= 0) {
      this._drop_hint = undefined;
      this.hovering = undefined;
    }
  };

  @eventOptions({ capture: true, passive: false })
  prevent_safari_scroll(ev: TouchEvent) {
    stop_ev(ev);
  }

  #bg_drag_over = (ev: DragEvent) => {
    stop_ev(ev);
    this._drop_hint = undefined;
    this.hovering = "bg";
  };

  #bg_drop = async (ev: DragEvent) => {
    stop_ev(ev);
    try {
      const img = await getImage(ev);
      this.dispatchEvent(window_ev("bg-drop", img));
    } catch (e) {}
    this.#drag_depth = 0;
    this.hovering = undefined;
  };

  #drop = async (ev: DragEvent) => {
    stop_ev(ev);
    try {
      const img = await getImage(ev);
      console.log("Emitting drop");
      // TODO EMIT DROPPED TOKEN
      this.dispatchEvent(
        window_ev("token-drop", {
          loc: this._drop_hint!,
          dim: [GRID_SIZE, GRID_SIZE] as Point,
          img,
        })
      );
    } catch (e) {}
    this._drop_hint = undefined;
    this.hovering = undefined;
  };

  #mouse_focus = (ev: PointerEvent) => {
    if (!is_mouse_down(ev)) return;
    this.#focus(ev);
  };

  #touch_focus = (ev: PointerEvent) => {
    if (!is_primary_touch(ev)) return;
    this.#focus(ev);
  };

  #focus = (ev: PointerEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    const id = (ev.target as SVGImageElement).id;
    if (ev.shiftKey || ev.ctrlKey) {
      this.dispatchEvent(
        window_ev(
          "token-select",
          [id, ...this.selection].filter((s) => s !== id || !this.selection.has(id))
        )
      );
    } else {
      this.dispatchEvent(window_ev("token-select", [(ev.target as SVGImageElement).id]));
    }
  };

  #sbox_start(ev: PointerEvent) {
    if (!is_mouse_down(ev)) return;
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    const local = this.#screen_to_svg(ev);
    this.#sbox = { pin: local, mouse: local };
  }

  #sbox_move(ev: PointerEvent) {
    this.#mouse_loc = { clientX: ev.clientX, clientY: ev.clientY };
    if (!this.#sbox) return;
    this.#sbox.mouse = this.#screen_to_svg(ev);
    this.requestUpdate();
  }

  #sbox_stop(ev: PointerEvent) {
    // TODO: This causes mobile safari to lose selection on zoom
    if (!this.#sbox) return this.dispatchEvent(window_ev("token-select", []));
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    const loc = min_p(this.#sbox.pin, this.#sbox.mouse);
    const dim = abs_p(sub_p(this.#sbox.pin, this.#sbox.mouse));

    const box = {
      start: loc,
      end: add_p(loc, dim),
    };

    const sel = map(
      filter(this.board.get("tokens").values(), (t: TypedMap<TokenData>) =>
        intersect(box, {
          start: t.get("loc"),
          end: add_p(t.get("loc"), t.get("dim")),
        })
      ),
      (t) => t.get("id")
    );

    this.#sbox = undefined;
    this.dispatchEvent(window_ev("token-select", [...sel]));
    this.requestUpdate();
  }

  #selection_bbox(): SelectionBox | undefined {
    if (this.selection.size === 0) return;
    const s = Array.from(this.selection, (t) => this.board.get("tokens").get(t)).filter((t) => t) as TypedMap<TokenData>[];
    const index = Math.max(...map(this.selection.values(), (id) => this.board.get("order").toJSON().indexOf(id)!));
    let start = s[0]!.get("loc");
    let end = add_p(s[0]!.get("loc"), s[0]!.get("dim"));

    s.forEach((t) => {
      start = min_p(start, t.get("loc"));
      end = max_p(end, add_p(t.get("loc"), t.get("dim")));
    });

    return { index, bbox: { start, end } };
  }

  #drag_offset?: Point;

  @eventOptions({ capture: true, passive: false })
  selection_drag_start(ev: PointerEvent) {
    if (!is_primary_down(ev)) return;
    const svg_coord = this.#screen_to_svg(ev) as Point;
    stop_ev(ev);
    (ev.target as SVGElement).setPointerCapture(ev.pointerId);
    this.#drag_offset = svg_coord;
  }

  #selection_transform = { move: [0, 0] as Point, resize: [0, 0] as Point, r: 0 };

  @eventOptions({ capture: true, passive: false })
  selection_drag(ev: PointerEvent) {
    if (!is_primary_down(ev)) return;
    if (!this.#drag_offset) {
      this.selection_drag_start(ev);
    }
    stop_ev(ev);
    const grid_loc = clamp_p([0, 0], this.#dim, this.#screen_to_svg(ev));
    const selection = this.board.get("tokens").get(this.selection.values().next().value)!;
    const dim = selection.get("dim");
    const loc = selection.get("loc");
    const classes = (ev.target as SVGGraphicsElement).classList;
    let move = [0, 0] as Point;
    let resize = [0, 0] as Point;
    let r = 0;

    if (classes.contains("rn")) {
      resize[1] = loc[1] - nearest_corner(grid_loc[1]);
      move[1] = nearest_corner(grid_loc[1]) - loc[1];
    }

    if (classes.contains("rw")) {
      resize[0] = loc[0] - nearest_corner(grid_loc[0]);
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
      r = Math.round(deg / 90) * 90 - (selection.get("r") % 360);
    }

    if (classes.contains("selection-drag-target")) {
      move = sub_p(grid_loc, this.#drag_offset!).map(nearest_corner) as Point;
    } else {
      // Don't let top-left drags cause movement pas the dimensions
      move = min_p(add_c(dim, -GRID_SIZE), move);
      // Constrain the transform from making anything smaller than a grid
      resize = max_p(add_c(mul_c(dim, -1), GRID_SIZE), resize as Point);
    }

    if (r !== this.#selection_transform.r || !eq_p(move, this.#selection_transform.move) || !eq_p(resize, this.#selection_transform.resize)) {
      this.#drag_offset = add_p(this.#drag_offset!, move);
      this.#selection_transform = { move: [0, 0] as Point, resize: [0, 0] as Point, r: 0 };
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          tokens: Array.from(this.selection, (id) => {
            let selection = this.board.get("tokens").get(id)!;
            return {
              id: selection.get("id"),
              loc: add_p(selection.get("loc"), move),
              dim: add_p(selection.get("dim"), resize),
              r: selection.get("r") + r,
            };
          }),
        })
      );
    }
  }

  @eventOptions({ capture: true, passive: false })
  selection_drag_end(ev: PointerEvent) {
    stop_ev(ev);
    this.#drag_offset = undefined;
  }

  // Normally we'd use SVG machinery but it's broken in one browser...
  // ... I'll let you guess who...
  // ... it's safari
  #screen_to_svg = (ev: { clientX: number; clientY: number }): Point => {
    let res = sub_p(this.viewport!.coordToLocal([ev.clientX, ev.clientY]), [PADDING, PADDING]);
    return res;
  };

  #keydown = (ev: KeyboardEvent) => {
    if (!this.selection) return;

    // Backspace
    if (ev.keyCode === 8) {
      this.dispatchEvent(
        game_event({
          type: "token-removed",
          ids: Array.from(this.selection),
        })
      );
      stop_ev(ev);
      return;
    }

    if (ev.key === "z" && this.#mouse_loc) {
      this.dispatchEvent(
        game_event({
          type: "callout",
          loc: this.#screen_to_svg(this.#mouse_loc),
        })
      );
    }

    let s = this.board.get("tokens").get(this.selection.values().next().value)!;
    const movements: { [key: string]: Point } = {
      ArrowUp: [0, -GRID_SIZE],
      ArrowDown: [0, GRID_SIZE],
      ArrowLeft: [-GRID_SIZE, 0],
      ArrowRight: [GRID_SIZE, 0],
    };

    let move: Point | undefined = movements[ev.key];
    if (move) {
      this.dispatchEvent(
        game_event({
          type: "token-manipulated",
          tokens: Array.from(this.selection, (id) => {
            const s = this.board.get("tokens").get(id)!;
            const loc = clamp_p([0, 0], sub_p(this.#dim, s.get("dim")), add_p(s.get("loc"), move!));
            return {
              id: s.get("id"),
              loc: loc,
              dim: s.get("dim"),
              r: s.get("r"),
            };
          }),
        })
      );
      stop_ev(ev);
    }
  };

  static styles = css`
    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
      overflow: hidden;
    }

    p-p-z {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-width: 100%;
      max-height: 100%;
    }
    #root {
      backface-visibility: hidden;
    }

    #sbox {
      stroke: var(--selection-color);
      stroke-width: 1px;
      fill: var(--selection-color);
      fill-opacity: 0.2;
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

    #surface {
      clip-path: rect(100%);
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

    .selection-box,
    line.ro {
      stroke: var(--selection-color);
      stroke-width: 1px;
      filter: drop-shadow(0px 0px 2px var(--selection-color));
      fill: transparent;
    }

    .selection-box {
      pointer-events: none !important;
    }

    .rn,
    .rs,
    .re,
    .rw {
      stroke-width: ${HANDLE_SIZE};
      vector-effect: non-scaling-stroke;
      stroke: transparent;
    }

    .handle {
      stroke-width: 1px;
      fill: var(--selection-color);
      stroke: white;
    }

    .selection-drag-target {
      pointer-events: fill;
      cursor: move;
    }

    rect.handle {
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;
      transform: translate(${-HANDLE_SIZE / 2}px, ${-HANDLE_SIZE / 2}px);
    }

    .ro.handle {
      cursor: crosshair;
    }

    .rn.re,
    .rs.rw {
      cursor: nesw-resize;
    }

    .rn.rw,
    .rs.re {
      cursor: nwse-resize;
    }

    .rn,
    .rs {
      cursor: row-resize;
    }

    .re,
    .rw {
      cursor: col-resize;
    }

    p-p-z {
      background-color: #ededf0;
    }

    .token {
      transform-box: fill-box;
      transform-origin: center;
      fill: transparent;
    }

    .token + .loading {
      fill: url(#loading);
      pointer-events: none;
    }

    .token.loaded + .loading {
      fill: transparent;
    }

    #selection {
      pointer-events: none;
    }

    #selection * {
      pointer-events: auto;
    }
  `;
}

export type TokenDropEvent = CustomEvent<{ loc: Point; dim: Point; img: LocalOrRemoteImage }>;
export type BgDropEvent = CustomEvent<LocalOrRemoteImage>;
export type TokenSelectEvent = CustomEvent<string[]>;
export type TokenDeleteEvent = CustomEvent<string>;

declare global {
  interface WindowEventMap {
    "token-drop": TokenDropEvent;
    "bg-drop": BgDropEvent;
    "token-select": TokenSelectEvent;
  }
}

const nearest_corner = (n: number) => Math.round(n / GRID_SIZE) * GRID_SIZE;
const occupied_cell = (n: number) => n - (n % GRID_SIZE);
const mark_loaded = (ev: any) => ev.target.classList.add("loaded");
