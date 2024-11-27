import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { UserState } from "./auth.service.reducer";
import { updateUserData } from "./auth.service.actions";
import { selectUser } from "./auth.service.selectors";
import { setCookie } from "../cookie";
import { tap } from "rxjs";


@Injectable()
export class AuthServiceEffects {

  constructor(private store: Store<{ user: UserState; }>, private actions$: Actions) { }

  setCookie$ = createEffect(() => this.actions$.pipe(
    ofType(updateUserData), tap(() => this.store.select(selectUser).subscribe(user => {
      if (user.username) {
        if (user.date) {
          setCookie("user", JSON.stringify(user), user.date);
        }
        else {
          setCookie("user", JSON.stringify(user));
        }
      }
    }))), { dispatch: false });
}
