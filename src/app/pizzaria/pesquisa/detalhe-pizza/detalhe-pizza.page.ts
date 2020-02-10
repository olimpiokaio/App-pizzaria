import { PizzariaService } from './../../pizzaria.service';
import { Component, OnInit } from '@angular/core';
//placeService
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
//place Model
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Pizza } from '../../pizza.model';

@Component({
  selector: 'app-detalhe-pizza',
  templateUrl: './detalhe-pizza.page.html',
  styleUrls: ['./detalhe-pizza.page.scss'],
})
export class DetalhePizzaPage implements OnInit {

  isLoading = false;
  private pizzaSub: Subscription;
  pizza: Pizza;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private pizzariaService: PizzariaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('pizzaId')) {
        this.navCtrl.navigateBack('/pizzaria/tabs/pesquisa');
        return;
      }
      this.isLoading = true;
      this.pizzaSub = this.pizzariaService
      .getPizza(paramMap.get('pizzaId'))
      .subscribe(pizza => {
        this.pizza = pizza;
        this.isLoading = false;
      }, error => {
      console.log(error);
      this.alertCtrl.create({
        header: 'Ocorreu um erro!', 
        message: 'A pizza não foi encontrada, por favor tente mais tarde.',
        buttons: [{text: 'ok', handler: () => {
          this.router.navigate(['/pizzaria/tabs/pizza/']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

}
