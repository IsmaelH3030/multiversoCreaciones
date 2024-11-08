import { Injectable } from '@angular/core'; // Importa el decorador Injectable para permitir la inyección de dependencias
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth para manejar la autenticación
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { User } from '../models/user.model'; // Importa el modelo User desde su archivo correspondiente
import { getAuth, updateProfile } from "firebase/auth"; // Importa funciones de Firebase para obtener la autenticación y actualizar el perfil
import { UtilsService } from './utils.service'; // Importa el servicio UtilsService para utilizar funciones utilitarias

// Marca la clase como un servicio inyectable
@Injectable({
  providedIn: 'root' // Indica que el servicio está disponible a nivel de aplicación
})
export class FirebaseService {

  // Constructor del servicio que inyecta las dependencias necesarias
  constructor(
    private auth: AngularFireAuth, // Inyección de AngularFireAuth para autenticación
    private db: AngularFirestore, // Inyección de AngularFirestore para acceso a la base de datos
    private utilsSvc: UtilsService, // Inyección del servicio utilitario
  ) { }

  //====== Autenticacion =========

  // Método para iniciar sesión con correo y contraseña
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password); // Llama al método de autenticación de Firebase
  }

  // Método para registrar un nuevo usuario
  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password); // Crea un nuevo usuario en Firebase
  }

  // Método para actualizar el perfil del usuario
  updateUser(user: any) {
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
    return updateProfile(auth.currentUser, user); // Actualiza el perfil del usuario actual
  }

  // Método para obtener el estado de autenticación del usuario
  getAuthState(){
    return this.auth.authState; // Devuelve el observable del estado de autenticación
  }

  // Método para cerrar sesión del usuario
  async signOut(){
    await this.auth.signOut(); // Cierra la sesión del usuario
    this.utilsSvc.routerLink('/auth'); // Redirige a la página de autenticación
    localStorage.removeItem('user'); // Elimina el usuario del almacenamiento local
  }

  // Método para restablecer la contraseña del usuario
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email); // Envía un correo para restablecer la contraseña
  }


    // Método para obtener el correo del usuario autenticado
    getUserEmail() {
      const user = this.auth.currentUser; // Obtenemos el usuario autenticado
      return user ? user.email : null; // Retorna el correo del usuario si está autenticado
    }
  
    // Método para obtener los datos del usuario desde Firestore
    getUserData(userId: string) {
      return this.db.collection('users').doc(userId).get();
    }

}
