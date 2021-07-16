import { Middleware } from "redux";

import actions from "./actions";
import { actions as colorOverrideActions } from "./colorOverrides";
import { parseUserConfigColor } from "./utils";
import type { RootState } from "../store";

const parseUserConfigColors: Middleware =
	({ dispatch, getState }) =>
	(next) =>
	(action) => {
		/*
  When parseUserConfigColors action is dispatched, get the colors from userConfig
  and pass them to colorOverrides slice.
  */
		if (action.type === actions.parseUserConfigColors.type) {
			const state: RootState = getState();
			const userConfigColors = state.userConfig.Colors || [];
			userConfigColors.forEach((userConfigColor) => {
				if (userConfigColor != "") {
					const { type, value, variantCode, nationCode } =
						parseUserConfigColor(userConfigColor);
					if (type == "position") {
						dispatch(colorOverrideActions.addPositionOverride(value));
					} else if (type == "nation") {
						dispatch(
							colorOverrideActions.addNationOverride({ nationCode, value })
						);
					} else if (type == "variant") {
						dispatch(
							colorOverrideActions.addVariantOverride({
								variantCode,
								nationCode,
								value,
							})
						);
					}
				}
			});
		}
		next(action);
	};

export default [parseUserConfigColors];
