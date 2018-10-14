import { DOM } from "wapitis";

// tslint:disable-next-line:no-namespace
export namespace EVENTS {

    // Permettre de surcharger ??
    const SWIPERESTRAINT = 100; // maximum distance allowed at the same time in perpendicular direction
    const MINSWIPEDISTANCE = 150; // required min distance traveled to be considered swipe
    const MAXTAPPRESS = 100; // Maximum press time in ms
    const SWIPEMAXTIME = 300; // required min distance traveled to be considered swipe
    const HOLDTIME = 600; // Max time before send hold event
    const ISPOINTEREVENT: boolean = "PointerEvent" in window;
    const ISTOUCHEVENT: boolean = "ontouchstart" in window;
    let POINTERTOUCHES: TouchList | number[] = [];

    export enum PointerType {
        enter = "Enter", leave = "Leave", tap = "Tap", press = "Press", hold = "Hold", pressup = "PressUp", move = "Move", pan = "Pan", pinch= "Pinch", rotate = "Rotate", swipe = "Swipe", doubletap = "DoubleTap",
    }

    export class Pointer {
        touch: boolean;
        mouse: boolean;
        pointer: boolean;
        x: number;
        y: number;
        deltaX: number;
        deltaY: number;
        which: number;
        buttons: number;
        pressure: number;
        tiltX: number;
        tiltY: number;
        pointerId: number;
        touches: TouchList | number[];
        maskedEvent: Event;
        handler: any;
        direction: string;
        velocityX: number;
        velocityY: number;
        scale: number;
        angle: number;
        isFirst: boolean;
        protected name: string;

        constructor(name: string) {
            this.name = name;
        }
    }

    // tslint:disable-next-line:max-classes-per-file
    export class PointerListener {

    // TODO : A passer dans wapitis avec une autre classe exporté event qui contiendra dispatchevent
    // IMPORTANT : fin normalisation avec scroll et multi touch _=> normalement ça marche
    // bug si centré et drag + window manager ne marche plus

    // Rest mise en place du touch action (à retester avec hammer) + finalisation rotate

    // TODO : Créer un log dans DOM dans wapitis

        static add(type: PointerType, callback: (evt: Pointer) => void, handler: any = document, options: {once?: boolean, capture?: boolean, passive?: boolean, replaceCallback?: boolean, usePointer?: boolean} = {once: false, capture: false, passive: true, replaceCallback: false, usePointer: true}) {
            // On sauvegarde tous les callback dans le handler
            handler.callback = handler.callback || {};
            handler.callback[type] = options.replaceCallback || !handler.callback[type] ? {} : handler.callback[type];
            handler.callback[type][this.generateIdFromString(callback.toString())] = callback;
            handler.addEventListener(this._getEvent(type, options.usePointer), this._getListener(type), {once: options.once, capture: options.capture, passive: options.passive});
            if (handler !== document) {
                handler.style.touchAction = "none";
            }
        }

        static remove(type: PointerType, callback: (evt: Pointer) => void, handler: any = document, options: {capture?: boolean, passive?: boolean, usePointer?: boolean} = {capture: false, passive: true, usePointer: true}) {
            if (handler.callback && handler.callback[type]) {
                delete handler.callback[type][this.generateIdFromString(callback.toString())];
                if (!Object.keys(handler.callback[type]).length) {
                    delete handler.callback[type];
                    handler.removeEventListener(this._getEvent(type, options.usePointer), this._getListener(type), options);
                }
            }
            if (handler !== document) {
                handler.style.touchAction = "";
            }
        }

        protected static _currentHandler: HTMLElement | null;

        // TODO : A passer dans DOM
        protected static generateIdFromString(str: string) {
            let hash = 0;
            if (str.length === 0) {
                return hash;
            }
            for (let i = 0; i < str.length; i++) {
                const charcode   = str.charCodeAt(i);
                // tslint:disable-next-line:no-bitwise
                hash = ((hash << 5) - hash) + charcode;
                // tslint:disable-next-line:no-bitwise
                hash |= 0;
            }
            return hash;
        }

