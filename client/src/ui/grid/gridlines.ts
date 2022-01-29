import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { Layer } from "./layer";

const thickness = 0.005;

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
          background: url(${unsafeCSS(svg_grid(thickness))}) 0 0 / 0.25in 0.25in;
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
    <rect
      x = "${thickness}"
      y = "${thickness}"
      width = "${1 - thickness * 2}"
      height = "${1 - thickness * 2}"
      fill="none"
      stroke="grey"
      stroke-width = "${thickness * 2}"
      shape-rendering = "geometricPrecision" 
      />
  </svg>`)
  );
}

/*
            <path
              d="M 1 0 L ${thickness} 0 ${thickness} 1"
              fill="none"
              stroke="grey"
              stroke-width="${thickness}"
              shape-rendering="geometricPrecision"
            ></path>
            */
