// Definimos una interfaz llamada User que describe las propiedades de un usuario en la aplicación.
export interface User {
    uid: string,         // Identificador único del usuario.
    name: string,        // Nombre del usuario.
    email: string,       // Correo electrónico del usuario.
    password?: string    // Contraseña del usuario (opcional).
}

// Definimos una interfaz llamada TShirt que describe las propiedades de una polera en la aplicación.
export interface TShirt {
    id?: string;          // Identificador único de la polera (opcional, usado en Firestore).
    material: string;     // Material de la polera.
    size: string;         // Tamaño de la polera.
    description?: string; // Descripción de la polera (opcional).
    imageUrl?: string;    // URL de la imagen de la polera (opcional).
    price?: number;       // Precio de la polera (opcional).
}