        protected static _getListener(type: PointerType) {
            switch (type) {
                case PointerType.tap: return this._tap;
                case PointerType.doubletap: return this._doubleTap;
                case PointerType.enter: return this._enter;
                case PointerType.leave: return this._leave;
                case PointerType.press: return this._press;
                case PointerType.hold: return this._hold;
                case PointerType.pressup: return this._pressup;
                case PointerType.move: return this._move;
                case PointerType.pinch: return this._pinch;
                case PointerType.rotate: return this._rotate;
                case PointerType.pan: return this._pan;
                case PointerType.swipe: return this._swipe;
            }
        }

        protected static _getEvent(type: PointerType, usePointer: boolean = true): string {
            switch (type) {
                case PointerType.enter:
                    return ISPOINTEREVENT && usePointer ? "pointerover" : ISTOUCHEVENT ? "" : "mouseover";
                case PointerType.leave:
                    return ISPOINTEREVENT && usePointer ? "pointerout" : ISTOUCHEVENT ? "" : "mouseout";
                case PointerType.tap:
                case PointerType.doubletap:
                case PointerType.press:
                case PointerType.hold:
                case PointerType.swipe:
                case PointerType.pan:
                case PointerType.pinch:
                case PointerType.rotate:
                    return ISPOINTEREVENT && usePointer ? "pointerdown" : ISTOUCHEVENT ? "touchstart" : "mousedown";
                case PointerType.pressup:
                    return ISPOINTEREVENT && usePointer ? "pointerup" : ISTOUCHEVENT ? "touchend" : "mouseup";
                case PointerType.move:
                    return ISPOINTEREVENT && usePointer ? "pointermove" : ISTOUCHEVENT ? "touchmove" : "mousemove";
                default:
                    return "";
            }
        }

        // protected static _updateTouchAction(type: PointerType) {
        //     // console.log(this._currentHandler)
        //     if (this._currentHandler) {
        //         // console.log(type)
        //         // console.log(PointerType.pressup)
        //         switch (type) {
        //             case PointerType.tap:
        //                 this._currentHandler.style.touchAction = "manipulation";
        //                 break;
        //             // Pas tous a mettre mais à réfléchir
        //             case PointerType.pressup:
        //             case PointerType.cancel:
        //             case PointerType.move:
        //             case PointerType.swipe:
        //                 this._currentHandler.style.touchAction = "none";
        //                 break;
        //             case PointerType.moveleft:
        //             case PointerType.moveright:
        //             case PointerType.swipeleft:
        //             case PointerType.swiperight:
        //                 this._currentHandler.style.touchAction = "pan-x";
        //                 break;
        //             case PointerType.moveup:
        //             case PointerType.movedown:
        //             case PointerType.swipeup:
        //             case PointerType.swipedown:
        //                 this._currentHandler.style.touchAction = "pan-y";
        //                 break;
        //             case PointerType.pinchin:
        //             case PointerType.pinchout:
        //             case PointerType.rotate:
        //             case PointerType.rotateleft:
        //             case PointerType.rotateright:
        //                 this._currentHandler.style.touchAction = "pinch-zoom";
        //                 break;
        //         }
        //     }
        // }

        protected static _press(event: Event) {
            // console.log(event)
            // if (this as any !== document) {
            //     PointerListener._currentHandler = this as any;
            // }
            const type = PointerType.press;
            PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
        }

        protected static _move(event: Event) {
            if (POINTERTOUCHES.length === 1) {
                const type = PointerType.move;
                PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
            }
        }

