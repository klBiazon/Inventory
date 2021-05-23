import { Routes, RouterModule } from '@angular/router';

import { categoryListRoute } from './category-list/category-list.route';
import { categoryFormRoute } from './category-form/category-form.route';
import { NgModule } from '@angular/core';

const CATEGORY_ROUTES: Routes = [categoryListRoute, ...categoryFormRoute];
@NgModule({
  imports: [
    RouterModule.forChild(CATEGORY_ROUTES)
  ],
  exports: [RouterModule]
})
export class CategoryRoutingModule {}