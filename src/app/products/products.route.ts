import { Routes } from '@angular/router';

import { productListRoute } from './product-list/product-list.route';
import { productFormRoute } from './product-form/product-form.route';

const PRODUCT_ROUTES = [productListRoute, productFormRoute];

export const productsRoute: Routes = [
    {
      path: '',
      children: PRODUCT_ROUTES
    }
  ];
