import { Injectable } from '@angular/core';
import { Pizza } from './pizza.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

interface PizzaData {
  nome: string;
  descricao: string;
  imageUrl: any;
  preco: number;
}

@Injectable({
  providedIn: 'root'
})
export class PizzariaService {

  constructor(
    private http: HttpClient
  ) {}

  private _pizzas = new BehaviorSubject<Pizza[]>([]);

  fetchPizzas() {
    return this.http
      .get<{[key: string]: PizzaData}>('https://app-reservas-9b5d8.firebaseio.com/pizzaria-pizza.json')
      .pipe(map(resData => {
        const pizzas = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            pizzas
            .push(new Pizza(
              key, 
              resData[key].nome, 
              resData[key].descricao, 
              resData[key].imageUrl, 
              resData[key].preco
              )
            );
          }
        }
        return pizzas;
      }),
      tap(pizzasRes => {
        this._pizzas.next(pizzasRes);
      })
    );
  }

  get pizzas() {
    return this._pizzas.asObservable();
  }

  getPizza(id: string) {
    return this.http
      .get<Pizza>(`https://app-reservas-9b5d8.firebaseio.com/pizzaria-pizza/${id}.json`)
      .pipe(
        map(pizzaData => {
          return new Pizza(
            id, 
            pizzaData.nome, 
            pizzaData.descricao, 
            pizzaData.imageUrl, 
            pizzaData.preco,
          );
        })
      );
  }

  addPizza(nome: string, descricao: string, imageUrl: any, preco: number) {
    let generateId: string;
    const newPizza = new Pizza(
      Math.random().toString(), 
      nome,
      descricao,
      imageUrl, 
      preco
    );
    return this.http
      .post<{name: string}>('https://app-reservas-9b5d8.firebaseio.com/pizzaria-pizza.json', 
      { ...newPizza, id: null })
      .pipe(
        switchMap(resData => {
          generateId = resData.name;
          return this.pizzas;
        }),
        take(1),
        tap(pizzas => {
          newPizza.id = generateId;
          this._pizzas.next(pizzas.concat(newPizza));
        })
      );
  }

  autalizaPizza(pizzaId: string, nome: string, descricao: string, imageUrl: any, preco: number) {
    let atualPizza: Pizza[];
    return this.pizzas.pipe(
      take(1), switchMap(pizzas => {
        if (!pizzas || pizzas.length <= 0) {
          return this.fetchPizzas();
        } else {
          return of(pizzas);
        }
      }),
      switchMap(pizzas => {
        const atualPizzaIndex = pizzas.findIndex(pl => pl.id === pizzaId);
        atualPizza = [...pizzas];
        const oldPizza = atualPizza[atualPizzaIndex];
        atualPizza[atualPizzaIndex] = new Pizza(
          oldPizza.id,
          nome,
          descricao,
          imageUrl,
          preco
        );
        return this.http.put(
          `https://app-reservas-9b5d8.firebaseio.com/pizzaria-pizza/${pizzaId}.json`,
          { ...atualPizza[atualPizzaIndex], id: null}
        );
      }),
      tap(() => {
        this._pizzas.next(atualPizza);
      }));
  }


  deletaPizza(pizzaId: string) {
    // logica para deletar pizza
    return this.http.delete(
        `https://app-reservas-9b5d8.firebaseio.com/pizzaria-pizza/${pizzaId}.json`
    ).pipe(switchMap(() => {
        return this.pizzas;
    }),
    take(1),
    tap(pizzas => {
        this._pizzas.next(pizzas.filter(b => b.id !== pizzaId));
    }));
  }

}
