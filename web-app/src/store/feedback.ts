import {
	createEntityAdapter,
	createSlice,
	EntityState,
} from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { RootState } from "./store";
import { Feedback, Severity } from "./types";

const feedbackAdapter = createEntityAdapter<Feedback>();

const getNextId = (state: EntityState<Feedback>) => {
	return state.ids.length !== 0
		? (state.ids[state.ids.length - 1] as number) + 1
		: 1;
};

const createFeedback = (
	state: EntityState<Feedback>,
	severity: Severity,
	message: string
): Feedback => ({ message, severity, id: getNextId(state) });

const feedbackSlice = createSlice({
	name: "feedback",
	initialState: feedbackAdapter.getInitialState(),
	reducers: {
		add: (state, action) => {
			action.payload.id = getNextId(state);
			feedbackAdapter.addOne(state, action);
		},
		clear: feedbackAdapter.removeOne,
		clearAll: feedbackAdapter.removeAll,
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.updateUserConfig.matchFulfilled,
			(state) => {
				const feedback = createFeedback(state, Severity.Success, "Settings updated successfully!");
				feedbackAdapter.addOne(state, feedback);
			}
		)
	},
});

export const actions = feedbackSlice.actions;

export const feedbackSelectors = feedbackAdapter.getSelectors(
	(state: RootState) => state.feedback
);

export default feedbackSlice.reducer;
