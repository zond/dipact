import { combineReducers } from "redux";
import { createOrderReducer } from "../createOrder";
import { createFeedbackSlice } from "../feedback";
import { phaseReducer } from "../phase";
import { createDiplicityApi } from "../diplicity";
import { createAuthSlice } from "../auth";

export const createReducer = ({
  diplicityApi,
  authSlice,
  feedbackSlice,
}: {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
  authSlice: Awaited<ReturnType<typeof createAuthSlice>>;
  feedbackSlice: ReturnType<typeof createFeedbackSlice>;
}) =>
  combineReducers({
    auth: authSlice.reducer,
    createOrder: createOrderReducer,
    feedback: feedbackSlice.reducer,
    phase: phaseReducer,
    [diplicityApi.reducerPath]: diplicityApi.reducer,
  });
