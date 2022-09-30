import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  CombinedState,
} from "@reduxjs/toolkit";

import { reducers } from ".";
import { diplicityService } from "./service";
import middleware from "./middleware";

const reducer = combineReducers(reducers);

export const store = configureStore({
  reducer: reducer,
  middleware: (gdm) => [
    ...gdm({ serializableCheck: false })
      .concat(diplicityService.middleware)
      .concat(middleware),
  ],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = CombinedState<ReturnType<typeof reducer>>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
