import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { provideStore } from '@ngrx/store';
import { authReducer } from './services/auth/auth.service.reducer';
import { RouterModule, provideRouter } from '@angular/router';
import { PostsMainComponent } from './components/posts/posts-main/posts-main.component';
import { CommonModule } from '@angular/common';
import { PostsIndexComponent } from './components/posts/posts-index/posts-index.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { provideEffects } from '@ngrx/effects';
import { PostFormComponent } from './components/shared/post-form/post-form.component';
import "@angular/compiler";
import { CommentFormComponent } from './components/shared/comment-form/comment-form.component';
import { UploadImageContainerComponent } from './components/shared/upload-image-container/upload-image-container.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LinkCreatorComponent } from './components/shared/link-creator/link-creator.component';
import { VideoUploaderComponent } from './components/shared/video-uploader/video-uploader.component';
import { DeleteConfirmationComponent } from './components/shared/delete-confirmation/delete-confirmation.component';
import { ShowPostComponent } from './components/posts/show-post/show-post.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { SelectBoxComponent } from './components/shared/select-box/select-box.component';
import { ImagePreviewComponent } from './components/shared/image-preview/image-preview.component';
import { CookieService } from 'ngx-cookie-service';
import { UserSettingsComponent } from './components/user/user-settings/user-settings.component';
import { UserEmailComponent } from './components/user/user-email/user-email.component';
import { UserPasswordComponent } from './components/user/user-password/user-password.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserAdministrationComponent } from './components/user/user-administration/user-administration.component';
import { AuthServiceEffects } from './services/auth/auth.service.effects';
import { ForbiddenComponent } from './components/shared/forbidden/forbidden.component';
import { ConfirmEmailChangeComponent } from './components/user/confirm-email-change/confirm-email-change.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { ConfirmEmailComponent } from './components/user/confirm-email/confirm-email.component';
import { ResendEmailConfirmationComponent } from './components/user/resend-email-confirmation/resend-email-confirmation.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { CommentsIndexComponent } from './components/comments/comments-index/comments-index.component';
import { TagsIndexComponent } from './components/tags/tags-index/tags-index.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsMainComponent,
    PostsIndexComponent,
    UserLoginComponent,
    PostFormComponent,
    UploadImageContainerComponent,
    LinkCreatorComponent,
    VideoUploaderComponent,
    DeleteConfirmationComponent,
    ShowPostComponent,
    NotFoundComponent,
    CommentFormComponent,
    SelectBoxComponent,
    ImagePreviewComponent,
    UserSettingsComponent,
    UserEmailComponent,
    UserPasswordComponent,
    UserProfileComponent,
    UserAdministrationComponent,
    ForbiddenComponent,
    ConfirmEmailChangeComponent,
    UserRegisterComponent,
    ConfirmEmailComponent,
    ResendEmailConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CommentsIndexComponent,
    TagsIndexComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, CommonModule,
    AppRoutingModule, RouterModule, ReactiveFormsModule,
    BrowserAnimationsModule, FormsModule, MatDialogModule,
    MatCommonModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
  providers: [provideStore({ user: authReducer }), provideAnimations(), provideEffects([AuthServiceEffects])],
  bootstrap: [AppComponent]
})
export class AppModule { }
