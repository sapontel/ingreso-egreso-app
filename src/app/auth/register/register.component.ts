import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {Subscription} from 'rxjs';
import * as ui from '../../shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private asuthService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required ],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required ]
    });
    this.uiSubscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading);
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) {return; }

    this.store.dispatch( ui.isLoading());
/*
    Swal.fire({
      title: 'Espere por favor!',
      didOpen: () => {
        Swal.showLoading();
      }});
*/

    const {nombre, correo, password} = this.registroForm.value;
    this.asuthService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        console.log(credenciales);
//        Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      }
    ).catch(err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      });
    });
  }
}
