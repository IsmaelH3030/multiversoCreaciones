import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage para manejar la subida y almacenamiento de archivos
import { Injectable } from '@angular/core'; // Importa el decorador Injectable para permitir la inyección de dependencias
import { TShirt } from '../models/user.model'; // Importa el modelo TShirt desde su archivo correspondiente
import { Observable } from 'rxjs'; // Importa Observable para trabajar con flujos de datos
import { finalize } from 'rxjs/operators'; // Importa finalize para manejar la finalización de observables

// Marca la clase como un servicio inyectable
@Injectable({
  providedIn: 'root' // Indica que el servicio está disponible a nivel de aplicación
})
export class TShirtService {
  public collectionName: string = 'tshirts'; // Nombre de la colección en Firestore para camisetas
  public db: AngularFirestore; // Inicializa la base de datos Firestore

  // Constructor del servicio que inyecta las dependencias necesarias
  constructor(private storage: AngularFireStorage, db: AngularFirestore) {
    this.db = db; // Asigna la instancia de Firestore al servicio
  }

  // Método para crear un ID único para cada camiseta
  createId(): string {
    return this.db.createId(); // Genera y devuelve un ID único
  }

  // Método para subir una imagen y crear una camiseta en Firestore
  uploadImageAndSaveTShirt(tshirt: TShirt, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = this.db.createId(); // Genera un ID único para la camiseta
      const filePath = `tshirts/${id}`; // Define la ruta de almacenamiento de la imagen en Firebase Storage
      const fileRef = this.storage.ref(filePath); // Crea una referencia al archivo en Firebase Storage
      const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

      // Después de que la imagen se suba, obtiene la URL y guarda la camiseta en Firestore
      task.snapshotChanges().pipe(
        finalize(() => { // Se ejecuta al completar la subida
          fileRef.getDownloadURL().subscribe(url => { // Obtiene la URL de descarga de la imagen
            tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
            // Guarda la camiseta en Firestore, incluyendo el ID y la URL de la imagen
            this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id })
              .then(() => resolve()) // Resuelve la promesa si se guarda correctamente
              .catch(error => reject(error)); // Rechaza la promesa si ocurre un error
          }, error => reject(error)); // Rechaza la promesa si hay un error al obtener la URL
        })
      ).subscribe(); // Suscribe al observable para que se inicie la subida
    });
  }

  // Método para crear una camiseta sin subir una imagen
  createTShirt(tshirt: TShirt): Promise<void> {
    const id = this.db.createId(); // Genera un ID único
    return this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id }); // Guarda la camiseta en Firestore
  }

  // Método para leer todas las camisetas desde Firestore
  getTShirts(): Observable<TShirt[]> {
    return this.db.collection<TShirt>(this.collectionName).valueChanges(); // Devuelve un observable con los cambios en la colección
  }

  // Método para leer una camiseta específica por su ID
  getTShirt(id: string): Observable<TShirt | undefined> {
    return this.db.collection(this.collectionName).doc<TShirt>(id).valueChanges(); // Devuelve un observable del documento correspondiente
  }

  // Método para actualizar una camiseta existente
  updateTShirt(tshirt: TShirt): Promise<void> {
    return this.db.collection(this.collectionName).doc(tshirt.id).update(tshirt); // Actualiza el documento en Firestore
  }

  // Método para eliminar una imagen del almacenamiento de Firebase
  deleteImage(filePath: string): Promise<void> {
    return this.storage.ref(filePath).delete().toPromise(); // Elimina el archivo y devuelve una promesa
  }

  // Método para eliminar una camiseta y su imagen asociada
  deleteTShirt(id: string, imageUrl: string): Promise<void> {
    const fileRef = this.storage.refFromURL(imageUrl); // Obtiene una referencia al archivo usando la URL
    return fileRef.delete().toPromise().then(() => { // Elimina la imagen del almacenamiento
      // Luego, elimina el documento correspondiente en Firestore
      return this.db.collection(this.collectionName).doc(id).delete();
    });
  }
}
