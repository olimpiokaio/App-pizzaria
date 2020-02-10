import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CategoriaService } from './../categoria.service';
import { Router } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nova-categoria',
  templateUrl: './nova-categoria.page.html',
  styleUrls: ['./nova-categoria.page.scss'],
})
export class NovaCategoriaPage implements OnInit {

  form: FormGroup;

  constructor(
    private loaderCtrl: LoadingController,
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      cargo: new FormControl(null ,{
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  novoCargo() {
    if (!this.form.valid) {
      return;
    }

    this.loaderCtrl.create({
      message: 'Cadastrando Cargo...'
    }).then(loadingEl => {
      loadingEl.present();
      this.categoriaService.addCargo(
        this.form.value.cargo
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/categoria']);
      });
    })
  }

}
