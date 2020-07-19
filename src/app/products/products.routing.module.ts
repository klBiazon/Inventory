import { Routes, RouterModule } from '@angular/router';

import { productListRoute } from './product-list/product-list.route';
import { productFormRoute } from './product-form/product-form.route';
import { NgModule } from '@angular/core';

const PRODUCT_ROUTES: Routes = [productListRoute, ...productFormRoute];
@NgModule({
  imports: [
    RouterModule.forChild(PRODUCT_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}