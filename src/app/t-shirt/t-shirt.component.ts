// Importaciones necesarias de Angular y Firebase
import { Component, OnInit } from '@angular/core'; // Importar el decorador Component y la interfaz OnInit
import { TShirtService } from '../services/t-shirt.service'; // Importar el servicio de camisetas
import { TShirt } from '../models/user.model'; // Importar el modelo de camiseta
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar Firebase Storage
import { finalize } from 'rxjs/operators'; // Importar operador finalize para manejar la finalización de observables

// Decorador que define el componente
@Component({
  selector: 'app-t-shirt', // Nombre del selector del componente
  templateUrl: './t-shirt.component.html', // Ruta del archivo HTML asociado
  styleUrls: ['./t-shirt.component.scss'] // Ruta del archivo de estilos asociado
})

// Clase del componente
export class TShirtComponent implements OnInit {
  // Propiedades del componente
  tshirts: TShirt[] = []; // Arreglo para almacenar camisetas
  selectedTShirt: TShirt = { material: '', size: '' }; // Inicializar camiseta seleccionada
  uploadPercent: number | undefined; // Para mostrar el progreso de la subida
  imageUrl: string | undefined; // URL de la imagen subida
  imageFile: File | undefined; // Archivo de la imagen seleccionado

  // Constructor que inyecta el servicio y el almacenamiento de Firebase
  constructor(private tShirtService: TShirtService, private storage: AngularFireStorage) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.loadTShirts(); // Cargar las camisetas al iniciar el componente
  }

  // Método para cargar las camisetas desde el servicio
  loadTShirts() {
    this.tShirtService.getTShirts().subscribe(tshirts => {
      this.tshirts = tshirts; // Asignar camisetas cargadas al arreglo
    });
  }

  // Método para crear o actualizar una camiseta
  createOrUpdateTShirt() {
    if (this.selectedTShirt.id) { // Verificar si hay una camiseta seleccionada (actualización)
      // Eliminar el producto existente antes de actualizar
      this.tShirtService.deleteTShirt(this.selectedTShirt.id, this.selectedTShirt.imageUrl).then(() => {
        // Después de eliminar, subimos la nueva imagen y creamos el nuevo producto
        if (this.imageFile) {
          this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile); // Llamar método para subir imagen y guardar
        } else {
          // Si no hay archivo de imagen, muestra un mensaje de advertencia
          alert("Por favor, selecciona una imagen."); // Avisar al usuario
        }
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error); // Mostrar error en consola
        alert('Ocurrió un error al intentar eliminar la camiseta.'); // Avisar al usuario
      });
    } else {
      // Crear nueva camiseta
      if (this.imageFile) {
        this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile); // Llamar método para subir imagen y guardar
      } else {
        // Si no hay archivo, no se puede crear sin imagen
        alert("Por favor, selecciona una imagen."); // Avisar al usuario
      }
    }
  }

  // Método para editar una camiseta
  editTShirt(tshirt: TShirt) {
    this.selectedTShirt = { ...tshirt }; // Clonar la camiseta seleccionada
    this.imageUrl = tshirt.imageUrl; // Mostrar la imagen existente para edición
  }

  // Método para eliminar una camiseta
  deleteTShirt(tshirt: TShirt) {
    if (confirm('¿Estás seguro de que deseas eliminar esta camiseta?')) { // Confirmar la eliminación
      this.tShirtService.deleteTShirt(tshirt.id, tshirt.imageUrl).then(() => {
        this.loadTShirts(); // Recargar camisetas después de eliminar
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error); // Mostrar error en consola
        alert('Ocurrió un error al intentar eliminar la camiseta. Por favor, inténtalo de nuevo.'); // Avisar al usuario
      });
    }
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.selectedTShirt = { material: '', size: '' }; // Reiniciar la camiseta seleccionada
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
      finalize(() => { // Operación a realizar al finalizar la carga
        fileRef.getDownloadURL().subscribe(url => { // Obtener la URL de la imagen subida
          tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
          // Crear el nuevo objeto en Firestore
          this.tShirtService.createTShirt({ ...tshirt, id }).then(() => {
            this.resetForm(); // Reiniciar el formulario después de crear
          }).catch(error => {
            console.error('Error al crear la camiseta:', error); // Mostrar error en consola
            alert('Ocurrió un error al crear la camiseta.'); // Avisar al usuario
          });
        });
      })
    ).subscribe(); // Suscribirse para iniciar el observable
  }

  // Método para manejar la selección de imagen
  uploadImage(event: any) {
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    if (file) {
      this.imageFile = file; // Guardar el archivo seleccionado
      this.imageUrl = URL.createObjectURL(file); // Crear URL para vista previa
    }
  }
}
