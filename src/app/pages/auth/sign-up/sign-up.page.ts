// Importamos los módulos necesarios de Angular.
import { Component, OnInit } from '@angular/core';
// Importamos los módulos para formularios y validaciones.
import { FormControl, FormGroup, Validators } from '@angular/forms';
// Importamos validadores personalizados.
import { CustomValidators } from 'src/app/utils/custom-validators';
// Importamos el servicio de Firebase para manejar la autenticación y registro de usuarios.
import { FirebaseService } from '../../../services/firebase.service';
// Importamos la interfaz de usuario para estructurar los datos de un usuario.
import { User } from 'src/app/models/user.model';
// Importamos el servicio de utilidades para manejar mensajes, redirección y almacenamiento local.
import { UtilsService } from 'src/app/services/utils.service';

// Decorador que define este archivo como un componente de Angular.
@Component({
  selector: 'app-sign-up',                 // Selector para referirse a este componente en HTML.
  templateUrl: './sign-up.page.html',      // Ruta del archivo de la plantilla HTML asociada.
  styleUrls: ['./sign-up.page.scss'],      // Ruta del archivo de estilos CSS asociado.
})
// Clase del componente para la página de registro de usuario.
export class SignUpPage implements OnInit {

  // Definimos el formulario de registro con los campos de nombre, correo, contraseña y confirmación de contraseña.
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]), // Campo de nombre, obligatorio y con longitud mínima.
    email: new FormControl('', [Validators.required, Validators.email]),       // Campo de correo, obligatorio y en formato de correo.
    password: new FormControl('', [Validators.required]),                      // Campo de contraseña, obligatorio.
    confirmPassword: new FormControl(''),                                      // Campo de confirmación de contraseña.
  })

  // Constructor del componente, donde se inyectan los servicios de Firebase y de utilidades.
  constructor(
    private FirebaseSvc: FirebaseService,    // Servicio de Firebase.
    private utilsSvc: UtilsService           // Servicio de utilidades.
  ) { }

  // Método ngOnInit que se ejecuta al inicializar el componente.
  ngOnInit() {
    this.confirmPasswordValidator(); // Llama al método que configura el validador de confirmación de contraseña.
  }

  // Método para validar que las contraseñas coincidan.
  confirmPasswordValidator() {
    // Agrega validadores al campo confirmPassword.
    this.form.controls.confirmPassword.setValidators([
      Validators.required,                                     // Validación que hace el campo obligatorio.
      CustomValidators.matchValues(this.form.controls.password) // Validador personalizado para comparar con el campo password.
    ]);

    // Actualiza el estado de validación de confirmPassword.
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  // Método submit para ejecutar el registro cuando el formulario es enviado.
  submit() {
    // Verifica si el formulario es válido antes de proceder.
    if (this.form.valid) {
      // Muestra un mensaje de carga indicando que se está registrando al usuario.
      this.utilsSvc.presentLoading({ message: 'Registrando...' });

      // Llama al método signUp de FirebaseService para crear el nuevo usuario.
      this.FirebaseSvc.signUp(this.form.value as User).then(async res => {
        console.log(res); // Imprime el resultado en la consola para ver los datos del usuario registrado.

        // Actualiza el nombre del usuario en Firebase.
        await this.FirebaseSvc.updateUser({ displayName: this.form.value.name });

        // Crea un objeto User con los datos del usuario registrado.
        let user: User = {
          uid: res.user.uid,           // ID único del usuario.
          name: res.user.displayName,   // Nombre del usuario.
          email: res.user.email         // Correo electrónico del usuario.
        };

        // Guarda el usuario en el almacenamiento local.
        this.utilsSvc.setElementInLocalstorage('user', user);
        
        // Redirecciona al usuario a la página de inicio.
        this.utilsSvc.routerLink('/tabs/home');

        // Cierra el mensaje de carga.
        this.utilsSvc.dismissLoading();

        // Muestra una notificación de bienvenida.
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`, // Mensaje personalizado con el nombre del usuario.
          duration: 1500,                                 // Duración de 1.5 segundos.
          color: 'primary',                               // Color de fondo de la notificación.
          icon: 'person-outline'                          // Icono de usuario en la notificación.
        });

        // Resetea el formulario después de registrar al usuario.
        this.form.reset();

      }, error => {
        // Maneja errores durante el registro.
        
        // Cierra el mensaje de carga si ocurre un error.
        this.utilsSvc.dismissLoading();
        
        // Muestra una notificación de advertencia con el mensaje de error.
        this.utilsSvc.presentToast({
          message: error,              // Mensaje de error.
          duration: 5000,              // Duración de 5 segundos.
          color: 'warning',            // Color de advertencia en la notificación.
          icon: 'alert-circle-outline' // Icono de alerta en la notificación.
        });
        
      });
    }
  }

}
