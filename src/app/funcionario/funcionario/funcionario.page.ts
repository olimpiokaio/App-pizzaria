import { Component, OnInit, OnDestroy } from '@angular/core';

import { Funcionario } from './../funcionario.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { FuncionarioService } from './../funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.page.html',
  styleUrls: ['./funcionario.page.scss'],
})
export class FuncionarioPage implements OnInit, OnDestroy {

  funcionarios: Funcionario[];
  isLoading = false;
  private funcionarioSub: Subscription;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit () {
    this.funcionarioSub = this.funcionarioService.funcionarios.subscribe(funcionarios => {
      this.funcionarios = funcionarios;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.funcionarioService.fetchFuncionarios().subscribe(() => {
      this.isLoading = false;
    });
  }

  editarFuncionario(funcionarioId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'pizzaria', 'tabs', 'funcionario', 'editar', funcionarioId]);
  }

  deletarFuncionario(funcionarioId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    // adiciona um o spinner
    this.loadingController.create({
      message: 'Deletando Funcionario...'
    }).then(loadingEl => {
      loadingEl.present();
      // deleta pizza pelo id
      this.funcionarioService.deletaFuncionario(funcionarioId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if(this.funcionarioSub) {
      this.funcionarioSub.unsubscribe();
    }
  }

}
