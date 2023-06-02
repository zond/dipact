import {
  AsyncThunkAction,
  Middleware,
  ThunkDispatch,
  createAsyncThunk,
  createSlice,
  isRejected,
} from "@reduxjs/toolkit";
import {
  Auth,
  CreateAuthMiddlewareOptions,
  CreateAuthSliceOptions,
  CreateLoginThunkOptions,
  CreateLogoutThunkOptions,
} from "./auth.types";
import { RootState } from "../store";
import { IAuthService } from "../../services";

const getInitialSate = async (authService: IAuthService): Promise<Auth> => {
  const token = await authService.getTokenFromStorage();
  return {
    token,
    loggedIn: !!token,
  };
};

export const createLoginThunk = ({ authService }: CreateLoginThunkOptions) =>
  createAsyncThunk("auth/login", async (token: string) => {
    await authService.setTokenInStorage(token);
    return token;
  });

export const createLogoutThunk = ({ authService }: CreateLogoutThunkOptions) =>
  createAsyncThunk("auth/logout", async () => {
    await authService.removeTokenFromStorage();
  });

export const createAuthSlice = async ({
  authService,
  loginThunk,
  logoutThunk,
}: CreateAuthSliceOptions) =>
  createSlice({
    name: "auth",
    initialState: (await getInitialSate(authService)) as Auth,
    reducers: {},
    extraReducers: (builder) => {
      builder.addMatcher(loginThunk.fulfilled.match, (state, { payload }) => {
        return { ...state, token: payload, loggedIn: true };
      });
      builder.addMatcher(logoutThunk.fulfilled.match, (state) => {
        return { ...state, token: null, loggedIn: false };
      });
    },
  });

export const createAuthMiddleware = ({
  diplicityApi,
  telemetryService,
  loginThunk,
  logoutThunk,
}: CreateAuthMiddlewareOptions): Middleware<
  AsyncThunkAction<any, any, any>,
  RootState,
  ThunkDispatch<RootState, any, any>
> => {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (isRejected(action)) {
        const { loggedIn } = selectAuth(getState());
        if (action.payload && action.payload.status === 401 && loggedIn) {
          telemetryService.logInfo(
            "Unauthorized while logged in - logging out"
          );
          dispatch(logoutThunk());
        }
      }
      if (diplicityApi.endpoints.getToken.matchFulfilled(action)) {
        dispatch(loginThunk(action.payload));
      }
      next(action);
    };
};

export const selectAuth = (state: RootState) => state.auth;
