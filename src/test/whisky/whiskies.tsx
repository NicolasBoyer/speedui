import { EVENTS } from 'events-manager'
import { Form, IInput } from 'form'
import { Fragment } from 'fragment'
import { Component, DOM, JSX } from 'wapitis'
import Whisky from 'whisky'

export interface IWhiskies {
    name: string
    image: string
    description: string
    stars: number
}

// Entrez le nom du composant (x-nameOfComponent) par défaut en paramètre de register => recquis
@Component.register('t-whiskies')

export class Whiskies extends Component {

    get items(): IWhiskies[] {
        return JSON.parse(String(this.getAttribute('items'))) || []
    }
    set items(items: IWhiskies[]) {
        // if (this._items) {
        //     const newParams = JSON.parse("[" + this._getNewParams(this._items, items) + "]");
        //     newParams.forEach((params: any) => this.add(params));
        // }
        // this._items = items;
        DOM.setAttribute(this, 'items', items)
    }

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
    protected _inputs: IInput[] = [
        {
            label: 'Nom',
            name: 'name',
            type: 'text',
        },
        {
            label: 'Description',
            name: 'description',
            type: 'area',
        },
    ]

    // Variables private
    // Exemple :
    // private _id: boolean;

    static get observedAttributes() {
        return ['items']
    }

    // Contructeur
    constructor() {
        super()
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
        `
    }

    // Virtual DOM déclaré dans return [HTMLElement] = recquis
    _render() {
        console.log(this.items)
        const items: JSX.Element[] = this.items.map((item, index) => {
            return (
                <Whisky key={index} name={item.name} image={item.image} desciption={item.description} />
            )
        })
        // TODO : A remplacer par fragment => En cours dessus
        return (
            <Fragment>
                {/* Passer une fonction submit sur edit whisky la fonction est envoyé à partir d'ici et récupérer sur edithisky via un attribut -> possible d'avoir un form qui récupère les attrbuts pour créer les input puis submit */}
                <button>Ajouter un Whisky</button>
                <div class='whiskies'>
                    {items}
                </div>
            </Fragment>
        )
    }

    // Recquis
    connectedCallback() {
        // Called every time the element is inserted into the DOM.
        // Useful for running setup code, such as fetching resources or rendering.
        // Generally, you should try to delay work until this time.
        super.connectedCallback()
        // this.removeAttribute("items");
        const items = this.items
        EVENTS.PointerListener.add(EVENTS.PointerType.tap, (tapEvent) => {
            if (tapEvent.buttons === 1 || tapEvent.which === 1 || tapEvent.which === null) {
                const form = document.body.appendChild(<Form inputs={this._inputs} submit={(event) => {
                    items.push(form.getValues())
                    this.items = items
                    event.preventDefault()
                }} />)
            }
        }, this._renderElements.querySelector('button'))
    }

    disconnectedCallback() {
        // Called every time the element is removed from the DOM.
        // Useful for running clean up code (removing event listeners, etc.).
    }

    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
        if (attrName === 'items' && oldVal !== newVal && this._renderElements) {
            // this._renderElements = this._render();
            this._renderElements.appendChild(this._render())
            console.log(this._renderElements)
        }
        // An attribute was added, removed, updated, or replaced.
        // Also called for initial values when an element is created by the parser, or upgraded.
        // Note: only attributes listed in the observedAttributes property will receive this callback.
    }

    // changed(node1, node2) {
    //     return typeof node1 !== typeof node2 ||
    //            typeof node1 === 'string' && node1 !== node2 ||
    //            node1.type !== node2.type
    // }

    // updateElement($parent, newNode, oldNode, index = 0) {
    //     if (!oldNode) {
    //       $parent.appendChild(
    //         createElement(newNode)
    //       );
    //     } else if (!newNode) {
    //       $parent.removeChild(
    //         $parent.childNodes[index]
    //       );
    //     } else if (changed(newNode, oldNode)) {
    //       $parent.replaceChild(
    //         createElement(newNode),
    //         $parent.childNodes[index]
    //       );
    //     } else if (newNode.type) {
    //       const newLength = newNode.children.length;
    //       const oldLength = oldNode.children.length;
    //       for (let i = 0; i < newLength || i < oldLength; i++) {
    //         updateElement(
    //           $parent.childNodes[index],
    //           newNode.children[i],
    //           oldNode.children[i],
    //           i
    //         );
    //       }
    //     }
    // }

    // Public functions

    // Protected functions
    // protected _addItem(params: any) {
    //     return (
    //         <Whisky name={params.name} image={params.image} desciption={params.description} />
    //     );
    // }

    // protected _submit(event: Event) {
    //     this._addItem(form.getValues());
    //     event.preventDefault();
    // }

    // Private functions

}
