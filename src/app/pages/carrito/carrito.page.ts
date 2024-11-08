import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { TShirt } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, OnDestroy {
  carrito: TShirt[] = [];
  totalPrecio: number = 0;
  carritoSubscription: Subscription;

  constructor(private carritoSvc: CarritoService) { }

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

  pagar() {
    alert('Procediendo al pago');
  }
}
