import { Injectable } from '@angular/core';
import { Funcionario } from './funcionario.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

interface FuncionarioData {
  nome: string;
  cargo: string;
  dataNascimento: any;
  imageUrl: any;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor(
    private http: HttpClient,
  ) {}

  private _funcionario = new BehaviorSubject<Funcionario[]>([]);

  fetchFuncionarios() {
    return this.http
      .get<{[key: string]: FuncionarioData}>('https://app-reservas-9b5d8.firebaseio.com/pizzaria-funcionario.json')
      .pipe(map(resData => {
        const funcionario = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            funcionario
            .push(new Funcionario(
              key,
              resData[key].nome,
              resData[key].cargo,
              resData[key].dataNascimento,
              resData[key].imageUrl
              )
            );
          }
        }
        return funcionario;
      }),
      tap(funcionarioRes => {
        this._funcionario.next(funcionarioRes);
      })
    );
  }

  get funcionarios() {
    return this._funcionario.asObservable();
  }

  getFuncionario(id: string) {
    return this.http
      .get<Funcionario>(`https://app-reservas-9b5d8.firebaseio.com/pizzaria-funcionario/${id}.json`)
      .pipe(
        map(placeData => {
          return new Funcionario(
            id, 
            placeData.nome, 
            placeData.cargo, 
            placeData.dataNascimento,
            placeData.imageUrl
          );
        })
      );
  }

  addFuncionario(nome: string, cargo: string, dataNascimento: any, imageUrl: any) {
    let generateId: string;
    const newFuncionario = new Funcionario(
      Math.random().toString(), 
      nome,
      cargo,
      dataNascimento,
      imageUrl 
    );
    return this.http
      .post<{name: string}>('https://app-reservas-9b5d8.firebaseio.com/pizzaria-funcionario.json', 
      { ...newFuncionario, id: null })
      .pipe(
        switchMap(resData => {
          generateId = resData.name;
          return this.funcionarios;
        }),
        take(1),
        tap(funcionario => {
          newFuncionario.id = generateId;
          this._funcionario.next(funcionario.concat(newFuncionario));
        })
      );
  }

  atualizaFuncionario(funcionarioId: string, nome: string, cargo: string, dataNascimento: any, imageUrl: any) {
    let atualFuncionario: Funcionario[];
    return this.funcionarios.pipe(
      take(1), switchMap(funcionarios => {
        if (!funcionarios || funcionarios.length <= 0) {
          return this.fetchFuncionarios();
        } else {
          return of(funcionarios);
        }
      }),
      switchMap(funcionarios => {
        const atualFuncionarioIndex = funcionarios.findIndex(pl => pl.id === funcionarioId);
        atualFuncionario = [...funcionarios];
        const oldFuncionario = atualFuncionario[atualFuncionarioIndex];
        atualFuncionario[atualFuncionarioIndex] = new Funcionario(
          oldFuncionario.id,
          nome,
          cargo,
          dataNascimento,
          imageUrl
        );
        return this.http.put(
          `https://app-reservas-9b5d8.firebaseio.com/pizzaria-funcionario/${funcionarioId}.json`,
          { ...atualFuncionario[atualFuncionarioIndex], id: null}
        );
      }),
      tap(() => {
        this._funcionario.next(atualFuncionario);
      }));
  }


  deletaFuncionario(funcionarioId: string) {
    // logica para deletar pizza
    return this.http.delete(
        `https://app-reservas-9b5d8.firebaseio.com/pizzaria-funcionario/${funcionarioId}.json`
    ).pipe(switchMap(() => {
        return this.funcionarios;
    }),
    take(1),
    tap(funcionarios => {
        this._funcionario.next(funcionarios.filter(b => b.id !== funcionarioId));
    }));
  }

}
