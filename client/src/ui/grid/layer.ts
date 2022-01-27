import { css, LitElement } from "lit";
// import type { Grid, LocalSystem } from "../grid";
// import { nearestElement } from "../util";

export abstract class Layer extends LitElement {
  //   _grid?: Grid;
  //   coordToLocal(coord: [number, number]): [number, number] {
  //     this._grid ||= nearestElement("bg-grid", this) as Grid;
  //     return this._grid.coordToLocal(coord);
  //   }

  // We use this wacky type to explain to typescript that we want
  // to allow flexible expressions of style
  static get styles(): Exclude<typeof LitElement.styles, undefined> {
    return css`
      :host {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
      }
    `;
  }
}
