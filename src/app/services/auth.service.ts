import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore) { }

  initOutListener(): void {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<void> {
    return this.auth.createUserWithEmailAndPassword(email, password)
      // .then( fbUser => {  const newuser = new Usuario(fbUser.user.uid, nombre, email); dessestructuración
      .then( ({user}) => {
        const newUser = new Usuario(user.uid, nombre, email);
        return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean>  {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null)
    );
  }
}
