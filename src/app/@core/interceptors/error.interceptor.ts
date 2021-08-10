import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "src/app/@shared/services/authentication.service";
import { LcuService } from "../../@shared/services/lcu.service";
import { WebsocketService } from "../../@shared/services/websocket.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //loaderComponent: LoaderComponent;
    //errorComponent: ErrorComponent;
    constructor(private authenticationService: AuthenticationService, private webSocketService: WebsocketService) {
        //this.loaderComponent = new LoaderComponent();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.url == "https://127.0.0.1:2999/liveclientdata/eventdata" && err.status == 0) {
                console.log("catch error game")
                console.log(this.webSocketService.getisPartida);
                if(this.webSocketService.getisPartida == true) {
                    this.webSocketService.finishInterval();
                }
            }
            if (err.status === 401) {

            }
            return throwError(err.error);
        }));
    }
}