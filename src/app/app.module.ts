import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { SharedModule } from './@shared/shared.module';
import { MainModule } from './main/main.module';

import { LoadingService } from './@shared/loading/loading.service';

import { LoadingComponent } from './@shared/loading/loading.component';
import { AppComponent } from './app.component';

import { ErrorInterceptor } from './@core/interceptors/error.interceptor';
import { JwtInterceptor } from './@core/interceptors/jwt.interceptor';
import { ApiHttpClient } from './@core/services/api-http-client';
import { RiotApiCore } from './@riotApi';
import { AppRoutingModule } from './RoutesApp';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NoopAnimationsModule, AppRoutingModule, MainModule, HttpClientModule, SharedModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    ApiHttpClient,
    JwtHelperService,
    RiotApiCore,
    LoadingService
  ],
  entryComponents: [LoadingComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
