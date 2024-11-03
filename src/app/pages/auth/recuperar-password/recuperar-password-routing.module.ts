import { NgModule } from '@angular/core'; // Importa NgModule de Angular, que permite crear módulos.
import { Routes, RouterModule } from '@angular/router'; // Importa tipos de rutas y RouterModule para la navegación.

import { RecuperarPasswordPage } from './recuperar-password.page'; // Importa el componente RecuperarPasswordPage.

const routes: Routes = [ // Define un arreglo de rutas.
  {
    path: '', // Ruta vacía que corresponde a la página de recuperación de contraseña.
    component: RecuperarPasswordPage // Asocia la ruta con el componente RecuperarPasswordPage.
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa las rutas definidas en el módulo hijo.
  exports: [RouterModule], // Exporta RouterModule para que esté disponible en otros módulos.
})
export class RecuperarPasswordPageRoutingModule {} // Exporta el módulo de rutas de la página de recuperación de contraseña.
