import { EVENTS } from "events-manager";
import { DOM } from "wapitis";

/**
 * Gère le déplacement d'un élément
 *
 * @export
 * @abstract
 * @class DragManager
 */
export default abstract class DragManager {

    static isDragging: boolean;

    /**
     * Permet d'ajouter un déplacement sur l'élément element en cliquant sur le handler
     *
     * @static
     * @param {HTMLElement} element
     * @param {*} [handler=element]
     * @memberof DragManager
     */
    static addDragToElement(element: HTMLElement, handler: any = element) {
        handler.element = element;
        document.addEventListener("panstart", this._startDrag as EventListenerOrEventListenerObject, {capture: true, passive: true});
        document.addEventListener("panend", this._stopDrag, {capture: true, passive: true});
        EVENTS.PointerListener.add(EVENTS.PointerType.pan, this._pan, handler);
    }

    /**
     * Supprime la possibilité de déplacement sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof DragManager
     */
    static removeDragFromElement(handler: any) {
        document.removeEventListener("panstart", this._startDrag as EventListenerOrEventListenerObject, false);
        document.removeEventListener("panend", this._stopDrag, false);
        EVENTS.PointerListener.remove(EVENTS.PointerType.pan, this._pan, handler);
    }

    /**
     * Permet d'ajouter un swipe sur l'élément element en cliquant sur le handler
     *
     * @static
     * @param {HTMLElement} element
     * @param {*} [handler=element]
     * @memberof DragManager
     */
    static addSwipeToElement(element: HTMLElement, handler: any = element) {
        handler.element = element;
        element.style.transition = "transform 0.3s ease-out";
        document.addEventListener("swipestart", this._startDrag as EventListenerOrEventListenerObject, {capture: true, passive: true});
        EVENTS.PointerListener.add(EVENTS.PointerType.swipe, this._swipe, handler);
    }

    /**
     * Supprime la possibilité de swipe sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof DragManager
     */
    static removeSwipeFromElement(handler: any) {
        handler.element.style.transition = "";
        document.removeEventListener("swipestart", this._startDrag as EventListenerOrEventListenerObject, false);
        EVENTS.PointerListener.remove(EVENTS.PointerType.swipe, this._swipe, handler);
    }

    static addZoomToElement(handler: any) {
        // Gérer le mousewheel avec
        // handler.addEventListener("mousewheel", () = > {}, true);

        // handler.element = element;
        // EVENTS.PointerListener.add(EVENTS.PointerType.pinch, this._swipe, handler);
    }

    // Manque l'ajout de drag and drop !!! IMPORTANT addDragAndDropToElement(element: HTMLElement, dropElement: HTMLelement, handler: any = element) + une option de snap ...

    /**
     * Surcharge la dernière position connue de l'élément pendant le drag
     *
     * @static
     * @param {number} posX
     * @param {number} posY
     * @memberof DragManager
     */
    static overrideElementPosition(posX: number, posY: number) {
        if (this.isDragging) {
            DragManager._initX = posX;
            DragManager._initY = posY;
        }
    }

    protected static _initX: number;
    protected static _initY: number;

    /**
     * Initalise la position de l'élément lorsque le mouvement démarre
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @returns
     * @memberof DragManager
     */
    protected static _startDrag(event: CustomEvent) {
        const elementBoundingRect = event.detail.PointerEvent.handler.element.getBoundingClientRect();
        DragManager._initX = elementBoundingRect.left;
        DragManager._initY = elementBoundingRect.top;
        DragManager.isDragging = true;
    }

    /**
     * Passe la variable isDragging a false
     *
     * @protected
     * @static
     * @memberof DragManager
     */
    protected static _stopDrag() {
        DragManager.isDragging = false;
    }

    /**
     * Retourne la nouvelle position possible de l'élément à chaque mouvement via l'envoie de l'événement isPanning
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @returns
     * @memberof DragManager
     */
    protected static _pan(event: EVENTS.Pointer) {
        if (event.buttons === 1 || event.which === 1 || event.which === null) {
            DOM.dispatchEvent("isPanning", {
                element: event.handler.element,
                event,
                left: DragManager._initX + event.deltaX,
                top: DragManager._initY + event.deltaY,
            });
        }
    }

    /**
     * Retourne la nouvelle position possible de l'élément après un swipe via l'envoie de l'événement isSwiping et swipeend
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @memberof DragManager
     */
    protected static _swipe(event: EVENTS.Pointer) {
        if (event.buttons === 1 || event.which === 1 || event.which === null) {
            DOM.dispatchEvent("isSwiping", {
                direction: event.direction,
                element: event.handler.element,
                event,
                left: DragManager._initX + event.deltaX,
                top: DragManager._initY + event.deltaY,
                velocityX: event.velocityX,
                velocityY: event.velocityY,
            });
            setTimeout(() => {
                DOM.dispatchEvent("swipeend", {
                    element: event.handler.element,
                    event,
                });
                DragManager._stopDrag();
            }, 300);
        }
    }

}
