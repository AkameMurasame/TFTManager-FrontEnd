"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var LCUConnector = require("lcu-connector");
var connector = new LCUConnector();
var IPC = require('electron').ipcMain;
var autoUpdater = require('electron-updater').autoUpdater;
var isDev = require('electron-is-dev');
var win;
var login = false;
function createWindow() {
    var _this = this;
    win = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }, maximizable: false, minimizable: false, closable: true,
        height: 340,
        width: 540,
        icon: path.join(__dirname, '/../icon.ico')
    });
    win.setMenu(null);
    win.setMenuBarVisibility(false);
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/TFTManager/index.html"),
        protocol: "file:",
        slashes: true,
    }));
    connector.start();
    connector.on("connect", function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    win.webContents.send('lcu-load', data);
                    return [2 /*return*/];
                });
            }); }, 5000);
            return [2 /*return*/];
        });
    }); });
    win.webContents.openDevTools();
    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });
    win.on("closed", function (event) {
        win = null;
    });
    win.once('ready-to-show', function () {
        autoUpdater.checkForUpdatesAndNotify();
    });
    autoUpdater.on('update-available', function () {
        win.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', function () {
        win.webContents.send('update_downloaded');
    });
}
electron_1.app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
    event.preventDefault();
    callback(true);
});
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
IPC.on('app_version', function (event) {
    event.sender.send('app_version', { version: electron_1.app.getVersion() });
});
IPC.on('restart_app', function () {
    autoUpdater.quitAndInstall();
});
IPC.on("change_view", function () {
    var window = electron_1.BrowserWindow.getFocusedWindow();
    win.setMaximizable(true);
    win.setSize(1060, 760);
    win.setClosable(true);
    win.maximize();
});
//# sourceMappingURL=main.js.map