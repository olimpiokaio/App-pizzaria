import { PizzariaPage } from './pizzaria.page';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
    path: 'tabs',
    component: PizzariaPage,
        children: [
            {
                path: 'pesquisa',
                children: [
                    {
                        path: '',
                        loadChildren: './pesquisa/pesquisa.module#PesquisaPageModule'
                    },
                    {
                        path: ':pizzaId',
                        loadChildren: './pesquisa/detalhe-pizza/detalhe-pizza.module#DetalhePizzaPageModule'
                    }
                ]
            },
            {
                path: 'pizza',
                children : [
                    {
                        path: '',
                        loadChildren: './pizza/pizza.module#PizzaPageModule'
                    },
                    {
                        path: 'nova',
                        loadChildren: './pizza/nova-pizza/nova-pizza.module#NovaPizzaPageModule'
                    },
                    {
                        path: 'editar/:pizzaId',
                        loadChildren: './pizza/editar-pizza/editar-pizza.module#EditarPizzaPageModule'
                    }
                ]
            },
            {
                path: 'funcionario',
                children : [
                    {
                        path: '',
                        loadChildren: './../funcionario/funcionario/funcionario.module#FuncionarioPageModule'
                    },
                    {
                        path: 'novo',
                        loadChildren: './../funcionario/funcionario/novo-funcionario/novo-funcionario.module#NovoFuncionarioPageModule'
                    },
                    {
                        path: 'editar/:funcionarioId',
                        loadChildren: './../funcionario/funcionario/editar-funcionario/editar-funcionario.module#EditarFuncionarioPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/pizzaria/tabs/pesquisa',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/pizzaria/tabs/pesquisa',
        pathMatch: 'full'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PizzariaRoutingModule {}