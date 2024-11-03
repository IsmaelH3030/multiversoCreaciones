import { Component, OnInit } from '@angular/core'; // Importa los módulos básicos de Angular para crear el componente y gestionar el ciclo de vida
import { FormControl, FormGroup, Validators } from '@angular/forms'; // Importa módulos para manejar formularios y validaciones en Angular
import { User } from 'src/app/models/user.model'; // Importa el modelo de datos `User` para tipar los datos de usuario
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase para gestionar la autenticación y otros servicios relacionados
import { UtilsService } from 'src/app/services/utils.service'; // Importa un servicio de utilidades que proporciona funciones auxiliares, como mostrar mensajes y cargar indicadores


@Component({
  selector: 'app-auth', // Define el selector que se usará para este componente en las plantillas
  templateUrl: './auth.page.html', // Ruta al archivo de la plantilla HTML del componente
  styleUrls: ['./auth.page.scss'], // Ruta al archivo de estilos del componente
})
export class AuthPage implements OnInit {

  // Definición del formulario de autenticación con los campos necesarios
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Campo de correo electrónico con validación requerida y de formato de email
    password: new FormControl('', [Validators.required]) // Campo de contraseña con validación requerida
  });

  constructor(
    private FirebaseSvc: FirebaseService, // Inyección del servicio de Firebase para autenticación
    private utilsSvc: UtilsService // Inyección del servicio de utilidades para funciones adicionales
  ) { }

  ngOnInit() {
    // Método de ciclo de vida que se ejecuta al iniciar el componente
  }

  // Método para manejar el envío del formulario
  submit() {
    if (this.form.valid) { // Verifica si el formulario es válido
      // this.utilsSvc.presentLoading muestra un indicador de carga con mensaje "Autenticando..."
      this.utilsSvc.presentLoading({message: 'Autenticando...'});
      
      // Llama al método de inicio de sesión en el servicio de Firebase y pasa los datos del formulario como usuario
      this.FirebaseSvc.login(this.form.value as User).then(async res => {
        console.log(res); // Muestra en consola la respuesta de la autenticación

        // Crea un objeto de usuario con los datos devueltos de la autenticación
        let user: User = {
          uid: res.user.uid, // ID de usuario de Firebase
          name: res.user.displayName, // Nombre de usuario (puede estar vacío si no está configurado)
          email: res.user.email // Email del usuario autenticado
        };

        // Guarda el usuario en el almacenamiento local
        this.utilsSvc.setElementInLocalstorage('user', user);
        this.utilsSvc.routerLink('/tabs/home'); // Navega a la página principal después de iniciar sesión

        this.utilsSvc.dismissLoading(); // Cierra el indicador de carga

        // Muestra un mensaje de bienvenida al usuario
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500, // Duración del mensaje en pantalla
          color: 'primary', // Color del mensaje
          icon: 'person-outline' // Icono para mostrar junto al mensaje
        });

        this.form.reset(); // Reinicia el formulario
      }, error => {
        
        this.utilsSvc.dismissLoading(); // Cierra el indicador de carga si hay un error
        // Muestra un mensaje de error en caso de falla en el inicio de sesión
        this.utilsSvc.presentToast({
          message: error, // Mensaje de error que devuelve Firebase
          duration: 5000, // Duración del mensaje en pantalla
          color: 'warning', // Color del mensaje para advertencia
          icon: 'alert-circle-outline' // Icono de advertencia
        });
        
      });
    }
  }

}
