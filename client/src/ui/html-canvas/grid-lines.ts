import { LitElement, PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("grid-lines")
export class GridLines extends LitElement {
    @property({type: Number})
    width: number = 0;

    @property({type: Number})
    height: number = 0;

    @property({type: Number})
    grid_size: number = 0;

    @query("#line-canvas", false)
    canvas: HTMLCanvasElement | undefined;

    render() {
        return html`
            <style>
                :host {
                    width: ${unsafeCSS((this.grid_size*this.width) + "px")};
                    height: ${unsafeCSS((this.grid_size*this.height) + "px")};
                    display: block;
                }
            </style>
            <canvas id="line-canvas" width=${this.grid_size * this.width} height=${this.grid_size * this.height}></canvas>
        `
    }

    updated(): void {
        let ctx = this.canvas?.getContext("2d");

        ctx?.clearRect(0, 0, this.grid_size*this.width, this.grid_size*this.height);
        for(let x = this.grid_size; x < this.width * this.grid_size -1; x += this.grid_size) {
            ctx?.beginPath();
            ctx?.moveTo(x, 0);
            ctx?.lineTo(x, this.height * this.grid_size);
            ctx?.stroke();
        }
        for(let y = this.grid_size; y < this.height * this.grid_size - 1; y += this.grid_size) {
            ctx?.beginPath();
            ctx?.moveTo(0, y);
            ctx?.lineTo(this.width * this.grid_size, y);
            ctx?.stroke();
        }
    }

    static styles = css`
        canvas {
            width: 100%;
            height: 100%;
        }
    `;
}