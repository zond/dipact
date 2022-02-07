import { combineReducers } from "redux";

import auth from "./auth";
import colorOverrides from "./colorOverrides";
import feedback from "./feedback";
import latestForumMail from "./latestForumMail";
import messaging from "./messaging";
import phase from "./phase";
import { diplicityService } from "./service";

export default combineReducers({
  [diplicityService.reducerPath]: diplicityService.reducer,
  auth,
  colorOverrides,
  feedback,
  latestForumMail,
  messaging,
  phase,
});
