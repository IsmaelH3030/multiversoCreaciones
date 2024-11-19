import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { TShirt } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, OnDestroy {
  carrito: TShirt[] = [];
  totalPrecio: number = 0;
  carritoSubscription: Subscription;

  constructor(private carritoSvc: CarritoService,
              private firebaseSvc: FirebaseService) { }

  ngOnInit() {
    this.carritoSubscription = this.carritoSvc.carrito$.subscribe((productos) => {
      this.carrito = productos;
      this.calcularTotal();
    });
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  calcularTotal() {
    this.totalPrecio = this.carrito.reduce((total, producto) => {
      return total + (producto.price || 0) * (producto.quantity || 1);
    }, 0);
  }

  aumentarCantidad(producto: TShirt) {
    this.carritoSvc.actualizarCantidad(producto.id, (producto.quantity || 1) + 1);
    this.calcularTotal();
  }

  disminuirCantidad(producto: TShirt) {
    this.carritoSvc.actualizarCantidad(producto.id, (producto.quantity || 1) - 1);
    this.calcularTotal();
  }

  eliminarDelCarrito(productoId: string) {
    this.carritoSvc.eliminarDelCarrito(productoId);
    this.calcularTotal();
  }

  vaciarCarrito() {
    this.carritoSvc.vaciarCarrito();
    this.calcularTotal();
  }

  async pagar() {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
  
    // Crear la orden con los productos y el total
    const orden = {
      articulos: this.carrito.map(producto => ({
        id: producto.id,                 // ID del producto
        descripcion: producto.description, // Descripción del producto
        precio: producto.price,           // Precio del producto
        cantidad: producto.quantity || 1, // Cantidad del producto (predeterminado 1 si no tiene cantidad)
        imagenUrl: producto.imageUrl,     // URL de la imagen del producto
        material: producto.material,      // Material del producto
        tamano: producto.size,            // Tamaño del producto
      })),
      total: this.totalPrecio,            // Total del carrito
      fecha: new Date().toISOString(),    // Fecha y hora de la orden en formato ISO
    };
  
    try {
      // Guardar la orden en Firebase
      await this.firebaseSvc.guardarPedido(orden);
  
      // Vaciar el carrito después de guardar
      this.vaciarCarrito();
  
      // Mostrar mensaje de éxito
      alert('Pago realizado con éxito. ¡Gracias por tu compra!');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un problema al procesar el pago. Por favor, inténtalo nuevamente.');
    }
  }
}
