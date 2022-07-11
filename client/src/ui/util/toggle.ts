import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("bg-toggle")
class Toggle extends LitElement {
  render() {
    return html`
      <!-- Rectangular switch -->
      <label class="switch">
        <input type="checkbox" />
        <span class="slider round">
          <span class="on-text">Hosting</span>
          <span class="off-text">Offline</span>
        </span>
        <div class="dot-wrapper"><div class="dot"></div></div>
      </label>
    `;
  }

  static styles?: CSSResultGroup | undefined = css`
    /* The switch - the box around the slider */
    .switch {
      cursor: pointer;
      position: relative;
      display: inline-block;
      height: 1em;
      width: 4.5em;
      padding: 0.1em;
    }

    /* Hide default HTML checkbox */
    .switch input {
      display: none;
    }

    /* The slider */
    .slider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #ccc;
      transition: 0.4s;
    }

    .slider > span {
      position: absolute;
      font-size: 0.8em;
      top: 0.1em;
    }

    input:checked + .slider > .on-text {
      opacity: 1;
    }

    input:checked + .slider > .off-text {
      opacity: 0;
    }

    input + .slider > .off-text {
      position: absolute;
      right: 0.8em;
      opacity: 1;
    }

    input + .slider > .on-text {
      opacity: 0;
      left: 0.5em;
      color: white;
    }

    .dot-wrapper {
      position: absolute;
      left: 0.1em;
      top: 0.1em;
      right: 0.1em;
      bottom: 0.1em;
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: #2196f3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider + .dot-wrapper {
      transform: translateX(calc(100% - 1.2em));
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .dot {
      position: absolute;
      background-color: white;
      height: 1em;
      aspect-ratio: 1/1;
      border-radius: 50%;
    }
  `;
}
