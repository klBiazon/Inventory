import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { productsRoute } from './products/products.route';
import { homeRoute } from './home/home.route';
import { loginRoute } from "./auth/login/login.route";
import { signupRoute } from "./auth/signup/signup.route";

const routes: Routes = [homeRoute, ...productsRoute, loginRoute, signupRoute];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
