import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";

@Injectable({ providedIn: "root" })
export class IpcRenderSService {

    ipcRenderer: IpcRenderer;

    constructor() {
        if ((<any>window).require) {
            try {
                this.ipcRenderer = (<any>window).require('electron').ipcRenderer;

                this.ipcRenderer.on('update_available', () => {
                    console.log("ATUALIZA")
                    this.ipcRenderer.removeAllListeners('update_available');
                    let msg = 'A new update is available. Downloading now...';
                    //abre modal
                });

                this.ipcRenderer.on('update_downloaded', () => {
                    console.log("BAIXOU")
                    this.ipcRenderer.removeAllListeners('update_downloaded');
                    let msg = 'Update Downloaded. It will be installed on restart. Restart now?';
                    //abre modal
                });
            } catch (e) {
                throw e;
            }
        } else {

        }
    }

    restartApp() {
        this.ipcRenderer.send('restart_app');
    }
}