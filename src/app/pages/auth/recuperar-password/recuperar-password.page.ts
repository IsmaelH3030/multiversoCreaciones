// Importamos los módulos necesarios de Angular.
import { Component, OnInit } from '@angular/core';
// Importamos los módulos para trabajar con formularios y validaciones.
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Importamos el servicio de Firebase para manejar la autenticación.
import { FirebaseService } from '../../../services/firebase.service';
// Importamos el servicio de utilidades para mostrar mensajes y loaders.
import { UtilsService } from 'src/app/services/utils.service';

// Decorador que define este archivo como un componente de Angular.
@Component({
  selector: 'app-recuperar-password',         // Selector utilizado en el HTML para referirse a este componente.
  templateUrl: './recuperar-password.page.html',  // Ruta del archivo de la plantilla HTML asociada.
  styleUrls: ['./recuperar-password.page.scss'],  // Ruta del archivo de estilos CSS asociado.
})
// Clase del componente para la página de recuperación de contraseña.
export class RecuperarPasswordPage implements OnInit {

  // Definimos un formulario con un solo campo, 'email', y validaciones.
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]) // Campo 'email' requerido y con formato de correo.
  });

  // Constructor del componente, donde se inyectan los servicios de Firebase y utilidades.
  constructor(
    private FirebaseSvc: FirebaseService,    // Servicio de Firebase.
    private utilsSvc: UtilsService           // Servicio de utilidades.
  ) { }

  // Método ngOnInit, que se ejecuta cuando el componente se inicializa. No tiene funcionalidad en este caso.
  ngOnInit() {}

  // Método submit que se ejecuta al enviar el formulario.
  submit() {
    // Verifica si el formulario es válido antes de proceder.
    if (this.form.valid) {
      // Muestra un mensaje de carga indicando que se está enviando el enlace de recuperación.
      this.utilsSvc.presentLoading({ message: 'Enviando enlace de recuperación...' });
      
      // Llama al método resetPassword del servicio de Firebase para enviar el enlace.
      this.FirebaseSvc.resetPassword(this.form.value.email).then(() => {
        // Cierra el mensaje de carga cuando se envía el enlace correctamente.
        this.utilsSvc.dismissLoading();
        
        // Muestra una notificación confirmando que el enlace se ha enviado al correo.
        this.utilsSvc.presentToast({
          message: 'Enlace de recuperación enviado a tu correo.',
          duration: 3000,     // Duración de 3 segundos.
          color: 'primary',   // Color de fondo de la notificación.
          icon: 'mail-outline' // Icono de sobre en la notificación.
        });
        
        // Resetea el formulario después de enviar el enlace.
        this.form.reset();
      }).catch(error => {
        // Cierra el mensaje de carga en caso de error.
        this.utilsSvc.dismissLoading();
        
        // Muestra una notificación con el mensaje de error si algo falla.
        this.utilsSvc.presentToast({
          message: error.message,          // Mensaje de error.
          duration: 5000,                  // Duración de 5 segundos.
          color: 'warning',                // Color de advertencia en la notificación.
          icon: 'alert-circle-outline'     // Icono de advertencia en la notificación.
        });
      });
    }
  }
}
