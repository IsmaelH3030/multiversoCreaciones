import { Component, OnInit } from '@angular/core';
import { TShirtService } from '../services/t-shirt.service';
import { TShirt } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar Firebase Storage
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-t-shirt',
  templateUrl: './t-shirt.component.html',
  styleUrls: ['./t-shirt.component.scss']
})
export class TShirtComponent implements OnInit {
  tshirts: TShirt[] = [];
  selectedTShirt: TShirt = { material: '', size: '' }; // Inicializar polera
  uploadPercent: number | undefined; // Para mostrar el progreso de la subida
  imageUrl: string | undefined; // URL de la imagen subida

  constructor(private tShirtService: TShirtService, private storage: AngularFireStorage) { }

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
    this.imageUrl = undefined; // Reiniciar la URL de la imagen
  }

  // Método para subir la imagen a Firebase Storage
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUrl = file; // Guardar el archivo seleccionado
      const filePath = `tshirts/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
  
      // Observar el progreso de la subida
      task.percentageChanges().subscribe((percentage) => {
        this.uploadPercent = percentage!;
      });
  
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // Guardar la URL de la imagen
            this.selectedTShirt.imageUrl = url; // Asigna la URL al objeto seleccionado
  
            // Llamar al método para crear o actualizar la camiseta
            this.createOrUpdateTShirt();
          });
        })
      ).subscribe();
    }
  }
}
  
