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
  })

  constructor(
    private FirebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.confirmPasswordValidator()
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ])

    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  submit() {
    if (this.form.valid) {
      // console.log(this.form.value)
      this.utilsSvc.presentLoading({message: 'Registrando...'})
      this.FirebaseSvc.signUp(this.form.value as User).then(async res => {
        console.log(res);

        await this.FirebaseSvc.updateUser({displayName: this.form.value.name})


        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilsSvc.setElementInLocalstorage('user', user);
        this.utilsSvc.routerLink('/tabs/home')

        this.utilsSvc.dismissLoading();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500, 
          color: 'primary',
          icon: 'person-outline'
        })

        this.form.reset();

      }, error => {
        
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error,
          duration: 5000, 
          color: 'warning',
          icon: 'alert-circle-outline'
        })
        
      })


    }
  }

}








