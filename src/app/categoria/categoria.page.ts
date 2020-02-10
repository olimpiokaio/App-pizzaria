import { Component, OnInit, OnDestroy } from '@angular/core';

import { Cargo } from './categoria.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { CategoriaService } from './categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  cargos: Cargo[];
  isLoading = false;
  private cargoSub: Subscription;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargoSub = this.categoriaService.cargos.subscribe(cargos => {
      this.cargos = cargos;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.categoriaService.fetchCargos().subscribe(() => {
      this.isLoading = false;
    });
  }

  editarCargo(cargoId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'categoria', 'editar', cargoId]);
    console.log('Editar oferta ' + cargoId);
  }

  deletarCargo(cargoId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    // adiciona um o spinner
    this.loadingController.create({
      message: 'Deletando Cargo...'
    }).then(loadingEl => {
      loadingEl.present();
      // deleta pizza pelo id
      this.categoriaService.deletaCargo(cargoId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if(this.cargoSub) {
      this.cargoSub.unsubscribe();
    }
  }

}
