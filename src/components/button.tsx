import { Component, css, customElement, html, JSX, property, TemplateResult, UTILS } from 'wapitis'
import './icon'
import { CSSResult } from 'wapitis/library/css'
import Tooltip from './tooltip'
import { EPopoverAnchorPosition } from '../templates/popover'

export enum EIconPosition { beforeLabel = 'beforeLabel', afterLabel = 'afterLabel' }

export enum EVariant { fab = 'fab', outlined = 'outlined', contained = 'contained', rounded = 'rounded' }

export enum ESize { small = 'small', large = 'large' }

@customElement('sui-button')
export default class Button extends Component {
    static get styles(): CSSResult {
        return css`
        :host {
            position: relative;
            transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            text-decoration: none;
            overflow: hidden;
        }

        :host(.textButton) {
            font-family: var(--fontFamily, Button, sans-serif);
            letter-spacing: 0.02857rem;
            text-transform: uppercase;
            font-weight: 500;
            line-height: 1.5;
            font-size: 0.8125rem;
        }

        :host(.textButton),
        :host(.iconButton) {
            color: var(--color, rgba(0, 0, 0, 0.87));
            background-color: var(--bgColor, transparent);
            box-sizing: border-box;
            transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            border-radius: 0.25rem;
            padding: 0.4375rem 0.5rem;
            min-height: 2rem;
            min-width: 4rem;
            cursor: pointer;
            display: inline-flex;
            outline: none;
            vertical-align: middle;
            justify-content: center;
            align-items: center;
            user-select: none;
        }

        :host(.textButton:hover),
        :host(.iconButton:hover) {
            background-color: var(--bgHoverColor, rgba(0, 0, 0, 0.04));
        }

        :host(.textButton:focus):before,
        :host(.iconButton:focus):before {
            content: "";
            border: 0.0625rem dashed var(--borderFocus, #bdbdbd);
            width: 97%;
            height: 92%;
            position: absolute;
            border-radius: inherit;
            opacity: 0.3;
        }

        /* ICON */
        :host(.textButton) sui-icon,
        :host(.iconButton) sui-icon {
            width: var(--iconSize, 1.2rem);
            height: var(--iconSize, 1.2rem);
            stroke: currentColor;
            fill: currentColor;
        }

        :host(.textButton.small) sui-icon,
        :host(.iconButton.small) sui-icon {
            width: var(--iconSmallSize, 0.9rem);
            height: var(--iconSmallSize, 0.9rem);
        }

        :host(.iconButton) sui-icon.beforeLabel {
            margin-right: 0.5rem
        }

        :host(.iconButton) sui-icon.afterLabel {
            margin-left: 0.5rem
        }
        /* ICON */

        /* VARIANT */
        :host([variant='fab']) {
            box-shadow: 0 0.1875rem 0.3125rem -0.0625rem rgba(0, 0, 0, 0.2), 0 0.375rem 0.625rem 0 rgba(0, 0, 0, 0.14), 0 0.0625rem 10.5rem 0 rgba(0, 0, 0, 0.12);
        }

        :host([variant='rounded']),
        :host([variant='fab']) {
            width: 3.5rem;
            height: 3.5rem;
            padding: 0;
            min-width: 0;
            border-radius: 50%;
            margin: 0;
        }

        :host([variant='outlined']) {
            border: 0.0625rem solid var(--outlinedBorder, rgba(170, 170, 170, 0.5));
        }

        :host([variant='contained']) {
            box-shadow: 0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.2), 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.14), 0 0.1875rem 0.0625rem -0.125rem rgba(0, 0, 0, 0.12);
            padding: 0.5rem 1rem;
            min-width: 4rem;
            min-height: 2.25rem;
        }

        :host([variant='fab']:focus):before,
        :host([variant='contained']:focus):before {
            opacity: 0.7;
        }

        :host([variant='outlined']:focus):before {
            border: none;
        }

        :host([variant='outlined']:focus) {
            opacity: 0.7;
            border: 0.0625rem dashed var(--borderFocus, #bdbdbd);
        }

        :host([variant='outlined'].hideFocus:focus) {
            opacity: 1;
            border: 0.0625rem solid var(--outlinedBorder, rgba(170, 170, 170, 0.5));
        }
        /* VARIANT */

        /* SIZE */
        :host([size='small']) {
            padding: 3px 9px;
            min-height: 1.5rem;
            min-width: 2rem;
            font-size: 80%;
        }

        :host([size='large']) {
            padding: 7px 21px;
            min-height: 3rem;
            min-width: 5rem;
            font-size: 110%;
        }
        /* SIZE */

        :host(.hideFocus:focus):before {
            opacity: 0;
        }

        /* DISABLED */
        :host([disabled]) {
            color: silver;
            font-style: italic;
            cursor: default;
            opacity: 0.5;
        }

        :host([disabled]:hover) {
            background: none;
        }

        :host([disabled]:focus):before {
            border-color: transparent;
        }
        /* DISABLED */

        /* RIPPLE */
        .ink {
            display: block;
            position: absolute;
            background: var(--rippleColor, #0000001f);
            border-radius: 100%;
            transform: scale(0);
        }

        .ink.animate {
            animation: ripple 0.65s linear;
        }

        @keyframes ripple {
            100% {
                opacity: 0;
                transform: scale(2.5);
            }
        }
        /* RIPPLE */
        `
    }

