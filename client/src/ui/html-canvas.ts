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

import "./html-canvas/drop-layer";
import { styleMap } from "lit/directives/style-map.js";

const PIXEL_SCALE = 1;
const GRID_SIZE = 24 * PIXEL_SCALE; // scale-dependent px
const LINE_WIDTH = 0.02 * PIXEL_SCALE; // scale-dependent px
const HANDLE_SIZE = 8 * PIXEL_SCALE; // scale-independent px
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
  @property({ attribute: false })
  //@ts-ignore
  readonly board: Board;

  get screen_dim(): Point {
    return mul_c(this.grid_dim, GRID_SIZE);
  }

  get grid_dim(): Point {
    return [this.board.get("width"), this.board.get("height")];
  }

  render() {
    let [px_width, px_height] = this.screen_dim;
    return html` <p-p-z>
      <div
        id="root"
        style=${styleMap({
          width: `${px_width}px`,
          height: `${px_height}px`,
          padding: `${PADDING}px`,
          fontSize: `${GRID_SIZE}px`,
        })}
      >
        <div id="board">
          <svg style="width: 100%; height: 100%; position: absolute;" viewBox=${"0 0 " + this.board.get("width") + " " + this.board.get("height")}>
            <defs>
              <pattern id="horiz" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="100%" height="1" patternUnits="userSpaceOnUse">
                <rect class="gridline" width="100%" height=${LINE_WIDTH} fill="#d3d3d3" shape-rendering="geometricPrecision"></rect>
              </pattern>
              <pattern id="vert" x=${-LINE_WIDTH / 2} y=${-LINE_WIDTH / 2} width="1" height="100%" patternUnits="userSpaceOnUse">
                <rect class="gridline" width=${LINE_WIDTH} height="100%" fill="#d3d3d3" shape-rendering="geometric precision"></rect>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#horiz)" opacity="0.75" pointer-events="none"></rect>
            <rect width="100%" height="100%" fill="url(#vert)" opacity="0.75" pointer-events="none"></rect>
          </svg>
          ${repeat(
            this.board.get("order").toJSON() ?? [],
            (t) => t,
            (tid, index) => {
              console.log("repeat!", tid);
              let t = this.board.get("tokens").get(tid)!;
              const [width, height] = add_c(t.get("dim"), 0);
              const [x, y] = add_c(t.get("loc"), 0);
              return html`
                <div
                  class="token"
                  style=${styleMap({
                    width: width + "px",
                    height: height + "px",
                    backgroundImage: `url("${t.get("url")}")`,
                    transform: `translate(${x}px, ${y}px)`,
                  })}
                ></div>
              `;
            }
          )}
          <drop-layer class="full-bleed" .grid=${this.#grid} @token-drop=${(ev: any) => console.log(ev)}></drop-layer>
        </div>
      </div>
    </p-p-z>`;
  }

  #grid: Grid = {
    snap(p) {
      return [occupied_cell(p[0]), occupied_cell(p[1])] as Point;
    },
    dim: GRID_SIZE,
  };

  #snap_to_grid(p: Point) {}

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
      border-radius: ${unsafeCSS(GRID_SIZE / 4 + "px")};
      background: white;
      position: relative;
      overflow: hidden;
      box-shadow: 5px solid #dddddddd;
    }

    .token {
      position: absolute;
      background-size: 100% 100%;
    }

    .full-bleed {
      position: absolute;
      inset: 0 0 0 0;
    }

    :host {
      position: relative;
      display: block;
      --selection-color: cornflowerblue;
      overflow: hidden;
    }
  `;
}

export interface Grid {
  snap(p: Point): Point;
  dim: number;
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
