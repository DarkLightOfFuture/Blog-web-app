import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./auth.service.reducer";

const stateSelector = createFeatureSelector<UserState>("user");

export const selectUser = createSelector(stateSelector, (state) => state.user);
