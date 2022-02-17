import { combineReducers } from "redux";

import auth from "./auth";
import feedback from "./feedback";
import messaging from "./messaging";
import phase from "./phase";
import { diplicityService } from "./service";

export default combineReducers({
  [diplicityService.reducerPath]: diplicityService.reducer,
  auth,
  feedback,
  messaging,
  phase,
});
