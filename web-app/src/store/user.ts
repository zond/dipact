import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { User } from "./types";

const initialState: User & { loaded: boolean } = { loaded: false };
const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.getRoot.matchFulfilled,
			(state, { payload }) => {
				return { ...payload.Properties, loaded: true };
			}
		);
	},
});

export default userSlice.reducer;
