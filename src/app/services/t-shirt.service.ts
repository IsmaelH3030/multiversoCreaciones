import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage para manejar la subida y almacenamiento de archivos
import { Injectable } from '@angular/core'; // Importa el decorador Injectable para permitir la inyección de dependencias
import { TShirt } from '../models/user.model'; // Importa el modelo TShirt desde su archivo correspondiente
import { Observable, of } from 'rxjs'; // Importa Observable y of para trabajar con flujos de datos
import { catchError, finalize, map } from 'rxjs/operators'; // Importa operadores para manejar finalización y errores

// Marca la clase como un servicio inyectable
@Injectable({
  providedIn: 'root' // Indica que el servicio está disponible a nivel de aplicación
})
export class TShirtService {
  public collectionName: string = 'tshirts'; // Nombre de la colección en Firestore para camisetas
  public db: AngularFirestore; // Inicializa la base de datos Firestore
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

  // Constructor del servicio que inyecta las dependencias necesarias
  constructor(private storage: AngularFireStorage, db: AngularFirestore) {
    this.db = db; // Asigna la instancia de Firestore al servicio
  }

  // Método para crear un ID único para cada camiseta
  createId(): string {
    return this.db.createId(); // Genera y devuelve un ID único
  }

  // Método para subir una imagen y crear/actualizar una camiseta en Firestore
  uploadImageAndSaveTShirt(tshirt: TShirt, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = tshirt.id || this.db.createId(); // Utiliza el ID existente o genera uno nuevo
      const filePath = `tshirts/${id}`; // Define la ruta de almacenamiento de la imagen en Firebase Storage
      const fileRef = this.storage.ref(filePath); // Crea una referencia al archivo en Firebase Storage
      const task = this.storage.upload(filePath, file); // Sube el archivo a Firebase Storage

      // Después de que la imagen se suba, obtiene la URL y guarda la camiseta en Firestore
      task.snapshotChanges().pipe(
        finalize(() => { // Se ejecuta al completar la subida
          fileRef.getDownloadURL().subscribe(url => { // Obtiene la URL de descarga de la imagen
            tshirt.imageUrl = url; // Asigna la URL de la imagen al objeto TShirt
            tshirt.id = id;
            
            // Guarda o actualiza la camiseta en Firestore
            this.db.collection(this.collectionName).doc(id).set(tshirt, { merge: true })
              .then(() => resolve()) // Resuelve la promesa si se guarda correctamente
              .catch(error => reject(error)); // Rechaza la promesa si ocurre un error
          }, error => reject(error)); // Rechaza la promesa si hay un error al obtener la URL
        })
      ).subscribe(); // Suscribe al observable para que se inicie la subida
    });
  }

  // Método para crear una camiseta con un ID explícito o autogenerado
  createTShirt(tshirt: TShirt): Promise<void> {
    const id = tshirt.id || this.db.createId(); // Respeta el ID existente si ya fue generado
    tshirt.id = id;
    return this.db.collection(this.collectionName).doc(id).set(tshirt); // Guarda la camiseta en Firestore
  }

  // Método para leer todas las camisetas desde Firestore
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

  // Método para leer una camiseta específica por su ID
  getTShirt(id: string): Observable<TShirt | undefined> {
    return this.db.collection(this.collectionName).doc<TShirt>(id).valueChanges(); // Devuelve un observable del documento correspondiente
  }

  // Método sobrecargado para actualizar una camiseta aceptando (id, datos) o un objeto TShirt completo
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

  // Método para eliminar una imagen del almacenamiento de Firebase de forma segura
  deleteImage(filePathOrUrl: string): Promise<void> {
    if (!filePathOrUrl || !filePathOrUrl.includes('firebasestorage')) {
      return Promise.resolve(); // Omite la eliminación si no es una URL de Firebase Storage
    }
    return this.storage.refFromURL(filePathOrUrl).delete().toPromise().then(() => {});
  }

  // Método para eliminar una camiseta y su imagen asociada sin romper la ejecución si falla Storage
  async deleteTShirt(id: string, imageUrl?: string): Promise<void> {
    try {
      // Intenta borrar la imagen únicamente si pertenece a Firebase Storage
      if (imageUrl && imageUrl.includes('firebasestorage')) {
        await this.storage.refFromURL(imageUrl).delete().toPromise().catch(err => {
          console.warn('No se pudo eliminar la imagen de Storage:', err);
        });
      }
    } final {
      // Elimina el documento en Firestore independientemente del estado de la imagen
      await this.db.collection(this.collectionName).doc(id).delete();
    }
  }
}