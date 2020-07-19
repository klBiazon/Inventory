import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('email', { static: false })
  email?: ElementRef;
  @ViewChild('password', { static: false })
  password?: ElementRef;
  form;

  private loginSubs: Subscription;
  authorized = true;
  validRoute = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    if(this.authService.getIsAuth()) {
      this.router.navigate(['/products']);
      return;
    }
    this.setForm();
    this.validRoute = true;
  }

  ngAfterViewInit() {
    if (this.email && this.password) {
      this.password.nativeElement.focus();
      this.email.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    if(this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
  }

  setForm() {
    this.form = new FormGroup({
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      'password': new FormControl(null, {
        validators: [Validators.required]
      })
    }, {
      updateOn: 'submit'
    });
  }

  onLogin(form) {
    if(this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
    
    if(form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    this.loginSubs = this.authService.getLoginListener()
      .subscribe(authorized => {
        this.authorized = authorized;
      });
  }

}
