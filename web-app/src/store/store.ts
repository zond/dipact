import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { setupListeners } from "@reduxjs/toolkit/query";

import { diplicityService } from "./service";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    [diplicityService.reducerPath]: diplicityService.reducer,
  },
  middleware: [...getDefaultMiddleware(), sagaMiddleware],
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
