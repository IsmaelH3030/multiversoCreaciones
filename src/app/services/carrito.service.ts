import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TShirt } from 'src/app/models/user.model'; // Importa el modelo TShirt

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<TShirt[]>(this.obtenerCarritoDeStorage()); // Inicializa el carrito con los productos en localStorage
  carrito$ = this.carritoSubject.asObservable(); // Exponemos el carrito como observable

  constructor() {}

  // Método para agregar un producto al carrito
  agregarAlCarrito(producto: TShirt) {
    const carrito = this.carritoSubject.value;
    carrito.push(producto);
    this.carritoSubject.next(carrito); // Emitimos el nuevo estado del carrito
    this.guardarCarritoEnStorage(carrito); // Guardamos el carrito actualizado en localStorage
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(productoId: string) {
    const carrito = this.carritoSubject.value;
    // Filtra el carrito para eliminar el producto con el id correspondiente
    const carritoActualizado = carrito.filter(producto => producto.id !== productoId);
    this.carritoSubject.next(carritoActualizado); // Emitimos el nuevo estado del carrito
    this.guardarCarritoEnStorage(carritoActualizado); // Guardamos el carrito actualizado en localStorage
  }

  // Método para limpiar el carrito
  vaciarCarrito() {
    this.carritoSubject.next([]); // Vacía el carrito
    this.guardarCarritoEnStorage([]); // Elimina el carrito de localStorage
  }

  // Método para obtener todos los productos en el carrito
  obtenerCarrito(): TShirt[] {
    return this.carritoSubject.value;
  }

  // Método para guardar el carrito en localStorage
  private guardarCarritoEnStorage(carrito: TShirt[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guarda el carrito en localStorage
  }

  // Método para obtener el carrito desde localStorage
  private obtenerCarritoDeStorage(): TShirt[] {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : []; // Devuelve el carrito si existe en localStorage, o un array vacío
  }
}
