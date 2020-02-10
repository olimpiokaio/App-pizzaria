import { Component, OnInit } from '@angular/core';

import { CategoriaService } from './../categoria.service';

import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cargo } from './../categoria.model';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.page.html',
  styleUrls: ['./editar-categoria.page.scss'],
})
export class EditarCategoriaPage implements OnInit {

  form: FormGroup;
  cargo: Cargo;
  cargoId: string;
  isLoading = false;
  private cargoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private navCtrl: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('cargoId')) {
        this.navCtrl.navigateBack('/categoria');
        return;
      }
      this.cargoId = paramMap.get('cargoId');
      this.isLoading = true;
      this.cargoSub = this.categoriaService
        .getCargo(paramMap.get('cargoId'))
        .subscribe(cargo => {
          this.cargo = cargo;
          this.form = new FormGroup({
            cargo: new FormControl(this.cargo.cargo,{
              updateOn: 'blur',
              validators: [Validators.required]
            })
          });
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.alertCtrl.create({
          header: 'Ocorreu um erro!', 
          message: 'Cargo não encontrado, por favor tente mais tarde.',
          buttons: [{text: 'ok', handler: () => {
            this.router.navigate(['/categoria/']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  atualizarCargo() {
    if(!this.form.valid) {
      return
    }
    this.loadingController.create({
      message: 'Atualizando...'
    }).then(loadingEl => {
      loadingEl.present();
      this.categoriaService.atualizarCargo(
        this.cargo.id, 
        this.form.value.cargo
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/categoria']);
      });
    })
  }

}
