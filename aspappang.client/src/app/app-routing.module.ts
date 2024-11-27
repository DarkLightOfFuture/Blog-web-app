import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PostsMainComponent } from './components/posts/posts-main/posts-main.component';
import { PostsIndexComponent } from './components/posts/posts-index/posts-index.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { ShowPostComponent } from './components/posts/show-post/show-post.component';
import { UserSettingsComponent } from './components/user/user-settings/user-settings.component';
import { authGuard } from './services/canActivate';
import { ForbiddenComponent } from './components/shared/forbidden/forbidden.component';
import { ConfirmEmailChangeComponent } from './components/user/confirm-email-change/confirm-email-change.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { ConfirmEmailComponent } from './components/user/confirm-email/confirm-email.component';
import { ResendEmailConfirmationComponent } from './components/user/resend-email-confirmation/resend-email-confirmation.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { CommentsIndexComponent } from './components/comments/comments-index/comments-index.component';
import { TagsIndexComponent } from './components/tags/tags-index/tags-index.component';

const routes: Routes = [
  { path: "comments", component: CommentsIndexComponent },
  { path: "tags", component: TagsIndexComponent },
  //Posts
  { path: "posts", component: PostsIndexComponent, canActivate: [authGuard] },
  { path: "posts/show/:id", component: ShowPostComponent },
  //Authorization and user's settings
  { path: "user/settings", component: UserSettingsComponent },
  { path: "user/login", component: UserLoginComponent },
  { path: "user/register", component: UserRegisterComponent },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "resend-email-confirmation", component: ResendEmailConfirmationComponent },
  { path: "confirm-email", component: ConfirmEmailComponent },
  { path: "confirm-email-change", component: ConfirmEmailChangeComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  //Main site
  { path: "", component: PostsMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
