import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { Token } from "./token";

@customElement("bg-canvas")
export class Canvas extends LitElement {
  @property({ type: Number })
  width = 5;

  @property({ type: Number })
  height = 6;

  tokens: TokenData[] = [
    {
      x: 2,
      y: 2,
      height: 1,
      width: 1,
      res: "test",
      id: "1",
    },
  ];

  constructor() {
    super();
    this.addEventListener("click", this.#unfocus);
  }

  render() {
    return html`
      <style>
        :host {
          width: ${this.width}in;
          height: ${this.height}in;
        }
      </style>
      ${repeat(
        this.tokens,
        (t) => t.id,
        (t, index) => html`
          <bg-token
            class=${"token" + (this.selection === t.id ? " selected" : "")}
            @click=${this.#focus}
            id=${t.id}
            style=${styleMap({
              top: em(t.y),
              left: em(t.x),
              width: em(t.width),
              height: em(t.height),
            })}
            res=${t.res}
          />
        `
      )}
    `;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    const root = super.createRenderRoot();
    return root;
  }

  @state()
  selection?: string;

  #focus = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log("focus");
    this.selection = (ev.target! as Token).id;
  };
  #unfocus = () => {
    this.selection = undefined;
  };

  static styles = css`
    :host {
      font-size: 1in;
      position: relative;
      background: white;
      display: inline-block;
    }

    .token {
      position: absolute;
    }

    .selected {
      border: 3px solid blue;
    }
  `;
}

const em = (n: number) => n + "em";
type TokenData = {
  x: number;
  y: number;
  width: number;
  height: number;
  res: string;
  id: string;
};
