import { NgModule } from "@angular/core";

import { signupRoute } from './signup/signup.route';
import { loginRoute } from './login/login.route';
import { RouterModule, Routes } from '@angular/router';

const AUTH_ROUTES: Routes = [signupRoute, loginRoute];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_ROUTES)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}