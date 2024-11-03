import { Injectable } from '@angular/core'; // Importa el decorador Injectable para permitir la inyección de dependencias
import { Route, Router } from '@angular/router'; // Importa Router para la navegación entre rutas
import { LoadingController, LoadingOptions, ToastController, ToastOptions } from '@ionic/angular'; // Importa LoadingController y ToastController para mostrar mensajes de carga y notificaciones

// Marca la clase como un servicio inyectable
@Injectable({
  providedIn: 'root' // Indica que el servicio está disponible a nivel de aplicación
})
export class UtilsService {

  // Constructor del servicio que inyecta LoadingController, Router y ToastController
  constructor(
    private loadingController: LoadingController, // Controlador para manejar las cargas
    private router: Router, // Router para la navegación
    private toastController: ToastController // Controlador para manejar los mensajes de toast
  ) { }

  // Método para mostrar un indicador de carga
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts); // Crea el componente de carga con las opciones dadas
    await loading.present(); // Presenta el componente de carga en la pantalla
  }

  // Método para ocultar el indicador de carga
  async dismissLoading(){
    return await this.loadingController.dismiss(); // Desvincula y oculta el componente de carga
  }

  // Métodos para manejar localStorage
  // Método para guardar un elemento en localStorage
  setElementInLocalstorage(key: string, element: any){
    return localStorage.setItem(key, JSON.stringify(element)); // Convierte el elemento en cadena JSON y lo guarda con la clave proporcionada
  }

  // Método para obtener un elemento de localStorage
  getElementFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key)); // Obtiene el elemento de localStorage y lo convierte de vuelta a su forma original
  }

  // Método para presentar un mensaje de toast
  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts); // Crea un componente de toast con las opciones proporcionadas
    toast.present(); // Presenta el toast en la pantalla
  }

  // Método para navegar a una URL especificada
  routerLink(url: string){
    return this.router.navigateByUrl(url); // Navega a la ruta especificada
  }

}
