import { NgModule } from '@angular/core'; // Importa el decorador NgModule de Angular
import { BrowserModule } from '@angular/platform-browser'; // Importa BrowserModule para aplicaciones web
import { RouteReuseStrategy } from '@angular/router'; // Importa la estrategia de reutilización de rutas

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; // Importa módulos de Ionic

import { AppComponent } from './app.component'; // Importa el componente raíz de la aplicación
import { AppRoutingModule } from './app-routing.module'; // Importa el módulo de enrutamiento de la aplicación

// ======= fire base ========== //
import { AngularFireModule } from '@angular/fire/compat'; // Importa AngularFire para Firebase
import { environment } from 'src/environments/environment.prod'; // Importa la configuración de entorno para Firebase
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importa el módulo de autenticación de Firebase
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importa el módulo de Firestore de Firebase
import { FormsModule } from '@angular/forms'; // Importa FormsModule para formularios

import { TShirtComponent } from './t-shirt/t-shirt.component'; // Importa el componente TShirt

import { registerLocaleData } from '@angular/common'; // Importa función para registrar datos locales
import localeEs from '@angular/common/locales/es'; // Importa los datos locales para español

registerLocaleData(localeEs, 'es'); // Registra el locale español para la aplicación

@NgModule({
  declarations: [
    AppComponent, // Declara el componente raíz de la aplicación
    TShirtComponent // Declara el componente TShirt
  ],
  imports: [
    BrowserModule, // Importa el módulo del navegador
    IonicModule.forRoot(), // Inicializa el módulo de Ionic
    AppRoutingModule, // Importa el módulo de enrutamiento
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa Firebase con la configuración del entorno
    AngularFireAuthModule, // Importa el módulo de autenticación de Firebase
    AngularFirestoreModule, // Importa el módulo de Firestore de Firebase
    FormsModule // Importa el módulo de formularios
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }], // Proveedores de estrategias de reutilización de rutas
  bootstrap: [AppComponent], // Componente raíz que se iniciará al arrancar la aplicación
})
export class AppModule {} // Exporta el módulo principal de la aplicación
