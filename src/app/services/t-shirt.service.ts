import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable } from '@angular/core';
import { TShirt } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TShirtService {
  public collectionName: string = 'tshirts';
  public db: AngularFirestore;
  private readonly fallbackProducts: TShirt[] = [
    {
      id: 'fallback-1',
      description: 'Camiseta básica',
      material: 'Algodón',
      size: 'M',
      price: 12990,
      imageUrl: 'assets/icon/1611770034484.png'
    },
    {
      id: 'fallback-2',
      description: 'Camiseta estampada',
      material: 'Poliéster',
      size: 'L',
      price: 14990,
      imageUrl: 'assets/icon/1611770034484.png'
    }
  ];

  constructor(private storage: AngularFireStorage, db: AngularFirestore) {
    this.db = db;
  }

  createId(): string {
    return this.db.createId();
  }

  uploadImageAndSaveTShirt(tshirt: TShirt, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = tshirt.id || this.db.createId();
      const filePath = `tshirts/${id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            tshirt.imageUrl = url;
            tshirt.id = id;
            
            this.db.collection(this.collectionName).doc(id).set(tshirt, { merge: true })
              .then(() => resolve())
              .catch(error => reject(error));
          }, error => reject(error));
        })
      ).subscribe();
    });
  }

  createTShirt(tshirt: TShirt): Promise<void> {
    const id = tshirt.id || this.db.createId();
    tshirt.id = id;
    return this.db.collection(this.collectionName).doc(id).set(tshirt);
  }

  getTShirts(): Observable<TShirt[]> {
    return this.db.collection<TShirt>(this.collectionName).valueChanges().pipe(
      map(products => (products && products.length > 0 ? products : this.getFallbackProducts())),
      catchError(error => {
        console.warn('No se pudo leer Firestore, mostrando productos de respaldo.', error);
        return of(this.getFallbackProducts());
      })
    );
  }

  private getFallbackProducts(): TShirt[] {
    return this.fallbackProducts.map(product => ({ ...product }));
  }

  getTShirt(id: string): Observable<TShirt | undefined> {
    return this.db.collection(this.collectionName).doc<TShirt>(id).valueChanges();
  }

  updateTShirt(idOrTShirt: string | TShirt, data?: Partial<TShirt>): Promise<void> {
    if (typeof idOrTShirt === 'string') {
      const docId = idOrTShirt;
      return this.db.collection(this.collectionName).doc(docId).update(data || {});
    } else {
      const docId = idOrTShirt.id;
      if (!docId) return Promise.reject(new Error('No se proporcionó un ID para actualizar.'));
      return this.db.collection(this.collectionName).doc(docId).update(idOrTShirt);
    }
  }

  deleteImage(filePathOrUrl: string): Promise<void> {
    if (!filePathOrUrl || !filePathOrUrl.includes('firebasestorage')) {
      return Promise.resolve();
    }
    return this.storage.refFromURL(filePathOrUrl).delete().toPromise().then(() => {});
  }

  async deleteTShirt(id: string, imageUrl?: string): Promise<void> {
    try {
      if (imageUrl && imageUrl.includes('firebasestorage')) {
        await this.storage.refFromURL(imageUrl).delete().toPromise().catch(err => {
          console.warn('No se pudo eliminar la imagen de Storage:', err);
        });
      }
    } finally {
      await this.db.collection(this.collectionName).doc(id).delete();
    }
  }
}