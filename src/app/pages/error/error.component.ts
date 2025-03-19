// Importa los módulos necesarios de Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Define el componente con su selector, plantilla y estilos
@Component({
  selector: 'app-error', // Nombre del selector que se usará en el HTML
  templateUrl: './error.component.html', // Ruta del archivo de plantilla HTML asociado
  styleUrls: ['./error.component.scss'], // Ruta del archivo de estilos SCSS asociado
})
export class ErrorComponent {
  // Inyecta el servicio Router en el constructor para manejar la navegación
  constructor(private router: Router) {}

  /**
   * Método que redirige al usuario a la página de inicio cuando se ejecuta.
   */
  goHome() {
    this.router.navigate(['./tabs/home']); // Redirige al usuario a la página principal
  }
}
