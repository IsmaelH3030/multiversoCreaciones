export interface User{
    uid: string,
    name: string,
    email: string,
    password?: string
}

export interface TShirt {
    id?: string; // Opcional para Firestore
    material: string;
    size: string;
    description?: string; // Si necesitas un campo de descripción
    imageUrl?: string; // Asegúrate de incluir este campo
  }
