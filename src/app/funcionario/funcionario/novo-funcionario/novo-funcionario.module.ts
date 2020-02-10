import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NovoFuncionarioPage } from './novo-funcionario.page';

const routes: Routes = [
  {
    path: '',
    component: NovoFuncionarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NovoFuncionarioPage]
})
export class NovoFuncionarioPageModule {}
