import { Routes } from '@angular/router';

import { CategoryFormComponent } from './category-form.component';

export const categoryFormRoute: Routes = [
    { path: 'add', component: CategoryFormComponent },
    { path: 'edit/:category_id', component: CategoryFormComponent }
];
