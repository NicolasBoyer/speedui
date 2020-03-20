import { Component, css, customElement, html, property, TemplateResult } from 'wapitis'
import icons from '../www/assets/img/icons.svg'
import { CSSResult } from 'wapitis/library/css'

@customElement('sui-icon')
export default class Icon extends Component {
    static get styles(): CSSResult {
        return css`
        svg {
            stroke-width: 0;
            overflow: hidden;
            width: inherit;
            height: inherit;
        }
        `
    }

    @property() name: string

    render(): TemplateResult {
        const name = icons + '#icon-' + this.name
        return html`
            <svg class=${this.name} aria-hidden='true'>
                <use href=${name}></use>
                <slot></slot>
            </svg>
        `
    }
}
