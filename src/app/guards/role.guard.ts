import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private firebaseSvc: FirebaseService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['role']; // Obtiene el rol esperado de la ruta

    return this.firebaseSvc.getAuthState().pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          this.router.navigate(['/auth']); // Redirige a autenticación si no hay usuario
          return [false];
        }
        return this.firebaseSvc.getUserRole(user.uid).pipe(
          take(1),
          map(userRole => {
            if (userRole === expectedRole) {
              return true;
            } else {
              this.router.navigate(['/error']); // Redirige a página de error si no tiene el rol correcto
              return false;
            }
          })
        );
      })
    );
  }
}
