import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { AuthGuard } from '../auth/auth-guard';

export const homeRoute: Route = {
  path: '',
  component: HomeComponent,
  canActivate: [AuthGuard]
};
