import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage
import { Injectable } from '@angular/core';
import { TShirt } from '../models/user.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'; // Para completar el observable de subida de imagen

@Injectable({
  providedIn: 'root'
})
export class TShirtService {
  public collectionName: string = 'tshirts'; // Cambia a public
  public db: AngularFirestore; // Cambia a public

  constructor(private storage: AngularFireStorage, db: AngularFirestore) {
    this.db = db; // Inicializa db
  }

  // Método para crear un ID único
  createId(): string {
    return this.db.createId(); // Genera y devuelve un ID único
  }


  // Crear polera con subida de imagen
  uploadImageAndSaveTShirt(tshirt: TShirt, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = this.db.createId(); // Genera un ID único
      const filePath = `tshirts/${id}`; // Define la ruta de la imagen en Firebase Storage
      const fileRef = this.storage.ref(filePath); // Referencia al archivo en Firebase Storage
      const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

      // Después de subir la imagen, obtener la URL y guardar la camiseta
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
            this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id }) // Guarda la camiseta en Firestore con la URL de la imagen
              .then(() => resolve()) // Resuelve la promesa
              .catch(error => reject(error)); // Rechaza la promesa en caso de error
          }, error => reject(error)); // Rechaza la promesa si hay un error al obtener la URL
        })
      ).subscribe();
    });
  }


  // Crear polera sin imagen
  createTShirt(tshirt: TShirt): Promise<void> {
    const id = this.db.createId(); // Genera un ID único
    return this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id });
  }

  // Leer poleras
  getTShirts(): Observable<TShirt[]> {
    return this.db.collection<TShirt>(this.collectionName).valueChanges();
  }

  // Leer polera por ID
  getTShirt(id: string): Observable<TShirt | undefined> {
    return this.db.collection(this.collectionName).doc<TShirt>(id).valueChanges();
  }

  // Actualizar polera
  updateTShirt(tshirt: TShirt): Promise<void> {
    return this.db.collection(this.collectionName).doc(tshirt.id).update(tshirt);
  }

  // Método para eliminar la imagen del Storage
  deleteImage(filePath: string): Promise<void> {
    return this.storage.ref(filePath).delete().toPromise();
  }

  // Modificar el método deleteTShirt
  deleteTShirt(id: string, imageUrl: string): Promise<void> {
    // Primero elimina la imagen del Storage
    const fileRef = this.storage.refFromURL(imageUrl); // Obtener referencia del archivo
    return fileRef.delete().toPromise().then(() => {
      // Después elimina el documento de Firestore
      return this.db.collection(this.collectionName).doc(id).delete();
    });
  }
}
