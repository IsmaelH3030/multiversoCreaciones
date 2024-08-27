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

  public user: User = {} as User; // Asegúrate de que sea "public"
  public isAuthenticated: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsScv: UtilsService
  ) { }

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
    this.getUser()
  }

  getUser(){
    return this.user = this.utilsScv.getElementFromLocalStorage('user')
  }

}
