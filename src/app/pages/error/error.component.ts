// src/app/pages/error/error.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // Navega a la página principal
  }
}
