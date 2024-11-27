import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordStrength, validateNewPassword } from '../../../validators/validators';
import { UserFormModel } from '../../../models/userFormModel';
import { appear } from '../../../animations/animations';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: '../resend-email-confirmation/resend-email-confirmation.component.css',
  animations: [
    appear
  ]
})
export class ResetPasswordComponent {
  public form: FormGroup;
  public model = new UserFormModel();

  public isSuccess = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.form = new FormGroup({
      newPassword: new FormControl('', { validators: [Validators.required, passwordStrength()], updateOn: "blur" }),
      newPassword2: new FormControl('', [Validators.required])
    });
  }

  validateNewPassword() {
    validateNewPassword(this.form, this.model);
  }

  saveChanges() {
    this.model.isLoading = true;

    const password = this.form.get("newPassword")?.value;
    const token = this.route.snapshot.queryParams['token'];
    const email = this.route.snapshot.queryParams['email'];

    if (token && email) {
      this.http.post("/user/api/reset-password", { password: password, token: token, email: email }).subscribe({
        next: () => {
          this.model.isLoading = false;
          this.isSuccess = true;
        },
        error: () => {
          this.model.isLoading = false;
        }
      });
    }
  }
}
