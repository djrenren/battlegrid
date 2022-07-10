import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("with2-tooltip")
class WithTooltip extends LitElement {
    @property()
    text = "";

    render() {
        console.log("Rendering")
        return html`
            <slot></slot>
            <div id="message">
                ${this.text}
            </div>
        `;
    }

    static styles?: CSSResultGroup | undefined = css`
        :host {
            display: inline-block;
            position: relative;
            width: fit-content;
            height: fit-content;
        }
        
        div {
            display: none;
            opacity: 0;
            position: absolute;
            bottom: -30px;
            left: 0;
            background: black;
            color: white;
            border-radius: 3px;
            padding: 0.25em 0.5em;
        }

        @keyframes appear {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }

        :host(:hover) div {
            display: inline-block;
            animation: appear 250ms linear forwards 750ms ;
        }
    `;
}