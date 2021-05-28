import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./RoutesApp";
import { MainModule } from "./main/main.module";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { JwtInterceptor } from "./@core/interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./@core/interceptors/error.interceptor";
import { SharedModule } from "./@shared/shared.module";
import { ApiHttpClient } from "./@core/services/api-http-client";
import { RiotApiCore } from "./@riotApi";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NoopAnimationsModule, AppRoutingModule, MainModule, HttpClientModule, SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    ApiHttpClient,
    JwtHelperService,
    RiotApiCore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
