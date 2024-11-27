import { createAction, props } from "@ngrx/store";
import { User } from "../../models/user";

export const clearUserData = createAction("[User] Clears user's values");
export const loadUserData = createAction("[User] loads user's values", props<{ user: User }>());
export const updateUserData = createAction("[User] updates user's values", props<{ user: Partial<User> }>())
