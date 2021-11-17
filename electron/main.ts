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
    }, maximizable: false, minimizable: false, closable: false,
    height: 240,
    width: 340,
    icon: path.join(__dirname, '/../icon.ico')
  });
  win.setMenu(null);
  win.setMenuBarVisibility(false);
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/TFTManager/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  connector.start();
  connector.on("connect", async (data) => {
    setTimeout(async () => {
      win.webContents.send('lcu-load', data);
    }, 5000);
  });

  win.webContents.openDevTools();

  win.on('minimize', function (event) {
    event.preventDefault()
    win.hide()
  })

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
  event.sender.send('app_version', { version: app.getVersion() });
});

IPC.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

IPC.on("change_view", () => {
  var window = BrowserWindow.getFocusedWindow();
  win.setMaximizable(true);
  win.setSize(1060, 760);
  win.setClosable(true);
  win.maximize();
})