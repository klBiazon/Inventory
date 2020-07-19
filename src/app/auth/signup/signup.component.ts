import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordChecker } from 'src/app/services/password-checker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  seePass = false;
  seeConfirmPass = false;

  constructor(private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.authService.getIsAuth()) {
      this.router.navigate(['/products']);
    }

    this.form = new FormGroup({
      'firstName': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'lastName': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      'passwordGroup': new FormGroup({
        'password': new FormControl(null, {
          validators: [Validators.required]
        }),
        'confirmPassword': new FormControl(null, {
          validators: [Validators.required]
        })
      }, {
        validators: [passwordChecker],
        updateOn: 'blur'
      })
    });
  }

  onSignup(form) {
    if(form.invalid) {
      return;
    }
    const signUpData = {
      'firstName': form.value.firstName,
      'lastName': form.value.lastName,
      'email': form.value.email,
      'password': form.form.controls['passwordGroup'].value.password
    };
    this.authService.createUser(signUpData)
      .subscribe(res => {
        document.getElementById('showSuccessModal').click();
      }, error => {
        if('email' in error.error.errors) {
          form.form.controls['email'].setErrors({emailInUse: true});
        }
        this.errorHandlerService.handleError(error);
      });
  }
}
