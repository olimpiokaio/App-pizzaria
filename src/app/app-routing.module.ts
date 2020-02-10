import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pizzaria',
    pathMatch: 'full'
  },
  { path: 'pizzaria', loadChildren: './pizzaria/pizzaria.module#PizzariaPageModule' },
  { path: 'categoria', loadChildren: './categoria/categoria.module#CategoriaPageModule' },
  { path: 'categoria/nova', loadChildren: './categoria/nova-categoria/nova-categoria.module#NovaCategoriaPageModule' },
  { path: 'categoria/editar/:cargoId', loadChildren: './categoria/editar-categoria/editar-categoria.module#EditarCategoriaPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
