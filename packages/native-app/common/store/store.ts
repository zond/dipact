import {
  configureStore,
  combineReducers,
  CombinedState,
} from "@reduxjs/toolkit";

import { service } from "./service";
import middleware from "./middleware";
import { authReducer } from "./auth";
import { createOrderReducer } from "./createOrder";
import { feedbackReducer } from "./feedback";
import { phaseReducer } from "./phase";

const reducer = combineReducers({
  auth: authReducer,
  createOrder: createOrderReducer,
  feedback: feedbackReducer,
  phase: phaseReducer,
  service: service.reducer,
});

export const store = configureStore({
  reducer: reducer,
  middleware: (gdm) => [
    ...gdm({ serializableCheck: false })
      .concat(service.middleware)
      .concat(middleware),
  ],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = CombinedState<ReturnType<typeof reducer>>;
