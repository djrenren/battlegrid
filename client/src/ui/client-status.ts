import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Status } from "../util/net";
import "./util/with-tooltip";

@customElement("client-status")
class ClientStatus extends LitElement {
  @property()
  status: Status = "opening";

  render() {
    return html`
      <!-- Rectangular switch -->
      <span class="slider round ${this.status}"> ${human(this.status)} </span>
    `;
  }

  toggle = (ev: InputEvent) => {
    ev.preventDefault();

    if ((ev.target as HTMLInputElement).checked) {
      this.dispatchEvent(new CustomEvent("enable"));
    } else {
      this.dispatchEvent(new CustomEvent("disable"));
    }

    return false;
  };

  static styles = css`
    .slider {
      height: 1em;
      transition: 0.4s;
      padding: 0.2em;
      min-width: 5em;
      cursor: pointer;
      color: white;
      font-size: 0.8em;
      align-items: baseline;
    }

    .open {
      background: #2196f3;
    }

    .opening {
      background: #fdcb18;
    }

    .round {
      border-radius: 1em;
    }
  `;
}

function human(s: Status | "local") {
  switch (s) {
    case "open":
      return "Connected";
    case "closed":
      return "Disconnected";
    case "opening":
      return "Connecting";
  }
}
