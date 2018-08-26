export interface IPointerEvent extends Event {
    x: number;
    y: number;
    which: number;
    handler: HTMLElement;
    maskedEvent: Event;
    touch: boolean;
    mouse: boolean;
    pointer: boolean;
}

export class PointerEvent {

// A passer dans wapitis avec une autre classe exporté event qui contiendra dispatchevent
// IMPORTANT : fin normalisation avec scroll et multi touch
// bug si centré et drag + window manager ne marche plus

    static add(type: string, callback: (evt: IPointerEvent) => void, handler: any = document) {
        // let isScrolling = false;
        // let timeout = false;
        // let sDistX = 0;
        // let sDistY = 0;
        // window.addEventListener('scroll', function() {
        //     if (!isScrolling) {
        //         sDistX = window.pageXOffset;
        //         sDistY = window.pageYOffset;
        //     }
        //     isScrolling = true;
        //     clearTimeout(timeout);
        //     timeout = setTimeout(function() {
        //         isScrolling = false;
        //         // sDistX = 0;
        //         // sDistY = 0;
        //     }, 100);
        // });
        // console.log(isScrolling)
        window.onscroll = function(ev) {
            console.log("scroll")
        };

        if (!handler.callback) {
            handler.callback = {};
        }
        handler.callback[type] = callback;
        const listener = this._getListener(type);
        if ("PointerEvent" in window) {
            handler.addEventListener("pointer" + type, listener, true);
        } else {
            handler.addEventListener("mouse" + type, listener, true);
            handler.addEventListener(PointerEvent._getTouchEvent(type), listener, true);
        }
    }

    static remove(type: string, handler: any = document) {
        const listener = this._getListener(type);
        if ("PointerEvent" in window) {
            handler.removeEventListener("pointer" + type, listener, true);
        } else {
            handler.removeEventListener("mouse" + type, listener, true);
            handler.removeEventListener(PointerEvent._getTouchEvent(type), listener, true);
        }
    }

    protected static _getListener(type: string) {
        switch (type) {
            case "down": return this._pointerDown;
            case "up": return this._pointerUp;
            case "move": return this._pointerMove;
        }
    }

    protected static _getTouchEvent(type: string): string | undefined {
        switch (type) {
            case "down": return "touchstart";
            case "up": return "touchend";
            case "move": return "touchmove";
        }
    }

    protected static _pointerDown(event: Event) {
        // console.log(isScrolling)
        const type = "down";
        const evt = PointerEvent._makePointerEvent(type, event, this);
        // (this as any).callback[type](evt);
        // don't maybeClick if more than one touch is active.
        // const singleFinger = evt.mouse || (evt.touch && event.touches.length === 1);
        // if (!isScrolling && singleFinger) {
        // if (singleFinger && event.target) {
        //     event.target.maybeClick = true;
        //     event.target.maybeClickX = evt.x;
        //     event.target.maybeClickY = evt.y;
        // }
    }

    protected static _pointerMove(event: Event) {
        console.log(event)
        const type = "move";
        const evt = PointerEvent._makePointerEvent(type, event, this);
        // (this as any).callback[type](evt);
    }

    protected static _pointerUp(event: Event) {
        const type = "up";
        const evt = PointerEvent._makePointerEvent(type, event, this);
        // (this as any).callback[type](evt);
    }

    protected static _makePointerEvent(type: string, e: any, handler: any) {
        const event: any = document.createEvent("CustomEvent");
        event.initCustomEvent("epointer" + type, true, true, {});
        event.touch = e.type.indexOf("touch") === 0;
        event.mouse = e.type.indexOf("mouse") === 0;
        event.pointer = e.type.indexOf("pointer") === 0;
        // event.pen à gérer
        if (event.touch) {
            event.x = e.changedTouches[0].pageX;
            event.y = e.changedTouches[0].pageY;
        }
        if (event.mouse || event.pointer) {
            event.x = e.clientX + window.pageXOffset;
            event.y = e.clientY + window.pageYOffset;
            if (e.which) {
                event.which = e.which;
            }
        }
        event.maskedEvent = e;
        event.handler = handler;
        handler.callback[type](event as IPointerEvent);
        return event as IPointerEvent;
    }

}
