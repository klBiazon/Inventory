import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordChecker } from 'src/app/services/password-checker';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  seePass = false;
  seeConfirmPass = false;
  
  @ViewChild('success') successModal: NgbModalRef;

  constructor(private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private modalService: NgbModal) { }

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
          validators: [Validators.required, Validators.minLength(3)]
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
        this.form.reset();
        this.openModal();
      }, error => {
        if('email' in error.error.errors) {
          form.form.controls['email'].setErrors({emailInUse: true});
        }
        this.errorHandlerService.handleError(error);
      });
  }
  
  openModal() {
    const modalRef = this.modalService.open(this.successModal).result.then((result) => {
      this.router.navigate(['/login']);
    }, (reason) => {
      this.router.navigate(['/login']);
    });
  }
}
