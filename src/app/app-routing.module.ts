// Importa los módulos necesarios desde Angular
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// Importa los guards para manejar la autenticación
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
// Importa el componente TShirt
import { TShirtComponent } from './t-shirt/t-shirt.component';

// Define las rutas de la aplicación
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth', // Redirige a 'auth' si la ruta está vacía
    pathMatch: 'full' // Debe coincidir completamente para activar la redirección
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule), // Carga el módulo de autenticación
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule), // Carga el módulo de pestañas
  },
  {
    path: 't-shirts', // Ruta para las poleras
    component: TShirtComponent, // Asocia el componente TShirt a esta ruta
    canActivate: [AuthGuard] // Protege la ruta para que solo usuarios autenticados puedan acceder
  },
];

// Declara el módulo de enrutamiento
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configura el enrutador con las rutas definidas y estrategia de carga perezosa
  ],
  exports: [RouterModule] // Exporta el RouterModule para que esté disponible en toda la aplicación
})
export class AppRoutingModule { } // Exporta la clase AppRoutingModule
