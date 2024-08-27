import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoadingController, LoadingOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController
  ) { }

// loading
  //present
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }
  //dismiss
  async dismissLoading(){
    return await this.loadingController.dismiss()
  }

// localStorage
  // set
  setElementInLocalstorage(key: string, element: any){
    return localStorage.setItem(key,JSON.stringify(element))
  }
  // get
  getElementFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }


  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

// Router
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

}
