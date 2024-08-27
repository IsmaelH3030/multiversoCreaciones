import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from '../../../services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User
 
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsScv: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser()
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

  getUser(){
    return this.user = this.utilsScv.getElementFromLocalStorage('user')
  }
}
