import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TShirt } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<TShirt[]>(this.obtenerCarritoDeStorage());
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregarAlCarrito(producto: TShirt) {
    const carrito = this.carritoSubject.value;
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
      productoExistente.quantity = (productoExistente.quantity || 1) + 1;
    } else {
      producto.quantity = 1; // Inicializa la cantidad en 1 si es un nuevo producto
      carrito.push(producto);
    }

    this.carritoSubject.next(carrito);
    this.guardarCarritoEnStorage(carrito);
  }

  eliminarDelCarrito(productoId: string) {
    const carrito = this.carritoSubject.value.filter(producto => producto.id !== productoId);
    this.carritoSubject.next(carrito);
    this.guardarCarritoEnStorage(carrito);
  }

  actualizarCantidad(productoId: string, cantidad: number) {
    const carrito = this.carritoSubject.value;
    const producto = carrito.find(item => item.id === productoId);

    if (producto) {
      producto.quantity = cantidad;
      if (producto.quantity <= 0) {
        this.eliminarDelCarrito(productoId);
      } else {
        this.carritoSubject.next(carrito);
        this.guardarCarritoEnStorage(carrito);
      }
    }
  }

  vaciarCarrito() {
    this.carritoSubject.next([]);
    this.guardarCarritoEnStorage([]);
  }

  private guardarCarritoEnStorage(carrito: TShirt[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  private obtenerCarritoDeStorage(): TShirt[] {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
  }
}
