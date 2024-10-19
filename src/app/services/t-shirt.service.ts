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
  private collectionName = 'tshirts'; // Nombre de la colección en Firestore

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { } // Inyecta AngularFireStorage

  // Crear polera con subida de imagen
  uploadImageAndSaveTShirt(file: File, tshirt: TShirt): void {
    const id = this.db.createId(); // Genera un ID único
    const filePath = `tshirts/${id}`; // Define la ruta de la imagen en Firebase Storage
    const fileRef = this.storage.ref(filePath); // Referencia al archivo en Firebase Storage
    const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

    // Después de subir la imagen, obtener la URL y guardar la camiseta
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
          this.db.collection(this.collectionName).doc(id).set({ ...tshirt, id }); // Guarda la camiseta en Firestore con la URL de la imagen
        });
      })
    ).subscribe();
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

  // Eliminar polera
  deleteTShirt(id: string): Promise<void> {
    return this.db.collection(this.collectionName).doc(id).delete();
  }
}
