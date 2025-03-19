import { Component, OnInit, ViewChild } from '@angular/core'; // Importa los decoradores y la interfaz necesarios de Angular
import { TShirtService } from '../services/t-shirt.service'; // Importa el servicio para gestionar camisetas
import { FirebaseService } from '../services/firebase.service'; // Importa el servicio de Firebase para autenticación y permisos
import { TShirt } from '../models/user.model'; // Importa el modelo de datos de camiseta
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa el servicio de almacenamiento de Firebase
import { finalize } from 'rxjs/operators'; // Importa el operador finalize para manejar la subida de imágenes

@Component({
  selector: 'app-t-shirt', // Define el selector del componente
  templateUrl: './t-shirt.component.html', // Especifica la plantilla HTML del componente
  styleUrls: ['./t-shirt.component.scss'] // Especifica los estilos CSS/SCSS del componente
})
export class TShirtComponent implements OnInit { // Declara la clase del componente e implementa OnInit
  tshirts: TShirt[] = []; // Define un array para almacenar la lista de camisetas
  selectedTShirt: TShirt = { material: '', size: '' }; // Define una camiseta seleccionada con valores vacíos por defecto
  uploadPercent: number | undefined; // Almacena el porcentaje de subida de una imagen
  imageUrl: string | undefined; // Almacena la URL de la imagen subida
  imageFile: File | undefined; // Almacena el archivo de imagen seleccionado
  isAdmin: boolean = false; // Define si el usuario es administrador o no

  @ViewChild('fileInput') fileInput: any; // Obtiene una referencia al input de archivos en la plantilla

  constructor(
    private tShirtService: TShirtService, // Inyecta el servicio de camisetas
    private storage: AngularFireStorage, // Inyecta el servicio de almacenamiento de Firebase
    private firebaseService: FirebaseService // Inyecta el servicio de Firebase para autenticación
  ) {}

  async ngOnInit() { // Método que se ejecuta al inicializar el componente
    this.loadTShirts(); // Carga la lista de camisetas desde el servicio
    this.isAdmin = await this.firebaseService.isAdmin(); // Verifica si el usuario tiene permisos de administrador
  }

  loadTShirts() { // Método para cargar la lista de camisetas desde el servicio
    this.tShirtService.getTShirts().subscribe(tshirts => {
      this.tshirts = tshirts; // Asigna la lista de camisetas obtenidas al array local
    });
  }

  createOrUpdateTShirt() { // Método para crear o actualizar una camiseta
    if (!this.isAdmin) { // Verifica si el usuario es administrador
      alert('No tienes permisos para realizar esta acción.'); // Muestra una alerta si no tiene permisos
      return; // Sale del método
    }
    
    if (this.selectedTShirt.id) { // Si la camiseta tiene un ID, significa que se está editando
      this.tShirtService.deleteTShirt(this.selectedTShirt.id, this.selectedTShirt.imageUrl!).then(() => {
        if (this.imageFile) { // Si hay una imagen nueva seleccionada
          this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile); // Sube la nueva imagen y guarda la camiseta
        } else {
          alert("Por favor, selecciona una imagen."); // Muestra una alerta si no hay imagen seleccionada
        }
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error); // Muestra el error en consola
        alert('Ocurrió un error al intentar eliminar la camiseta.'); // Muestra una alerta de error
      });
    } else { // Si no hay un ID, significa que se está creando una nueva camiseta
      if (this.imageFile) { // Si hay una imagen seleccionada
        this.uploadImageAndSaveTShirt(this.selectedTShirt, this.imageFile); // Sube la imagen y guarda la camiseta
      } else {
        alert("Por favor, selecciona una imagen."); // Muestra una alerta si no hay imagen
      }
    }
  }

  editTShirt(tshirt: TShirt) { // Método para editar una camiseta
    if (!this.isAdmin) { // Verifica si el usuario es administrador
      alert('No tienes permisos para editar.'); // Muestra una alerta si no tiene permisos
      return; // Sale del método
    }
    this.selectedTShirt = { ...tshirt }; // Clona la camiseta seleccionada
    this.imageUrl = tshirt.imageUrl; // Asigna la URL de la imagen actual
  }

  deleteTShirt(tshirt: TShirt) { // Método para eliminar una camiseta
    if (!this.isAdmin) { // Verifica si el usuario es administrador
      alert('No tienes permisos para eliminar.'); // Muestra una alerta si no tiene permisos
      return; // Sale del método
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar esta camiseta?')) { // Muestra una confirmación antes de eliminar
      this.tShirtService.deleteTShirt(tshirt.id, tshirt.imageUrl!).then(() => {
        this.loadTShirts(); // Recarga la lista de camisetas tras eliminar
      }).catch(error => {
        console.error('Error al eliminar la camiseta:', error); // Muestra el error en consola
        alert('Ocurrió un error al intentar eliminar la camiseta. Por favor, inténtalo de nuevo.'); // Muestra una alerta de error
      });
    }
  }

  resetForm() { // Método para reiniciar el formulario de camiseta
    this.selectedTShirt = { material: '', size: '' }; // Restablece la camiseta seleccionada
    this.imageUrl = undefined; // Restablece la URL de la imagen
    this.imageFile = undefined; // Restablece el archivo de imagen
    this.uploadPercent = undefined; // Restablece el porcentaje de subida
    
    if (this.fileInput) { // Si hay un input de archivos
      this.fileInput.nativeElement.value = ''; // Restablece el input de archivos
    }
  }

  uploadImageAndSaveTShirt(tshirt: TShirt, file: File) { // Método para subir una imagen y guardar la camiseta
    const id = this.tShirtService.createId(); // Genera un ID único para la camiseta
    const filePath = `tshirts/${id}`; // Define la ruta de almacenamiento en Firebase
    const fileRef = this.storage.ref(filePath); // Obtiene la referencia del archivo en Firebase
    const task = this.storage.upload(filePath, file); // Inicia la subida del archivo

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = Math.floor(percentage!); // Actualiza el porcentaje de subida
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          tshirt.imageUrl = url; // Asigna la URL de la imagen subida
          this.tShirtService.createTShirt({ ...tshirt, id }).then(() => {
            this.resetForm(); // Reinicia el formulario tras guardar
          }).catch(error => {
            console.error('Error al crear la camiseta:', error); // Muestra el error en consola
            alert('Ocurrió un error al crear la camiseta.'); // Muestra una alerta de error
          });
        });
      })
    ).subscribe();
  }

  uploadImage(event: any) { // Método para manejar la selección de imágenes
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (file) { // Si hay un archivo seleccionado
      this.imageFile = file; // Asigna el archivo a la variable local
      this.imageUrl = URL.createObjectURL(file); // Crea una URL temporal para previsualización
    }
  }
}
