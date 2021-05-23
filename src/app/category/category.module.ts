import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { CategoryListComponent } from "./category-list/category-list.component";
import { CategoryFormComponent } from "./category-form/category-form.component";
import { CategoryRoutingModule } from "./category.routing.module";
import { PaginationModule } from "../layouts/pagination/pagination.module";

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    CategoryRoutingModule,
    PaginationModule
  ]
})
export class CategoryModule { }