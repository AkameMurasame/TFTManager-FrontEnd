import { Injectable } from "@angular/core";
import { HotToastService, ToastOptions } from "@ngneat/hot-toast";

@Injectable({ providedIn: "root" })
export class ToastService {

    constructor(private toast: HotToastService) { }

    warning(message: string) {
        this.toast.warning(message, {
            position: 'top-right',
            dismissible: true,
            style: {
                padding: '12px',
            },
        });
    }

    error(message: string) {
        console.log("carai")
        this.toast.error(message, {
            position: 'top-right',
            dismissible: true,
            style: {
                padding: '12px',
            },
        });
    }

    success(message: string) {
        this.toast.success(message, {
            position: 'top-right',
            dismissible: true,
            style: {
                padding: '12px',
            },
            iconTheme: {
                primary: '#007965',
                secondary: '#fff',
            },
        });
    }
}