import DragManager from "drag-manager";
import { DOM } from "wapitis";

/**
 * Gère le redimentionnement d'un élément
 *
 * @export
 * @abstract
 * @class ResizeManager
 */
export default abstract class ResizeManager {

    static isResizing: boolean;

    /**
     * Permet d'ajouter un redimentionnement sur l'élément element
     *
     * @static
     * @param {HTMLElement} element
     * @memberof ResizeManager
     */
    static addResizeToElement(element: HTMLElement) {
        element.addEventListener("mousedown", this._startResize, true);
        document.addEventListener("mouseup", () => {
            this.isResizing = false;
            document.removeEventListener("mousemove", this._resize, true);
        }, true);
        document.addEventListener("mousemove", this._detectElementEdges, true);
    }

    /**
     * Supprime la possibilité de redimentionnement sur l'élément
     *
     * @static
     * @param {HTMLElement} element
     * @memberof ResizeManager
     */
    static removeResizeFromElement(element: HTMLElement) {
        element.removeEventListener("mousedown", this._resize, true);
        document.removeEventListener("mouseup", () => {
            //
        }, true);
        document.addEventListener("mousemove", () => {
            //
        }, true);
    }

    protected static _currentResizeElement: HTMLElement;
    protected static _isOnElementEdge: {top: boolean, bottom: boolean, left: boolean, right: boolean} = {top: false, bottom: false, left: false, right: false};

    /**
     * Initalise la position de l'élément lorsque le redimentionnement démarre
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof ResizeManager
     */
    protected static _startResize(event: MouseEvent) {
        if (event.which === 1) {
            ResizeManager._currentResizeElement = event.target as HTMLElement;
            const isOnElementEdge = ResizeManager._isOnElementEdge;
            if ((!isOnElementEdge.top && !isOnElementEdge.bottom && !isOnElementEdge.left && !isOnElementEdge.right)) {
                return;
            }
            ResizeManager.isResizing = true;
            DOM.dispatchEvent("startResizing", this);
            document.addEventListener("mousemove", ResizeManager._resize, true);
        }
        event.preventDefault();
    }

    /**
     * Retourne la nouvelle dimension et la nouvelle position possible de l'élément à chaque redimentionnement via l'envoie de l'événement isResizing
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof ResizeManager
     */
    protected static _resize(event: MouseEvent) {
        if (!ResizeManager.isResizing) {
            return;
        }
        const element = ResizeManager._currentResizeElement;
        const elementBoundingRect = element.getBoundingClientRect();
        let left = elementBoundingRect.left;
        let top = elementBoundingRect.top;
        let width = element.clientWidth;
        let height = element.clientHeight;
        const minWidth = DOM.parseStyleToNumber(element.getAttribute("min-width")) || 0;
        const minHeight = DOM.parseStyleToNumber(element.getAttribute("min-height")) || 0;
        const deltaMouseX = event.clientX - left;
        const deltaMouseY = event.clientY - top;
        const isOnElementEdge = ResizeManager._isOnElementEdge;
        if (isOnElementEdge.right) {
            width = Math.max(minWidth, deltaMouseX);
        }
        if (isOnElementEdge.bottom) {
            height = Math.max(minHeight, deltaMouseY);
        }
        if (isOnElementEdge.left && (width > minWidth || deltaMouseX < 0)) {
            width = width - deltaMouseX;
            left = event.clientX;
        }
        if (isOnElementEdge.top && (height > minHeight || deltaMouseY < 0)) {
            height = height - deltaMouseY;
            top = event.clientY;
        }
        DOM.dispatchEvent("isResizing", {element, top, left, width, height});
    }

    /**
     * Détecte si le pointeur est sur les bords de l'élément et l'indique dans la propriété isOnElementEdge
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof ResizeManager
     */
    protected static _detectElementEdges(event: MouseEvent) {
        const element = event.target as any;
        if (DragManager.isDragging || ResizeManager.isResizing || !element.resizable) {
            return;
        }
        const elementBoundingRect = element.getBoundingClientRect();
        const x = event.clientX - elementBoundingRect.left;
        const y = event.clientY - elementBoundingRect.top;
        const isOnElementEdge = ResizeManager._isOnElementEdge;
        isOnElementEdge.top = y < 0;
        isOnElementEdge.left = x < 0;
        isOnElementEdge.right = x >= element.offsetWidth;
        isOnElementEdge.bottom = y >= element.offsetHeight;
        ResizeManager._changeMouseCursor(element);
    }

    /**
     * Change la forme du curseur de la souris en fonction de sa position sur les bords de l'élément
     *
     * @protected
     * @static
     * @param {HTMLElement} element
     * @memberof ResizeManager
     */
    protected static _changeMouseCursor(element: HTMLElement) {
        const isOnElementEdge = this._isOnElementEdge;
        if (isOnElementEdge.right && isOnElementEdge.bottom || isOnElementEdge.left && isOnElementEdge.top) {
            element.style.cursor = "nwse-resize";
        } else if (isOnElementEdge.right && isOnElementEdge.top || isOnElementEdge.bottom && isOnElementEdge.left ) {
            element.style.cursor = "nesw-resize";
        } else if (isOnElementEdge.right  || isOnElementEdge.left ) {
            element.style.cursor = "ew-resize";
        } else if (isOnElementEdge.bottom || isOnElementEdge.top) {
            element.style.cursor = "ns-resize";
        } else {
            element.style.cursor = "default";
        }
    }

}
