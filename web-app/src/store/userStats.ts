import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { UserStats } from "./types";

const initialState: UserStats = {};
const latestForumMailSlice = createSlice({
	name: "userStatsSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.getUserStats.matchFulfilled,
			(state, { payload }) => {
				return payload.Properties;
			}
		);
	},
});

export default latestForumMailSlice.reducer;
