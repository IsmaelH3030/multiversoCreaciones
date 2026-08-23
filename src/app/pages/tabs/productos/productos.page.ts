import { Component, OnInit, OnDestroy } from '@angular/core'; // Importa Component, OnInit y OnDestroy desde Angular core
import { TShirtService } from 'src/app/services/t-shirt.service'; // Importa el servicio para manejar las poleras
import { TShirt } from 'src/app/models/user.model'; // Importa la interfaz o modelo TShirt
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio del carrito
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { ToastController, AlertController } from '@ionic/angular'; // Importa controladores de Ionic
import { Router } from '@angular/router'; // Importa Router para la navegación
import { Subscription } from 'rxjs'; // Importa Subscription para gestionar la desuscripción
import { firstValueFrom } from 'rxjs'; // Importa conversor de Observable a Promesa

@Component({
  selector: 'app-productos', // Selector del componente que se usará en la plantilla
  templateUrl: './productos.page.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['./productos.page.scss'], // Ruta del archivo de estilos SCSS
})
export class ProductosPage implements OnInit, OnDestroy { // Implementa OnInit y OnDestroy
  productos: TShirt[] = []; // Declaración de un array para almacenar los productos de tipo TShirt
  isLoading: boolean = true; // Control visual del estado de carga
  private productosSub!: Subscription; // Variable para almacenar la suscripción a Firestore

  constructor(
    private tShirtService: TShirtService, 
    private carritoSvc: CarritoService,
    private firebaseSvc: FirebaseService, // Inyección del servicio de Firebase
    private toastController: ToastController,
    private alertController: AlertController, // Inyección para mostrar alertas
    private router: Router // Inyección para redirigir
  ) { } // Constructor que inyecta los servicios necesarios

  ngOnInit() { // Método que se ejecuta al inicializar el componente
    this.loadTShirts(); // Llama al método para cargar las poleras al inicializar el componente
  }

  ionViewWillEnter() { // Se ejecuta cada vez que la vista entra en pantalla en Ionic
    this.loadTShirts(); // Refresca las poleras al navegar entre pestañas
  }

  ionViewWillLeave() { // Se ejecuta cuando la vista sale de pantalla
    this.unsubscribe(); // Desconecta la suscripción al salir de la página
  }

  ngOnDestroy() { // Limpieza al destruir el componente
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.productosSub) {
      this.productosSub.unsubscribe();
    }
  }

  loadTShirts() { // Método para cargar las poleras
    this.isLoading = true; // Activa el esqueleto de carga
    this.unsubscribe(); // Cancela suscripciones previas para evitar acumulación de datos en memoria

    this.productosSub = this.tShirtService.getTShirts().subscribe({
      next: (data: TShirt[]) => { // Llama al servicio para obtener las poleras y se suscribe a los datos
        this.productos = data; // Almacena las poleras obtenidas en la variable productos
        this.isLoading = false; // Desactiva el esqueleto de carga
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Método para agregar productos al carrito con verificación de sesión
  async agregarAlCarrito(producto: TShirt) {
    // Verifica si hay un usuario autenticado
    const user = await firstValueFrom(this.firebaseSvc.getAuthState());

    if (!user) {
      // Muestra una alerta si no hay sesión iniciada
      const alert = await this.alertController.create({
        header: 'Sesión requerida',
        message: 'Debes iniciar sesión para agregar productos al carrito.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Iniciar Sesión',
            handler: () => {
              this.router.navigate(['/auth']); // Redirige al inicio de sesión
            }
          }
        ]
      });

      await alert.present();
      return; // Detiene la ejecución si no está autenticado
    }

    // Si la sesión está activa, agrega el producto al carrito
    this.carritoSvc.agregarAlCarrito(producto);
    const toast = await this.toastController.create({
      message: `${producto.description} ha sido añadido al carrito.`, // Mensaje del Toast
      duration: 1500,  // Duración del mensaje en pantalla
      color: 'primary',  // Color del Toast
      icon: 'cart', // Icono del Toast
    });
    toast.present(); // Muestra el Toast
  }
}