import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

import { AuthData } from './auth-data.model';
import { tokenName } from '@angular/compiler';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends ApiService {

  private token: string;
  
  constructor(http: HttpClient, private errorHandlerService: ErrorHandlerService) {
    super('http://localhost:3000/api/user', http)
  }

  getToken() {
    return this.token;
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
      }, error => this.errorHandlerService.handleError(error));;
  }
}