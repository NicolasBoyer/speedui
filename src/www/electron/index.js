/* eslint-disable no-irregular-whitespace */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

const style = document.createElement('style')
style.innerHTML = `#notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 210px;
    padding: 20px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.hidden {
    display: none;
}`
document.head.appendChild(style)
const container = document.createElement('div')
container.id = 'notification'
container.classList.add('hidden')
const message = document.createElement('p')
container.appendChild(message)
const closeButton = document.createElement('button')
closeButton.innerHTML = 'Fermer'
closeButton.classList.add('hidden')
closeButton.onclick = () => container.classList.add('hidden')
container.appendChild(closeButton)
const restartButton = document.createElement('button')
restartButton.classList.add('hidden')
restartButton.onclick = () => ipcRenderer.send('restart_app')
restartButton.innerHTML = 'Redémarrer'
container.appendChild(restartButton)
document.body.appendChild(container)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function showInfos(options) {
    let timer
    container.classList.remove('hidden')
    message.innerHTML = options.text
    if (options.isRestartButton) restartButton.classList.remove('hidden')
    if (options.isCloseButton) closeButton.classList.remove('hidden')
    if (options.autoCloseWindow) {
        timer = setTimeout(() => {
            container.classList.add('hidden')
            clearTimeout(timer)
        }, 1000)
    }
}

ipcRenderer.on('message', (_event, options) => showInfos(options))

ipcRenderer.on('show_about', (_event, arg) => {
    const style = document.createElement('style')
    style.innerHTML = `.about {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.container {
    border-radius: 0.3125rem;
    box-shadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.2), 0 0.0625rem 0.0625rem 0 rgba(0, 0, 0, 0.14), 0 0.125rem 0.0625rem -0.0625rem rgba(0, 0, 0, 0.12);
    width: 40rem;
    position: absolute;
    top: 10rem;
    left: 50%;
    margin-left: -20rem;
    text-align: center;
    background: #fff;
    padding: 0.5rem;
    font-family: monospace;
    font-weight: bold;
    user-select: none;
}

.background {
    background: #000;
    opacity: 0.6;
    width: 100%;
    height: 100%;
}

.credit {
    display: flex;
    justify-content: space-between;
}

.infos {
    padding: 0.5rem
}`
    document.head.appendChild(style)
    const about = document.createElement('div')
    about.classList.add('about')
    about.addEventListener('click', () => document.body.removeChild(about))
    const background = document.createElement('div')
    background.classList.add('background')
    about.appendChild(background)
    const container = document.createElement('div')
    container.classList.add('container')
    about.appendChild(container)
    container.innerHTML = `<img src="./about.png"/>
<div class="infos">
<div>Version : ${arg.appVersion}</div>
<div>Date : ${new Date().toLocaleDateString()}</div>
<div>Electron : ${arg.electronVersion}</div>
<div>Chrome : ${arg.chromeVersion}</div>
<div>Node.js : ${arg.nodeJsVersion}</div>
<div>V8 : ${arg.v8Version}</div>
</div>
<div class="credit">
<div>© 2019</div>
<div>Tous droits réservés.</div>
</div>`
    document.body.appendChild(about)
})

// VERSION AVEC DEMANDE ET RECEPTCION
// ipcRenderer.send('app_version');
// ipcRenderer.on('app_version', (event, arg) => {
//     ipcRenderer.removeAllListeners('app_version');
//     const version = document.createElement("p")
//     version.innerText = 'Version ' + arg.version;
//     document.body.appendChild(version)
// });
