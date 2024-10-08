import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { TShirtComponent } from './t-shirt/t-shirt.component'; // Importa el componente TShirt

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule), // Puedes agregar canActivate aquí si es necesario
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule), // Puedes agregar canActivate aquí si es necesario
  },
  {
    path: 't-shirts', // Ruta para las poleras
    component: TShirtComponent,
    canActivate: [AuthGuard] // Proteger la ruta para que solo usuarios autenticados puedan acceder
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
