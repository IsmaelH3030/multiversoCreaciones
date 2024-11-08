import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public user: User = {} as User;
  public isAuthenticated: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsScv: UtilsService
  ) { }

  ngOnInit() {
    // Escucha el estado de autenticación
    this.firebaseSvc.getAuthState().subscribe(
      user => {
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          this.getUser();
        }
      },
      error => {
        console.error('Error en el estado de autenticación:', error);
        // Aquí podrías mostrar un mensaje de error o realizar otra acción
      }
    );
  }

  ionViewWillEnter() {
    // Puedes omitir esta llamada si ya la haces en ngOnInit
    this.getUser();
  }

  getUser() {
    const userFromLocalStorage = this.utilsScv.getElementFromLocalStorage('user');
    if (userFromLocalStorage) {
      this.user = userFromLocalStorage;
    } else {
      console.warn('No se encontró información del usuario en el almacenamiento local');
      // Redirige al login si es necesario
    }
  }
}
