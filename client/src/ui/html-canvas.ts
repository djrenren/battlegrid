import { css, html, LitElement, svg, unsafeCSS } from "lit";
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

const PIXEL_SCALE = 1;
const GRID_SIZE = 24 * PIXEL_SCALE; // scale-dependent px
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

@customElement("html-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  readonly width = 30;

  @property({ type: Number })
  readonly height = 40;

  @property({attribute: false})
  //@ts-ignore
  readonly board: Board;

  get screen_dim(): Point {
    return mul_c([this.width, this.height] as Point, GRID_SIZE)
  }

  render() {
    let [px_width, px_height] = this.screen_dim;
    return html`
      <p-p-z>
        <div
          id="root"
          style=${styleMap({
            width: `${px_width}px`,
            height: `${px_height}px`,
            padding: `${PADDING}px`,
            fontSize: `${GRID_SIZE}px`
          })}
        >
          <div id="board">
            <svg width=${this.width} height=${this.height} style="width: 100%; height: 100%;">
                <defs>
                    <pattern id="horiz" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="100%" height=${GRID_SIZE} patternUnits="userSpaceOnUse">
                    <rect class="gridline" width="100%" height=${LINE_WIDTH} fill="#d3d3d3" shape-rendering="geometricPrecision"></rect>
                    </pattern>
                    <pattern id="vert" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width=${GRID_SIZE} height="100%" patternUnits="userSpaceOnUse">
                    <rect class="gridline" width=${LINE_WIDTH} height="100%" fill="#d3d3d3" shape-rendering="geometric precision"></rect>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
                <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
            </svg>
                ${repeat(
                    this.board.get("order") ?? [],
                    (t) => t,
                    (tid, index) => {
                        let t = this.board.get('tokens').get(tid)!;
                        const [width, height] = add_c(t.get("dim"), -LINE_WIDTH);
                        const [x, y] = add_c(t.get("loc"), LINE_WIDTH / 2); 
                       return html`
                       <div class="token" style=${styleMap({
                        width: width + 'em',
                        height: height + 'em',
                        background: "red",
                        transform: `translate(${x}em, ${y}em)`
                       })}></div>
                        `;
                    }
                )}
            </div>
        </div>
    </p-p-z>`;
  }

  static styles = css`
    p-p-z {
      position: absolute;
      background-color: #ededf0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    #board {
        width: 100%;
        height: 100%;
        border-radius: ${unsafeCSS((GRID_SIZE/4) + 'px')};
        background: white;
    }

    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
      overflow: hidden;
    }
  `
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
