import { Component, OnInit } from '@angular/core';
import { TShirtService } from 'src/app/services/t-shirt.service'; // Verifica la ruta
import { TShirt } from 'src/app/models/user.model'; // Verifica la ruta

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: TShirt[] = []; // Array para almacenar los productos

  constructor(private tShirtService: TShirtService) {}

  ngOnInit() {
    this.loadTShirts(); // Cargar poleras al inicializar
  }

  loadTShirts() {
    this.tShirtService.getTShirts().subscribe((data: TShirt[]) => {
      this.productos = data; // Almacenar las poleras obtenidas en la variable
    });
  }
}
