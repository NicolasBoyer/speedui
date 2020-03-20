import { Component, css, customElement, html, property, TemplateResult, unsafeCSS, UTILS } from 'wapitis'
import { CSSResult } from 'wapitis/library/css'

export enum EBoxType { horizontal = 'horizontal', vertical = 'vertical', reverseHorizontal = 'reverseHorizontal', reverseVertical = 'reverseVertical', aroundFirstLeft = 'aroundFirstLeft', aroundFirstRight = 'aroundFirstRight', inline = 'inline' }

export enum EBoxPosition { start = 'start', end = 'end', center = 'center', spaceBetween = 'spaceBetween', spaceAround = 'spaceAround', spaceEvenly = 'spaceEvenly' }

@customElement('sui-box')
export class Box extends Component {
    static get styles(): CSSResult {
        return css`
        :host([sticky]) {
            position: sticky;
            top: 0;
        }
        :host([type='horizontal']),
        :host([type='vertical']),
        :host([type='reverseHorizontal']),
        :host([type='reverseVertical']) {
            display: flex;
        }

        :host([type='inline']) {
            display: inline-flex;
        }

        :host([type='aroundFirstLeft']),
        :host([type='aroundFirstRight']) {
            overflow: auto;
        }

        :host([type='aroundFirstLeft']) ::slotted(*:first-child) {
            float: left;
            margin: 0 1em 0.5em 0;
        }

        :host([type='aroundFirstRight']) ::slotted(*:first-child) {
            float: right;
            margin: 0 0 0.5em 1em;
        }

        :host([type='horizontal']) {
            flex-direction: row;
        }

        :host([type='vertical']) {
            flex-direction: column;
        }

        :host([type='reverseHorizontal']) {
            flex-direction: row-reverse;
        }

        :host([type='reverseVertical']) {
            flex-direction: column-reverse;
        }

        :host([position='start']) {
            justify-content: flex-start;
        }

        :host([position='end']) {
            justify-content: flex-end;
        }

        :host([position='center']) {
            justify-content: center;
        }

        :host([position='spaceBetween']) {
            justify-content: space-between;
            align-items: center;
        }

        :host([position='spaceAround']) {
            justify-content: space-around;
        }

        :host([position='spaceEvenly']) {
            justify-content: space-evenly;
        }
        `
    }

    @property() type?: EBoxType = EBoxType.horizontal
    @property() position?: EBoxPosition = EBoxPosition.start
    @property({ fromAttribute: (value: string) => value && typeof Number(value) === 'number' ? Number(value) : UTILS.fromString(value, Boolean) }) sticky?: boolean | number

    render(): TemplateResult {
        return html`
            <slot></slot>
        `
    }

    updated(): void {
        if (typeof this.sticky === 'number') {
            this.style.top = this.sticky + 'px'
        }
    }
    // TODO a voir si j'en crée une fonction peut etre dans component comme ça j'accède direct à changedProperties -> A voir si j'en ai besoin
    // updatePropertiesToClasses(changedProperties: PropertyValues, propertiesToUpdate: string[]) {
    //     _changedProperties.forEach((value: any, key: string) => {
    //         if (propertiesToUpdate.includes(key)) {
    //             const oldVal = value.oldVal as string
    //             const newVal = value.newVal as string
    //             if (newVal !== oldVal && newVal !== '') {
    //                 if (this.classList.contains(oldVal)) {
    //                     this.classList.replace(oldVal, newVal)
    //                 } else {
    //                     this.classList.add(newVal)
    //                 }
    //             }
    //         }
    //     })
    // }
}
