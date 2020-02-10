import { Pizza } from './../pizza.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { PizzariaService } from './../pizzaria.service'
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
})
export class PizzaPage implements OnInit, OnDestroy {

  pizzas: Pizza[];
  isLoading = false;
  private pizzaSub: Subscription;

  constructor(
    private pizzariaService: PizzariaService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.pizzaSub = this.pizzariaService.pizzas.subscribe(pizzas => {
      this.pizzas = pizzas;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.pizzariaService.fetchPizzas().subscribe(() => {
      this.isLoading = false;
    });
  }

  editarPizza(pizzaId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'pizzaria', 'tabs', 'pizza', 'editar', pizzaId]);
    console.log('Editar oferta ' + pizzaId);
  }

  deletarPizza(pizzaId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    // adiciona um o spinner
    this.loadingController.create({
      message: 'Deletando Pizza...'
    }).then(loadingEl => {
      loadingEl.present();
      // deleta pizza pelo id
      this.pizzariaService.deletaPizza(pizzaId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if(this.pizzaSub) {
      this.pizzaSub.unsubscribe();
    }
  }

}
