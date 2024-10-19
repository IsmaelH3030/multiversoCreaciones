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
  imageFile: File | undefined; // Archivo de la imagen seleccionado

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
      // Eliminar el producto existente antes de actualizar
      this.tShirtService.deleteTShirt(this.selectedTShirt.id, this.selectedTShirt.imageUrl).then(() => {
        // Después de eliminar, subimos la nueva imagen y creamos el nuevo producto
        if (this.imageFile) {
          this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile);
        } else {
          // Si no hay archivo de imagen, muestra un mensaje de advertencia
          alert("Por favor, selecciona una imagen.");
        }
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error);
        alert('Ocurrió un error al intentar eliminar la camiseta.');
      });
    } else {
      // Crear nueva camiseta
      if (this.imageFile) {
        this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile);
      } else {
        // Si no hay archivo, no se puede crear sin imagen
        alert("Por favor, selecciona una imagen.");
      }
    }
  }

  editTShirt(tshirt: TShirt) {
    this.selectedTShirt = { ...tshirt }; // Clonar la polera seleccionada
    this.imageUrl = tshirt.imageUrl; // Mostrar la imagen existente para edición
  }

  deleteTShirt(tshirt: TShirt) {
    if (confirm('¿Estás seguro de que deseas eliminar esta camiseta?')) {
      this.tShirtService.deleteTShirt(tshirt.id, tshirt.imageUrl).then(() => {
        this.loadTShirts(); // Recargar poleras después de eliminar
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error);
        alert('Ocurrió un error al intentar eliminar la camiseta. Por favor, inténtalo de nuevo.');
      });
    }
  }

  resetForm() {
    this.selectedTShirt = { material: '', size: '' };
    this.imageUrl = undefined; // Reiniciar la URL de la imagen
    this.imageFile = undefined; // Reiniciar el archivo de imagen
    this.uploadPercent = undefined; // Reiniciar el porcentaje de carga
  }

  // Método para subir la imagen a Firebase Storage y guardar la camiseta
  uploadImageAndSaveTShirt(tshirt: TShirt, file: File) {
    const id = this.tShirtService.createId(); // Crear un nuevo ID para la camiseta
    const filePath = `tshirts/${id}`; // Define la ruta de la imagen en Firebase Storage
    const fileRef = this.storage.ref(filePath); // Referencia al archivo en Firebase Storage
    const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

    // Observar el progreso de la subida
    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = Math.floor(percentage!); // Redondea el porcentaje a un entero
    });

    // Después de subir la imagen, obtener la URL y guardar la camiseta
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
          // Crear el nuevo objeto en Firestore
          this.tShirtService.createTShirt({ ...tshirt, id }).then(() => {
            this.resetForm();
          }).catch(error => {
            console.error('Error al crear la camiseta:', error);
            alert('Ocurrió un error al crear la camiseta.');
          });
        });
      })
    ).subscribe();
  }

  // Método para manejar la selección de imagen
  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file; // Guardar el archivo seleccionado
      this.imageUrl = URL.createObjectURL(file); // Crear URL para vista previa
    }
  }
}
