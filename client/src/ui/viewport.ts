import { css, html, LitElement } from "lit";
import { customElement, eventOptions, state, property, query, queryAssignedElements } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { is_non_touch_drag, stop_ev } from "../util/events";
import { add_p, div_c, div_p, max_p, min_p, mul_c, mul_p, Point, sub_p } from "../util/math";

const min_scale = 0.5;
const max_scale = 5;
const scroll_factor = 0.005;
const AUTO_ZOOM_FILL = 0.8; // Percentage of the viewport to fill on first load

@customElement("bg-viewport")
export class Viewport extends LitElement {
  @property({ type: Number })
  scale = 1;

  // we need to track dimensions of content
  // and viewport so we can do centering properly
  @state()
  c_dim: Point = [0, 0];

  @state()
  v_dim: Point = [0, 0];

  @state()
  v_loc: Point = [0, 0];

  #content?: SVGSVGElement;

  @state()
  _scrollPos = [0, 0] as [number, number];

  get #scrollPos() {
    return max_p([0, 0], min_p(this._scrollPos, sub_p(mul_c(this.c_dim, this.scale), this.v_dim)));
  }
  set #scrollPos(value: [number, number]) {
    const old = this._scrollPos;
    this._scrollPos = value;
    this.requestUpdate("#scrollPos", old);
  }

  // Surface represents the client rectangle for the viewport.
  // It's "bigger on the inside" so that content can be scrolled through
  @query("#touch-surface", true)
  surface?: HTMLDivElement;

  // When content is smaller than the viewport, it needs to be centered
  // Normally, you'd use margin or positioning to center, but these are slow
  // they require layout on resize. Instead, we'll do our own math with
  // transforms.
  //
  // offset represents the position of content within the viewport.
  // When content is larger than the viewport, the offset is 0,0
  get offset(): [number, number] {
    return max_p([0, 0], mul_c(sub_p(this.v_dim, mul_c(this.c_dim, this.scale)), 0.5)).map((n) => n) as any; //Math.round((n + Number.EPSILON) * 100) / 100) as any;
  }

  // Indicates whether to animate content placement.  This is used to when input
  // is big and chunky like ctrl+scroll wheel scrolling.  In the future it could
  // be used for pg-up/down
  @state()
  smooth?: boolean;

  _transitionend = () => {
    this.smooth = false;
  };

  // The internal structure of viewport consists of 3 layers:
  //
  // Surface - where scrollbars are drawn and handlers are attached
  // Translater - which handles the offset
  // Content - which is scaled
  //
  // Translater and content are separated to allow overlays which
  // are not scaled, but are positioned correctly. If we used em-scaling
  // for grid elements we wouldn't need this separation but em-scaling
  // causes a lot of math, so we use transform scaling for that GPU-accelerated
  // goodness.
  //
  // We update offset and scale using CSS variables in the hopes that it's faster
  // for browsers to deal with. This is untested
  render() {
    const offset = this.offset;
    const scrollPos = this.#scrollPos;
    let needs_v_bar = false;
    let needs_h_bar = false;
    if (this.v_dim && this.c_dim) {
      needs_v_bar = this.v_dim[1] < this.c_dim[1] * this.scale;
      needs_h_bar = this.v_dim[0] < this.c_dim[0] * this.scale;
    }

    const scroll_size = div_p(mul_p(this.v_dim, this.v_dim), mul_c(this.c_dim, this.scale));
    const scroll_loc = div_p(mul_p(scrollPos, this.v_dim), mul_c(this.c_dim, this.scale));

    return html`
      <style>
        :host,
        :root {
          --scale: ${this.scale};
        }
        ::slotted(svg) {
          transform: translate(${offset[0] - scrollPos[0]}px, ${offset[1] - scrollPos[1]}px) scale(var(--scale));
        }
      </style>
      <div
        id="touch-surface"
        class=${this.smooth ? "smooth" : ""}
        @wheel=${this._wheel}
        @pointerdown=${this._touchdragstart}
        @pointermove=${this._touchdragmove}
        @pointerup=${this._touchdragend}
        @gesturestart=${this._gesturestart}
        @gesturechange=${this._gesturechange}
      >
        <div
          part="background"
          @transitionend=${this._transitionend}
          style=${styleMap({
            position: "absolute",
            zIndex: "-1",
            height: "100%",
            width: "100%",
            backgroundPosition: `${offset[0] - scrollPos[0]}px ${offset[1] - scrollPos[1]}px`,
          })}
        ></div>
        <slot @slotchange=${this.handleSlotchange}></slot>
        <div
          part="bar"
          class="bottombar"
          style=${styleMap({
            width: scroll_size[0] + "px",
            transform: `translate(${scroll_loc[0]}px, 0)`,
            opacity: needs_h_bar ? "0.75" : "0",
            pointerEvents: needs_h_bar ? "auto" : "none",
          })}
          @pointerdown=${this.#scrollbar_down}
          @pointermove=${this.#scrollbar_change_horiz}
          @pointerup=${this.#scrollbar_up}
        ></div>
        <div
          part="bar"
          class="rightbar"
          style=${styleMap({
            height: scroll_size[1] + "px",
            transform: `translate(0, ${scroll_loc[1]}px)`,
            opacity: needs_v_bar ? "0.75" : "0",
            pointerEvents: needs_v_bar ? "auto" : "none",
          })}
          @pointerdown=${this.#scrollbar_down}
          @pointermove=${this.#scrollbar_change_vert}
          @pointerup=${this.#scrollbar_up}
        ></div>
      </div>
    `;
  }

  #scrollbar_down(ev: PointerEvent) {
    if (is_non_touch_drag(ev)) this.#do_drag_start(ev);
  }

  #scrollbar_change_horiz(ev: PointerEvent) {
    if (is_non_touch_drag(ev)) this.#do_drag_move(ev, true, false, (this.c_dim[0] * this.scale) / this.v_dim[0]);
  }
  #scrollbar_change_vert(ev: PointerEvent) {
    if (is_non_touch_drag(ev)) this.#do_drag_move(ev, false, true, (this.c_dim[1] * this.scale) / this.v_dim[1]);
  }
  #scrollbar_up(ev: PointerEvent, idx: number) {
    this.#do_drag_end(ev);
  }

  // Chrome and Firefox model pinches as ctrl + scroll (to match the classic
  // desktop idiom). This handler turns that into a _performZoom call.
  @eventOptions({ passive: false })
  _wheel(ev: WheelEvent) {
    stop_ev(ev);
    const multiplier = ev.deltaMode === WheelEvent.DOM_DELTA_LINE ? ((this.smooth = true), 5) : 1;
    if (ev.ctrlKey) {
      this.smooth = ev.deltaMode === WheelEvent.DOM_DELTA_LINE;
      //zoom
      this._performZoom(this.coordToLocal([ev.clientX, ev.clientY]), -ev.deltaY * multiplier * scroll_factor * this.scale);
    } else {
      this.smooth = ev.deltaMode === WheelEvent.DOM_DELTA_LINE && (ev.deltaY * multiplier > 15 || ev.deltaX * multiplier > 15);
      // Firefox scrolls by lines so we need to multiply that by a line size
      // to get actual pixels. Page scrolling is unsupported currently.
      this.#scrollPos = add_p(mul_c([ev.deltaX, ev.deltaY], multiplier), this.#scrollPos);
    }
  }

  // Gesture-based scrolling
  // Safari records pinches as gesture events rather than wheel events
  // so we have to listen for these as well
  #prev_scale = 0;
  #origin = [0, 0] as [number, number];
  @eventOptions({ capture: true })
  _gesturestart(ev: any) {
    this.#origin = this.coordToLocal([ev.clientX, ev.clientY]);
    this.#prev_scale = 1;
    stop_ev(ev);
  }

  @eventOptions({ passive: false })
  _gesturechange(ev: any) {
    stop_ev(ev);

    this._performZoom(
      this.#origin,
      // I'll be real I'm not entirely sure why this is the magic number
      this.scale * (ev.scale - this.#prev_scale) * 1.5
    );

    this.#prev_scale = ev.scale;
  }

  // _performZoom is separated out so it can be initiated by different event handlers
  // such as scroll wheels, touches, button clicks, etc.
  _performZoom(origin: [number, number], scale_delta: number) {
    // Step 1: Bound the proposed delta by the min and max scale
    let new_scale = Math.min(max_scale, Math.max(min_scale, this.scale + scale_delta));

    let new_scale_delta = new_scale - this.scale;

    //Step 2: Set scroll position
    this.#scrollPos = add_p(mul_c(origin, new_scale_delta), this.#scrollPos);

    //Step 3: Perform zoom then scroll
    this.scale = new_scale; //Math.round((new_scale + Number.EPSILON) * 10) / 10
  }

  #resize_observer = new ResizeObserver((entries) => {
    for (let e of entries) {
      switch (e.target) {
        case this.surface:
          this.v_dim = [e.contentRect.width, e.contentRect.height];
          this.v_loc = [e.contentRect.x, e.contentRect.y];
          break;
        case this.#content:
          // this.c_dim = [e.contentRect.width, e.contentRect.height];
          this.c_dim = [this.#content!.width.baseVal.value, this.#content!.height.baseVal.value];
          break;
      }
    }
  });

  // After connection, we set up resize observers
  // so that we can properly position the content within
  // the viewport when it is smaller than the container
  firstUpdated() {
    this.#resize_observer.observe(this.surface!);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resize_observer.disconnect();
  }

  // Converts screen coordinates into content coordinates, accounting for
  // the viewport's offset and scale. This calculation also incorportated
  coordToLocal(coord: [number, number]): [number, number] {
    const v = add_p(sub_p(coord, this.v_loc), this.#scrollPos);
    const res = div_c(sub_p(v, this.offset), this.scale);

    return res;
  }

  handleSlotchange({ target }: { target: HTMLSlotElement }) {
    this.#content ? this.#resize_observer.unobserve(this.#content) : 0;
    this.#content = target.assignedElements().find((el) => el.matches("svg")) as SVGSVGElement;

    // Whenever #content changes, let's auto-zoom to a comfortable level
    const dim = [this.#content!.width.baseVal.value, this.#content!.height.baseVal.value] as Point;
    const rect = this.surface!.getBoundingClientRect();
    this.scale = Math.max(min_scale, Math.min(max_scale, ...mul_c(div_p([rect.width, rect.height], dim), AUTO_ZOOM_FILL)));

    this.#content ? this.#resize_observer.observe(this.#content) : 0;
  }

  // Drag Logic (reused by touch panning, and scrollbar dragging)
  #dragOrigin = [0, 0];
  #do_drag_start = (ev: PointerEvent) => {
    stop_ev(ev);
    (ev.target as HTMLDivElement).setPointerCapture(ev.pointerId);
    this.#dragOrigin = [ev.clientX, ev.clientY];
  };

  #do_drag_move = (ev: PointerEvent, allow_x: boolean, allow_y: boolean, scalar: number) => {
    let sp = this.#scrollPos;
    let old = this.#dragOrigin;
    this.#dragOrigin = [ev.clientX, ev.clientY];
    this.#scrollPos = [
      allow_x ? sp[0] + scalar * (this.#dragOrigin[0] - old[0]) : sp[0],
      allow_y ? sp[1] + scalar * (this.#dragOrigin[1] - old[1]) : sp[1],
    ];
  };

  #do_drag_end = (ev: PointerEvent) => {
    (ev.target as HTMLDivElement).releasePointerCapture(ev.pointerId);
  };

  _touchdragstart = (ev: PointerEvent) => {
    if (ev.isPrimary && ev.pointerType === "touch") {
      this.#do_drag_start(ev);
    }
  };

  _touchdragmove = (ev: PointerEvent) => {
    if (ev.isPrimary && ev.pointerType === "touch") {
      this.#do_drag_move(ev, true, true, -1);
    }
  };

  _touchdragend = (ev: PointerEvent) => {
    if (ev.isPrimary && ev.pointerType === "touch") {
      this.#do_drag_end(ev);
    }
  };

  static get styles() {
    return css`
      #touch-surface {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      ::slotted(svg) {
        transform-origin: 0 0;
        position: absolute;
      }

      .bottombar {
        position: absolute;
        bottom: 0;
        height: var(--thickness);
      }
      .rightbar {
        position: absolute;
        right: 0;
        width: var(--thickness);
      }

      .smooth > *,
      .smooth ::slotted(svg) {
        transition: transform 150ms, width 150ms, height 150ms, background-position 150ms, background-size 150ms;
      }
    `;
  }
}

// Keep typescript happy
declare global {
  interface HTMLElementTagNameMap {
    "bg-viewport": Viewport;
  }
}
