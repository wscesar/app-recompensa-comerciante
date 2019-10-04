import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: './auth/auth.module#AuthPageModule'},
    { path: 'login', loadChildren: './auth/auth.module#AuthPageModule' },

    { 
        path: 'cadastrar-produto',
        canActivate: [AuthGuard],
        loadChildren: './product-create/product-create.module#ProductCreatePageModule'
    },


    { 
        path: 'editar-produto/:productId',
        canActivate: [AuthGuard],
        loadChildren: './product-create/product-create.module#ProductCreatePageModule'
    },

    
    {
        path: 'produtos',
        loadChildren: './products/products.module#ProductsPageModule'
    },

    {
        path: 'produto/:productId', 
        canActivate: [AuthGuard],
        loadChildren: './product-detail/product-detail.module#ProductDetailPageModule'
    },
  
    {
        path: 'restaurante',
        canActivate: [AuthGuard],
        children:
        [
            {
                path: 'editar', 
                loadChildren: './profile-edit/profile-edit.module#ProfileEditPageModule'
            },
            
            {
                path: ':place',
                children:
                [
                    {
                        path: 'editar', 
                        loadChildren: './profile-edit/profile-edit.module#ProfileEditPageModule'
                    },

                    {
                        path: 'produto/:productId', 
                        loadChildren: './product-detail/product-detail.module#ProductDetailPageModule'
                    },

                    {
                        path: '',
                        loadChildren: './profile/profile.module#ProfilePageModule'
                    },
                ]
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
