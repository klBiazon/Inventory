import { Routes } from '@angular/router';

import { ProductFormComponent } from './product-form.component';
import { AuthGuard } from 'src/app/auth/auth-guard';

export const productFormRoute: Routes = [
  { path: 'products/add', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:product_id', component: ProductFormComponent, canActivate: [AuthGuard] }
];
