import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { ConsultaPersonalizadaPageRoutingModule } from './consulta-personalizada-routing.module';
import { ConsultaPersonalizadaPage } from './consulta-personalizada.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,  // Asegúrate de incluir esto aquí
    IonicModule,
    ConsultaPersonalizadaPageRoutingModule,
  ],
  declarations: [ConsultaPersonalizadaPage]
})
export class ConsultaPersonalizadaPageModule {}
