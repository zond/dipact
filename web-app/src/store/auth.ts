import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "./types";


let token = localStorage.getItem('token');
if (token === "null") {
	token = null;
}

const initialState: Auth = token
  ? {
      isLoggedIn: true,
      token
    }
  : { isLoggedIn: false };

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<string>) => {
			const token = action.payload;
			localStorage.setItem("token", token);
			state.isLoggedIn = true;
			state.token = token;
		},
		// TODO test
		logout: (state) => {
			localStorage.removeItem("token");
			state.isLoggedIn = false;
			state.token = undefined;
		},
	},
});

export const actions = authSlice.actions;

export default authSlice.reducer;
