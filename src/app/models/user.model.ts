export interface User{
    uid: string,
    name: string,
    email: string,
    password?: string
}

export interface TShirt {
    id?: string;
    material: string;
    size: string;
    description?: string; // Agrega una descripción opcional
    imageUrl?: string;    // URL de la imagen subida
  }