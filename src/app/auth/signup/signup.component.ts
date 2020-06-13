import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService,
    private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
  }

  onSignup(form) {
    console.log(form.value)
    this.authService.createUser(form.value)
      .subscribe(res => {
        console.log(res);
      }, error => this.errorHandlerService.handleError(error));
  }
}
