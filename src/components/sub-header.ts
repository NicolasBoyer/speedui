import { Component, css, customElement, html, property, PropertyValues, TemplateResult } from 'wapitis'
import { Box } from './box'
import { CSSResult } from 'wapitis/library/css'

// TODO a finir
@customElement('sui-sub-header')
export default class SubHeader extends Box {
    static get styles(): CSSResult {
        return css`
        :host {
            /*  */
        }
        `
    }

    @property() name: string
    @property({ type: Boolean }) isVisible: boolean

    render(): TemplateResult {
        return html`
            <div class={styles.subHeader}>
                <h1 class={styles.title}>
                    <span>{props.name}</span>
                </h1>
            </div>
        `
    }
}
