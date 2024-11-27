import { Component, Input } from '@angular/core';
import { User } from '../../../models/user';
import { FormControl } from '@angular/forms';
import { validateEmail } from '../../../validators/validators';
import { appear } from '../../../animations/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'user-email',
  templateUrl: './user-email.component.html',
  animations: [
    appear
  ]
})
export class UserEmailComponent {
  @Input() public user: User | null = null;
  public isSuccess = false;
  public isLoading = false;

  public email = new FormControl("", { validators: [validateEmail()], updateOn: 'blur' })

  constructor(private http: HttpClient) { }

  change() {
    this.isLoading = true;

    this.http.post("/user/api/change-email", { newEmail: this.email.value }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
