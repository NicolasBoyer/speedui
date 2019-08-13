interface IRoute {
    component: typeof HTMLElement;
    path: string;
    name: string;
    datas?: {};
}

// TODO : Voir si on peut gérer une arrivée directe sur une page (tester sur un serveur normal et voir si compatible avec le principe de PWA)
// TODO : y a t-il besoin d'accéder à un historique ? Est ce nécessaire et surtout souhaitable ?

// TODO : reste à envoyer et permettra la récupération des params !!

export abstract class NavManager {

    static routes: IRoute[];

    static push(name: string, params: any = {}, isPushState: boolean = true) {
        const route = this._getRoute(name);
        if (route) {
            const element = new route.component();
            this._elements.push(element);
            document.body.appendChild(element);
            let path = route.path;
            const isVariable = path.match(/:/g);
            if (isVariable) {
                const variable = path.substring(path.lastIndexOf(":") + 1);
                if (params[variable]) {
                    path = route.path.replace(":" + variable, params[variable]);
                }
            }
            if (isPushState) {
                history.pushState({name, params}, "", path);
            }
        }
    }

    static pop(isHistoryBack: boolean = true) {
        const element = this._elements.pop();
        if (element) {
            document.body.removeChild(element);
            if (isHistoryBack) {
                history.back();
            }
            return true;
        }
        return false;
    }

    protected static _elements: HTMLElement[] = [];

    protected static _getRoute(name: string) {
        for (const key in this.routes) {
            if (this.routes.hasOwnProperty(key)) {
                const route = this.routes[key];
                if (route.name === name) {
                    return route;
                }
            }
        }
        return null;
    }

    // TODO : A passer dans DOM ou utils
    // protected static slugify(str: string){
    //     const a = "ãàáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/-,:;";
    //     const b = "aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh______";
    //     const p = new RegExp(a.split("").join("|"), "g");

    //     return str.toString().toLowerCase()
    //         .replace(/\s+/g, "_")           // Replace spaces with _
    //         .replace(p, c =>
    //             b.charAt(a.indexOf(c)))     // Replace special chars
    //         .replace(/&/g, "_and_")         // Replace & with 'and'
    //         .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    //         .replace(/\-\-+/g, "_")         // Replace multiple - with single _
    //         .replace(/^-+/, "")             // Trim - from start of text
    //         .replace(/-+$/, "");            // Trim - from end of text
    // }

}

window.addEventListener("popstate", (event) => {
    if (!NavManager.pop(false)) {
        NavManager.push(event.state.name, event.state.params, false);
    }
});
