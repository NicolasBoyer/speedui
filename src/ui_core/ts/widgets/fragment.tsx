import { EVENTS } from "events-manager";
// TODO : à passer dans wapitis

export class Fragment extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // setTimeout(() => {
        //     this.childNodes.forEach((child) => {
        //         const newChild = child.cloneNode(true);
        //         const childEvents = EVENTS.PointerListener.getEventListeners(child);
        //         for (const typeEvent in childEvents) {
        //             if (childEvents.hasOwnProperty(typeEvent)) {
        //                 for (const key in childEvents[typeEvent]) {
        //                     if (childEvents[typeEvent].hasOwnProperty(key)) {
        //                         EVENTS.PointerListener.add(typeEvent as EVENTS.PointerType, childEvents[typeEvent][key], newChild);
        //                     }
        //                 }
        //             }
        //         }
        //         if (this.parentNode) {
        //             this.parentNode.appendChild(newChild);
        //         }
        //     });
        //     if (this.parentNode) {
        //         this.parentNode.removeChild(this);
        //     }
        // }, 50);
    }
}
customElements.define("t-fragment", Fragment);
