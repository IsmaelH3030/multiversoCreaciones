import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = new BehaviorSubject(false);


  constructor() { }

  setInitialTheme() {
    let darkMode = JSON.parse(localStorage.getItem('darkMode'));

    if (darkMode) {
      this.setTheme(darkMode)
    } else {
      this.setTheme(darkMode)
    }

  }


  setTheme(darkMode: boolean) {
    if (darkMode) {
      document.body.setAttribute('color-theme', 'dark')
    } else {
      document.body.setAttribute('color-theme', 'ligth')
    }

    this.darkMode.next(darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }
}
