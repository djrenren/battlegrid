import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Status } from "../util/net";

@customElement('network-status')
class NetworkStatus extends LitElement {
    @property()
    status?: Status;

    render() {
        let s = this.status || 'unknown';
        return html`
            <with2-tooltip text=${s}>
                <div id="light" class=${s}></div>
            </with2-tooltip>
        `;
    }

    static styles?: CSSResultGroup | undefined = css`
        #light {
            border-radius: 100%;
            height: 1em;
            width: 1em;
            background: gray;
        }

        #light.open {
            background: lime; 
        }

        #light.closed {
            background: red;
        }

        #light.opening {
            fill: yellow;
        }
        . 
    `;
}