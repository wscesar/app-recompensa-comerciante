import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: './auth/auth.module#AuthPageModule' },
    { path: 'login', loadChildren: './auth/auth.module#AuthPageModule' },

    {
        path: 'produtos',
        loadChildren: './restaurant/restaurant.module#RestaurantPageModule'
    },

    {
        path: 'cadastrar-produto',
        canActivate: [AuthGuard],
        loadChildren: './product-form/product-form.module#ProductFormPageModule'
    },

    {
        path: 'editar-produto/:productId',
        canActivate: [AuthGuard],
        loadChildren: './product-form/product-form.module#ProductFormPageModule'
    },

    {
        path: 'restaurante',
        canActivate: [AuthGuard],
        children:
        [
            {
                path: 'editar',
                loadChildren: './restaurant-edit/restaurant-edit.module#RestaurantEditPageModule'
            },

            {
                path: ':restaurantId',
                loadChildren: './restaurant/restaurant.module#RestaurantPageModule'
            },

            {
                path: '',
                pathMatch: 'full',
                loadChildren: './restaurant/restaurant.module#RestaurantPageModule'
            },

        ]
    },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
