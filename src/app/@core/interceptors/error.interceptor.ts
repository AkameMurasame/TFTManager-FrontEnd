import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "src/app/@shared/services/authentication.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //loaderComponent: LoaderComponent;
    //errorComponent: ErrorComponent;
    constructor(private authenticationService: AuthenticationService) {
        //this.loaderComponent = new LoaderComponent();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {

            }
            return throwError(err.error);
        }));
    }
}