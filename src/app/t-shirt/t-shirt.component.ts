import { Component, OnInit } from '@angular/core';
import { TShirtService } from '../services/t-shirt.service';
import { TShirt } from '../models/user.model';

@Component({
  selector: 'app-t-shirt',
  templateUrl: './t-shirt.component.html',
  styleUrls: ['./t-shirt.component.scss']
})
export class TShirtComponent implements OnInit {
  tshirts: TShirt[] = [];
  selectedTShirt: TShirt = { material: '', size: '' }; // Inicializar polera

  constructor(private tShirtService: TShirtService) { }

  ngOnInit() {
    this.loadTShirts();
  }

  loadTShirts() {
    this.tShirtService.getTShirts().subscribe(tshirts => {
      this.tshirts = tshirts;
    });
  }

  createOrUpdateTShirt() {
    if (this.selectedTShirt.id) {
      this.tShirtService.updateTShirt(this.selectedTShirt).then(() => {
        this.resetForm();
      });
    } else {
      this.tShirtService.createTShirt(this.selectedTShirt).then(() => {
        this.resetForm();
      });
    }
  }

  editTShirt(tshirt: TShirt) {
    this.selectedTShirt = { ...tshirt }; // Clonar la polera seleccionada
  }

  deleteTShirt(id: string) {
    this.tShirtService.deleteTShirt(id).then(() => {
      this.loadTShirts(); // Recargar poleras después de eliminar
    });
  }

  resetForm() {
    this.selectedTShirt = { material: '', size: '' };
  }
}