        protected static _pan(event: Event) {
            const pressEvent = PointerListener._makePointerEvent(PointerType.press, event, this);
            const startX = pressEvent.x;
            const startY = pressEvent.y;
            let isPan = true;
            DOM.dispatchEvent("panstart", {PointerEvent: pressEvent});
            const _self = this;
            let counter = 0;
            function panMove(evt: Event) {
                if (POINTERTOUCHES.length === 1 && isPan) {
                    const moveEvent = PointerListener._makePointerEvent(PointerType.move, evt, document);
                    const deltaX = moveEvent.x - startX;
                    const deltaY = moveEvent.y - startY;
                    if (deltaX === 0 || deltaY === 0) {
                        return;
                    }
                    const panEvent = PointerListener._makePointerEvent(PointerType.pan, evt, _self);
                    panEvent.isFirst = counter === 0;
                    counter++;
                    panEvent.deltaX = deltaX;
                    panEvent.deltaY = deltaY;
                    DOM.dispatchEvent("panmove", {PointerEvent: panEvent});
                    PointerListener._runCallback(_self, PointerType.pan, panEvent);
                }
            }
            document.addEventListener(PointerListener._getEvent(PointerType.move), panMove, {capture: false, passive: true});
            document.addEventListener(PointerListener._getEvent(PointerType.pressup), () => {
                isPan = false;
                document.removeEventListener(PointerListener._getEvent(PointerType.move), panMove);
                DOM.dispatchEvent("panend", {});
            }, {once: true, capture: false, passive: true});
        }

        protected static _pinch() {
            let isPinch = true;
            DOM.dispatchEvent("pinchstart", {});
            const _self = this;
            let startScale = 0;
            let counter = 0;
            function pinchMove(evt: Event) {
                if (POINTERTOUCHES.length === 2 && isPinch) {
                    POINTERTOUCHES = (evt as TouchEvent).touches;
                    const distance = Math.hypot(POINTERTOUCHES[0].pageX - POINTERTOUCHES[1].pageX, POINTERTOUCHES[0].pageY - POINTERTOUCHES[1].pageY);
                    const pinchEvent = PointerListener._makePointerEvent(PointerType.pinch, evt, _self);
                    const currentScale = distance * 10 / 1300;
                    pinchEvent.isFirst = counter === 0;
                    if (counter === 0) {
                        startScale = currentScale;
                        counter++;
                    }
                    pinchEvent.scale = currentScale / startScale;
                    pinchEvent.x = (POINTERTOUCHES[0].pageX + POINTERTOUCHES[1].pageX) / 2;
                    pinchEvent.y = (POINTERTOUCHES[0].pageY + POINTERTOUCHES[1].pageY) / 2;
                    PointerListener._runCallback(_self, PointerType.pinch, pinchEvent);
                }
            }
            document.addEventListener("touchmove", pinchMove, {capture: false, passive: true});
            document.addEventListener(PointerListener._getEvent(PointerType.pressup), () => {
                isPinch = false;
                counter = 0;
                document.removeEventListener(PointerListener._getEvent(PointerType.move), pinchMove);
                DOM.dispatchEvent("pinchend", {});
            }, {once: true, capture: false, passive: true});
        }

