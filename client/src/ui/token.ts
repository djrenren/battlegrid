import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { subscribe } from "../fs/store";

@customElement("bg-token")
export class Token extends LitElement {
  @property({ type: String })
  res?: string;

  @state()
  _url?: string;

  constructor() {
    super();
    console.log(this.res);
  }

  protected willUpdate(
    _changedProperties: Map<string | number | symbol, unknown>
  ): void {
    if (this.res) {
      subscribe(this.res, (url) => {
        console.log("NEW URL: ", url);
        this._url = url;
      });
    }

    let old = _changedProperties.get("res") as string | undefined;
    if (old) {
    }
  }

  render() {
    return html`
      <style>
        :host {
          background: url("${this._url}");
          overflow: hidden;
        }
      </style>
    `;
  }
}
