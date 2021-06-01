import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

const LCUConnector = require("lcu-connector");
const connector = new LCUConnector();
const IPC = require('electron').ipcRenderer;

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }, maximizable: true
  });
  win.setMenu(null);
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/TFTManager/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  connector.start();
  connector.on("connect", async (data) => {
    win.webContents
    .executeJavaScript(
      `localStorage.removeItem('Api');`,
      true
    )
    .then((result) => {
      win.webContents
        .executeJavaScript(
          `localStorage.removeItem('currentUser');`,
          true
        )
        .then((result) => {
          win.webContents
            .executeJavaScript(
              `localStorage.removeItem('currentPlayer');`,
              true
            )
            .then((result) => {
             
            });
        });
    });
    setTimeout(async () => {
      win.webContents.send('lcu-load', data);
    }, 5000);
  });

  win.webContents.openDevTools();

  win.on('minimize', function (event) {
    event.preventDefault()
    win.hide()
  })

  win.on("closed", () => {
    win = null;
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
