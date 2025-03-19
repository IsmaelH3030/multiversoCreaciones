import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TShirt } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // BehaviorSubject para manejar el estado del carrito y permitir la suscripción a cambios
  private carritoSubject = new BehaviorSubject<TShirt[]>(this.obtenerCarritoDeStorage());
  // Observable para exponer los cambios en el carrito
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  // Método para agregar un producto al carrito
  agregarAlCarrito(producto: TShirt) {
    // Obtener el estado actual del carrito
    const carrito = this.carritoSubject.value;
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
      // Si el producto ya existe, incrementar su cantidad
      productoExistente.quantity = (productoExistente.quantity || 1) + 1;
    } else {
      // Si el producto no existe, asignar cantidad inicial de 1 y agregarlo al carrito
      producto.quantity = 1;
      carrito.push(producto);
    }

    // Actualizar el estado del carrito y guardarlo en localStorage
    this.carritoSubject.next(carrito);
    this.guardarCarritoEnStorage(carrito);
  }

  // Método para eliminar un producto del carrito por su ID
  eliminarDelCarrito(productoId: string) {
    // Filtrar los productos que no coincidan con el ID dado
    const carrito = this.carritoSubject.value.filter(producto => producto.id !== productoId);
    // Actualizar el estado del carrito y guardarlo en localStorage
    this.carritoSubject.next(carrito);
    this.guardarCarritoEnStorage(carrito);
  }

  // Método para actualizar la cantidad de un producto en el carrito
  actualizarCantidad(productoId: string, cantidad: number) {
    const carrito = this.carritoSubject.value;
    const producto = carrito.find(item => item.id === productoId);

    if (producto) {
      // Asignar la nueva cantidad al producto
      producto.quantity = cantidad;
      if (producto.quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el producto del carrito
        this.eliminarDelCarrito(productoId);
      } else {
        // Si la cantidad es válida, actualizar el carrito y guardarlo
        this.carritoSubject.next(carrito);
        this.guardarCarritoEnStorage(carrito);
      }
    }
  }

  // Método para vaciar completamente el carrito
  vaciarCarrito() {
    // Reiniciar el carrito a un arreglo vacío
    this.carritoSubject.next([]);
    this.guardarCarritoEnStorage([]);
  }

  // Método privado para guardar el carrito en localStorage
  private guardarCarritoEnStorage(carrito: TShirt[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Método privado para obtener el carrito desde localStorage
  private obtenerCarritoDeStorage(): TShirt[] {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
  }
}