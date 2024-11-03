import { NgModule } from '@angular/core'; // Importa el decorador NgModule desde Angular core
import { Routes, RouterModule } from '@angular/router'; // Importa las interfaces Routes y RouterModule para la configuración de rutas

import { TabsPage } from './tabs.page'; // Importa el componente TabsPage desde su archivo correspondiente

// Define las rutas para la aplicación
const routes: Routes = [
  {
    path: '', // Ruta raíz del módulo
    component: TabsPage, // Asocia la ruta con el componente TabsPage
  },
  {
    path: 'home', // Ruta para la página de inicio
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) // Carga perezosamente el módulo HomePageModule
  },
  {
    path: 'profile', // Ruta para la página de perfil
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule) // Carga perezosamente el módulo ProfilePageModule
  },
  {
    path: 'productos', // Ruta para la página de productos
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule) // Carga perezosamente el módulo ProductosPageModule
  }
];

// Configuración del módulo de rutas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa RouterModule y configura las rutas definidas
  exports: [RouterModule], // Exporta RouterModule para que esté disponible en otros módulos
})
export class TabsPageRoutingModule {} // Declara la clase TabsPageRoutingModule que gestiona las rutas del módulo Tabs
