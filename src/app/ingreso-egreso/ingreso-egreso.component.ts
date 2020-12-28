import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IngresoEgreso} from '../models/ingreso-egreso.models';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import * as ui from '../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo = 'ingreso';
  cargando = false;
  loadingSubs: Subscription;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubs = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading);

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  guardar(): void {

    if ( this.ingresoForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngersoEgreso(ingresoEgreso)
      .then( () => {
        this.ingresoForm.reset();
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Error', err.message, 'error');
      });
  }
}
