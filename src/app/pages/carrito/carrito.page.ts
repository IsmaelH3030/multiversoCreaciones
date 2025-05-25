import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { TShirt } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { loadScript } from '@paypal/paypal-js';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit, OnDestroy {
  carrito: TShirt[] = [];
  totalPrecio: number = 0;
  carritoSubscription: Subscription;

  constructor(
    private carritoSvc: CarritoService,
    private firebaseSvc: FirebaseService
  ) {}

  async ngOnInit() {
    this.carritoSubscription = this.carritoSvc.carrito$.subscribe((productos) => {
      this.carrito = productos;
      this.calcularTotal();
    });

    await this.loadPayPalButton(); // ✅ Cargar botón PayPal
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

  // ✅ Método modificado para integrar PayPal
  async loadPayPalButton() {
    const paypal = await loadScript({
      clientId: 'AVrRexaZH32FwFZ9bmgwMuI_G2cTnBtx6Hh6bPdIeYd5hCtb9TGTrozAkiECjM3VBQhhAn-nW2NrUYFt', // Reemplaza con tu client ID
      currency: 'USD'
    });

    if (paypal) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.totalPrecio.toFixed(2) // Usar total dinámico
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();

          // Guardar pedido en Firebase
          const orden = {
            articulos: this.carrito.map(producto => ({
              id: producto.id,
              descripcion: producto.description,
              precio: producto.price,
              cantidad: producto.quantity || 1,
              imagenUrl: producto.imageUrl,
              material: producto.material,
              tamano: producto.size,
            })),
            total: this.totalPrecio,
            fecha: new Date().toISOString(),
            paypalOrderId: data.orderID,
            comprador: details.payer.name.given_name
          };

          try {
            await this.firebaseSvc.guardarPedido(orden);
            this.vaciarCarrito();
            alert('Pago realizado con éxito. ¡Gracias por tu compra!');
          } catch (error) {
            console.error('Error al guardar el pedido:', error);
            alert('Error al guardar el pedido. Intenta nuevamente.');
          }
        }
      }).render('#paypal-button-container');
    }
  }
}