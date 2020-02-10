import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditarFuncionarioPage } from './editar-funcionario.page';

const routes: Routes = [
  {
    path: '',
    component: EditarFuncionarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditarFuncionarioPage]
})
export class EditarFuncionarioPageModule {}
