import {IngresoEgreso} from '../models/ingreso-egreso.models';
import {createReducer, on} from '@ngrx/store';
import {setItems, unSetItems} from './ingreso-egreso.actions';


export interface State {
  items: IngresoEgreso[];
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
