import { Component, OnInit } from '@angular/core'; // Importa los decoradores y la interfaz necesarios de Angular
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio para manejar autenticación de Firebase
import { UtilsService } from './services/utils.service'; // Servicio utilitario para operaciones comunes
import { User } from 'src/app/models/user.model'; // Modelo de usuario para tipado

@Component({
  selector: 'app-root', // Selector que se usará en la plantilla principal
  templateUrl: 'app.component.html', // Archivo de plantilla HTML asociado
  styleUrls: ['app.component.scss'], // Estilos SCSS asociados a este componente
})
export class AppComponent implements OnInit { // Clase principal del componente que implementa OnInit
  public user: User = {} as User; // Propiedad para almacenar información del usuario, inicializada como un objeto vacío
  public isAuthenticated: boolean = false; // Propiedad para verificar si el usuario está autenticado

  constructor(
    private firebaseSvc: FirebaseService, // Inyección del servicio de Firebase
    private utilsSvc: UtilsService // Inyección del servicio utilitario
  ) {}

  ngOnInit() { // Método que se ejecuta al inicializar el componente
    // Suscripción al estado de autenticación
    this.firebaseSvc.getAuthState().subscribe(user => {
      this.isAuthenticated = !!user; // Establece isAuthenticated en true si hay un usuario
      if (this.isAuthenticated) {
        this.getUser(); // Llama a getUser si el usuario está autenticado
      }
    });
  }

  ionViewWillEnter() { // Ciclo de vida que se ejecuta antes de que la vista se muestre
    this.getUser(); // Obtiene datos del usuario cada vez que la vista está a punto de entrar
  }

  signOut() { // Método para cerrar sesión
    this.firebaseSvc.signOut(); // Llama al método de cierre de sesión en el servicio de Firebase
  }

  getUser() { // Método para obtener datos del usuario del almacenamiento local
    this.user = this.utilsSvc.getElementFromLocalStorage('user') || {} as User; // Obtiene el usuario desde el almacenamiento local o inicializa como objeto vacío
  }
}
