import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel } from '../../../models/formModel';
import { passwordStrength, validateNewPassword } from '../../../validators/validators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { appear } from '../../../animations/animations';
import { UserFormModel } from '../../../models/userFormModel';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrl: './user-password.component.css',
  animations: [
    appear
  ]
})
export class UserPasswordComponent {
  public model = new UserFormModel();
  public form: FormGroup;

  constructor(private http: HttpClient) {
    this.form = new FormGroup({
      currentPassword: new FormControl("", [Validators.required]),
      newPassword: new FormControl("", { validators: [Validators.required, passwordStrength()], updateOn: 'blur' }),
      newPassword2: new FormControl("", [Validators.required])
    });
  }

  validateNewPassword() {
    validateNewPassword(this.form, this.model);
  }

  resetPassword() {
    this.model.isLoading = true;
    this.model.isIncorrect = false;

    this.http.post("/user/api/change-password", this.form.value).subscribe({
      next: () => {
        this.model.isLoading = false;
        this.model.isSuccess = true;
        this.form.reset();
      },
      error: (r: HttpErrorResponse) => {
        this.model.isLoading = false;
        this.model.isSuccess = false;

        if (r.error == "Incorrect password.") {
          this.model.isIncorrect = true;
          this.form.reset();
        }
      }
    });
  }
}
