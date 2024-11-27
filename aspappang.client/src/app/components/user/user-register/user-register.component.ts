import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFormModel } from '../../../models/userFormModel';
import { passwordStrength, validateEmail, validateNewPassword, validateUsername } from '../../../validators/validators';
import { appear } from '../../../animations/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
  animations: [
    appear
  ]
})
export class UserRegisterComponent {
  public model = new UserFormModel();
  public form: FormGroup;

  public isRegistered = false;
  public isInvalidEmail = false;

  constructor(private http: HttpClient) {
    this.form = new FormGroup({
      email: new FormControl("", { validators: [Validators.required, validateEmail()], updateOn: "blur" }),
      username: new FormControl('', { validators: [Validators.required, validateUsername()], updateOn: "blur" }),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', { validators: [Validators.required, passwordStrength()], updateOn: "blur" }),
      newPassword2: new FormControl('', [Validators.required]),
    });
  }

  validateNewPassword() {
    validateNewPassword(this.form, this.model);
  }

  register() {
    this.model.isLoading = true;

    this.http.post("/user/api/register", this.form.value).subscribe({
      next: () => {
        this.model.isLoading = this.isInvalidEmail = false;
        this.isRegistered = true;
      },
      error: (r: HttpErrorResponse) => {
        this.model.isLoading = false;

        if (r.error == "The username is not unique.") {
          this.model.isUnique = false;
        }
        else if (r.error == "Invalid email.") {
          this.isInvalidEmail = true;
        }
      }
    });
  }
}
