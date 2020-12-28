import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {IngresoEgreso} from '../models/ingreso-egreso.models';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) { }

  crearIngersoEgreso(ingresoEgreso: IngresoEgreso): Promise<DocumentReference<DocumentData>> {
    const uid = this.authService.user().uid;
    delete ingresoEgreso.uid; // Borra el atributo
    return this.firestore.doc(`${ uid }/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});
  }

  initIngresosEgresosListener(uid: string): Observable<any[]> {
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => {
          return snapshot.map( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            };
          });
        })
      );
  }

  borrarIngresoEgreso( uidItem: string): Promise<void> {
    const uid = this.authService.user().uid;
    return this.firestore.doc( `${ uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
