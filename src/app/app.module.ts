import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {DashboardModule } from './dashboard/dashboard.module';

import { HeaderComponent } from './pages/header/header.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';

// Firestarter App Modules
import { CoreModule } from './core/core.module';
// import { UploadsModule } from './uploads/uploads.module';

// @angular/fire/ Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PagesModule } from './pages/pages.module';
import { ImportDataModule } from './import-data/import-data.module';
import { UsersModule } from './users/users.module';
// import { AlertComponent } from './_directives/alert.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { AlertComponent } from './_directives/alert.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PagesModule,
    ImportDataModule,
   // UsersModule,
    CoreModule,
    AppRoutingModule,
    DashboardModule,
    // UploadsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    UsersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
