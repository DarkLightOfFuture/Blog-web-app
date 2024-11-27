import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html'
})
export class ConfirmEmailComponent {
  public confirmed = false;
  public isLoading = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  confirm() {
    this.isLoading = true;

    const token = this.route.snapshot.queryParams["token"];
    const newEmail = this.route.snapshot.queryParams["email"];

    if (token && newEmail) {
      this.http.post("/user/api/confirm-email", { token, newEmail }).subscribe({
        next: () => {
          this.isLoading = false;
          this.confirmed = true;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
