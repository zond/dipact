import { Middleware } from "redux";

import * as actions from "./actions";
import { actions as colorOverrideActions } from "./colorOverrides";
import { getUpdatedUserConfig, parseUserConfigColor } from "./utils";
import type { RootState } from "../store";
import { selectMessaging } from "./selectors";
import { diplicityService } from "./service";

// TODO test
const submitSettingsForm: Middleware =
	/*
 	When settings form is submitted, merge the settings form values with the userConfig
	and dispatch updateUserConfig
  	*/

		({ dispatch, getState }) =>
		(next) =>
		(action) => {
			if (action.type === actions.submitSettingsForm.type) {
				const state: RootState = getState();
				const { data: userConfig } =
					diplicityService.endpoints.getUserConfig.select("123456789")(state);
				const messaging = selectMessaging(state);
				const updatedUserConfig = getUpdatedUserConfig(
					userConfig || {},
					action.payload,
					messaging
				);
				dispatch<any>(
					diplicityService.endpoints.updateUserConfig.initiate(
						updatedUserConfig
					)
				);
			}
			next(action);
		};

const parseUserConfigColors: Middleware =
	/*
 	When parseUserConfigColors action is dispatched, get the colors from userConfig
  	and pass them to colorOverrides slice.
  	*/

		({ dispatch, getState }) =>
		(next) =>
		(action) => {
			if (action.type === actions.parseUserConfigColors.type) {
				const state: RootState = getState();
				// const userConfigColors = state.userConfig.Colors || [];
				// userConfigColors.forEach((userConfigColor) => {
				// 	if (userConfigColor !== "") {
				// 		const { type, value, variantCode, nationCode } =
				// 			parseUserConfigColor(userConfigColor);
				// 		if (type === "position") {
				// 			dispatch(colorOverrideActions.addPositionOverride(value));
				// 		} else if (type === "nation") {
				// 			dispatch(
				// 				colorOverrideActions.addNationOverride({ nationCode, value })
				// 			);
				// 		} else if (type === "variant") {
				// 			dispatch(
				// 				colorOverrideActions.addVariantOverride({
				// 					variantCode,
				// 					nationCode,
				// 					value,
				// 				})
				// 			);
				// 		}
				// 	}
				// });
			}
			next(action);
		};

const middleware = [parseUserConfigColors, submitSettingsForm];
export default middleware;
