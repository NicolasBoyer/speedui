import Item from "item";
import { Component, DOM, JSX } from "wapitis";
import { NavManager } from "nav-manager";

enum Type {
    list = "list", block = "block", grid = "grid",
}

@Component.register("ui-list")

// FIXME :  Sans doute list n'est pas générique donc à supprimer mais peut etre des attribut ou des classes permettant un style particulier !!

export default class List extends Component {

    // Variables publiques dont getter et setter
    // Exemple :
    // isDocked: boolean = false;
    get items(): string {
        return this.getAttribute("items") || "[]";
    }
    set items(items: string) {
        if (this._items) {
            const newParams = JSON.parse("[" + this._getNewParams(this._items, items) + "]");
            newParams.forEach((params: any) => this.add(params));
        }
        this._items = items;
        DOM.setAttribute(this, "items", items);
    }
    get type(): Type {
        return (this.getAttribute("type") || "") as Type;
    }
    set type(type: Type) {
        DOM.setAttribute(this, "type", type);
    }

    // Variables protected
    // Exemple :
    // protected _isDragging: boolean;

    // Variables private
    // Exemple :
    // private _itemsData: any;
    private _items: string;

    // Contructeur
    constructor() {
        super();
        // this._items = this.items.split(",").map((item) => {
        //     console.log(item)
        //     return (
        //         <div>blip</div>
        //     );
        // });
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
        // TODO : Decription à supprimer et à passer dans item
        return `
        .description {
            font-style: italic;
            font-size: 0.8em;
            color: #555;
        }
        ui-item {
            font-size: 1.5em;
        }
        `;
    }

    // Virtual DOM déclaré dans return [HTMLElement] = recquis
    // TODO : Il ne faut pa créer les items ici il faut créer en fonction de l'exemple donné dans l'élément
    _render() {
        // this._itemsData = JSON.parse(this.items);
        const items: JSX.Element[] = JSON.parse(this.items).map(this._addItem);
        // TODO : A remplacer par fragment
        return (
            <div>
                {items}
                <slot></slot>
            </div>
        );
    }

    // TODO : penser à ajouter un lifecucle sur le component dans dom !
    // Recquis
    connectedCallback() {
        // Called every time the element is inserted into the DOM.
        // Useful for running setup code, such as fetching resources or rendering.
        // Generally, you should try to delay work until this time.
        super.connectedCallback();
        if (this.type === Type.list) {
            this.classList.add("list");
        }
        // TODO : à remettre et écrire son propre getattribute qui peut prendre en compte un array
        this.removeAttribute("items");
        DOM.dispatchEvent("listCreated", this);
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
    // A supprimer
    add(params: any) {
        // this._itemsData.push(params);
        // TODO : A externaliser pour mutualiser firebase et storage
        // localStorage.setItem("items", JSON.stringify(this._itemsData));
        return this._renderElements.appendChild(this._addItem(params));
    }

    protected _getNewParams(smallerString: string, biggerString: string) {
        let i = 0;
        let j = 0;
        let result = "";

        while (j < biggerString.length) {
            if (smallerString[i] !== biggerString[j] || i === smallerString.length) {
                result += biggerString[j];
            } else {
                i++;
            }
            j++;
        }
        return result.substring(1);
    }

    // TODO : Supprimer la création ici et remplacer par un exemple
    protected _addItem(params: any) {
        const desc = params.desc ? <div class="description">{params.desc}</div> : "" ;
        return (
            <Item class="button" label={params.name} onclick={() => {
                // routerLink="/detail/{{hero.id}}" => Un button ou un attr spécifique à créer pour passer ça et ensuite à traiter pour recréer le push en fonction de ce qu'il y a dans la route
                NavManager.push("page", {id: params.name});
            }}>
                {desc}
            </Item>
        );
    }

    // Private functions

}
