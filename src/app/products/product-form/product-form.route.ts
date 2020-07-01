import { Routes } from '@angular/router';

import { ProductFormComponent } from './product-form.component';

export const productFormRoute: Routes = [
  { path: 'add', component: ProductFormComponent },
  { path: 'edit/:product_id', component: ProductFormComponent }
];
