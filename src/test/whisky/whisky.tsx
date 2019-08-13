import { Component, JSX } from "wapitis"; // Recquis

// Entrez le nom du composant (x-nameOfComponent) par défaut en paramètre de register => recquis
@Component.register()

export default class Whisky extends Component {

    // Variables publiques dont getter et setter
    // Exemple :
    // isDocked: boolean = false;
    // get width(): number {
    //     return Number(this.getAttribute("width"));
    // }
    // set width(width: number) {
    //     this.center = false;
    //     DOM.setAttribute(this, "width", String(width));
    // }

    // Variables protected
    // Exemple :
    // protected _isDragging: boolean;

    // Variables private
    // Exemple :
    // private _id: boolean;

    // Contructeur
    constructor() {
        super();
        // Variables héritées :
        // _renderElements: ensemple des éléments déclarés dans la fonction _render() => HTMLElement
        // _defaultAttributes : attributs et leurs valeurs définis par défaut sur le composant => Array<{name: string, value: any, executeAtLast?: boolean}>
        // Exemple
        // this._defaultAttributes = [
        // {name: "width", value: 800},
        // {name: "height", value: 600}
        // {name: "center", value: false, executeAtLast: true},
        // ]
    }

    // Définition des styles [string] = recquis
    _style() {
        return `
        `;
    }

    // Virtual DOM déclaré dans return [HTMLElement] = recquis
    _render() {
        return (<div>blop</div>);
    }

    // Recquis
    connectedCallback() {
        // Called every time the element is inserted into the DOM.
        // Useful for running setup code, such as fetching resources or rendering.
        // Generally, you should try to delay work until this time.
        super.connectedCallback();
    }

    disconnectedCallback() {
        // Called every time the element is removed from the DOM.
        // Useful for running clean up code (removing event listeners, etc.).
    }

    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
        // An attribute was added, removed, updated, or replaced.
        // Also called for initial values when an element is created by the parser, or upgraded.
        // Note: only attributes listed in the observedAttributes property will receive this callback.
    }

    // Public functions

    // Protected functions

    // Private functions

}
