import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PizzariaRoutingModule } from './pizzaria-routing.module';

import { IonicModule } from '@ionic/angular';

import { PizzariaPage } from './pizzaria.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PizzariaRoutingModule
  ],
  declarations: [PizzariaPage]
})
export class PizzariaPageModule {}
