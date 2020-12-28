import {IngresoEgreso} from '../models/ingreso-egreso.models';
import {createReducer, on} from '@ngrx/store';
import {setItems, unSetItems} from './ingreso-egreso.actions';
import {AppState} from '../app.reducer';


export interface State {
  items: IngresoEgreso[];
}

// when load lazy, must do this interface extends from AppState
export interface AppStateWithIngreso extends AppState {
  ingresosEgresos: State;
}

export const initalState: State = {
  items: []
};

export const _ingresoEgresoReducer = createReducer(initalState,
  on(setItems, ( state, { items }) => ({...state, items: [...items]})),
  on(unSetItems, state => ({...state, items: []})),
);

export function ingresoEgresoReducer(state, action) {
  return _ingresoEgresoReducer(state, action);
}
