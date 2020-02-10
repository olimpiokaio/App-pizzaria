import { Cargo } from './../../../categoria/categoria.model';
import { Component, OnInit } from '@angular/core';

import { LoadingController } from '@ionic/angular';
import { FuncionarioService } from './../../funcionario.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Subscription } from 'rxjs';

import { CategoriaService } from './../../../categoria/categoria.service';

@Component({
  selector: 'app-novo-funcionario',
  templateUrl: './novo-funcionario.page.html',
  styleUrls: ['./novo-funcionario.page.scss'],
})
export class NovoFuncionarioPage implements OnInit {

  form: FormGroup;
  photo: SafeResourceUrl;
  imageUrl: any;

  cargos: Cargo[];
  private cargoSub: Subscription;

  constructor(
    private loaderCtrl: LoadingController,
    private router: Router,
    private funcionarioService: FuncionarioService,
    private categoriaService: CategoriaService,
    private sanitizer: DomSanitizer // camera capacitor
  ) { }

  ngOnInit() {
    defineCustomElements(window);
    this.form = new FormGroup({
      nome: new FormControl(null ,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      cargo: new FormControl(null,{
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dataNascimento: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });

    this.cargoSub = this.categoriaService.cargos.subscribe(cargos => {
      this.cargos = cargos;
    });
  }

  ionViewWillEnter() {
    this.categoriaService.fetchCargos().subscribe();
  }

  onNovoFuncionario() {
    if (!this.form.valid) {
      return;
    }

    this.loaderCtrl.create({
      message: 'Cadastrando Pizza...'
    }).then(loadingEl => {
      loadingEl.present();
      this.funcionarioService.addFuncionario(
        this.form.value.nome,
        this.form.value.cargo,
        this.form.value.dataNascimento,
        this.imageUrl = this.photo && this.photo !== null ? this.photo : 'https://img.icons8.com/android/420/user.png'
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/pizzaria/tabs/funcionario']);
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
