import { EVENTS } from "events-manager";
import { DOM } from "wapitis";

// TODO : Ajout de drag and drop !!! IMPORTANT addDragAndDropToElement(element: HTMLElement, dropElement: HTMLelement, handler: any = element) + une option de snap ...
// TODO : Manque le rotate + à voir double tap pour reset scale ?

export enum SupportType {
    all,
    mobile,
    desktop,
}

/**
 * Gère le déplacement d'un élément
 *
 * @export
 * @abstract
 * @class TransformManager
 */
export abstract class TransformManager {

    static isDragging: boolean;
    static isResizing: boolean;

    /**
     * Permet d'ajouter un déplacement sur l'élément element en cliquant sur le handler
     *
     * @static
     * @param {HTMLElement} element
     * @param {*} [handler=element]
     * @memberof TransformManager
     */
    static addPanToElement(element: HTMLElement, handler: any = element, supportType: SupportType = SupportType.all) {
        if (this._isMobile() && supportType === SupportType.desktop || !this._isMobile() && supportType === SupportType.mobile) {
            return;
        }
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
     * @memberof TransformManager
     */
    static removePanFromElement(handler: any) {
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
     * @memberof TransformManager
     */
    static addSwipeToElement(element: HTMLElement, handler: any = element, supportType: SupportType = SupportType.all) {
        if (this._isMobile() && supportType === SupportType.desktop || !this._isMobile() && supportType === SupportType.mobile) {
            return;
        }
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
     * @memberof TransformManager
     */
    static removeSwipeFromElement(handler: any) {
        handler.element.style.transition = "";
        document.removeEventListener("swipestart", this._startDrag as EventListenerOrEventListenerObject, false);
        EVENTS.PointerListener.remove(EVENTS.PointerType.swipe, this._swipe, handler);
    }

    /**
     * Permet d'ajouter un zoom sur l'élément element en cliquant sur le handler
     *
     * @static
     * @param {HTMLElement} element
     * @param {*} [handler=element]
     * @param {{ maxZoom?: number, minZoom?: number, supportType?: SupportType }} [options={ maxZoom: 4, minZoom: 0.3, supportType : SupportType.all }]
     * @memberof TransformManager
     */
    static addZoomToElement(element: HTMLElement, handler: any = element, options: { maxZoom?: number, minZoom?: number, supportType?: SupportType } = { maxZoom: 4, minZoom: 0.3, supportType : SupportType.all }) {
        handler.element = element;
        handler.options = options;
        handler.zoomFactor = 1;

        handler.offset = { x: 0, y: 0 };
        element.style.transformOrigin = "0% 0%";
        if (this._isMobile() && options.supportType === SupportType.mobile || options.supportType === SupportType.all) {
            EVENTS.PointerListener.add(EVENTS.PointerType.pinch, this._pinch, handler);
        }
        if (!this._isMobile() && options.supportType === SupportType.desktop || options.supportType === SupportType.all) {
            handler.addEventListener("mousewheel", this._zoom, {capture: true, passive: true});
        }
    }

    /**
     * Supprime la possibilité de zoom sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof TransformManager
     */
    static removeZoomFromElement(handler: any) {
        handler.element.style.transformOrigin = "";
        EVENTS.PointerListener.remove(EVENTS.PointerType.pinch, this._pinch, handler);
        handler.removeEventListener("mousewheel", this._zoom, false);
    }

    /**
     * Permet d'ajouter un redimentionnement sur l'élément element
     * Ne fonctionne que sur desktop et si le scale = 1
     *
     * @static
     * @param {HTMLElement} element
     * @memberof TransformManager
     */
    static addResizeToElement(element: HTMLElement) {
        element.addEventListener("mousedown", this._startResize, {capture: true, passive: true});
        document.addEventListener("mouseup", this._stopResize, {capture: true, passive: true});
        document.addEventListener("mousemove", this._detectElementEdges, {capture: true, passive: true});
    }

    /**
     * Supprime la possibilité de redimentionnement sur l'élément
     *
     * @static
     * @param {HTMLElement} element
     * @memberof TransformManager
     */
    static removeResizeFromElement(element: HTMLElement) {
        element.removeEventListener("mousedown", this._startResize, false);
        document.removeEventListener("mouseup", this._stopResize, false);
        document.removeEventListener("mousemove", this._detectElementEdges, false);
    }

    /**
     * Permet d'ajouter un rotate sur l'élément element en cliquant sur le handler
     *
     * @static
     * @param {HTMLElement} element
     * @param {*} [handler=element]
     * @param {{ supportType?: SupportType }} [options={ supportType : SupportType.all }]
     * @memberof TransformManager
     */
    static addRotateToElement(element: HTMLElement, handler: any = element, options: { supportType?: SupportType } = { supportType : SupportType.all }) {
        handler.element = element;
        handler.options = options;
        element.style.transformOrigin = "0% 0%";
        // document.addEventListener("rotatestart", this._startDrag as EventListenerOrEventListenerObject, {capture: true, passive: true});
        EVENTS.PointerListener.add(EVENTS.PointerType.rotate, this._rotate, handler);
    }

    /**
     * Supprime la possibilité de rotate sur l'élément avec lequel le handler a été déclaré
     *
     * @static
     * @param {*} handler
     * @memberof TransformManager
     */
    static removeRotateFromElement(handler: any) {
        handler.element.style.transformOrigin = "";
        // document.removeEventListener("rotatestart", this._startDrag as EventListenerOrEventListenerObject, false);
        EVENTS.PointerListener.remove(EVENTS.PointerType.rotate, this._rotate, handler);
    }

    /**
     * Surcharge la dernière position connue de l'élément pendant le drag
     *
     * @static
     * @param {number} posX
     * @param {number} posY
     * @memberof TransformManager
     */
    static overrideElementDraggingPosition(posX: number, posY: number) {
        if (this.isDragging) {
            TransformManager._initX = posX;
            TransformManager._initY = posY;
        }
    }

    protected static _initX: number;
    protected static _initY: number;
    protected static _currentResizeElement: HTMLElement;
    protected static _isOnElementEdge: {top: boolean, bottom: boolean, left: boolean, right: boolean} = {top: false, bottom: false, left: false, right: false};

    // TODO : a passer dans DOM dans WAPITIS
    protected static _isMobile() {
        let isMobile = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }
        return isMobile;
    }

    /**
     * Initalise la position de l'élément lorsque le mouvement démarre
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @returns
     * @memberof TransformManager
     */
    protected static _startDrag(event: CustomEvent) {
        const elementBoundingRect = event.detail.PointerEvent.handler.element.getBoundingClientRect();
        TransformManager._initX = elementBoundingRect.left;
        TransformManager._initY = elementBoundingRect.top;
        TransformManager.isDragging = true;
    }

    /**
     * Passe la variable isDragging a false
     *
     * @protected
     * @static
     * @memberof TransformManager
     */
    protected static _stopDrag() {
        TransformManager.isDragging = false;
    }

    /**
     * Retourne la nouvelle position possible de l'élément à chaque mouvement via l'envoi de l'événement isPanning
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @returns
     * @memberof TransformManager
     */
    protected static _pan(event: EVENTS.Pointer) {
        if (event.buttons === 1 || event.which === 1 || event.which === null) {
            const element = event.handler.element;
            const currentScale = element.getBoundingClientRect().width / element.offsetWidth;
            DOM.dispatchEvent("isPanning", {
                element,
                event,
                left: (TransformManager._initX + event.deltaX) / currentScale,
                top: (TransformManager._initY + event.deltaY) / currentScale,
            });
        }
    }

    /**
     * Retourne la nouvelle position possible de l'élément après un swipe via l'envoi de l'événement isSwiping et swipeend
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @memberof TransformManager
     */
    protected static _swipe(event: EVENTS.Pointer) {
        if (event.buttons === 1 || event.which === 1 || event.which === null) {
            const element = event.handler.element;
            const currentScale = element.getBoundingClientRect().width / element.offsetWidth;
            DOM.dispatchEvent("isSwiping", {
                direction: event.direction,
                element,
                event,
                left: (TransformManager._initX + event.deltaX) / currentScale,
                top: (TransformManager._initY + event.deltaY) / currentScale,
                velocityX: event.velocityX,
                velocityY: event.velocityY,
            });
            setTimeout(() => {
                DOM.dispatchEvent("swipeend", {
                    element: event.handler.element,
                    event,
                });
                TransformManager._stopDrag();
            }, 300);
        }
    }

    /**
     * Retourne la nouvelle position possible de l'élément après un pinch via l'envoi de l'événement isZooming
     *
     * @protected
     * @static
     * @param {EVENTS.Pointer} event
     * @memberof TransformManager
     */
    protected static _pinch(event: EVENTS.Pointer) {
        const handler = event.handler;
        if (event.isFirst) {
            const elementBoundingRect = handler.element.getBoundingClientRect();
            handler.offset.x = -elementBoundingRect.left;
            handler.offset.y = -elementBoundingRect.top;
            handler.lastScale = 1;
            handler.nthZoom = 0;
        } else {
            const touchCenter = { x: event.x, y: event.y };
            let scale = event.scale / handler.lastScale;
            handler.lastScale = event.scale;
            // On utilise pas les premiers événements car ils sont imprécis
            handler.nthZoom += 1;
            if (handler.nthZoom > 3) {
                const oldZoomFactor = handler.zoomFactor;
                handler.zoomFactor *= scale;
                handler.zoomFactor = Math.min(handler.options.maxZoom, Math.max(handler.zoomFactor, handler.options.minZoom));
                // Met à l'échelle le facteur de zoom par rapport à l'état actuel
                scale = handler.zoomFactor / oldZoomFactor;
                handler.offset = {
                    x: handler.offset.x + ((scale - 1) * (touchCenter.x + handler.offset.x) - (touchCenter.x - handler.lastZoomCenter.x)),
                    y: handler.offset.y + ((scale - 1) * (touchCenter.y + handler.offset.y) - (touchCenter.y - handler.lastZoomCenter.y)),
                };
            }
            handler.lastZoomCenter = touchCenter;
            DOM.dispatchEvent("isZooming", {
                element: handler.element,
                event,
                left: -handler.offset.x / handler.zoomFactor,
                scale: handler.zoomFactor,
                top: -handler.offset.y / handler.zoomFactor,
            });
        }
    }

    /**
     * Retourne la nouvelle position possible de l'élément après un mousewheel via l'envoi de l'événement isZooming
     *
     * @protected
     * @static
     * @param {MouseWheelEvent} event
     * @memberof TransformManager
     */
    protected static _zoom(event: MouseWheelEvent) {
        // element.style.transition = "transform 0.15s";
        const handler = this as any;
        const elementBoundingRect = handler.element.getBoundingClientRect();
        handler.scale = handler.scale || 1;
        handler.lastScale = handler.lastScale || 1;
        handler.pos = handler.pos || { x: -elementBoundingRect.left / handler.scale, y: -elementBoundingRect.top / handler.scale };

        const touchCenter = { x: event.pageX - elementBoundingRect.left, y: event.pageY - elementBoundingRect.top };
        const delta = Math.max(-1, Math.min(1, event.wheelDelta));
        handler.scale += delta * 0.1 * handler.scale;
        handler.scale = Math.max(handler.options.minZoom, Math.min(handler.options.maxZoom, handler.scale));
        handler.pos.x = (handler.pos.x - touchCenter.x) * (handler.lastScale / handler.scale) + touchCenter.x;
        handler.pos.y = (handler.pos.y - touchCenter.y) * (handler.lastScale / handler.scale) + touchCenter.y;
        handler.lastScale = handler.scale;
        DOM.dispatchEvent("isZooming", {
            element: handler.element,
            event,
            left: -handler.pos.x,
            scale: handler.scale,
            top: -handler.pos.y,
        });
        setTimeout(() => {
            // element.style.transition = "";
            handler.pos = null;
        }, 1000);
    }

    /**
     * Initalise la position de l'élément lorsque le redimentionnement démarre
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof TransformManager
     */
    protected static _startResize(event: MouseEvent) {
        if (event.which === 1) {
            const element = (this as any);
            TransformManager._currentResizeElement = element;
            const isOnElementEdge = TransformManager._isOnElementEdge;
            if ((!isOnElementEdge.top && !isOnElementEdge.bottom && !isOnElementEdge.left && !isOnElementEdge.right)) {
                return;
            }
            TransformManager.isResizing = true;
            DOM.dispatchEvent("startResizing", this);
            document.addEventListener("mousemove", TransformManager._resize, {capture: true, passive: true});
        }
        event.preventDefault();
    }

    /**
     * Stop l'événement resize sur l'élément et passe la variable isresizing à false
     *
     * @protected
     * @static
     * @memberof TransformManager
     */
    protected static _stopResize() {
        TransformManager.isResizing = false;
        document.removeEventListener("mousemove", TransformManager._resize, false);
    }

    /**
     * Retourne la nouvelle dimension et la nouvelle position possible de l'élément à chaque redimentionnement via l'envoie de l'événement isResizing
     * Ne fonctionne pas si le scale est différent de 1
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof TransformManager
     */
    protected static _resize(event: MouseEvent) {
        const element = TransformManager._currentResizeElement;
        const elementBoundingRect = element.getBoundingClientRect();
        if (!TransformManager.isResizing || elementBoundingRect.width / element.offsetWidth !== 1) {
            return;
        }
        let left = elementBoundingRect.left;
        let top = elementBoundingRect.top;
        let width = element.clientWidth;
        let height = element.clientHeight;
        const minWidth = DOM.parseStyleToNumber(element.getAttribute("min-width")) || 0;
        const minHeight = DOM.parseStyleToNumber(element.getAttribute("min-height")) || 0;
        const deltaMouseX = event.clientX - left;
        const deltaMouseY = event.clientY - top;
        const isOnElementEdge = TransformManager._isOnElementEdge;
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
     * Ne fonctionne pas si le scale est différent de 1
     *
     * @protected
     * @static
     * @param {MouseEvent} event
     * @returns
     * @memberof TransformManager
     */
    protected static _detectElementEdges(event: MouseEvent) {
        const element = event.target as any;
        const elementBoundingRect = element.getBoundingClientRect();
        if (TransformManager.isDragging || TransformManager.isResizing || !element.resizable || elementBoundingRect.width / element.offsetWidth !== 1) {
            return;
        }
        const x = event.clientX - elementBoundingRect.left;
        const y = event.clientY - elementBoundingRect.top;
        const isOnElementEdge = TransformManager._isOnElementEdge;
        isOnElementEdge.top = y < 0;
        isOnElementEdge.left = x < 0;
        isOnElementEdge.right = x >= elementBoundingRect.width;
        isOnElementEdge.bottom = y >= elementBoundingRect.height;
        TransformManager._changeMouseCursor(element);
    }

    /**
     * Change la forme du curseur de la souris en fonction de sa position sur les bords de l'élément
     *
     * @protected
     * @static
     * @param {HTMLElement} element
     * @memberof TransformManager
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

    protected static _rotate(event: EVENTS.Pointer) {
        const handler = event.handler;
        const element = handler.element;
        const options = handler.options;
        let rotateProperties: object = {};
        // FIXME : Problème avec le drag créer une propriété isRotating
        if (event.touches) {

            // TODO : faire pour touch
            rotateProperties = { angle: event.angle, element: handler.element, event, left: event.x, top: event.y };
            console.log("blop")
            // left = 0;
            // top = 0;
            // angle = event.angle;
        } else {

            // Le choix pour left et top se fait côté element ! Mais à tester
            rotateProperties = { angle: event.angle, element: handler.element, event };
        }
        DOM.dispatchEvent("isRotating", rotateProperties);
        // if (event.isFirst) {
        //     const elementBoundingRect = handler.element.getBoundingClientRect();
        //     handler.offset.x = -elementBoundingRect.left;
        //     handler.offset.y = -elementBoundingRect.top;
        //     handler.lastScale = 1;
        //     handler.nthZoom = 0;
        // } else {
        //     const touchCenter = { x: event.x, y: event.y };
        //     let scale = event.scale / handler.lastScale;
        //     handler.lastScale = event.scale;
        //     // On utilise pas les premiers événements car ils sont imprécis
        //     handler.nthZoom += 1;
        //     if (handler.nthZoom > 3) {
        //         const oldZoomFactor = handler.zoomFactor;
        //         handler.zoomFactor *= scale;
        //         handler.zoomFactor = Math.min(handler.options.maxZoom, Math.max(handler.zoomFactor, handler.options.minZoom));
        //         // Met à l'échelle le facteur de zoom par rapport à l'état actuel
        //         scale = handler.zoomFactor / oldZoomFactor;
        //         handler.offset = {
        //             x: handler.offset.x + ((scale - 1) * (touchCenter.x + handler.offset.x) - (touchCenter.x - handler.lastZoomCenter.x)),
        //             y: handler.offset.y + ((scale - 1) * (touchCenter.y + handler.offset.y) - (touchCenter.y - handler.lastZoomCenter.y)),
        //         };
        //     }
        //     handler.lastZoomCenter = touchCenter;
        //     DOM.dispatchEvent("isZooming", {
        //         element: handler.element,
        //         event,
        //         left: -handler.offset.x / handler.zoomFactor,
        //         scale: handler.zoomFactor,
        //         top: -handler.offset.y / handler.zoomFactor,
        //     });
        // }
    }

}
