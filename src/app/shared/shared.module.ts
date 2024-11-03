import { NgModule } from '@angular/core'; // Importa el decorador NgModule de Angular
import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa los módulos de formularios de Angular
import { RouterModule } from '@angular/router'; // Importa el módulo de enrutamiento de Angular
import { CustomInputComponent } from './components/custom-input/custom-input.component'; // Importa el componente personalizado

@NgModule({
  declarations: [
    CustomInputComponent // Declara el componente personalizado en este módulo
  ],
  exports: [
    CustomInputComponent, // Exporta el componente para que pueda ser utilizado en otros módulos
  ],
  imports: [
    CommonModule, // Importa el módulo común que proporciona directivas comunes como ngIf y ngFor
    IonicModule, // Importa el módulo de Ionic para utilizar sus componentes
    FormsModule, // Importa el módulo de formularios para usar formularios basados en plantillas
    ReactiveFormsModule, // Importa el módulo de formularios reactivos para usar formularios reactivos
    RouterModule // Importa el módulo de enrutamiento para utilizar rutas en este módulo
  ]
})
export class SharedModule { } // Define y exporta el SharedModule
