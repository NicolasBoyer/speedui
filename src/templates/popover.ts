import { Component, css, customElement, property } from 'wapitis'
import { CSSResult } from 'wapitis/library/css'

export enum EPopoverAnchorPosition { top = 'top', left = 'left', bottom = 'bottom', right = 'right' }

interface IAnchorPosition { elementSize: DOMRect, position: EPopoverAnchorPosition }

interface IAbsolutePosition { top: number, left: number }

@customElement('sui-popover')
export default class Popover extends Component {
    static get styles(): CSSResult {
        return css`
        :host {
            z-index: 1300;
            position: fixed;
            visibility: hidden;
            opacity: 0;
            font-family: var(--fontFamily, Arial, Helvetica, sans-serif);
        }

        :host(.animate) {
            transition: visibility 0s linear var(--displaySpeed, ${this._displaySpeed}ms), opacity var(--displaySpeed, ${this._displaySpeed}ms) cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }

        :host([open]) {
            opacity: 1;
            visibility: visible;
        }

        :host([open].animate) {
            transition: visibility 0s linear 0s, opacity var(--displaySpeed, ${this._displaySpeed}ms) cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        `
    }

    protected static _displaySpeed = 300
    protected _container: HTMLElement = this

    @property({ attribute: false }) anchor: IAnchorPosition | IAbsolutePosition
    @property({ type: Boolean }) open?: boolean
    @property() role?: string

    firstUpdated(): void {
        this.tabIndex = -1
        this.addEventListener('showPopover', ((event: CustomEvent) => {
            this.classList.add('animate')
            this.open = true
            if (event.detail.children) {
                if (typeof event.detail.children === 'string') {
                    this.textContent = event.detail.children
                } else {
                    this.replaceChild(event.detail.children, this.firstChild as ChildNode)
                }
            }
            if (event.detail.anchor) {
                this.anchor = event.detail.anchor
            }
        }) as EventListener)
        this.addEventListener('hidePopover', () => {
            this.open = false
            setTimeout(() => this.parentElement?.removeChild(this), (this.constructor as typeof Popover)._displaySpeed)
        })
    }

    updated(): void {
        if (this.anchor) {
            let top = 0
            let left = 0
            if ('top' in this.anchor) {
                top = this.anchor.top
                left = this.anchor.left
            } else {
                const anchorSize = this.anchor.elementSize
                const tooltipSize = this._container.getBoundingClientRect()
                switch (this.anchor.position) {
                    case EPopoverAnchorPosition.top:
                        left = anchorSize.left + anchorSize.width / 2 - tooltipSize.width / 2
                        top = anchorSize.top - tooltipSize.height
                        break
                    case EPopoverAnchorPosition.right:
                        left = anchorSize.left + anchorSize.width
                        top = anchorSize.top + anchorSize.height / 2 - tooltipSize.height / 2
                        break
                    case EPopoverAnchorPosition.left:
                        left = anchorSize.left - tooltipSize.width
                        top = anchorSize.top + anchorSize.height / 2 - tooltipSize.height / 2
                        break
                    default:
                        left = anchorSize.left + anchorSize.width / 2 - tooltipSize.width / 2
                        top = anchorSize.top + anchorSize.height
                        break
                }
            }
            this._container.style.top = top + 'px'
            this._container.style.left = left + 'px'
        }
    }
}
