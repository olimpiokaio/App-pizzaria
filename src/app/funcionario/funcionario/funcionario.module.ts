import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FuncionarioPage } from './funcionario.page';

const routes: Routes = [
  {
    path: '',
    component: FuncionarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FuncionarioPage]
})
export class FuncionarioPageModule {}
