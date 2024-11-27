import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel } from '../../../models/formModel';
import { AuthService } from '../../../services/auth/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { appear } from '../../../animations/animations';
import { removeCookie, setCookie } from '../../../services/cookie';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
  animations: [
    appear
  ]
})
export class UserLoginComponent {
  public formGroup: FormGroup;
  public email: any;
  public formModel = new FormModel();

  constructor(private authService: AuthService) {
    this.formGroup = new FormGroup({
      email: new FormControl("", [Validators.email]),
      password: new FormControl("", [Validators.required]),
      rememberMe: new FormControl(false)
    });

    this.email = this.formGroup.get("email");
  }

  signIn() {
    this.formModel.isLoading = true;

    this.authService.signIn(this.formGroup, this.formModel);
  }
}
