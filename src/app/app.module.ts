import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ======= Firebase ======== //
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';

import { TShirtComponent } from './t-shirt/t-shirt.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ErrorComponent } from './pages/error/error.component';

// Importa el plugin de EmailComposer de Ionic
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

// Registra el locale español
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    TShirtComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule
  ],
  // Correcta inyección del EmailComposer como proveedor
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer // Aquí lo agregamos como un proveedor independiente
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
