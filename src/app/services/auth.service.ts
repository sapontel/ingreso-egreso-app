import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

import {Observable, Subscription} from 'rxjs';

import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import * as authAcions from '../auth/auth.actions';

import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.models';
import * as ingresoEgresoActiosn from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  public user(): Usuario {
    return this._user; // {...this_user} evita mutaciones
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAutListener(): void {
    this.auth.authState.subscribe( fuser => {
      if ( fuser ){
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (fireStoreUser: Usuario) => {
            // const user = Usuario.fromFirebase(fireStoreUser);
            this._user = fireStoreUser;
            this.store.dispatch( authAcions.setUser({user: fireStoreUser}));
          });
      } else {
        this._user = null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch( authAcions.unSetUser());
        this.store.dispatch( ingresoEgresoActiosn.unSetItems());
      }
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

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean>  {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null)
    );
  }
}
