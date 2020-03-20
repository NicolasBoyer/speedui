import { css, customElement, TemplateResult, html } from 'wapitis'
import { CSSResult } from 'wapitis/library/css'
import Popover from '../templates/popover'

@customElement('sui-tooltip')
export default class Tooltip extends Popover {
    static get styles(): CSSResult {
        return [
            super.styles,
            css`
            :host {
                outline: none;
                position: absolute;
                border-radius: var(--borderRadius, 0.25rem);
                background: var(--bgColor, rgba(97, 97, 97, .9));
                color: var(--color, #fff);
                max-width: 15.625rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.625rem;
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;
            }
            `
        ]
    }

    render(): TemplateResult {
        return html`
            <slot></slot>
        `
    }

    firstUpdated(): void {
        super.firstUpdated()
        this.role = 'tooltip'
    }
}
