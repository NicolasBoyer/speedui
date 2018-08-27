import { IPointerEvent, PointerEvent } from "events-manager";
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
        handler.transform = {x: 0, y: 0};
        PointerEvent.add("down", this._startDrag, handler);
    }

    /**
     * Supprime la possibilité de déplacement sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof DragManager
     */
    static removeDragFromElement(handler: any) {
        PointerEvent.remove("down", handler);
    }

    /**
     * Surcharge la dernière position connue de l'élément
     *
     * @static
     * @param {number} posX
     * @param {number} posY
     * @memberof DragManager
     */
    static overrideDragElementPosition(posX: number, posY: number) {
        if (this._currentDragHandler) {
            this._currentDragHandler.transform = {x: posX, y: posY};
        }
    }

    protected static _currentDragHandler: any;

    /**
     * Initalise la position de l'élément lorsque le mouvement démarre
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof DragManager
     */
    protected static _startDrag(event: IPointerEvent) {
        if ((event.which === 1 || !event.which) && event.touches === 1) {
            DragManager._currentDragHandler = event.handler;
            const handler = DragManager._currentDragHandler;
            if (!handler.element.draggable) {
                return;
            }
            DragManager.isDragging = true;
            handler.startMouseX = event.x;
            handler.startMouseY = event.y;
            DOM.dispatchEvent("startDragging", event.handler);
            PointerEvent.add("move", DragManager._drag);
            PointerEvent.add("up", () => {
                DragManager.isDragging = false;
                PointerEvent.remove("move");
                PointerEvent.remove("up");
            });
        }
        event.preventDefault();
    }

    /**
     * Retourne la nouvelle position possible de l'élément à chaque mouvement via l'envoie de l'événement isDragging
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof DragManager
     */
    protected static _drag(event: IPointerEvent) {
        if (!DragManager.isDragging) {
            return;
        }
        const handler = DragManager._currentDragHandler;
        const deltaMouseX = handler.startMouseX - event.x;
        const delataMouseY = handler.startMouseY - event.y;
        // On drag seulement s'il y a un mouvement
        if (deltaMouseX === 0 || delataMouseY === 0) {
            return;
        }
        handler.startMouseX = event.x;
        handler.startMouseY = event.y;
        handler.transform.x = handler.transform.x - deltaMouseX;
        handler.transform.y = handler.transform.y - delataMouseY;
        DOM.dispatchEvent("isDragging", {
            element: handler.element,
            event,
            moveX: handler.transform.x,
            moveY: handler.transform.y,
        });
    }

}
