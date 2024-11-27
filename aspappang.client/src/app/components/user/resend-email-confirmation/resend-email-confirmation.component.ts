import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateEmail } from '../../../validators/validators';

@Component({
  selector: 'app-resend-email-confirmation',
  templateUrl: './resend-email-confirmation.component.html',
  styleUrl: './resend-email-confirmation.component.css'
})
export class ResendEmailConfirmationComponent {
  public isLoading = false;
  public isSuccess = false;

  public email = new FormControl("", { validators: [Validators.required, validateEmail], updateOn: "blur" })

  constructor(private http: HttpClient) { }

  resend() {
    this.isLoading = true;

    this.http.post("user/api/resend-email-confirmation", { newEmail: this.email.value }).subscribe({
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
