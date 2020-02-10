import { PizzariaService } from './../../pizzaria.service';
import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Pizza } from '../../pizza.model';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-editar-pizza',
  templateUrl: './editar-pizza.page.html',
  styleUrls: ['./editar-pizza.page.scss'],
})
export class EditarPizzaPage implements OnInit {

  form: FormGroup;
  pizza: Pizza;
  pizzaId: string;
  isLoading = false;
  private pizzaSub: Subscription;
  imageUrl: any;

  constructor(
    private route: ActivatedRoute, 
    private pizzariaService: PizzariaService,
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer // camera capacitor
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('pizzaId')) {
        this.navCtrl.navigateBack('/pizzaria/tabs/pizza/');
        return;
      }
      this.pizzaId = paramMap.get('pizzaId');
      this.isLoading = true;
      this.pizzaSub = this.pizzariaService
        .getPizza(paramMap.get('pizzaId'))
        .subscribe(pizza => {
          this.pizza = pizza;
          this.form = new FormGroup({
            nome: new FormControl(this.pizza.nome,{
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            descricao: new FormControl(this.pizza.descricao,{
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }),
            preco: new FormControl(this.pizza.preco,{
              updateOn: 'blur',
              validators: [Validators.required, Validators.min(1)]
            })
          });
          this.imageUrl = pizza.imageUrl;
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
    defineCustomElements(window);
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 55,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl))
    this.imageUrl = image.dataUrl;
  }

  atualizarPizza() {
    if(!this.form.valid) {
      return
    }
    this.loadingController.create({
      message: 'Atualizando Pizza...'
    }).then(loadingEl => {
      loadingEl.present();
      this.pizzariaService.autalizaPizza(
        this.pizza.id, 
        this.form.value.nome, 
        this.form.value.descricao,
        this.imageUrl,
        this.form.value.preco
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/pizzaria/tabs/pizza']);
      });
    })
  }

}
