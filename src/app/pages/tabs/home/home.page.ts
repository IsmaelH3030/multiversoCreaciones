import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public user: User = {} as User;
  public isAuthenticated: boolean = false;

  // 🔽 Variables para el clima
  API_KEY = '48747ca75479d2aab2ae2698159c90af'; // Cambia por tu propia API key si lo deseas
  selectedCity = '';
  result: any = null;
  error: string = '';

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsScv: UtilsService,
    private http: HttpClient // 👈 Asegúrate de importar este servicio en app.module.ts también
  ) {}

  ngOnInit() {
    this.firebaseSvc.getAuthState().subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.getUser();
      }
    });
  }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    return this.user = this.utilsScv.getElementFromLocalStorage('user');
  }

  // 🔽 Función para obtener el clima desde OpenWeatherMap
  getWeather() {
    if (!this.selectedCity) {
      this.result = null;
      this.error = 'Debe seleccionar una ciudad...';
      return;
    }

    const [city, country] = this.selectedCity.split(',');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${this.API_KEY}&units=metric&lang=es`;

    this.http.get(url).subscribe({
      next: (data: any) => {
        this.result = data;
        this.error = '';
      },
      error: () => {
        this.result = null;
        this.error = 'Ciudad no encontrada o error de conexión.';
      }
    });
  }
}
