import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";
import * as url from "url";

const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const IPC = require('electron').ipcMain;
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');

let win: BrowserWindow;
let login: boolean = false;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }, maximizable: true, closable: true,
    height: 360,
    width: 560,
    icon: path.join(__dirname, '/../icon.ico')
  });
  win.setMenu(null);
  win.setMenuBarVisibility(false);
  win.loadFile(__dirname + `/../../dist/TFTManager/index.html`);

  connector.start();
  connector.on("connect", async (data) => {
    setTimeout(async () => {
      win.webContents.send('lcu-load', data);
    }, 5000);
  });

  win.webContents.openDevTools();

  win.on("closed", (event) => {
    win = null;
  });

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
  });
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault()
  callback(true)
});

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

IPC.on('app_version', (event) => {
  win.webContents.send('app_version', { version: app.getVersion() });
});

IPC.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

IPC.on("change_view", () => {
  win.setSize(1060, 760);
})