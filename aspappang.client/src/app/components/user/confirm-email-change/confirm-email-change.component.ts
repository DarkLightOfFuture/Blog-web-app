import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appear } from '../../../animations/animations';
import { UserState } from '../../../services/auth/auth.service.reducer';
import { Store } from '@ngrx/store';
import { updateUserData } from '../../../services/auth/auth.service.actions';

@Component({
  selector: 'app-confirm-email-change',
  templateUrl: './confirm-email-change.component.html'
})
export class ConfirmEmailChangeComponent {
  public confirmed = false;
  public isLoading = false;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private store: Store<{ user: UserState }>) { }

  confirm() {
    this.isLoading = true;

    const token = this.route.snapshot.queryParams["token"];
    const newEmail = this.route.snapshot.queryParams["new-email"];

    if (token && newEmail) {
      this.http.post("/user/api/confirm-email-change", { token, newEmail }).subscribe({
        next: () => {
          this.isLoading = false;
          this.confirmed = true;

          this.store.dispatch(updateUserData({ user: { email: newEmail } }));
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
