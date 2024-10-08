import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TShirt } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TShirtService {
  private collectionName = 'tshirts'; // Nombre de la colección en Firestore

  constructor(private db: AngularFirestore) { }

  // Crear polera
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
