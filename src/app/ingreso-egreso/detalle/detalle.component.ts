import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {IngresoEgreso} from '../../models/ingreso-egreso.models';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription;

  constructor(private store: Store<AppState>,
              private ingresEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresosEgresos')
      .subscribe(ingresosEgresosFB => this.ingresosEgresos = ingresosEgresosFB.items);
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid: string): void {
    this.ingresEgresoService.borrarIngresoEgreso( uid )
      .then( () => Swal.fire ('Borrado', 'Item borrado', 'success'))
      .catch( err => Swal.fire ('Error', err.message, 'error'));
  }
}
