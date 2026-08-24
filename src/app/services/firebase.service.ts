import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { first, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { getAuth, updateProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) {}

  //====== Autenticación =========

  getAuth() {
    return this.auth;
  }

  async login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email ?? '', user.password ?? '');
  }

  async signUp(user: User, isAdmin: boolean = false) {
    const credenciales = await this.auth.createUserWithEmailAndPassword(user.email ?? '', user.password ?? '');
  
    if (credenciales.user) {
      await this.db.collection('users').doc(credenciales.user.uid).set({
        uid: credenciales.user.uid,
        email: user.email,
        role: isAdmin ? 'admin' : 'cliente'
      });
  
      await credenciales.user.updateProfile({ displayName: user.name });
    }
    
    return credenciales;
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    // Limpiamos los datos del almacenamiento al cerrar sesión
    this.utilsSvc.removeElementFromLocalStorage('user');
    this.utilsSvc.routerLink('/auth');
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  // ====== Gestión de Usuarios =========

  getUserRole(uid: string) {
    return this.db.collection('users').doc(uid).valueChanges().pipe(
      first(),
      map((user: any) => user?.role || 'cliente')
    );
  }

  getUserData(uid: string) {
    return this.db.collection('users').doc(uid).valueChanges().pipe(
      first(),
      map((user: any) => user || { role: 'cliente' })
    );
  }

  async isAdmin(): Promise<boolean> {
    const user = await lastValueFrom(this.auth.authState.pipe(first()));
    if (user) {
      const role = await lastValueFrom(this.getUserRole(user.uid));
      return role === 'admin';
    }
    return false;
  }

  async updateUserRole(uid: string, newRole: 'admin' | 'cliente') {
    try {
      if (!uid || !newRole) throw new Error('Datos inválidos para actualizar el rol.');
      await this.db.collection('users').doc(uid).update({ role: newRole });
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      throw error;
    }
  }

  async updateUser(user: { displayName?: string }) {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, user);
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        throw error;
      }
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

  // ====== Gestión de Pedidos =========

  async guardarPedido(order: any) {
    try {
      if (!order) throw new Error('Orden inválida.');
      await this.db.collection('pedidos').add(order);
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      throw error;
    }
  }
}