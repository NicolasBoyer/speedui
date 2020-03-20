import { css, customElement, html, property, PropertyValues, TemplateResult } from 'wapitis'
import { WEBSITE } from '..//helpers/config'
import { Box, EBoxPosition, EBoxType } from './box'

import { CSSResult } from 'wapitis/library/css'

// TODO a finir
@customElement('sui-header')
export default class Header extends Box {
    static get styles(): CSSResult {
        return [
            super.styles,
            css`
            :host {
                background: var(--bgColor, #AAA);
                height: var(--heigth, 3.5rem);
                width: 100%;
                box-shadow: 0 0 0.3125rem var(--shadowColor, rgba(0, 0, 0, .5));
                position: fixed;
                left: 0;
                top: 0;
                padding: 0;
                z-index: 500;
                font-family: var(--fontFamily, inherit);
                /* transition: all .25s ease;
                transform: translateZ(0); */
            }

            sui-box {
                position: relative;
                width: var(--contentWidth, 37.5rem);
            }

            /* :host.isBack sui-box {
                justify-content: space-between;
                width: 50rem;
            }

            :host nsui-boxav a,
            :host sui-box button {
                font-family: 'HeaderFont', Arial, Helvetica, sans-serif;
                display: inline-flex;
                position: relative;
                height: var(--heigth, 3.5rem);
                line-height: var(--heigth, 3.5rem);
                padding: 0 0.9375rem;
                min-width: 3.125rem;
                border: none;
                text-align: center;
                background-color: hsla(0, 0%, 100%, 0);
                text-decoration: none;
                font-size: 0.625rem;
                color: #eee;
                cursor: pointer;
                align-items: center;
                border-radius: 0;
            }

            :host sui-box a:hover,
            :host sui-box button:hover {
                background-color: hsla(0, 0%, 100%, .3);
            }

            .log svg {
                width: 1.5rem !important;
                height: 1.5rem !important;
                margin-right: 0.8rem;
            } */
            `
        ]
    }

    render(): TemplateResult {
        return html`
            <sui-box type=${EBoxType.horizontal}>
                ${location.href !== WEBSITE.homeUrl ? html`<div>test</div>` : ''}
                <slot></slot>
            </sui-box>
        `
    }
}
