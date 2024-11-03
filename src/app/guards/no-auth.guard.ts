// Importamos el decorador Injectable, que permite declarar un servicio e inyectarlo en otros componentes o servicios.
import { Injectable } from "@angular/core";

// Importamos las interfaces necesarias para la protección de rutas y control de acceso.
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from "@angular/router";

// Importamos operadores y tipos de RxJS para manejar observables.
import { map, Observable } from "rxjs";

// Importamos el servicio de Firebase para manejar el estado de autenticación del usuario.
import { FirebaseService } from "../services/firebase.service";

// Importamos el servicio de utilidades para facilitar la navegación y otras funciones auxiliares.
import { UtilsService } from "../services/utils.service";

// Decorador que marca la clase como inyectable y la registra en el inyector de dependencia en toda la aplicación.
@Injectable({
  providedIn: 'root'
})

// Definimos la clase NoAuthGuard que implementa CanActivate para proteger rutas de usuarios autenticados.
export class NoAuthGuard implements CanActivate {

  // Constructor de la clase, donde se inyectan el servicio de Firebase y el servicio de utilidades.
  constructor(
    private firebaseSvc: FirebaseService,  // Instancia del servicio FirebaseService.
    private uitlsSvc: UtilsService,        // Instancia del servicio UtilsService.
  ) {}

  // Método canActivate, que determina si se permite o no el acceso a una ruta específica.
  canActivate(
    route: ActivatedRouteSnapshot,       // Información sobre la ruta activada.
    state: RouterStateSnapshot           // Estado actual de la ruta.
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Retornamos un observable que emite true o false según el estado de autenticación del usuario.
    return this.firebaseSvc.getAuthState().pipe(
      map(auth => {
        // Si no hay un usuario autenticado, permite el acceso a la ruta.
        if (!auth) {
          return true;
        } else {
          // Si el usuario está autenticado, lo redirige a la página de inicio.
          this.uitlsSvc.routerLink('/tabs/home');
          return false;
        }
      })
    );
  }
}
