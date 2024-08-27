
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from './services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public user: User = {} as User; // Asegúrate de que sea "public"
  public isAuthenticated: boolean = false; // También debe ser "public"

  constructor(
    private themeSvc: ThemeService,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {
    this.themeSvc.setInitialTheme();
  }

  ngOnInit() {
    // Suscripción al estado de autenticación
    this.firebaseSvc.getAuthState().subscribe(user => {
      this.isAuthenticated = !!user; // Si hay un usuario, se establece como true
      if (this.isAuthenticated) {
        this.getUser(); // Cargar datos del usuario si está autenticado
      }
    });
  }

  ionViewWillEnter() {
    this.getUser();
  }

  signOut() {
    this.firebaseSvc.signOut();
  }

  getUser() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user') || {} as User;
  }
}
