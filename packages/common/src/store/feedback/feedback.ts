import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Feedback, CreateFeedbackSliceOptions } from "./feedback.types";

const feedbackAdapter = createEntityAdapter<Feedback>();

const getNextId = (state: EntityState<Feedback>) => {
  return state.ids.length !== 0
    ? (state.ids[state.ids.length - 1] as number) + 1
    : 1;
};

const createFeedback = (
  state: EntityState<Feedback>,
  severity: Feedback["severity"],
  message: string
): Feedback => ({ message, severity, id: getNextId(state) });

export const createFeedbackSlice = ({
  diplicityApi,
}: CreateFeedbackSliceOptions) =>
  createSlice({
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
        diplicityApi.endpoints.updateUserConfig.matchFulfilled,
        (state) => {
          const feedback = createFeedback(
            state,
            "success",
            "Settings updated successfully!" // TODO translate
          );
          feedbackAdapter.addOne(state, feedback);
        }
      );
    },
  });

export const feedbackSelectors = feedbackAdapter.getSelectors(
  (state: RootState) => state.feedback
);
