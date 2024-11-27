import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { clearUserData, updateUserData } from './auth.service.actions';
import { FormGroup } from '@angular/forms';
import { ISignInForm } from '../../models/signInForm.interface';
import { IRegisterForm } from '../../models/registerForm.interface';
import { FormModel } from '../../models/formModel';
import { removeCookie, setCookie } from '../cookie';
import { selectUser } from './auth.service.selectors';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private store: Store<{ user: User }>) { }

  signIn(formData: FormGroup, formModel: FormModel) {
    if (formData.valid) {
      const data = <ISignInForm>formData.value,
            params = new HttpParams().set("email", data.email).set("password", data.password)
                     .set("rememberMe", data.rememberMe);

      formModel.error = "";
      this.http.get<User>("/user/api/login", { params: params }).subscribe({
        next: user => {
          if (data.rememberMe) {
            const date = setCookie("user", JSON.stringify(user), 14);

            if (date) {
              this.store.dispatch(updateUserData({ user: { ...user, date: date } }));
            }
          }
          else {
            this.store.dispatch(updateUserData({ user: user }));
          }

          const path = this.route.snapshot.queryParams['returnUrl'] ?? "/";
          this.router.navigate([path])
        },
        error: (r: HttpErrorResponse) => {
          formModel.isLoading = false;
          formModel.error = r.error;
        }
      });
    }
  }

  signOut() {
    this.http.delete("/user/api/logout").subscribe({
      next: () => {
        removeCookie("user");

        this.store.dispatch(clearUserData());
        this.router.navigate(["/"]);
      }
    });
  }
}
