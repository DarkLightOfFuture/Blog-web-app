import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { UploadImageContainerComponent } from '../../shared/upload-image-container/upload-image-container.component';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormModel } from '../../../models/formModel';
import { appear } from '../../../animations/animations';
import { phoneNumberValidation, validateUsername } from '../../../validators/validators';
import { Store } from '@ngrx/store';
import { UserState } from '../../../services/auth/auth.service.reducer';
import { updateUserData } from '../../../services/auth/auth.service.actions';
import { selectUser } from '../../../services/auth/auth.service.selectors';
import { setCookie } from '../../../services/cookie';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  animations: [
    appear
  ]
})
export class UserProfileComponent {
  @Input() public user: User | null = null;

  @ViewChild("avatar") avatar!: ElementRef<HTMLInputElement>;
  public form: FormGroup;
  public formData = new FormData();

  public isUnique = true;
  public isLoading = false;
  public isSuccess = false;

  constructor(private dialog: MatDialog, private http: HttpClient, private store: Store<{ user: UserState }>) {
    this.form = new FormGroup({
      username: new FormControl("", { validators: [validateUsername()], updateOn: "blur" }),
      phoneNumber: new FormControl(null, { validators: [phoneNumberValidation()], updateOn: 'blur' })
    });
  }

  ngAfterViewInit() {
    this.form.get("username")?.setValue(this.user?.username);
    this.form.get("phoneNumber")?.setValue(this.user?.phoneNumber);
  }

  openUploadImage() {
    const uploadImage = this.dialog.open(UploadImageContainerComponent);

    //Uploads new avatar.
    uploadImage.componentInstance.dataEvent.subscribe(file => {
      if (this.user) {
        const src = window.URL.createObjectURL(file);

        this.user = { ...this.user, avatar: src };
        this.formData.append("avatar", file);

        uploadImage.close();
      }
    });
  }

  saveChanges() {
    const username = this.form.get("username");
    const phoneNumber = this.form.get("phoneNumber");

    this.formData.append("username", username?.value);
    this.formData.append("phoneNumber", phoneNumber?.value);

    this.isLoading = this.isUnique = true;
    this.isSuccess = false;

    this.http.post("/user/api/change-profile", this.formData).subscribe({
      next: (r) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.formData = new FormData();

        if (r instanceof Object) {
          this.store.dispatch(updateUserData({ user: r }));
        }
      },
      error: (r: HttpErrorResponse) => {
        this.isLoading = false;
        this.form.get("username")?.setValue(this.user?.username);

        if (r.error == "The username is not unique.") {
          this.isUnique = false;
        }
      }
    });
  }
}