        protected static _rotate(event: Event) {
            const pressEvent = PointerListener._makePointerEvent(PointerType.press, event, this);
            const startX = pressEvent.x;
            const startY = pressEvent.y;
            let isRotate = true;
            DOM.dispatchEvent("rotatestart", {});
            const _self = this;
            let counter = 0;
            pressEvent.handler.angle = pressEvent.handler.angle || 0;

            // A changer !!! Supprimer le center et l'appel au handler pour le remettre sur transform
            const boundingRect = pressEvent.handler.getBoundingClientRect();
            const center = { x: 0, y: 0 };
            // const center = { x: boundingRect.left + (boundingRect.width / 2), y: boundingRect.top + (boundingRect.height / 2) };
            const oneTouchStartAngle = (180 / Math.PI ) * Math.atan2(startY - center.y, startX - center.x);
            let multiTouchStartAngle = 0;
            function rotateMove(evt: Event) {
                if (isRotate) {
                    const rotateEvent = PointerListener._makePointerEvent(PointerType.rotate, evt, _self);
                    if (POINTERTOUCHES.length === 2) {
                        POINTERTOUCHES = (evt as TouchEvent).touches;
                        const distance = { x: POINTERTOUCHES[0].pageX - POINTERTOUCHES[1].pageX, y: POINTERTOUCHES[0].pageY - POINTERTOUCHES[1].pageY };
                        if (counter === 0) {
                            multiTouchStartAngle = (180 / Math.PI ) * Math.atan2(distance.y, distance.x);
                            counter++;
                        }
                        pressEvent.handler.rotation = ((180 / Math.PI) * Math.atan2(distance.y, distance.x)) - multiTouchStartAngle;
                        rotateEvent.x = (POINTERTOUCHES[0].pageX + POINTERTOUCHES[1].pageX) / 2;
                        rotateEvent.y = (POINTERTOUCHES[0].pageY + POINTERTOUCHES[1].pageY) / 2;
                        rotateEvent.touches = POINTERTOUCHES;
                    } else {
                        pressEvent.handler.rotation = ((180 / Math.PI ) * Math.atan2((evt as any).clientY - center.y, (evt as any).clientX - center.x)) - oneTouchStartAngle;
                        if (counter === 0) {
                            counter++;
                        }
                    }
                    rotateEvent.isFirst = counter === 0;
                    rotateEvent.angle = pressEvent.handler.angle + pressEvent.handler.rotation;
                    PointerListener._runCallback(_self, PointerType.rotate, rotateEvent);
                }
            }
            document.addEventListener(PointerListener._getEvent(PointerType.move), rotateMove, {capture: false, passive: true});
            document.addEventListener(PointerListener._getEvent(PointerType.pressup), () => {
                pressEvent.handler.angle += pressEvent.handler.rotation;
                pressEvent.handler.rotation = 0;
                isRotate = false;
                document.removeEventListener(PointerListener._getEvent(PointerType.move), rotateMove);
                DOM.dispatchEvent("rotateend", {});
            }, {once: true, capture: false, passive: true});
        }

        protected static _swipe(event: Event) {
            const pressEvent = PointerListener._makePointerEvent(PointerType.press, event, this);
            const pressTimer = new Date().getTime();
            const startX = pressEvent.x;
            const startY = pressEvent.y;
            let type = PointerType.pressup;
            let counter = 0;
            DOM.dispatchEvent("swipestart", {PointerEvent: pressEvent});
            document.addEventListener(PointerListener._getEvent(PointerType.move), () => {
                document.addEventListener(PointerListener._getEvent(type), (evt: Event) => {
                    const pressupEvent = PointerListener._makePointerEvent(type, evt, document);
                    const deltaX = pressupEvent.x - startX;
                    const deltaY = pressupEvent.y - startY;
                    const velocityX = pressupEvent.x / startX;
                    const velocityY = pressupEvent.y / startY;
                    const isHorizontal = Math.abs(deltaX) >= MINSWIPEDISTANCE && Math.abs(deltaY) <= SWIPERESTRAINT;
                    const isVertical = Math.abs(deltaY) >= MINSWIPEDISTANCE && Math.abs(deltaX) <= SWIPERESTRAINT;
                    if (new Date().getTime() - pressTimer <= SWIPEMAXTIME && (isHorizontal || isVertical)) {
                        type = PointerType.swipe;
                        const swipeEvent = PointerListener._makePointerEvent(type, evt, this);
                        if (isHorizontal) {
                            const isLeft = deltaX < 0;
                            swipeEvent.direction = isLeft ? "left" : "right";
                            DOM.dispatchEvent(isLeft ? "swipeleft" : "swiperight", {PointerEvent: swipeEvent});
                        } else if (isVertical) {
                            const isUp = deltaY < 0;
                            swipeEvent.direction = isUp ? "up" : "down";
                            DOM.dispatchEvent(isUp ? "swipeup" : "swipedown", {PointerEvent: swipeEvent});
                        }
                        swipeEvent.isFirst = counter === 0;
                        counter++;
                        swipeEvent.deltaX = deltaX;
                        swipeEvent.deltaY = deltaY;
                        swipeEvent.velocityX = velocityX;
                        swipeEvent.velocityY = velocityY;
                        PointerListener._runCallback(this, type, swipeEvent);
                    }
                }, {once: true, capture: false, passive: true});
            }, {once: true, capture: false, passive: true});
        }

