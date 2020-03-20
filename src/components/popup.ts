import { css, customElement, html, property, TemplateResult, UTILS } from 'wapitis'
import { CSSResult } from 'wapitis/library/css'
import Popover from '../templates/popover'

@customElement('sui-popup')
export default class Popup extends Popover {
    static get styles(): CSSResult {
        return [
            super.styles,
            css`
            :host {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            .background {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                position: fixed;
                touch-action: none;
                background-color: var(--bgColorBackground, transparent);;
                -webkit-tap-highlight-color: transparent;
            }

            .container {
                outline: none;
                position: absolute;
                border-radius: var(--borderRadius, 0.25rem);
                box-shadow: var(--boxShadow, 0 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2), 0 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14), 0 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12));
                background-color: var(--bgColorContainer, #fff);
                max-width: calc(100% - 2rem);
                min-height: 1rem;
                max-height: calc(100% - 2rem);
                min-width: 1rem;
                padding: 1rem;
                overflow-y: auto;
                overflow-x: hidden;
            }
            `
        ]
    }

    @property({ attribute: false }) preventHideOnTap = false
    @property({ attribute: false }) allowScroll = false

    shouldUpdate(): boolean {
        if (this.allowScroll) {
            (document.querySelector('html') as HTMLElement).classList.toggle('scrollLock', this.open)
        }
        return true
    }

    render(): TemplateResult {
        return html`
            <div class='background' aria-hidden='true'></div>
            <div class='container' role='document' tabIndex=${-1}>
                <slot></slot>
            </div>
        `
    }

    firstUpdated(): void {
        super.firstUpdated()
        this._container = this.shadowRoot?.querySelector('.container') as HTMLElement
        this.role = 'presentation'
        const background = this.shadowRoot?.querySelector('.background') as HTMLElement
        background.addEventListener('hidePopup', this._hidePopup)
    }

    protected _hidePopup = (): void | false => !this.preventHideOnTap && UTILS.dispatchEvent('hidePopover', {}, this)
}
