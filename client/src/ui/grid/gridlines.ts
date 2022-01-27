import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { Layer } from "./layer";

const thickness = 0.01;

// Lines implements the visual gridlines
@customElement("bg-lines")
export class Lines extends Layer {
  render() {
    return html``;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          float: left;
          background: url(${unsafeCSS(svg_grid(thickness))});
          background-size: 1em 1em;
          background-position: ${-thickness / 2}em ${-thickness / 2}em;
          background-repeat: repeat;
          pointer-events: none;
        }
      `,
    ];
  }
}

function svg_grid(thickness: number): string {
  return (
    "data:image/svg+xml;base64," +
    btoa(`<!DOCTYPE svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
            <path
              d="M 1 0 L 0 0 0 1"
              fill="none"
              stroke="grey"
              stroke-width="${thickness * 2}"
            ></path>
  </svg>`)
  );
}
