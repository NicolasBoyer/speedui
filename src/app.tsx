import Button from "button";
import { JSX } from "wapitis";
import Window from "window";
// import WindowsManager from "windows-manager";
import "./www/styles/main.css";

// const windowsManager = new WindowsManager();
// windowsManager.initEvents();

// console.log("blop")

// Pas sur de l'utilité

// console.log(scenariLib.nodesConfig);

// !!!! Rendu à créer un framewok pour créer des window pour faire la config des nodes ...
// !!!!
// tslint:disable-next-line:max-line-length
document.body.appendChild(new Window({title: "Configurer les nodes", width: 600, height: 800, draggable: true, minWidth: 400, className: "blop"}));

// win.hide();
// document.body.appendChild(win);
const win2 = document.body.appendChild(<Window width="800" draggable="true" resizable="true" title="Other"><div>By default, if an element has shadow DOM, the shadow tree is rendered instead of the element's children. To allow children to render, you need to add placeholders for them in your shadow tree. To do this in shadow DOM v1:</div></Window>);
const win = document.body.appendChild(<Window width="600" draggable="false" resizable="true" center="true" title="Configurer les nodes"><div>blirp</div></Window>);
// win.left = 10;
// eventsManager.addWindow(win)
// eventsManager.addWindow(win2)
win.draggable = true;
// console.log(win.left);
// Sans doute revoir la mise en place des attributs
// document.body.appendChild(<button style="position:absolute;bottom:0;" onclick={(ev: MouseEvent) => {win.resizable = true; win.visible = true; win.center = true;const test = document.body.appendChild(<ui-window width="600" center="true" draggable="true" title="Configurer les po"><div>blirp</div></ui-window>) as Window; console.log(test.id);eventsManager.addWindow(test) }}>blop</button>);

const settings = document.body.appendChild(<Button title="Paramètres" type="maximize" class="maximize" style="position:absolute;top:0;font-size: xx-large;left: 1em;height: 1em;width: 1em;cursor: pointer;"></Button>);
// const settings = document.body.appendChild(new Button({title: "Paramètres", type: "maximize", className: "maximize"}));
// settings.setAttribute("style", "position:absolute;top:0;font-size: xx-large;left: 1em;height: 1em;width: 1em;cursor: pointer;");

settings.onclick = () => {
    const test = {blop : true};
    win2.appendChild(<div {...test}>Blirp</div>);
    // win2.left = 100;
    // document.body.appendChild(<Window width="800" center="true" draggable="true" resizable="true" title="Autre"><div>Machin</div></Window>);
};

// document.onmousemove = (event: MouseEvent) => {
//     //console.log(event)
// };
// win.content.appendChild(<div>blirp</div>);

// win.content = <div>blirp</div>;
// win.resizable = true;
// win.title = "blop"
// win.hide()
// win.setAttribute("visible", "false");

// penser au menu, popupwindow, node configurator, tabwindow et peut-etre l'idée de partir moi aussi sur une tabwindow au départ
