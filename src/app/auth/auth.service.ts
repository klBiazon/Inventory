import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

import { AuthData } from './auth-data.model';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends ApiService {

  private token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer;
  
  constructor(http: HttpClient, private errorHandlerService: ErrorHandlerService,
    private router: Router) {
    super('http://localhost:3000/api/user', http)
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user: AuthData) {
    const authData: AuthData = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName
    };
        
    return this.user('signup', authData);
  }

  login(email: string, password: string) {
    this.user('login', { email: email, password: password })
      .subscribe(res => {
        const token = res['token'];
        this.token = token;
        if(token) {
          this.authStatusListener.next(true);
          this.isAuthenticated = true;

          //will logout automatically based on the expiresIn duration
          const expiresIn = res['expiresIn'];
          this.setAuthTimer(expiresIn);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresIn * 1000));
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/']);
        }  
      }, error => this.errorHandlerService.handleError(error));;
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(()=> {
      this.logout();
    }, (duration * 1000));
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}