        protected static _pressup(event: Event) {
            // PointerListener._updateTouchAction(PointerType.pressup);
            PointerListener._currentHandler = null;
            const type = PointerType.pressup;
            PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
        }

        protected static _tap() {
            // if (this as any !== document) {
            //     PointerListener._currentHandler = this as any;
            // }
            // PointerListener._updateTouchAction(PointerType.tap);

            const pressTimer = new Date().getTime();
            (this as any).addEventListener(PointerListener._getEvent(PointerType.pressup), (event: Event) => {
                if (new Date().getTime() - pressTimer <= MAXTAPPRESS) {
                    const type = PointerType.tap;
                    PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
                }
            }, {once: true, capture: false, passive: true});
        }

        protected static _doubleTap() {
            const pressTimer = new Date().getTime();
            (this as any).addEventListener(PointerListener._getEvent(PointerType.pressup), () => {
                const doublePressTimer = new Date().getTime();
                if (doublePressTimer - pressTimer <= MAXTAPPRESS) {
                    (this as any).addEventListener(PointerListener._getEvent(PointerType.pressup), (event: Event) => {
                        if (new Date().getTime() - doublePressTimer <= MAXTAPPRESS * 2.5) {
                            const type = PointerType.doubletap;
                            PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
                        }
                    }, {once: true, capture: false, passive: true});
                }
            }, {once: true, capture: false, passive: true});
        }

        protected static _hold(event: Event) {
            const counter = setTimeout(() => {
                const type = PointerType.hold;
                PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
            }, HOLDTIME);
            (this as any).addEventListener(PointerListener._getEvent(PointerType.pressup), () => clearTimeout(counter));
        }

        protected static _enter(event: Event) {
            const type = PointerType.enter;
            PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
        }

        protected static _leave(event: Event) {
            const type = PointerType.leave;
            PointerListener._runCallback(this, type, PointerListener._makePointerEvent(type, event, this));
        }

        protected static _makePointerEvent(type: PointerType, e: any, handler: any) {
            const event = new Pointer("Pointer" + type);
            event.touch = e.type.indexOf("touch") === 0;
            event.mouse = e.type.indexOf("mouse") === 0;
            event.pointer = e.type.indexOf("pointer") === 0;
            if (event.touch) {
                event.x = e.changedTouches[0].pageX;
                event.y = e.changedTouches[0].pageY;
            }
            if (event.mouse || event.pointer) {
                event.x = e.clientX + window.pageXOffset;
                event.y = e.clientY + window.pageYOffset;
                if (e.which || e.which === 0) {
                    event.which = e.which;
                }
                if (e.buttons) {
                    event.buttons = e.buttons;
                }
                if (e.pressure) {
                    event.pressure = e.pressure;
                }
                if (e.tiltX) {
                    event.tiltX = e.tiltX;
                }
                if (e.tiltY) {
                    event.tiltY = e.tiltY;
                }
                if (e.pointerId) {
                    event.pointerId = e.pointerId;
                }
            }
            event.touches = POINTERTOUCHES;
            event.maskedEvent = e;
            event.handler = handler;
            return event;
        }

        protected static _runCallback(handler: any, type: PointerType, event: Pointer) {
            if (handler.callback) {
                for (const i in handler.callback[type]) {
                    if (i in handler.callback[type]) {
                        handler.callback[type][i](event);
                    }
                }
            }
        }

    }

    PointerListener.add(PointerType.press, () => POINTERTOUCHES = (event as TouchEvent).touches || [1], document, { usePointer: false });
    PointerListener.add(PointerType.pressup, () => POINTERTOUCHES = (event as TouchEvent).touches || [], document, { usePointer: false });

}
