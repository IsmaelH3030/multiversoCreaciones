import { Component, Input, OnInit } from '@angular/core'; // Importa los decoradores y clases necesarias de Angular
import { FormControl } from '@angular/forms'; // Importa la clase FormControl para manejar el estado del formulario

@Component({
  selector: 'app-custom-input', // Define el selector del componente que se usará en otras partes de la aplicación
  templateUrl: './custom-input.component.html', // Especifica la ubicación de la plantilla HTML del componente
  styleUrls: ['./custom-input.component.scss'], // Especifica la ubicación de los estilos SCSS del componente
})
export class CustomInputComponent implements OnInit {
  // Propiedades de entrada que permiten recibir datos desde el componente padre
  @Input() control: FormControl; // Control del formulario que se vinculará al input
  @Input() label: string; // Etiqueta que se mostrará para el campo de entrada
  @Input() icon: string; // Nombre del icono que se mostrará en el input (si se proporciona)
  @Input() type: string; // Tipo del campo de entrada (por ejemplo, texto, contraseña)
  @Input() autocomplete: string; // Atributo de autocompletado para el input

  constructor() { }

  ngOnInit() { } // Método que se ejecuta al inicializar el componente, actualmente vacío
}
