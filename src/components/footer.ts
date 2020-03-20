import { css, customElement, html, property, TemplateResult } from 'wapitis'
import { Box, EBoxPosition } from './box'

import { CSSResult } from 'wapitis/library/css'

@customElement('sui-footer')
export default class Footer extends Box {
    static get styles(): CSSResult {
        return [
            super.styles,
            css`
            :host {
                background: var(--bgColor, #f2f2f2);
                border-top: 0.0625rem solid var(--borderColor, #ddd);
                text-align: center;
                color: var(--color, #555);
                min-height: var(--height, 5em);
                font-family: var(--fontFamily, inherit);
            }

            sui-box {
                min-height: var(--height, 5em);
            }

            .createdBy,
            .credit {
                margin-top: auto;
            }

            .emphase {
                font-weight: bold;
                text-transform: uppercase;
            }
            `
        ]
    }

    @property({ attribute: false }) credit?: string
    @property({ attribute: false }) createdBy?: string

    render(): TemplateResult {
        return html`
            <slot></slot>
            ${(this.credit || this.createdBy) && html`
                <sui-box position=${EBoxPosition.spaceAround}>
                    ${this.credit && html`<div class='credit'>© <span class='emphase'>${this.credit}</span>. Tous droits réservés.</div>`}
                    ${this.createdBy && html`<div class='createdBy'>Réalisé par <span class='emphase'>${this.createdBy}</span> avec Speedui.</div>`}
                </sui-box>
            `}
        `
    }
}
