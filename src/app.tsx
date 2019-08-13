// import Button from "button";
import { NavManager } from 'nav-manager'
import { JSX } from 'wapitis'
// import Window from "window";
// import WindowsManager from "windows-manager";

// import List from "list";

import Header from 'header'
import { Whiskies } from 'whiskies'
import WhiskyDetails from 'whisky-details'
import './www/styles/main.css'
// import Page from "page";
// import Item from "item";

NavManager.routes = [
    {
        component: WhiskyDetails,
        name: 'whisky',
        path: 'whisky/:id',
    },
]

// Liaison avec la BDD -> ici localstorage pour test
const whiskies = localStorage.getItem('whiskies')

// TODO : voir si on peut pas ajouter un WAPITIS.render avec un fragment ... en cours sur fragment
document.body.appendChild(<Header title='Best Whiskies' />)
document.body.appendChild(<Whiskies items={whiskies} />)

// const windowsManager = new WindowsManager();
// windowsManager.initEvents();

// console.log("blop")

// Pas sur de l'utilité

// console.log(scenariLib.nodesConfig);

// !!!! Rendu à créer un framewok pour créer des window pour faire la config des nodes ...
// !!!!
// tslint:disable-next-line:max-line-length
// document.body.appendChild(new Window({title: "Configurer les nodes", width: 600, height: 800, draggable: true, minWidth: 400, className: "blop"}));

// // win.hide();
// // document.body.appendChild(win);
// const win2 = document.body.appendChild(<Window width="800" draggable="true" resizable="true" title="Other"><div>By default, if an element has shadow DOM, the shadow tree is rendered instead of the element's children. To allow children to render, you need to add placeholders for them in your shadow tree. To do this in shadow DOM v1:</div></Window>);
// const win = document.body.appendChild(<Window width="600" draggable="false" resizable="true" center="true" title="Configurer les nodes"><div>blirp</div></Window>);
// // win.left = 10;
// // eventsManager.addWindow(win)
// // eventsManager.addWindow(win2)
// win.draggable = false;
// // console.log(win.left);
// // Sans doute revoir la mise en place des attributs
// // document.body.appendChild(<button style="position:absolute;bottom:0;" onclick={(ev: MouseEvent) => {win.resizable = true; win.visible = true; win.center = true;const test = document.body.appendChild(<ui-window width="600" center="true" draggable="true" title="Configurer les po"><div>blirp</div></ui-window>) as Window; console.log(test.id);eventsManager.addWindow(test) }}>blop</button>);

// const settings = document.body.appendChild(<Button title="Paramètres" type="maximize" class="maximize" style="position:absolute;top:0;font-size: xx-large;left: 1em;height: 1em;width: 1em;cursor: pointer;"></Button>);
// // const settings = document.body.appendChild(new Button({title: "Paramètres", type: "maximize", className: "maximize"}));
// // settings.setAttribute("style", "position:absolute;top:0;font-size: xx-large;left: 1em;height: 1em;width: 1em;cursor: pointer;");

// settings.onclick = () => {
//     const test = {blop : true};
//     win2.appendChild(<div {...test}>Blirp</div>);
//     // win2.left = 100;
//     // document.body.appendChild(<Window width="800" center="true" draggable="true" resizable="true" title="Autre"><div>Machin</div></Window>);
// };

// Pas encore super et à virer via une classe de gestion des datas
// const items = localStorage.getItem("items");
// const itemsObj = JSON.parse(items || "[]");

// document.body.appendChild(
//     <div class="add">
//         <div>
//             <label for="name">Label:</label>
//             <input type="text" id="name" name="name"/>
//         </div>
//         {/* Textarea */}
//         <div>
//             <label for="description">Description:</label>
//             <input type="text" id="description" name="description"/>
//         </div>
//         <Button title="Envoyer" type="minimize" class="minimize" onclick={() => {
//             const name: HTMLInputElement | null = document.querySelector("#name");
//             const desc: HTMLInputElement | null = document.querySelector("#description");
//             if (name) {
//                 list.add({name: name.value, desc: desc.value});
//             }
//         }}></Button>
//     </div>
// );
// document.body.appendChild(<Button title="Envoyer" type="minimize" class="minimize" onclick={() => {
//     document.body.appendChild(<Window width="600" draggable="false" resizable="false" center="true" title="Configurer les nodes">
//     <div class="add">
//         <div>
//             <label for="name">Label:</label>
//             <input type="text" id="name" name="name"/>
//         </div>
//         {/* Textarea */}
//         <div>
//             <label for="description">Description:</label>
//             <input type="text" id="description" name="description"/>
//         </div>
//         <Button title="Envoyer" type="minimize" class="minimize" onclick={() => {
//             const name: HTMLInputElement | null = document.querySelector("#name");
//             const desc: HTMLInputElement | null = document.querySelector("#description");
//             // if (name) {
//             //     list.add({name: name.value, desc: desc.value});
//             // }
//             itemsObj.push({name: name.value, desc: desc.value});
//             localStorage.setItem("items", JSON.stringify(itemsObj));
//             // Le mieux serait de pas avoir à remettre ça ici et d'uriliser un set fluent
//             list.items = localStorage.getItem("items");
//         }}></Button>
//     </div>
// </Window>);
// }}></Button>);
// // On passe un exemple -> voir comment passer la desc
// const list = document.body.appendChild(<List items={items}></List>);

// TODO : créer un composant Form qui fera un envoi auto des inputs renseignés

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
