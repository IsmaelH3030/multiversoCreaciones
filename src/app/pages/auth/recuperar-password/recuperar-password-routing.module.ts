import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarPasswordPage } from './recuperar-password.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarPasswordPageRoutingModule {}
