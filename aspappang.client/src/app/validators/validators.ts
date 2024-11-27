import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserFormModel } from "../models/userFormModel";

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    
    if (!value) {
      return null;
    }

    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?~]).{6,100}$/;

    return pattern.test(value) ?
      null : { "passwordStrength": true };
  }
}

export function phoneNumberValidation(): ValidatorFn {
  return (control: AbstractControl): null | ValidationErrors => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const pattern = /^\+\d{11}$/;

    return pattern.test(value) ?
      null : { 'incorrect': true };
  }
}

export function validateEmail(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const pattern = /^[\w\+\-~\!\#\$\'\.\/=\^`\{\}\|]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    
    return pattern.test(value) ?
      null : { "invalid": true }
  }
}

export function validateNewPassword(form: FormGroup, model: UserFormModel) {
  const password1 = form.get("newPassword");
  const password2 = form.get("newPassword2");

  if (password1 && password2) {
    if (!password1.pristine && password1.touched
      && !password2.pristine && password2.touched) {
      if (password1.value != password2.value) {
        model.areSame = false;
        form.setErrors({ "areSame": null });
      }
      else {
        model.areSame = true;
      }
    }
  }
}

export function validateUsername(): ValidatorFn {
  return (control: AbstractControl): null | ValidationErrors => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const pattern = /^[\w\+\-~\!\#\$\.\^]{5,30}$/;

    return pattern.test(value) ?
      null : { "invalid": true };
  }
}
