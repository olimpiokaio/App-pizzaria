import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PizzariaService } from './../../pizzaria.service';
import { Router } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-nova-pizza',
  templateUrl: './nova-pizza.page.html',
  styleUrls: ['./nova-pizza.page.scss'],
})
export class NovaPizzaPage implements OnInit {

  form: FormGroup;
  photo: SafeResourceUrl;
  imageUrl: any;
 
  constructor(
    private loaderCtrl: LoadingController,
    private pizzariaService: PizzariaService,
    private router: Router,
    private sanitizer: DomSanitizer // camera capacitor
  ) {}

  ngOnInit() {
    defineCustomElements(window);
    this.form = new FormGroup({
      nome: new FormControl(null ,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      descricao: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      preco: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onNovaPizza() {
    if (!this.form.valid) {
      return;
    }

    this.loaderCtrl.create({
      message: 'Cadastrando Pizza...'
    }).then(loadingEl => {
      loadingEl.present();
      this.pizzariaService.addPizza(
        this.form.value.nome,
        this.form.value.descricao,
        this.imageUrl = this.photo && this.photo !== null ? this.photo : 'http://amarribo.org.br/wp-content/themes/wpbrasil-odin-3fa0943-child/assets/images/sem_imagem.jpg',
        +this.form.value.preco
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/pizzaria/tabs/pizza']);
      });
    })
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
  });
    this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl))
    this.photo = image.dataUrl;
  }
  

}
