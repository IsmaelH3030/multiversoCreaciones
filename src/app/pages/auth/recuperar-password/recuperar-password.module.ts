import { NgModule } from '@angular/core'; // Importa NgModule para definir un módulo Angular.
import { CommonModule } from '@angular/common'; // Importa CommonModule para utilizar funcionalidades comunes de Angular.
import { FormsModule } from '@angular/forms'; // Importa FormsModule para trabajar con formularios en Angular.

import { IonicModule } from '@ionic/angular'; // Importa IonicModule para utilizar componentes de Ionic.

import { RecuperarPasswordPageRoutingModule } from './recuperar-password-routing.module'; // Importa el módulo de rutas para la página de recuperación de contraseña.

import { RecuperarPasswordPage } from './recuperar-password.page'; // Importa el componente de la página de recuperación de contraseña.
import { SharedModule } from 'src/app/shared/shared.module'; // Importa un módulo compartido que contiene componentes/directivas/servicios reutilizables.

@NgModule({
  imports: [ // Sección para importar otros módulos necesarios.
    CommonModule, // Proporciona funcionalidades comunes como ngIf, ngFor, etc.
    FormsModule, // Permite el uso de formularios en la aplicación.
    IonicModule, // Proporciona componentes y funcionalidades de Ionic.
    RecuperarPasswordPageRoutingModule, // Importa el módulo de rutas para gestionar la navegación.
    SharedModule // Importa el módulo compartido para acceder a componentes/directivas/servicios reutilizables.
  ],
  declarations: [RecuperarPasswordPage] // Declara el componente RecuperarPasswordPage que se utilizará en este módulo.
})
export class RecuperarPasswordPageModule {} // Exporta el módulo de recuperación de contraseña para que se pueda utilizar en otras partes de la aplicación.
