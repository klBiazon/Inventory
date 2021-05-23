import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { homeRoute } from './home/home.route';
import { loginRoute } from "./auth/login/login.route";
import { signupRoute } from "./auth/signup/signup.route";
import { AuthGuard } from './auth/auth-guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [homeRoute,
  { 
    path: 'products', canActivateChild: [AuthGuard], loadChildren: () => import('./products/product.module')
      .then(m => m.ProductModule)
  },
  { 
    path: 'category', canActivateChild: [AuthGuard], loadChildren: () => import('./category/category.module')
      .then(m => m.CategoryModule)
  },
  {
    path: '', loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },  
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] }, // Redirect if the URL is not registered within the app
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
