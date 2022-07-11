import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Status } from "../util/net";
import "./util/with-tooltip";

@customElement("host-toggle")
class HostToggle extends LitElement {
  @property()
  status: Status | "local" = "local";

  render() {
    return html`
      <!-- Rectangular switch -->
      <label class="switch">
        <with-tooltip text=${human(this.status)}>
          <input type="checkbox" @input=${this.toggle} ?checked=${this.status !== "local"} />
          <span class="slider round ${this.status}">
            <span class="on-space">Hosting</span>
            <span class="dot"></span>
            <span class="off-space">Offline</span>
          </span>
        </with-tooltip>
      </label>
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
      display: inline-flex;
      flex-wrap: nowrap;
      height: 1em;
      transition: 0.4s;
      padding: 0.2em;
      min-width: 4.5em;
      cursor: pointer;
      background: #ccc;
    }

    .open {
      background: #2196f3;
    }

    .opening {
      background: #fdcb18;
    }

    .opening > .on-space {
      color: black;
    }

    input {
      display: none;
    }

    input:checked + .slider {
    }

    input:checked + .slider > .on-space {
      flex-grow: 1;
      opacity: 1;
    }

    input:checked + .slider > .off-space {
      flex-grow: 0 !important;
      opacity: 0;
    }

    .off-space {
      opacity: 1;
      flex-grow: 1 !important;
    }

    .on-space {
      opacity: 0;
      color: white;
      width: 0;
    }

    .on-space,
    .off-space {
      font-size: 0.8em;
    }

    .slider > span {
      flex-grow: 0;
      flex-basis: 0;
      transition: 0.4s;
      overflow: hidden;
      text-align: center;
    }

    .round {
      border-radius: 1em;
    }
    .dot {
      border-radius: 1em;
      min-width: 1em;
      height: 1em;
      background: white;
    }
  `;
}

function human(s: Status | "local") {
  switch (s) {
    case "open":
      return "Joinable";
    case "closed":
      return "Offline";
    case "opening":
      return "Not Joinable";
    case "local":
      return "Start hosting";
  }
}
