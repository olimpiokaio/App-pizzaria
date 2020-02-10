import { Injectable } from '@angular/core';

import { Cargo } from './categoria.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

interface CargoData {
  cargo: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private http: HttpClient
  ) { }

  private _cargos = new BehaviorSubject<Cargo[]>([]);

  fetchCargos() {
    return this.http
      .get<{[key: string]: CargoData}>('https://app-reservas-9b5d8.firebaseio.com/funcionario-cargo.json')
      .pipe(map(resData => {
        const cargos = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            cargos
            .push(new Cargo(
              key, 
              resData[key].cargo
              )
            );
          }
        }
        return cargos;
      }),
      tap(cargosRes => {
        this._cargos.next(cargosRes);
      })
    );
  }

  get cargos() {
    return this._cargos.asObservable();
  }

  getCargo(id: string) {
    return this.http
      .get<Cargo>(`https://app-reservas-9b5d8.firebaseio.com/funcionario-cargo/${id}.json`)
      .pipe(
        map(cargoData => {
          return new Cargo(
            id, 
            cargoData.cargo
          );
        })
      );
  }

  addCargo(cargo: string) {
    let generateId: string;
    const newCargo = new Cargo(
      Math.random().toString(), 
      cargo
    );
    return this.http
      .post<{name: string}>('https://app-reservas-9b5d8.firebaseio.com/funcionario-cargo.json', 
      { ...newCargo, id: null })
      .pipe(
        switchMap(resData => {
          generateId = resData.name;
          return this.cargos;
        }),
        take(1),
        tap(cargos => {
          newCargo.id = generateId;
          this._cargos.next(cargos.concat(newCargo));
        })
      );
  }

  atualizarCargo(cargoId: string, cargo: string) {
    let atualCargo: Cargo[];
    return this.cargos.pipe(
      take(1), switchMap(cargos => {
        if (!cargos || cargos.length <= 0) {
          return this.fetchCargos();
        } else {
          return of(cargos);
        }
      }),
      switchMap(cargos => {
        const atualCargoIndex = cargos.findIndex(pl => pl.id === cargoId);
        atualCargo = [...cargos];
        const oldPizza = atualCargo[atualCargoIndex];
        atualCargo[atualCargoIndex] = new Cargo(
          oldPizza.id,
          cargo
        );
        return this.http.put(
          `https://app-reservas-9b5d8.firebaseio.com/funcionario-cargo/${cargoId}.json`,
          { ...atualCargo[atualCargoIndex], id: null}
        );
      }),
      tap(() => {
        this._cargos.next(atualCargo);
      }));
  }


  deletaCargo(cargoId: string) {
    // logica para deletar pizza
    return this.http.delete(
        `https://app-reservas-9b5d8.firebaseio.com/funcionario-cargo/${cargoId}.json`
    ).pipe(switchMap(() => {
        return this.cargos;
    }),
    take(1),
    tap(cargos => {
        this._cargos.next(cargos.filter(b => b.id !== cargoId));
    }));
  }

}
