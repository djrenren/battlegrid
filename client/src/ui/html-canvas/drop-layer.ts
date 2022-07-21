import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { stop_ev, window_ev } from "../../util/events";
import { getImage } from "../../util/files";
import { Point, snap_c } from "../../util/math";
import { Grid } from "../html-canvas";
import { DragAndDropMixin } from "../util/drag-and-drop-mixin";

@customElement("drop-layer")
export class DropLayer extends DragAndDropMixin(LitElement) {
  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("drop", this.#new_token_drop);
  }

  render() {
    let loc = this.drag_location ? this.grid.snap(this.drag_location) : undefined;
    return html`
      <div
        id="drop-hint"
        style=${styleMap({
          visibility: loc === undefined ? "hidden" : "visible",
          transform: loc ? `translate(${loc[0]}px, ${loc[1]}px)` : "",
        })}
      ></div>
    `;
  }

  #new_token_drop = async (ev: DragEvent) => {
    stop_ev(ev);
    try {
      const img = await getImage(ev);
      console.log("Emitting drop");
      // TODO EMIT DROPPED TOKEN
      let x = this.dispatchEvent(
        window_ev("token-drop", {
          loc: this.grid.snap([ev.offsetX, ev.offsetY]),
          dim: [this.grid.dim, this.grid.dim],
          img,
        })
      );
      console.log("DISPATCH?", x);
    } catch (e) {
      console.error(e);
    }
  };

  // @ts-ignore
  grid: Grid;

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      position: relative;
    }

    #drop-hint {
      width: 1em;
      height: 1em;
      background: grey;
      position: absolute;
    }
  `;
}
