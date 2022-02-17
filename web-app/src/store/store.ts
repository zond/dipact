import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import reducer from "./reducer";
import { diplicityService } from "./service";
import middleware from "./middleware";

export const store = configureStore({
  reducer,
  middleware: (gdm) => [
    ...gdm({ serializableCheck: false })
      .concat(diplicityService.middleware)
      .concat(middleware),
  ],
});

export const createTestStore = (preloadedState?: RootState) =>
  configureStore({
    reducer,
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(diplicityService.middleware)
        .concat(middleware),
    ],
    preloadedState,
  });

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
