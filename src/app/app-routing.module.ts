import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { productsRoute } from './products/products.route';
import { homeRoute } from './home/home.route';

const routes: Routes = [homeRoute, ...productsRoute];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
