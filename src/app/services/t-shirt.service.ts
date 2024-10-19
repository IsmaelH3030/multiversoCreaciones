// Importaciones necesarias de Angular y Firebase
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar el servicio Firestore
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar AngularFireStorage para manejar almacenamiento
import { Injectable } from '@angular/core'; // Importar el decorador Injectable
import { TShirt } from '../models/user.model'; // Importar el modelo TShirt
import { Observable } from 'rxjs'; // Importar Observable de RxJS para manejo de datos asíncronos
import { finalize } from 'rxjs/operators'; // Importar operador finalize para completar el observable de subida de imagen

// Decorador que indica que esta clase es un servicio
@Injectable({
  providedIn: 'root' // Proveer el servicio en el root del módulo
})

// Clase del servicio
export class TShirtService {
  public collectionName: string = 'tshirts'; // Nombre de la colección en Firestore (público para acceso)
  public db: AngularFirestore; // Instancia de AngularFirestore (público para acceso)

  // Constructor que inyecta AngularFireStorage y AngularFirestore
  constructor(private storage: AngularFireStorage, db: AngularFirestore) {
    this.db = db; // Inicializa la instancia de Firestore
  }

  // Método para crear un ID único
  createId(): string {
    return this.db.createId(); // Genera y devuelve un ID único usando Firestore
  }

  // Método para crear una camiseta con subida de imagen
  uploadImageAndSaveTShirt(tshirt: TShirt, file: File): Promise<void> {
    return new Promise((resolve, reject) => { // Devuelve una promesa para manejar la carga
      const id = this.db.createId(); // Genera un ID único para la camiseta
      const filePath = `tshirts/${id}`; // Define la ruta de la imagen en Firebase Storage
      const fileRef = this.storage.ref(filePath); // Referencia al archivo en Firebase Storage
      const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

      // Después de subir la imagen, obtener la URL y guardar la camiseta
      task.snapshotChanges().pipe(
        finalize(() => { // Cuando se completa la carga
          fileRef.getDownloadURL().subscribe(url => { // Obtener la URL de la imagen subida
            tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
            this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id }) // Guarda la camiseta en Firestore con la URL de la imagen
              .then(() => resolve()) // Resuelve la promesa si la creación fue exitosa
              .catch(error => reject(error)); // Rechaza la promesa si hay un error al guardar
          }, error => reject(error)); // Rechaza la promesa si hay un error al obtener la URL
        })
      ).subscribe(); // Se suscribe para iniciar la observación de cambios
    });
  }

  // Método para crear una camiseta sin imagen
  createTShirt(tshirt: TShirt): Promise<void> {
    const id = this.db.createId(); // Genera un ID único para la camiseta
    return this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id }); // Guarda la camiseta en Firestore
  }

  // Método para leer todas las camisetas
  getTShirts(): Observable<TShirt[]> {
    return this.db.collection<TShirt>(this.collectionName).valueChanges(); // Devuelve un observable de las camisetas
  }

  // Método para leer una camiseta específica por ID
  getTShirt(id: string): Observable<TShirt | undefined> {
    return this.db.collection(this.collectionName).doc<TShirt>(id).valueChanges(); // Devuelve un observable de la camiseta específica
  }

  // Método para actualizar una camiseta
  updateTShirt(tshirt: TShirt): Promise<void> {
    return this.db.collection(this.collectionName).doc(tshirt.id).update(tshirt); // Actualiza la camiseta en Firestore
  }

  // Método para eliminar la imagen del almacenamiento
  deleteImage(filePath: string): Promise<void> {
    return this.storage.ref(filePath).delete().toPromise(); // Elimina la imagen de Firebase Storage y devuelve una promesa
  }

  // Método para eliminar una camiseta y su imagen
  deleteTShirt(id: string, imageUrl: string): Promise<void> {
    // Primero elimina la imagen del Storage
    const fileRef = this.storage.refFromURL(imageUrl); // Obtener referencia del archivo utilizando la URL
    return fileRef.delete().toPromise().then(() => { // Eliminar la imagen y manejar la promesa
      // Después elimina el documento de Firestore
      return this.db.collection(this.collectionName).doc(id).delete(); // Eliminar la camiseta de Firestore
    });
  }
}
