import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : boolean | UrlTree |
      Observable<boolean | UrlTree> | 
      Promise<boolean | UrlTree> {

    const isAuth = this.authService.getIsAuth();
    if(!isAuth) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/products']);
    }

    return isAuth;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isAuth = this.authService.getIsAuth();
      
      if(!isAuth) {
        this.router.navigate(['/login']);
        return isAuth;
      }
      return isAuth;
  }

}