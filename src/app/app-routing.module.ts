import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { productsRoute } from './products/products.route';
import { homeRoute } from './home/home.route';
import { loginRoute } from "./auth/login/login.route";
import { signupRoute } from "./auth/signup/signup.route";
import { AuthGuard } from './auth/auth-guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [homeRoute, ...productsRoute, loginRoute, signupRoute,
  { path: '**', component: HomeComponent } // Redirect if the URL is not registered within the app
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
