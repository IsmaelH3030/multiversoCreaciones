// Importa los módulos necesarios desde Angular
import { NgModule } from '@angular/core'; // Módulo base de Angular
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'; // Módulos para configurar rutas

// Importa los guards para manejar la autenticación y roles de usuario
import { NoAuthGuard } from './guards/no-auth.guard'; // Evita que usuarios autenticados accedan a ciertas páginas
import { AuthGuard } from './guards/auth.guard'; // Restringe el acceso a usuarios autenticados
import { RoleGuard } from './guards/role.guard'; // Restringe el acceso según el rol del usuario

// Importa los componentes utilizados en las rutas
import { TShirtComponent } from './t-shirt/t-shirt.component'; // Componente para gestionar camisetas
import { ErrorComponent } from './pages/error/error.component'; // Página de error para rutas no encontradas
import { CarritoPage } from './pages/carrito/carrito.page'; // Página del carrito de compras

// Define las rutas de la aplicación
const routes: Routes = [
  {
    path: '', // Ruta principal
    redirectTo: 'auth', // Redirige a la página de autenticación si la ruta está vacía
    pathMatch: 'full' // Coincidencia exacta con la ruta vacía
  },
  {
    path: 'auth', // Ruta de autenticación
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule), // Carga el módulo de autenticación de manera diferida
  },
  {
    path: 'tabs', // Ruta para la navegación con pestañas
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule), // Carga el módulo de pestañas de manera diferida
  },
  {
    path: 't-shirts', // Ruta para la gestión de camisetas
    component: TShirtComponent, // Asigna el componente correspondiente
    canActivate: [AuthGuard] // Protege la ruta para que solo usuarios autenticados accedan
  },
  {
    path: 'carrito', // Ruta del carrito de compras
    loadChildren: () => import('./pages/carrito/carrito.module').then(m => m.CarritoPageModule) // Carga el módulo del carrito de manera diferida
  },
  {
    path: 'contacto', // Ruta de la página de contacto
    loadChildren: () => import('./pages/contacto/contacto.module').then(m => m.ContactoPageModule) // Carga el módulo de contacto de manera diferida
  },
  {
    path: '**', // Ruta comodín para cualquier ruta no definida
    component: ErrorComponent // Muestra la página de error cuando no se encuentra la ruta
  },
];

// Declara el módulo de enrutamiento
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configura las rutas y precarga todos los módulos
  ],
  exports: [RouterModule] // Exporta el módulo de rutas para su uso en la aplicación
})
export class AppRoutingModule { } // Exporta la clase del módulo de rutas
