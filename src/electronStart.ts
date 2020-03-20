/* eslint-disable @typescript-eslint/naming-convention */
import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'

const ENV = process.env.NODE_ENV || 'production'
const ELECTRON_ENV = process.env.ELECTRON_ENV
const DEBUG = ENV === 'development'
let win: any
let splash: any

function createWindow(): void {
    win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    splash = new BrowserWindow({ width: 810, height: 610, transparent: true, frame: false, alwaysOnTop: true })

    if (DEBUG) {
        splash.loadURL('http://localhost:4444/splash/splash.html')
        win.loadURL('http://localhost:4444')
        // Open the DevTools.
        win.webContents.openDevTools()
    } else {
        splash.loadURL(url.format({
            pathname: path.join(app.getAppPath(), 'dist/splash/', 'splash.html'),
            protocol: 'file:',
            slashes: true
        }))
        win.loadURL(url.format({
            pathname: path.join(app.getAppPath(), 'dist', 'index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }
    win.once('ready-to-show', () => {
        splash.destroy()
        win.maximize()
    })
    win.on('closed', () => win = null)

    // Menu
    const menuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Fichier',
            submenu: [
                {
                    accelerator: 'Alt+F4',
                    label: 'Quitter',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Affichage',
            submenu: [
                {
                    label: 'Recharger',
                    role: 'reload'
                },
                {
                    label: 'Basculer en plein écran',
                    role: 'togglefullscreen'
                },
                {
                    label: 'Developper tools (DEBUG)',
                    role: 'toggleDevTools'
                }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal('https://nicolasboyer.github.io/wapitis/')
                    }
                },
                { type: 'separator' },
                {
                    label: 'Rechercher une mise à jour...',
                    click() {
                        autoUpdater.checkForUpdates()
                    }
                },
                { type: 'separator' },
                {
                    label: 'A propos de',
                    click() {
                        win.webContents.send('show_about',
                            {
                                appVersion: app.getVersion(),
                                chromeVersion: process.versions.chrome,
                                electronVersion: process.versions.electron,
                                nodeJsVersion: process.versions.node,
                                v8Version: process.versions.v8
                            }
                        )
                    }
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate)
    if (!DEBUG && menu.items[1].submenu) {
        menu.items[1].submenu.items[2].visible = false
    }
    if ((DEBUG || ELECTRON_ENV === 'production') && menu.items[2].submenu) {
        menu.items[2].submenu.items[2].enabled = false
    }
    Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
    createWindow()
    if (ELECTRON_ENV === 'publish') {
        setTimeout(() => {
            autoUpdater.checkForUpdates()
        }, 1000)
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

// AUTOUPDATE
ipcMain.on('restart_app', () => autoUpdater.quitAndInstall())

function sendUpdateStatusToWindow(options: { text: string, isRestartButton?: boolean, isCloseButton?: boolean, autoCloseWindow?: boolean }): void {
    win.webContents.send('message', { text: options.text, isRestartButton: options.isRestartButton || false, isCloseButton: options.isCloseButton !== undefined ? options.isCloseButton : true, autoCloseWindow: options.autoCloseWindow || false })
}

autoUpdater.on('checking-for-update', () => sendUpdateStatusToWindow({ text: 'Vérification des mises à jours...', isCloseButton: false }))

autoUpdater.on('update-not-available', () => sendUpdateStatusToWindow({ text: 'Aucune mise à jour disponible.', isCloseButton: false, autoCloseWindow: true }))

autoUpdater.on('update-available', () => sendUpdateStatusToWindow({ text: 'Une mise à jour est disponible !<br>Téléchargement en cours ...' }))

// autoUpdater.on('download-progress', (progressObj) => {
//     let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
//     logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
//     logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
//     sendUpdateStatusToWindow({text: logMessage})
// })

autoUpdater.on('update-downloaded', () => sendUpdateStatusToWindow({ text: 'Mise à jour téléchargée !<br>Elle sera installée au redémarrage de l\'application.<br><br>Redémarrez maintenant ?', isRestartButton: true }))

autoUpdater.on('error', (err) => sendUpdateStatusToWindow({ text: 'error - ' + err }))

// VERSION AVEC DEMANDE ET RECEPTCION
// ipcMain.on('app_version', (event) => event.sender.send('app_version', { version: app.getVersion() }))