    @property({ attribute: false }) label: string
    @property({ attribute: false }) iconName?: string
    @property({ attribute: false }) isRipple?: boolean = true
    @property({ attribute: false }) iconPosition?: EIconPosition
    @property({ type: String }) size?: ESize
    @property({ type: String }) variant?: EVariant
    @property({ type: Boolean }) disabled?: boolean
    @property({ attribute: false }) tooltip?: string
    @property({ attribute: false }) tooltipPosition?: EPopoverAnchorPosition
    _icon: TemplateResult | ''
    private _tooltipElement: JSX.Element | null

    render(): TemplateResult {
        this._icon = this.iconName ? html`<sui-icon class=${this.iconPosition || ''} name=${this.iconName} />` : ''
        return html`
            ${(this.iconName && !this.iconPosition || this.iconName && this.iconPosition && this.iconPosition === EIconPosition.beforeLabel) ? this._icon : ''}
            ${(!this.iconName || this.iconName && this.iconPosition) && html`<span class='label'>${this.label}</span>`}
            ${(this.iconName && this.iconPosition && this.iconPosition === EIconPosition.afterLabel && this.label) ? this._icon : ''}
            ${this.isRipple && html`<span class='ink'></span>`}
        `
    }

    firstUpdated(): void {
        this.tabIndex = 0
        this.className = (!this._icon ? 'textButton' : this.iconPosition ? 'textButton iconButton' : 'iconButton') + (this.className && ' ' + this.className)
        this.addEventListener('pointerdown', this._handlePoint)
        this.addEventListener('blur', this._onBlur)
        if (this.tooltip) {
            this.addEventListener('pointerenter', () => {
                if (!this._tooltipElement) {
                    this._tooltipElement = document.body.appendChild(<Tooltip anchor={{ elementSize: this.getBoundingClientRect(), position: this.tooltipPosition || EPopoverAnchorPosition.bottom }}>{this.tooltip}</Tooltip>)
                }
                setTimeout(() => UTILS.dispatchEvent('showPopover', {}, this._tooltipElement as JSX.Element))
            })
            this.addEventListener('pointerleave', () => {
                UTILS.dispatchEvent('hidePopover', {}, this._tooltipElement as JSX.Element)
                this._tooltipElement = null
            })
        }
    }

    protected _handlePoint = (event: PointerEvent): void => {
        if (!this.disabled) {
            (event.currentTarget as HTMLButtonElement).classList.add('hideFocus')
        }
        this._ripple(event)
    }

    protected _onBlur = (event: Event): void => (event.currentTarget as HTMLButtonElement).classList.remove('hideFocus')

    protected _ripple = (event: PointerEvent): void => {
        const ink = this.shadowRoot?.querySelector('span.ink') as HTMLSpanElement
        ink.classList.remove('animate')
        if (!ink.offsetHeight && !ink.offsetWidth) {
            const dims = Math.max(this.offsetHeight, this.offsetWidth)
            ink.style.height = `${dims}px`
            ink.style.width = `${dims}px`
        }
        const rect = this.getBoundingClientRect()
        const offset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
        const x = event.pageX - offset.left - ink.offsetWidth / 2
        const y = event.pageY - offset.top - ink.offsetHeight / 2
        ink.style.top = `${y}px`
        ink.style.left = `${x}px`
        ink.classList.add('animate')
    }
}
