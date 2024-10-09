import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
    role: new FormControl('cliente') // Campo para seleccionar el rol
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
    this.confirmPasswordValidator();
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ]);
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  async submit() {
    if (this.form.valid) {
      this.utilsSvc.presentLoading({ message: 'Registrando...' });
      
      try {
        // Llamar al método signUp del servicio Firebase
        const res = await this.firebaseSvc.signUp(this.form.value as User);
        
        const user: User = {
          uid: res.user.uid,
          name: this.form.value.name,
          email: this.form.value.email,
          role: this.form.value.role // Asignar el rol al usuario
        };
  
        // Llamar al método para agregar el usuario a Firestore
        await this.firebaseSvc.addUserToFirestore(user);
  
        this.utilsSvc.setElementInLocalstorage('user', user);
        this.utilsSvc.routerLink('/tabs/home');
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline'
        });
        this.form.reset();
      } catch (error) {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      }
    }
  }
}  
