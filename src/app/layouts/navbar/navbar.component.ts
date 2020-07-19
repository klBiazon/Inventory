import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service'
import { Subscription } from 'rxjs';  
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent extends ApiService  implements OnInit, OnDestroy {
  
  private authListenerSubs: Subscription;
  private userId: string;
  
  userAuthenticated = false;
  userData: Object = {
    firstName : '',
    lastName: '',
    email: ''
  };

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService,
          http: HttpClient) { 
    super('http://localhost:3000/api/user', http);
  }

  ngOnInit() {
    this.userAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.userId = res.userId;
        this.userAuthenticated = res.isAuthenticated;
        this.getUser();
      });
    this.getUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  getUser() {
    if(this.userId) {
      this.get(this.userId)
        .subscribe(user => {
          this.userData = user;
        }, error => this.errorHandlerService.handleError(error));
    }
  }
}
