import { stop_ev } from "../util/events";
import { add_p, div_c, div_p, max_p, mul_c, mul_p, Point, sub_p } from "../util/math";

type State = {
  offset: [0, 0];
  z: number;
};

const MAX_SCALE = 4;
const MIN_SCALE = 1;
const AUTO_ZOOM_FILL = 0.95; // Percentage of the viewport to fill on first load

const SPEED = 0.002; // 100 px per second

export class PPZ extends HTMLElement {
  root: ShadowRoot;
  container: HTMLDivElement;

  state = { z: 1, scroll_pos: [0, 0] as [number, number] };
  desired_state = { z: 1 };

  // TODO: replace with a `desired_state.scroll_pos` that we interpolate

  /** The point around which an animated zoom operates */
  origin = [0, 0] as [number, number];

  /** Location of the viewport in client space */
  vloc: Point = [0, 0] as Point;

  /** Dimensions of the viewport */
  vdim: Point = [0, 0] as Point;

  /** Dimensions of the client */
  cdim: Point = [0, 0] as Point;

  /** Offset of the client within the interior scrollable space. Used to center content */
  offset: Point = [0, 0] as Point;

  /** Indicates whether zooming should be animated or immediate */
  smooth: boolean = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(PPZ.template().content.cloneNode(true));
    this.container = this.root.getElementById("container") as HTMLDivElement;
    this.#resize_observer.observe(this);
    this.root.querySelector("slot")!.onslotchange = ({ target }) => {
      let slot = target as HTMLSlotElement;
      let svg = slot.assignedElements()[0] as SVGSVGElement;
      this.#resize_observer.observe(svg);

      this.smooth = false;
      this.#zoom_to_fit();
    };
    this.addEventListener("scroll", () => (this.state.scroll_pos = [this.scrollLeft, this.scrollTop]));
    this.addEventListener("gesturestart", this.#gesture.start);
    this.addEventListener("gesturechange", this.#gesture.change);
    document.addEventListener("keydown", this.#keyboard_zoom, { passive: false });
  }

  #zoom_to_fit() {
    let svg = (this.root.querySelector("slot") as HTMLSlotElement).assignedElements()[0] as SVGSVGElement;
    let dim = this.getBoundingClientRect();
    let vdim = [dim.width, dim.height] as Point;
    let cdim = [svg.width.baseVal.value, svg.height.baseVal.value] as Point;
    const zoom = Math.max(MIN_SCALE, Math.min(MAX_SCALE, ...mul_c(div_p(vdim, cdim), AUTO_ZOOM_FILL)));
    this.zoom([0, 0], zoom - this.state.z);
  }

  #resize_observer = new ResizeObserver((entries) => {
    for (let e of entries) {
      if (e.target === this) {
        this.vdim = [e.contentRect.width, e.contentRect.height];
        const rect = this.getBoundingClientRect();
        this.vloc = [rect.x, rect.y];
      } else {
        //@ts-ignore;
        this.cdim = [e.target.width.baseVal.value, e.target.height.baseVal.value];
      }
    }

    this.center();
  });

  loop = async () => {
    let prv;
    let ts;
    while (((prv = ts) || true) && (ts = await next_frame())) {
      if (!prv) continue;
      let delta = this.desired_state.z - this.state.z;
      if (delta === 0) {
        continue;
      }
      let elapsed = ts - prv;

      // If it's smooth, we'll move in increments, otherwise perform all adjustments in one frame
      let delta_scale = this.smooth ? Math.sign(delta) * Math.min(elapsed * SPEED * this.state.z, Math.abs(delta)) : delta;

      // Record the new z
      this.state.z += delta_scale;

      this.center();

      // Be sure to prevent negative scroll positions
      this.state.scroll_pos = max_p([0, 0], add_p(mul_c(this.origin, delta_scale), this.state.scroll_pos));
      this.scrollTo({ left: this.state.scroll_pos[0], top: this.state.scroll_pos[1] });
    }
  };

  /**
   * Centers the content on the screen if it is smaller than the viewport.
   * This updates the `offset` member accordingly
   */
  center() {
    this.offset = max_p([0, 0], mul_c(sub_p(this.vdim, mul_c(this.cdim, this.state.z)), 0.5));
    this.container.style.transform = `translate(${this.offset[0]}px, ${this.offset[1]}px) scale(${this.state.z})`;
  }

  /**
   * Runs when the component is attached to the DOM.
   * Sets up our animation loop and event listenees
   */
  connectedCallback() {
    this.loop();
    this.addEventListener("wheel", this.wheel, { passive: false, capture: true });
  }

  /**
   * Performs an incremental zoom on a location (screen coordinate)
   */
  zoom = (origin: [number, number], inc: number) => {
    // Step 1: Bound the proposed delta by the min and max scale
    this.desired_state.z = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.desired_state.z + inc));

    // Step 2: Record the current scroll position.
    //          TODO: Determine if we still need this when we record on scroll event
    this.state.scroll_pos = [this.scrollLeft, this.scrollTop];

    // Step 3: Record the origin the zoom in content-local coordinates.
    //          The goal of zooming is to keep this coordinate in the same client location
    this.origin = this.coordToLocal(origin);

    // Step 4: Do the zooming? We have an animation loop running for that
  };

  /**
   * Performs an incremental zoom on a location (local coordinate in content)
   */
  wheel = (ev: WheelEvent) => {
    if (!ev.ctrlKey) return;
    ev.preventDefault();

    // Firefox scrolls by lines, chrome scrolls by pixels, there's no formal
    // definition of what a "line" is, but let's just say it's 10 px
    const multiplier = ev.deltaMode === WheelEvent.DOM_DELTA_LINE ? 10 : 1;

    // Don't let any weird inputs cause a jump of more than 50px / 5 lines
    const delta = Math.min(50, Math.max(-50, -ev.deltaY * multiplier));

    // Turn the scroll delta into a zoom delta. We use a magic scalar,
    //  but note that we zoom *more* the more zoomed in we are.
    const zoom = delta * 0.005 * this.state.z;

    // Only do smoothing if the delta is large.
    // This should correspond to using a scroll wheel as opposed to a touchpad
    this.smooth = Math.abs(delta) === 50;

    this.zoom([ev.clientX, ev.clientY], zoom);
    this.addEventListener;
  };

  #keyboard_zoom = (ev: KeyboardEvent) => {
    console.log("zoom!", ev.ctrlKey, ev.key);
    if (!ev.ctrlKey) return;
    if (ev.key === "-") {
      this.smooth = true;
      this.zoom(this.coordToLocal(add_p(this.vloc, div_c(this.vdim, 2))), -0.2 * this.state.z);
      stop_ev(ev);
    } else if (ev.key === "=") {
      this.smooth = true;
      this.zoom(this.coordToLocal(add_p(this.vloc, div_c(this.vdim, 2))), 0.2 * this.state.z);
      stop_ev(ev);
    } else if (ev.key === "0") {
      this.smooth = true;
      this.#zoom_to_fit();
    }
  };

  // Gesture-based scrolling
  // Safari records pinches as gesture events rather than wheel events
  // so we have to listen for these as well
  #gesture = {
    prev_scale: 0,
    origin: [0, 0] as [number, number],
    start: (ev: any) => {
      stop_ev(ev);
      this.#gesture.origin = this.coordToLocal([ev.clientX, ev.clientY]);
      this.#gesture.prev_scale = 1;
    },

    change: (ev: any) => {
      stop_ev(ev);
      this.zoom(
        this.#gesture.origin,
        // I'll be real I'm not entirely sure why this is the magic number
        this.state.z * (ev.scale - this.#gesture.prev_scale) * 1.5
      );
      this.#gesture.prev_scale = ev.scale;
    },
  };

  /**
   * Converts client coordinates into content coordinates, accounting for
   * the viewport's offset and scale
   */
  coordToLocal(client_coord: [number, number]): [number, number] {
    // v: The coordinate of the event within to the interior scrollable space:
    const v = add_p(sub_p(client_coord, this.vloc), this.state.scroll_pos);
    // We want to just divide by scale, but before we can do that, we have to subtract
    // any offset on the content (the result of our centering operation)
    const res = div_c(sub_p(v, this.offset), this.state.z);
    return res;
  }

  static template(): HTMLTemplateElement {
    let t = document.createElement("template");
    t.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: block;
                    overflow: auto; 
                }
                #container {
                    transform-origin: 0 0;
                    display: block;
                    width: fit-content;
                    height: fit-content;
                }
            </style>
                <div id="container">
                    <slot id="content"></slot>
                </div>
            </div>
        `;
    return t;
  }
}

const next_frame = (): Promise<DOMHighResTimeStamp> => new Promise((res) => window.requestAnimationFrame(res));

customElements.define("p-p-z", PPZ);
