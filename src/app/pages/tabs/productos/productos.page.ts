import { Component, OnInit } from '@angular/core'; // Importa Component y OnInit desde Angular core para crear un componente
import { TShirtService } from 'src/app/services/t-shirt.service'; // Importa el servicio para manejar las poleras, verifica la ruta
import { TShirt } from 'src/app/models/user.model'; // Importa la interfaz o modelo TShirt, verifica la ruta
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio del carrito
import { ToastController } from '@ionic/angular'; // Importa el ToastController

@Component({
  selector: 'app-productos', // Selector del componente que se usará en la plantilla
  templateUrl: './productos.page.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['./productos.page.scss'], // Ruta del archivo de estilos SCSS
})
export class ProductosPage implements OnInit { // Clase del componente ProductosPage que implementa la interfaz OnInit
  productos: TShirt[] = []; // Declaración de un array para almacenar los productos de tipo TShirt

  constructor(private tShirtService: TShirtService, private carritoSvc: CarritoService,private toastController: ToastController) { } // Constructor que inyecta el servicio TShirtService

  ngOnInit() { // Método que se ejecuta al inicializar el componente
    this.loadTShirts(); // Llama al método para cargar las poleras al inicializar el componente
  }

  loadTShirts() { // Método para cargar las poleras
    this.tShirtService.getTShirts().subscribe((data: TShirt[]) => { // Llama al servicio para obtener las poleras y se suscribe a los datos
      this.productos = data; // Almacena las poleras obtenidas en la variable productos
    });
  }
  // Método para agregar productos al carrito
  async agregarAlCarrito(producto: TShirt) {
    this.carritoSvc.agregarAlCarrito(producto); // Llama al servicio para agregar el producto
    // Muestra el Toast
  const toast = await this.toastController.create({
    message: `${producto.description} ha sido añadido al carrito.`, // Mensaje del Toast
    duration: 1500,  // Duración del mensaje en pantalla
    color: 'primary',  // Color del Toast
    icon: 'cart', // Icono del Toast
  });
  toast.present(); // Muestra el Toast
  }
  
}
