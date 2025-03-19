import { Component, OnInit } from '@angular/core'; // Importa las dependencias necesarias
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio para manejar Firebase
import { UtilsService } from './services/utils.service'; // Servicio para utilidades generales
import { User } from 'src/app/models/user.model'; // Modelo de usuario
import { CarritoService } from 'src/app/services/carrito.service'; // Servicio para manejar el carrito de compras
import { Router } from '@angular/router'; // Servicio para manejar la navegación en la aplicación

@Component({
  selector: 'app-root', // Define el selector del componente
  templateUrl: 'app.component.html', // Especifica el archivo HTML asociado
  styleUrls: ['app.component.scss'], // Especifica el archivo de estilos asociado
})
export class AppComponent implements OnInit {
  public user: User = {} as User; // Objeto para almacenar la información del usuario
  public isAuthenticated: boolean = false; // Estado de autenticación del usuario
  public isAdmin: boolean = false; // Estado para saber si el usuario es administrador
  carritoCount: number = 0; // Contador de productos en el carrito

  constructor(
    private firebaseSvc: FirebaseService, // Inyección del servicio Firebase
    private utilsSvc: UtilsService, // Inyección del servicio de utilidades
    private carritoSvc: CarritoService, // Inyección del servicio del carrito
    private router: Router // Inyección del servicio de enrutamiento
  ) {}

  async ngOnInit() {
    // Suscribirse al estado de autenticación del usuario en Firebase
    this.firebaseSvc.getAuthState().subscribe(async user => {
      this.isAuthenticated = !!user; // Verifica si el usuario está autenticado
      if (this.isAuthenticated && user?.uid) {
        await this.getUser(user.uid); // Si está autenticado, obtiene la información del usuario
      } else {
        this.isAdmin = false; // Si no está autenticado, establece isAdmin en falso
      }
    });

    // Suscribirse a los cambios en el carrito y actualizar el contador
    this.carritoSvc.carrito$.subscribe(carrito => {
      this.carritoCount = carrito.length; // Actualiza el número de productos en el carrito
    });
  }

  async getUser(uid: string) {
    // Obtiene la información del usuario desde el almacenamiento local
    this.user = this.utilsSvc.getElementFromLocalStorage('user') || {} as User;
    
    // Obtiene el rol del usuario desde Firebase y lo asigna
    this.user.role = await this.firebaseSvc.getUserRole(uid).toPromise();
    
    // Define si el usuario es administrador
    this.isAdmin = this.user.role === 'admin';
  }

  signOut() {
    this.firebaseSvc.signOut(); // Cierra la sesión del usuario en Firebase
  }

  goToCarrito() {
    this.router.navigate(['/carrito']); // Navega a la página del carrito de compras
  }
}