// A passer dans wapitis avec une autre classe exporté event qui contiendra dispatchevent
// Faire un array permettant d'ajouter les événement et donc de les supprimer facilement ...
export class PointerEvent {

    static add(type: string, handler: HTMLElement = document.body) {
        return new Promise((resolve) => {
            this._currentElement = handler;
            this._currentPromise = resolve;
            switch (type) {
                case "down":
                this.down(); break;
                // case "touchend":   type = TouchMouseEvent.UP;   break;
                // case "touchmove":  type = TouchMouseEvent.MOVE; break;
                default: return;
            }
        });
    }

    protected static _currentElement: HTMLElement;
    // Passer en type fonction promise
    protected static _currentPromise: any;

    protected static down() {
        // Voir si les 3 cumulable dans addeventlistener ???
        // Reste aussi à normaliser en retour pour obtenir les bonx x  et y et widt etc ... !!!!!!!!! IMPORTANT
        if ("PointerEvent" in window) {
            this._currentElement.addEventListener("pointerdown", PointerEvent.pointerDown, true);
        } else {
            this._currentElement.addEventListener("mousedown", PointerEvent.pointerDown, true);
            this._currentElement.addEventListener("touchstart", PointerEvent.pointerDown, true);
        }
    }

    protected static pointerDown = (event: Event) => {
        const evt = PointerEvent.makePointerEvent("down", event);
        PointerEvent._currentPromise(evt);
        // console.log(evt)
        // don't maybeClick if more than one touch is active.
        // const singleFinger = evt.mouse || (evt.touch && event.touches.length === 1);
        // if (!isScrolling && singleFinger) {
        // if (singleFinger && event.target) {
        //     event.target.maybeClick = true;
        //     event.target.maybeClickX = evt.x;
        //     event.target.maybeClickY = evt.y;
        // }
    }

    protected static makePointerEvent(type: string, e: any) {
        const target = e.target;
        const event: any = document.createEvent("CustomEvent");
        event.initCustomEvent("epointer" + type, true, true, {});
        // console.log(e)
        // console.log(event)
        event.touch = e.type.indexOf("touch") === 0;
        event.mouse = e.type.indexOf("mouse") === 0;
        event.pointer = e.type.indexOf("pointer") === 0;
        if (event.touch) {
            event.x = e.changedTouches[0].pageX;
            event.y = e.changedTouches[0].pageY;
        }
        if (event.mouse) {
            event.x = e.clientX + window.pageXOffset;
            event.y = e.clientY + window.pageYOffset;
        }
        event.maskedEvent = e;
        target.dispatchEvent(event);
        return event;
    }

}
