import { isRejected} from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { submitSettingsForm } from "./actions";
import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";

export const submitSettingsFormMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  next(action);
  if (action.type === submitSettingsForm.type) {
    const state = getState();
    const userConfig = selectUserConfig(state);
    if (!userConfig) return;
    dispatch<any>(
      diplicityService.endpoints.updateUserConfig.initiate(userConfig, {
        track: true,
      })
    );
  }
};

const logoutOn400: Middleware<{}, any> = ({ getState, dispatch }) => (next) => (
  action
) => {
  if (isRejected(action)) {
    if (action?.payload?.status === 401) {
      dispatch(authActions.logout());
    }
  }
  return next(action);
};

const middleware = [submitSettingsFormMiddleware, logoutOn400];
export default middleware;
