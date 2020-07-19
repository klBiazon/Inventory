import { FormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

export const passwordChecker: ValidatorFn = (control: AbstractControl):
  { [key: string]: boolean } | null  => {

    if (control.get('confirmPassword').errors && !control.get('confirmPassword').errors.doNotMatch) {
      return;
    }

    if(control.get('password').value === control.get('confirmPassword').value) {
      control.get('confirmPassword').setErrors(null);
    } else {
      control.get('confirmPassword').setErrors({ doNotMatch: true });
    }

    return null;
  }