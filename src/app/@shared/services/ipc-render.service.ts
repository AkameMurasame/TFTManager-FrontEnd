import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { MatchService } from "./match.service";
import { ToastService } from "./toast.service";

@Injectable({ providedIn: "root" })
export class IpcRenderSService {

    ipcRenderer: IpcRenderer;

    constructor(private toastService: ToastService, private match: MatchService) {
        if ((<any>window).require) {
            try {
                this.ipcRenderer = (<any>window).require('electron').ipcRenderer;

                this.ipcRenderer.on('update_available', () => {
                    console.log("ATUALIZA")
                    this.ipcRenderer.removeAllListeners('update_available');
                    let msg = 'Uma nova atualização está disponivel, o download está sendo executado em segundo plano!';
                    this.toastService.success(msg);
                });

                this.ipcRenderer.on('update_downloaded', () => {
                    console.log("BAIXOU")
                    this.ipcRenderer.removeAllListeners('update_downloaded');
                    let msg = 'Atualização Realizada. O TFTManager será reiniciado!';
                    this.toastService.success(msg);

                    setTimeout(() => {
                        this.ipcRenderer.send('restart_app');
                    }, 7000);
                });
            } catch (e) {
                throw e;
            }
        } else {

        }
    }
}