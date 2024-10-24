import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ======= fire base ========== //
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { TShirtComponent } from './t-shirt/t-shirt.component'; // Asegúrate de ajustar la ruta según sea necesario

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // Importar el locale español

registerLocaleData(localeEs, 'es'); // Registrar el locale español

@NgModule({
  declarations: [
    AppComponent,
    TShirtComponent // Agrega TShirtComponent aquí
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule // Puedes elegir usar solo FormsModule o ReactiveFormsModule según tus necesidades
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
