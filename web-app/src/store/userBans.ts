import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { Ban } from "./types";

const initialState: { [key: string]: Ban } = {};
const latestForumMailSlice = createSlice({
	name: "userBansSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.getUserBans.matchFulfilled,
			(state, { payload }) => {
				const { userId } = payload;
				if (userId) {
					payload.Properties.filter((ban) =>
						ban.OwnerIds.includes(userId)
					).forEach((ban) => {
						const otherUser = ban.UserIds.find((uid) => uid != userId);
						if (otherUser) {
							state[otherUser] = ban;
						}
					});
				}
				return state;
			}
		);
	},
});

export default latestForumMailSlice.reducer;
