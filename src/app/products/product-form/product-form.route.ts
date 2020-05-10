import { Route } from '@angular/router';

import { ProductFormComponent } from './product-form.component';

export const productFormRoute: Route = {
  path: 'products/add',
  component: ProductFormComponent
};
