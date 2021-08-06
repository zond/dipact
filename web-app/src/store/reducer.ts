import { combineReducers } from "redux";

import auth from "./auth";
import colorOverrides from "./colorOverrides";
import latestForumMail from "./latestForumMail";
import messaging from "./messaging";
import user from "./user";
import userBans from "./userBans";
import userStats from "./userStats";
import { diplicityService } from "./service";

export default combineReducers({
	[diplicityService.reducerPath]: diplicityService.reducer,
	auth,
	colorOverrides,
	latestForumMail,
	messaging,
	user,
	userBans,
	userStats,
});
