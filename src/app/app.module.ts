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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule

import { TShirtComponent } from './t-shirt/t-shirt.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ErrorComponent } from './pages/error/error.component';

// Importa el plugin de EmailComposer de Ionic
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

// Asegúrate de importar el módulo de la página de consulta personalizada
import { ConsultaPersonalizadaPageModule } from './pages/consulta-personalizada/consulta-personalizada.module';

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
    FormsModule,
    ReactiveFormsModule, // Aquí añades ReactiveFormsModule
    ConsultaPersonalizadaPageModule, // Asegúrate de importar el módulo de la página de consulta personalizada
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer // Aquí lo agregamos como un proveedor independiente
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
