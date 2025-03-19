// Importa los módulos necesarios desde Angular
import { Component, OnInit, OnDestroy } from '@angular/core'; // Importa los decoradores y ciclos de vida del componente
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio que maneja el carrito de compras
import { TShirt } from 'src/app/models/user.model'; // Importa el modelo de la camiseta
import { Subscription } from 'rxjs'; // Importa Subscription para manejar la suscripción al observable del carrito
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio que maneja Firebase

// Decorador que define el componente
@Component({
  selector: 'app-carrito', // Nombre del selector que se usará en el HTML
  templateUrl: './carrito.page.html', // Ruta del archivo de plantilla HTML asociado al componente
  styleUrls: ['./carrito.page.scss'], // Ruta del archivo de estilos asociado al componente
})

// Define la clase del componente
export class CarritoPage implements OnInit, OnDestroy {
  carrito: TShirt[] = []; // Arreglo que almacenará los productos dentro del carrito
  totalPrecio: number = 0; // Variable para almacenar el precio total del carrito
  carritoSubscription: Subscription; // Variable que almacenará la suscripción al carrito de compras

  // Constructor donde se inyectan los servicios necesarios
  constructor(private carritoSvc: CarritoService, // Servicio del carrito de compras
              private firebaseSvc: FirebaseService) { } // Servicio de Firebase para almacenar los pedidos

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    // Se suscribe al observable del carrito para recibir los cambios en tiempo real
    this.carritoSubscription = this.carritoSvc.carrito$.subscribe((productos) => {
      this.carrito = productos; // Asigna los productos obtenidos al arreglo del carrito
      this.calcularTotal(); // Llama al método para calcular el total del carrito
    });
  }

  // Método que se ejecuta cuando el componente es destruido
  ngOnDestroy() {
    // Si la suscripción existe, se cancela para evitar fugas de memoria
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  // Método para calcular el total del carrito sumando los precios de los productos
  calcularTotal() {
    this.totalPrecio = this.carrito.reduce((total, producto) => { // Recorre todos los productos del carrito
      return total + (producto.price || 0) * (producto.quantity || 1); // Multiplica el precio por la cantidad y lo suma al total
    }, 0); // Se inicia la suma en 0
  }

  // Método para aumentar la cantidad de un producto en el carrito
  aumentarCantidad(producto: TShirt) {
    this.carritoSvc.actualizarCantidad(producto.id, (producto.quantity || 1) + 1); // Llama al servicio para aumentar la cantidad en 1
    this.calcularTotal(); // Recalcula el total del carrito
  }

  // Método para disminuir la cantidad de un producto en el carrito
  disminuirCantidad(producto: TShirt) {
    this.carritoSvc.actualizarCantidad(producto.id, (producto.quantity || 1) - 1); // Llama al servicio para reducir la cantidad en 1
    this.calcularTotal(); // Recalcula el total del carrito
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(productoId: string) {
    this.carritoSvc.eliminarDelCarrito(productoId); // Llama al servicio para eliminar el producto del carrito
    this.calcularTotal(); // Recalcula el total del carrito después de la eliminación
  }

  // Método para vaciar completamente el carrito
  vaciarCarrito() {
    this.carritoSvc.vaciarCarrito(); // Llama al servicio para vaciar el carrito
    this.calcularTotal(); // Recalcula el total del carrito (quedará en 0)
  }

  // Método para procesar el pago y guardar la orden en Firebase
  async pagar() {
    // Verifica si el carrito está vacío
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.'); // Muestra un mensaje de alerta si no hay productos en el carrito
      return; // Detiene la ejecución del método
    }
  
    // Crea un objeto que representa la orden de compra
    const orden = {
      articulos: this.carrito.map(producto => ({ // Mapea los productos del carrito para construir la orden
        id: producto.id,                 // ID del producto
        descripcion: producto.description, // Descripción del producto
        precio: producto.price,           // Precio unitario del producto
        cantidad: producto.quantity || 1, // Cantidad del producto (si no tiene, se establece en 1)
        imagenUrl: producto.imageUrl,     // URL de la imagen del producto
        material: producto.material,      // Material del producto
        tamano: producto.size,            // Tamaño del producto
      })),
      total: this.totalPrecio,            // Precio total de la orden
      fecha: new Date().toISOString(),    // Fecha y hora de la orden en formato ISO
    };
  
    try {
      // Guarda la orden en Firebase
      await this.firebaseSvc.guardarPedido(orden);
  
      // Vacía el carrito después de haber realizado el pago
      this.vaciarCarrito();
  
      // Muestra un mensaje de éxito al usuario
      alert('Pago realizado con éxito. ¡Gracias por tu compra!');
    } catch (error) {
      // Captura cualquier error que ocurra al intentar procesar el pago
      console.error('Error al procesar el pago:', error); // Muestra el error en la consola
      alert(`Error al guardar la camiseta: ${error.message}`); // Muestra una alerta al usuario
    }
  }
}
