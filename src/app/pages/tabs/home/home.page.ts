import { Component, OnInit } from '@angular/core'; // Importa los decoradores y la interfaz OnInit de Angular
import { User } from 'src/app/models/user.model'; // Importa la interfaz User desde el modelo de usuario
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { UtilsService } from 'src/app/services/utils.service'; // Importa el servicio de utilidades

@Component({
  selector: 'app-home', // Selector para este componente, que se utilizará en el HTML
  templateUrl: './home.page.html', // Ruta del archivo de plantilla HTML para este componente
  styleUrls: ['./home.page.scss'], // Ruta del archivo de estilos SCSS para este componente
})
export class HomePage implements OnInit { // Declara la clase HomePage que implementa la interfaz OnInit

  public user: User = {} as User; // Declara la propiedad user de tipo User y la inicializa como un objeto vacío
  public isAuthenticated: boolean = false; // Propiedad para verificar si el usuario está autenticado, inicializada como false

  constructor(
    private firebaseSvc: FirebaseService, // Inyección del servicio de Firebase
    private utilsScv: UtilsService // Inyección del servicio de utilidades
  ) { }

  ngOnInit() { // Método que se ejecuta al inicializar el componente
    // Suscripción al estado de autenticación
    this.firebaseSvc.getAuthState().subscribe(user => { // Escucha los cambios en el estado de autenticación
      this.isAuthenticated = !!user; // Convierte el usuario en un valor booleano; true si hay un usuario, false si no
      if (this.isAuthenticated) { // Si el usuario está autenticado
        this.getUser(); // Llama al método getUser para cargar los datos del usuario
      }
    });
  }

  ionViewWillEnter() { // Método que se llama justo antes de que la vista se presente
    this.getUser() // Llama al método getUser para cargar los datos del usuario
  }

  getUser() { // Método para obtener los datos del usuario
    return this.user = this.utilsScv.getElementFromLocalStorage('user') // Recupera los datos del usuario desde el almacenamiento local y los asigna a la propiedad user
  }

}
