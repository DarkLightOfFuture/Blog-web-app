import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { UserState } from "./auth/auth.service.reducer";
import { selectUser } from "./auth/auth.service.selectors";
import { map } from "rxjs/internal/operators/map";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store<{ user: UserState }>);
  const router = inject(Router);

  return store.select(selectUser).pipe(map(user => user.hasAdmin == true ? true : router.parseUrl("/forbidden")));
}
