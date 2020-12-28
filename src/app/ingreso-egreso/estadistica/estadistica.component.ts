import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {IngresoEgreso} from '../../models/ingreso-egreso.models';
import {Subscription} from 'rxjs';
import {Label, MultiDataSet} from 'ng2-charts';
import {AppStateWithIngreso} from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos = 0;
  egresos = 0;
  totalIngresos = 0;
  totalEgresos = 0;

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription;


  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];

  // constructor(private store: Store<AppState>) { } for load lazy
  constructor(private store: Store<AppStateWithIngreso>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ingresosEgresosFb => this.generarEstadistica(ingresosEgresosFb.items));
  }

  generarEstadistica( items: IngresoEgreso[] ): void {

    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.egresos = 0;
    this.ingresos = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }
    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }

}
