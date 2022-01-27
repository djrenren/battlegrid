import { css, html, LitElement } from "lit";
import {
  customElement,
  eventOptions,
  state,
  property,
  query,
} from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

const min_scale = 0.1;
const max_scale = 5;
const scroll_factor = 0.005;

@customElement("bg-viewport")
export class Viewport extends LitElement {
  @property({ type: Number })
  scale = 1;

  // we need to track dimensions of content
  // and viewport so we can do centering properly
  @state()
  c_dim? = new DOMRectReadOnly();

  @state()
  v_dim? = new DOMRectReadOnly();

  @query("#content", true)
  content?: HTMLDivElement;

  @query("#scroller", true)
  scroller?: HTMLDivElement;

  @state()
  _scrollPos = [0, 0] as [number, number];

  #dragOrigin = [0, 0];
  #do_drag_start = (ev: PointerEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    (ev.target as HTMLDivElement).setPointerCapture(ev.pointerId);
    this.#dragOrigin = [ev.clientX, ev.clientY];
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

  #do_drag_move = (
    ev: PointerEvent,
    allow_x: boolean,
    allow_y: boolean,
    scalar: number
  ) => {
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

  get #scrollPos() {
    return [
      Math.max(
        0,
        Math.min(
          this.c_dim!.width * this.scale - this.v_dim!.width,
          this._scrollPos[0]
        )
      ),
      Math.max(
        0,
        Math.min(
          this.c_dim!.height * this.scale - this.v_dim!.height,
          this._scrollPos[1]
        )
      ),
    ];
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
  get offset() {
    return [
      Math.max(0, (this.v_dim!.width - this.c_dim!.width * this.scale) / 2),
      Math.max(0, (this.v_dim!.height - this.c_dim!.height * this.scale) / 2),
    ];
  }

  @state()
  smooth?: boolean

  _transitionend = () => {
    this.smooth = false;
  }
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
      needs_v_bar = this.v_dim.height < this.c_dim.height * this.scale;
      needs_h_bar = this.v_dim.width < this.c_dim.width * this.scale;
    }
    return html`
      <div
        id="touch-surface"
        @wheel=${this.#wheel}
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
              transition: this.smooth ? "all 250ms" : "none"
            })}
          ></div>
        <div
          id="content"
          style=${styleMap({
            transform: `translate(${offset[0] - scrollPos[0]}px, ${
              offset[1] - scrollPos[1]
            }px) scale(${this.scale}) `,
            transition: this.smooth ? "transform 250ms" : "none",
          })}
        >
          <slot></slot>
        </div>
        <div
          part="bar"
          class="bottombar"
          style=${styleMap({
            width:
              (this.v_dim!.width / (this.c_dim!.width * this.scale)) *
                this.v_dim!.width +
              "px",
            transform: `translate(${
              (scrollPos[0] / (this.c_dim!.width * this.scale)) *
              this.v_dim!.width
            }px, 0)`,
            display: needs_h_bar ? "block" : "none",
          })}
          @pointerdown=${this.#scrollbar_down}
          @pointermove=${this.#scrollbar_change_horiz}
          @pointerup=${this.#scrollbar_up}
        ></div>
        <div
          part="bar"
          class="rightbar"
          style=${styleMap({
            height:
              this.v_dim!.height ** 2 / (this.c_dim!.height * this.scale) +
              "px",
            transform: `translate(0, ${
              (scrollPos[1] / (this.c_dim!.height * this.scale)) *
              this.v_dim!.height
            }px)`,
            display: needs_v_bar ? "block" : "none",
          })}
          @pointerdown=${this.#scrollbar_down}
          @pointermove=${this.#scrollbar_change_vert}
          @pointerup=${this.#scrollbar_up}
        ></div>
      </div>
    `;
  }

  #scrollbar_down(ev: PointerEvent) {
    if (
      ev.pointerType === "touch" ||
      !ev.isPrimary ||
      (ev.pressure === 0 && ev.buttons !== 1)
    )
      return;
    this.#do_drag_start(ev);
  }

  #scrollbar_change_horiz(ev: PointerEvent) {
    if (
      ev.pointerType === "touch" ||
      !ev.isPrimary ||
      ev.pressure === 0 ||
      ev.buttons !== 1
    )
      return;
    this.#do_drag_move(
      ev,
      true,
      false,
      (this.c_dim!.width * this.scale) / this.v_dim!.width
    );
  }
  #scrollbar_change_vert(ev: PointerEvent) {
    if (
      ev.pointerType === "touch" ||
      !ev.isPrimary ||
      ev.pressure === 0 ||
      ev.buttons !== 1
    )
      return;
    this.#do_drag_move(
      ev,
      false,
      true,
      (this.c_dim!.height * this.scale) / this.v_dim!.height
    );
  }
  #scrollbar_up(ev: PointerEvent, idx: number) {
    this.#do_drag_end(ev);
  }

  // Chrome and Firefox model pinches as ctrl + scroll (to match the classic
  // desktop idiom). This handler turns that into a _performZoom call.
  #wheel = (ev: WheelEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.smooth=true;
    const multiplier = ev.deltaMode === WheelEvent.DOM_DELTA_LINE ? 5 : 1;
    if (ev.ctrlKey) {
      //zoom
      this._performZoom(
        this.coordToLocal([ev.clientX, ev.clientY]),
        -ev.deltaY * multiplier * scroll_factor * this.scale
      );
    } else {
      // Firefox scrolls by lines so we need to multiply that by a line size
      // to get actual pixels. Page scrolling is unsupported currently.
      // scroll
      this.#scrollPos = [
        this.#scrollPos[0] + ev.deltaX * multiplier,
        this.#scrollPos[1] + ev.deltaY * multiplier,
      ];
    }
  };

  #scroll(ev: any) {
    this.#scrollPos = [
      this.#scrollPos[0] + ev.scrollX,
      this.#scrollPos[1] + ev.scrollY,
    ];
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
    ev.preventDefault();
  }

  @eventOptions({ passive: false })
  _gesturechange(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();

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
    let new_scale = Math.min(
      max_scale,
      Math.max(min_scale, this.scale + scale_delta)
    );

    let new_scale_delta = new_scale - this.scale;

    //Step 2: Set scroll position
    this.#scrollPos = [
      this.#scrollPos[0] + origin[0] * new_scale_delta,
      this.#scrollPos[1] + origin[1] * new_scale_delta,
    ];

    //Step 3: Perform zoom then scroll
    this.scale = new_scale;
  }

  // After connection, we set up resize observers
  // so that we can properly position the content within
  // the viewport when it is smaller than the container
  firstUpdated() {
    console.log(Object.getOwnPropertyDescriptor(this, "surface"));
    const ro = new ResizeObserver((entries) => {
      for (let e of entries) {
        switch (e.target) {
          case this.surface:
            this.v_dim = e.contentRect;
            break;
          case this.content:
            this.c_dim = e.contentRect;
            break;
        }
      }
    });
    ro.observe(this.surface!);
    ro.observe(this.content!);
    this.disconnectedCallback = () => {
      super.disconnectedCallback();
      ro.disconnect();
    };
  }

  // Converts screen coordinates into content coordinates, accounting for
  // the viewport's offset and scale. This calculation also incorportated
  coordToLocal([x, y]: [number, number]): [number, number] {
    const vx = x - this.v_dim!.x + this.#scrollPos[0];
    const vy = y - this.v_dim!.y + this.#scrollPos[1];
    const offset = this.offset;
    const res = [(vx - offset[0]) / this.scale, (vy - offset[1]) / this.scale];
    return res as any;
  }

  updated() {
    this.style.setProperty("--scale", "" + this.scale);
  }

  static get styles() {
    return css`
      #touch-surface {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
      }

      #content {
        transform-origin: 0 0;
        position: absolute;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .bottombar {
        position: fixed;
        bottom: 0;
        height: var(--thickness);
      }
      .rightbar {
        position: fixed;
        right: 0;
        width: var(--thickness);
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
