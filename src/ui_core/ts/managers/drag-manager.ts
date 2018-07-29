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
        handler.addEventListener("mousedown", this._startDrag, true);
        document.addEventListener("mouseup", () => {
            this.isDragging = false;
            document.removeEventListener("mousemove", this._drag, true);
        }, true);
    }

    /**
     * Supprime la possibilité de déplacement sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof DragManager
     */
    static removeDragFromElement(handler: any) {
        handler.removeEventListener("mousedown", this._startDrag, true);
        document.removeEventListener("mouseup", () => {
            //
        }, true);
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
    protected static _startDrag(event: MouseEvent) {
        if (event.which === 1) {
            DragManager._currentDragHandler = this;
            const handler = DragManager._currentDragHandler;
            if (!handler.element.draggable) {
                return;
            }
            DragManager.isDragging = true;
            handler.startMouseX = event.clientX;
            handler.startMouseY = event.clientY;
            DOM.dispatchEvent("startDragging", this);
            document.addEventListener("mousemove", DragManager._drag, true);
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
    protected static _drag(event: MouseEvent) {
        if (!DragManager.isDragging) {
            return;
        }
        const handler = DragManager._currentDragHandler;
        const deltaMouseX = handler.startMouseX - event.clientX;
        const delataMouseY = handler.startMouseY - event.clientY;
        // On drag seulement s'il y a un mouvement
        if (deltaMouseX === 0 || delataMouseY === 0) {
            return;
        }
        handler.startMouseX = event.clientX;
        handler.startMouseY = event.clientY;
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
