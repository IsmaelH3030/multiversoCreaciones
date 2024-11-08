import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaPersonalizadaPageRoutingModule } from './consulta-personalizada-routing.module';

import { ConsultaPersonalizadaPage } from './consulta-personalizada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaPersonalizadaPageRoutingModule
  ],
  declarations: [ConsultaPersonalizadaPage]
})
export class ConsultaPersonalizadaPageModule {}
