import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GroupStatus } from "src/app/@shared/enum/groupStatus.enum";
import { AuthenticationService } from "src/app/@shared/services/authentication.service";
import { ToastService } from "src/app/@shared/services/toast.service";
import { LcuService } from "../../@shared/services/lcu.service";
import { WebsocketService } from "../../@shared/services/websocket.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //loaderComponent: LoaderComponent;
    //errorComponent: ErrorComponent;
    constructor(private authenticationService: AuthenticationService, private webSocketService: WebsocketService, private toast: ToastService) {
        //this.loaderComponent = new LoaderComponent();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.url == "https://127.0.0.1:2999/liveclientdata/eventdata" && err.status == 0) {
                console.log("catch error game")
                console.log(this.webSocketService.getisPartida);
                if (this.webSocketService.getisPartida == true) {
                    this.webSocketService.finishInterval();
                    var posicao = this.webSocketService.getKillNames.length;
                    console.log("posicao", posicao)
                    if (posicao == 7 || posicao == 6) {
                        this.webSocketService.changeMatchStatus(GroupStatus.PARTIDA_FINALIZADA);
                    }
                }
                console.log("catch error game");
            }
            if (err.status === 401) {

            }

            if (err.status === 500) {
                this.toast.error("Ocorreu um erro inesperado!")
            }

            return throwError(err.error);
        }));
    }
}