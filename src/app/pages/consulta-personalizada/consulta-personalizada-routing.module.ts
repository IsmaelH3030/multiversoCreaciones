import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaPersonalizadaPage } from './consulta-personalizada.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaPersonalizadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaPersonalizadaPageRoutingModule {}
