// Importamos el decorador Injectable para declarar el servicio y poder inyectarlo en otros componentes o servicios.
import { Injectable } from "@angular/core";

// Importamos las interfaces necesarias para la funcionalidad de navegación y autenticación en rutas.
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";

// Importamos operadores y tipos de RxJS para el manejo de observables.
import { map, Observable } from "rxjs";

// Importamos el servicio de Firebase para manejar la autenticación.
import { FirebaseService } from "../services/firebase.service";

// Importamos el servicio de utilidades para navegar y otras funciones auxiliares.
import { UtilsService } from "../services/utils.service";

// Marcamos la clase AuthGuard como inyectable y disponible en toda la aplicación.
@Injectable({
  providedIn: 'root'
})

// Definimos la clase AuthGuard que implementa la interfaz CanActivate para protección de rutas.
export class AuthGuard implements CanActivate {

  // Inyectamos el servicio de Firebase y el servicio de utilidades en el constructor de la clase.
  constructor(
    private firebaseSvc: FirebaseService,
    private uitlsSvc: UtilsService,
  ) {}

  // Método canActivate, utilizado para decidir si se permite el acceso a una ruta.
  canActivate(
    route: ActivatedRouteSnapshot,  // Representa la información de la ruta activada.
    state: RouterStateSnapshot      // Representa el estado de la ruta actual.
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Retorna un observable que emite true o false según el estado de autenticación del usuario.
    return this.firebaseSvc.getAuthState().pipe(
      map(auth => {
        // Si el usuario está autenticado, permite el acceso a la ruta.
        if (auth) {
          return true;
        } else {
          // Si el usuario no está autenticado, redirige a la página de autenticación.
          this.uitlsSvc.routerLink('/auth');
          return false;
        }
      })
    );
  }
}

