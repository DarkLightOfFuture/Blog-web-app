import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/user";
import { clearUserData, loadUserData, updateUserData } from "./auth.service.actions";
export interface UserState {
  user: User;
}

export const initialState: UserState = { user: new User(null, null, null, null, null, null) };

const _authReducer = createReducer(initialState, on(clearUserData, (state) => ({ user: new User(null, null, null, null, null, null), error: null })),
  on(updateUserData, (state, { user }) => ({ ...state, user: { ...state.user, ...user } })),
  on(loadUserData, (state, { user }) => ({ ...state, user: user }))
);

export function authReducer(state: any, action: any) {
  return _authReducer(state, action);
}
