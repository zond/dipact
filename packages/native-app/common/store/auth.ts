import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Auth } from "./types";

const initialState: Auth = { isLoggedIn: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.isLoggedIn = true;
      state.token = token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = undefined;
    },
  },
});

const selectAuth = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth
);

const selectToken = createSelector(selectAuth, (auth) => auth.token);
const selectIsLoggedIn = createSelector(selectAuth, (auth) => auth.isLoggedIn);

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authSelectors = {
  selectAuth,
  selectToken,
  selectIsLoggedIn,
};
