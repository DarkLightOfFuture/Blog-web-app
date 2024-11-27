import { Component } from '@angular/core';
import { validateEmail } from '../../../validators/validators';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: '../resend-email-confirmation/resend-email-confirmation.component.css',
})
export class ForgotPasswordComponent {
  public isLoading = false;
  public isSuccess = false;

  public email = new FormControl("", { validators: [Validators.required, validateEmail], updateOn: "blur" })

  constructor(private http: HttpClient) { }

  send() {
    this.isLoading = true;

    this.http.post("user/api/forgot-password", { newEmail: this.email.value }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }
}
