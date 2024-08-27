import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { FirebaseService } from "../services/firebase.service";
import { UtilsService } from "../services/utils.service";


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private firebaseSvc: FirebaseService,
    private uitlsSvc: UtilsService,
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.firebaseSvc.getAuthState().pipe(map(auth => {
      // existe usuario autenticado
      if (auth) {
        return true;
      } else {
        // no existe usuario autenticado
        this.uitlsSvc.routerLink('/auth')
        return false;
      }



    }))


  }

}
