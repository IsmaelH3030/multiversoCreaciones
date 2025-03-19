import { Injectable } from '@angular/core'; // Importa el decorador Injectable para que el servicio pueda ser inyectado en otros componentes.
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa el servicio de autenticación de Firebase.
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa el servicio de Firestore para gestionar la base de datos.
import { User } from '../models/user.model'; // Importa la interfaz User que define la estructura de un usuario.
import { UtilsService } from './utils.service'; // Importa un servicio de utilidades personalizado.
import { first, map } from 'rxjs/operators'; // Importa operadores de RxJS para manipular observables.
import { lastValueFrom } from 'rxjs'; // Importa la función para obtener el último valor de un observable.
import { getAuth, updateProfile } from 'firebase/auth'; // Importa funciones para la gestión de autenticación de Firebase.

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación sin necesidad de declararlo en un módulo específico.
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth, // Servicio de autenticación de Firebase.
    private db: AngularFirestore, // Base de datos Firestore para gestionar los usuarios.
    private utilsSvc: UtilsService // Servicio de utilidades personalizado.
  ) {}

  //====== Autenticación =========

  /**
   * Inicia sesión con correo y contraseña.
   * @param user Objeto con email y password.
   */
  async login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password); // Inicia sesión en Firebase con email y contraseña.
  }

  /**
   * Registra un nuevo usuario y le asigna un rol (cliente o admin).
   * @param user Objeto con datos del usuario.
   * @param isAdmin Indica si el usuario es administrador.
   */
  async signUp(user: User, isAdmin: boolean = false) {
    const credenciales = await this.auth.createUserWithEmailAndPassword(user.email, user.password); // Crea una cuenta en Firebase Authentication.
  
    if (credenciales.user) { // Verifica si el usuario fue creado correctamente.
      await this.db.collection('users').doc(credenciales.user.uid).set({ // Guarda el usuario en Firestore.
        uid: credenciales.user.uid, // ID único del usuario.
        email: user.email, // Email del usuario.
        role: isAdmin ? 'admin' : 'cliente' // Asigna el rol según el parámetro isAdmin.
      });
  
      await credenciales.user.updateProfile({ displayName: user.name }); // Actualiza el perfil del usuario con su nombre.
  
      console.log("Usuario registrado con éxito:", user.email, "Rol:", isAdmin ? "admin" : "cliente"); // Muestra un mensaje en consola con los datos del usuario.
    }
    
    return credenciales; // Retorna las credenciales del usuario creado.
  }

  /**
   * Obtiene el estado de autenticación del usuario.
   */
  getAuthState() {
    return this.auth.authState; // Devuelve un observable que indica si el usuario está autenticado.
  }

  /**
   * Cierra la sesión del usuario y redirige a la página de autenticación.
   */
  async signOut() {
    await this.auth.signOut(); // Cierra sesión en Firebase Authentication.
    this.utilsSvc.routerLink('/auth'); // Redirige al usuario a la página de autenticación.
    localStorage.removeItem('user'); // Elimina la información del usuario almacenada localmente.
  }

  /**
   * Envía un correo para restablecer la contraseña.
   * @param email Correo del usuario que solicita el restablecimiento.
   */
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email); // Envía un correo de recuperación de contraseña.
  }

  // ====== Gestión de Usuarios =========

  /**
   * Obtiene el rol del usuario a partir de su UID.
   * @param uid ID único del usuario en Firebase.
   */
  getUserRole(uid: string) {
    return this.db.collection('users').doc(uid).valueChanges().pipe(
      first(), // Obtiene solo el primer valor del observable.
      map((user: any) => user?.role || 'cliente') // Devuelve el rol del usuario o 'cliente' si no se encuentra.
    );
  }

  /**
   * Obtiene los datos completos del usuario.
   * @param uid ID único del usuario.
   */
  getUserData(uid: string) {
    return this.db.collection('users').doc(uid).valueChanges().pipe(
      first(),
      map((user: any) => user || { role: 'cliente' }) // Devuelve los datos del usuario o un objeto por defecto.
    );
  }

  /**
   * Verifica si el usuario autenticado es administrador.
   */
  async isAdmin(): Promise<boolean> {
    const user = await lastValueFrom(this.auth.authState.pipe(first())); // Obtiene el usuario autenticado.
    if (user) {
      const role = await lastValueFrom(this.getUserRole(user.uid)); // Obtiene el rol del usuario.
      return role === 'admin'; // Retorna true si el usuario es administrador.
    }
    return false; // Retorna false si el usuario no está autenticado o no es administrador.
  }

  /**
   * Actualiza el rol de un usuario en Firestore.
   * @param uid ID del usuario.
   * @param newRole Nuevo rol ('admin' o 'cliente').
   */
  async updateUserRole(uid: string, newRole: 'admin' | 'cliente') {
    try {
      if (!uid || !newRole) throw new Error('Datos inválidos para actualizar el rol.'); // Verifica que los datos sean válidos.
      await this.db.collection('users').doc(uid).update({ role: newRole }); // Actualiza el rol en Firestore.
    } catch (error) {
      console.error('Error al actualizar el rol:', error); // Muestra un error en consola.
      throw error; // Lanza el error para que pueda ser manejado externamente.
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado en Firebase Authentication.
   * @param user Objeto con la información a actualizar.
   */
  async updateUser(user: { displayName?: string }) {
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase.
    if (auth.currentUser) { // Verifica si hay un usuario autenticado.
      try {
        await updateProfile(auth.currentUser, user); // Actualiza el perfil del usuario.
      } catch (error) {
        console.error('Error al actualizar el perfil:', error); // Muestra un error en consola.
        throw error;
      }
    } else {
      throw new Error('No hay usuario autenticado'); // Lanza un error si no hay usuario autenticado.
    }
  }

  // ====== Gestión de Pedidos =========

  /**
   * Guarda un pedido en la base de datos Firestore.
   * @param order Objeto con la información del pedido.
   */
  async guardarPedido(order: any) {
    try {
      if (!order) throw new Error('Orden inválida.'); // Verifica que el pedido sea válido.
      await this.db.collection('pedidos').add(order); // Guarda el pedido en Firestore.
    } catch (error) {
      console.error('Error al guardar el pedido:', error); // Muestra un error en consola.
      throw error;
    }
  }
}
