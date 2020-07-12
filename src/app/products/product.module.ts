import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsRoutingModule } from './products.routing.module';
import { PaginationComponent } from '../layouts/pagination/pagination.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    ProductsRoutingModule
  ]
})
export class ProductModule { }