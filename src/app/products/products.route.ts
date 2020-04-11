import { Routes } from '@angular/router';

import { productListRoute } from './product-list/product-list.route';

const PRODUCT_ROUTES = [productListRoute];

export const productsRoute: Routes = [
    {
      path: '',
      children: PRODUCT_ROUTES
    }
  ];
