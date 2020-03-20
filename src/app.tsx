import { Component, css, customElement, html, JSX, property, PropertyValues, TemplateResult } from 'wapitis'
import './components/footer'
import './components/header'
import './www/styles/main.css'
// import './components/button'
import Button, { EVariant, ESize } from './components/button'
import { CSSResult } from 'wapitis/library/css'
import './components/popup-button'

// Log.showLog = false

// TODO A customiser avec des variables à voir selon les besoins futurs -> restons simple pour le moment
// TODO ajout propriété layout pour changer la structure du site
// TODO IMPORTANT peut etre faire dériver la plupart des block de box
// TODO besoin des events ?
// TODO système de layout + un fichier de vbariable permettant un stylage simple et + compliqué !!
@customElement('sui-app')
export default class App extends Component {
    // TODO sans doute à passer en variable css ou en attribut
    static get styles(): CSSResult {
        return css`
        :host {
            background: #fff;
            display: flex;
            min-height: 100vh;
            flex-direction: column;
        }

        main {
            flex-grow: 1;
            padding-top: 3.5rem;
        }

        sui-header {
            --bgColor: #2b7a77;
            --height: 3.5rem;
        }

        sui-footer {
            --height: 10rem;
        }

        sui-button {
            /* --bgHoverColor: rgba(33, 150, 243, 0.08);
            --bgColor: transparent;
            --color: #2b7a77;
            --borderFocus: #168f8b;
            --outlinedBorder: rgba(25, 70, 68, 0.5)*/
            /* --fontFamily: cursive */
        }
        `
    }

    render(): TemplateResult {
        return html`
            <sui-header position='center'>
                <!-- <button @click=${() => (this.shadowRoot!.querySelector('sui-button') as Button).variant = EVariant.contained}>testu</button> -->
                <sui-button tooltip='le texte' iconName='user' label='test' iconPosition='beforeLabel' @pointerdown=${() => console.log('blip')}></sui-button>
            </sui-header>

            <main>main<sui-popup-button tooltip='Autre texte' label='test'><div>blirpi</div></sui-popup-button>
            </main>
            <sui-footer type='vertical' createdBy='Nicolas Boyer' credit='Wapitis'></sui-footer>
            <!-- <sui-popup></sui-popup> -->
        `
    }
}

document.body.appendChild(<App></App>)
