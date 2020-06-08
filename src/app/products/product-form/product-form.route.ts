import { Routes } from '@angular/router';

import { ProductFormComponent } from './product-form.component';

export const productFormRoute: Routes = [
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/edit/:product_id', component: ProductFormComponent }
];
