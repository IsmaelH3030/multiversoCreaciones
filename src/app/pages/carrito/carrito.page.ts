import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio del carrito
import { TShirt } from 'src/app/models/user.model'; // Importa el modelo TShirt
import { Subscription } from 'rxjs';  // Importa Subscription para gestionar la suscripción

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, OnDestroy {
  carrito: TShirt[] = [];
  totalPrecio: number = 0;  // Variable para almacenar el total
  carritoSubscription: Subscription;  // Para almacenar la suscripción

  constructor(private carritoSvc: CarritoService) { }

  ngOnInit() {
    // Nos suscribimos al carrito para recibir actualizaciones
    this.carritoSubscription = this.carritoSvc.carrito$.subscribe((productos) => {
      this.carrito = productos;
      this.calcularTotal(); // Recalcular el total cada vez que el carrito cambie
    });
  }

  ngOnDestroy() {
    // Nos desuscribimos cuando el componente se destruya para evitar memory leaks
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  // Método para calcular el total del carrito
  calcularTotal() {
    this.totalPrecio = this.carrito.reduce((total, producto) => {
      return total + (producto.price || 0); // Asegúrate de manejar los productos sin precio
    }, 0);
  }

  pagar() {
    // Lógica para proceder con el pago
    alert('Procediendo al pago');
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(productoId: string) {
    this.carritoSvc.eliminarDelCarrito(productoId);
    this.calcularTotal(); // Recalcula el total después de eliminar el producto
  }

   // Método para vaciar el carrito
   vaciarCarrito() {
    this.carritoSvc.vaciarCarrito();
    this.calcularTotal(); // Recalcula el total después de vaciar el carrito
  }
}


