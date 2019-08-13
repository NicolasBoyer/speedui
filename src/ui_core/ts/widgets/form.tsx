import { Component, DOM, JSX } from "wapitis"; // Recquis

export interface IInput {
    name: string;
    type: string;
    label?: string;
}

// Entrez le nom du composant (x-nameOfComponent) par défaut en paramètre de register => recquis
@Component.register("ui-form")

export class Form extends Component {

    // Variables publiques dont getter et setter
    // Exemple :
    // isDocked: boolean = false;
    submit: void;

    get inputs(): IInput[] {
        return JSON.parse(String(this.getAttribute("inputs"))) || [];
    }
    set inputs(inputs: IInput[]) {
        DOM.setAttribute(this, "inputs", inputs);
    }

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
        return (
            <form onsubmit={this.submit} autocomplete="off">
                {this.inputs.map(this._addInput)}
                <button type="submit">Ajouter</button>
            </form>
        );
    }

    // Recquis
    connectedCallback() {
        // Called every time the element is inserted into the DOM.
        // Useful for running setup code, such as fetching resources or rendering.
        // Generally, you should try to delay work until this time.
        super.connectedCallback();
        this.removeAttribute("inputs");
    }

    disconnectedCallback() {
        // Called every time the element is removed from the DOM.
        // Useful for running clean up code (removing event listeners, etc.).
    }

    // attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
    //     // An attribute was added, removed, updated, or replaced.
    //     // Also called for initial values when an element is created by the parser, or upgraded.
    //     // Note: only attributes listed in the observedAttributes property will receive this callback.
    // }

    // Public functions
    getValues() {
        const values: any = {};
        const elements = (this._renderElements as HTMLFormElement).elements;
        for (const element of elements) {
            const entry = element as HTMLFormElement;
            if (entry.value) {
                values[entry.name] = entry.value;
            }
        }
        return values;
    }

    // Protected functions
    _addInput(params: IInput) {
        const label = params.label ? <label for="name">{params.label} : </label> : "";
        const entry = params.type === "area" ? <textarea name={params.name} id={params.name} /> : <input name={params.name} id={params.name} type={params.type} />;
        return (
            <div class={params.name}>
                {label}
                {entry}
            </div>
        );
    }

    // Private functions

}
