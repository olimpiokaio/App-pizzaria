import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pizza } from './../pizza.model';
import { PizzariaService } from './../pizzaria.service';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.page.html',
  styleUrls: ['./pesquisa.page.scss'],
})
export class PesquisaPage implements OnInit, OnDestroy {

  pizzas: Pizza[];
  carregaPizzas: Pizza[];
  pizzaRelevante: Pizza[];
  isLoading = false;
  private pizzaSub: Subscription;

  constructor(
    private pizzariaService: PizzariaService, 
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.pizzaSub = this.pizzariaService.pizzas.subscribe(pizzas => {
      this.pizzas = pizzas;
      this.carregaPizzas = this.pizzas;
      this.pizzaRelevante = this.carregaPizzas.slice(1);
    });
  }

  //quando a pagina se tornar visivel
  ionViewWillEnter() {
    this.isLoading = true;
    this.pizzariaService.fetchPizzas().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if(this.pizzaSub) {
      this.pizzaSub.unsubscribe;
    }
  }

}