import { combineReducers } from "redux";

import colorOverrides from "./colorOverrides";
import latestForumMail from "./latestForumMail";
import user from "./user";
import userBans from "./userBans";
import userConfig from "./userConfig";
import userStats from "./userStats";
import { diplicityService } from "./service";

export default combineReducers({
  [diplicityService.reducerPath]: diplicityService.reducer,
  colorOverrides,
  latestForumMail,
  user,
  userBans,
  userConfig,
  userStats,
});
