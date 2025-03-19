import { Component, OnInit } from '@angular/core'; // Importa las dependencias necesarias para crear un componente y utilizar el ciclo de vida
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase para autenticación y manejo de usuarios
import { UtilsService } from '../../../services/utils.service'; // Importa un servicio de utilidades para manejar operaciones comunes
import { User } from 'src/app/models/user.model'; // Importa el modelo de usuario para definir la estructura de los datos del usuario

@Component({
  selector: 'app-profile', // Selector del componente para usar en plantillas
  templateUrl: './profile.page.html', // Ruta a la plantilla HTML del componente
  styleUrls: ['./profile.page.scss'], // Ruta a los estilos SCSS del componente
})
export class ProfilePage implements OnInit { // Declara la clase ProfilePage que implementa la interfaz OnInit

  user = {} as User; // Inicializa una propiedad "user" como un objeto de tipo User

  constructor( // Constructor de la clase
    private firebaseSvc: FirebaseService, // Inyecta el servicio de Firebase para poder usarlo
    private utilsScv: UtilsService // Inyecta el servicio de utilidades
  ) { }

  ngOnInit() { // Método del ciclo de vida que se llama al inicializar el componente
  }

  ionViewWillEnter() { // Método del ciclo de vida que se llama antes de que la vista del componente entre en foco
    this.getUser(); // Llama al método getUser para obtener los datos del usuario
  }

  signOut() { // Método para cerrar sesión
    this.firebaseSvc.signOut(); // Llama al método signOut del servicio de Firebase para desconectar al usuario
  }

  getUser() {
    const storedUser = this.utilsScv.getElementFromLocalStorage('user');
    this.user = storedUser ? storedUser : { uid: '', name: '', email: '', role: 'cliente' };
  }
  
}
