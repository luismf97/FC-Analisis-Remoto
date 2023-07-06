import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.URI, options: {} };
//const config: SocketIoConfig = { url: 'localhost:5000', options: {} };

import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular-highcharts';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { registerLocaleData } from "@angular/common";
import localeMx from "@angular/common/locales/es-MX";

registerLocaleData(localeMx);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SocketIoModule.forRoot(config),
    ChartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    AppRoutingModule,
    SweetAlert2Module,
    NoopAnimationsModule,
  ],
  providers: [{provide: LOCALE_ID, useValue: "es-MX"}],
  bootstrap: [AppComponent]
})
export class AppModule { }
