import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private FirebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.utilsSvc.presentLoading({ message: 'Enviando enlace de recuperación...' });
      this.FirebaseSvc.resetPassword(this.form.value.email).then(() => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Enlace de recuperación enviado a tu correo.',
          duration: 3000,
          color: 'primary',
          icon: 'mail-outline'
        });
        this.form.reset();
      }).catch(error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      });
    }
  }
}






