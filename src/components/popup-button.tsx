import { customElement, html, JSX, property, UTILS, TemplateResult } from 'wapitis'
import Button from './button'
import { EPopoverAnchorPosition } from '../templates/popover'
import Popup from './popup'

@customElement('sui-popup-button')
export default class PopupButton extends Button {
    @property() popupPosition?: EPopoverAnchorPosition
    @property({ type: Boolean }) allowScroll: boolean
    @property({ type: Boolean }) preventHideOnTap: boolean
    private _popupElement: JSX.Element | null

    render(): TemplateResult {
        return html`
            ${super.render()}
            <slot></slot>
        `
    }

    firstUpdated(): void {
        super.firstUpdated()
        const slot = this.shadowRoot?.querySelector('slot')
        const slotteElement = slot?.assignedNodes()[0]
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.shadowRoot!.removeChild(slot as HTMLElement)
        this.addEventListener('pointerdown', () => {
            if (!this._popupElement) {
                this._popupElement = document.body.appendChild(<Popup preventHideOnTap={this.preventHideOnTap} allowScroll={this.allowScroll} anchor={{ elementSize: this.getBoundingClientRect(), position: this.popupPosition || EPopoverAnchorPosition.bottom }}>{slotteElement}</Popup>)

                this._popupElement.addEventListener('pointerdown', (event: Event) => {
                    UTILS.dispatchEvent('hidePopup', {}, event.composedPath()[0] as HTMLElement)
                    this._popupElement = null
                })
            }
            setTimeout(() => UTILS.dispatchEvent('showPopover', {}, this._popupElement as JSX.Element))
        })
    }
}
