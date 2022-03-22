import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { ColorOverrides } from "./types";
import { overrideReg, parseUserConfigColor } from "./utils";

const initialState: ColorOverrides = {
	nationCodes: {},
	variantCodes: {},
	positions: [],
	variants: {},
	nations: {},
};
const colorOverridesSlice = createSlice({
	name: "colorOverrides",
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.listVariants.matchFulfilled,
			(state, { payload: variants }) => {
				variants.forEach((variant) => {
					// Add variants to color overrides
					const variantKey = variant.Name.replace(overrideReg, "");
					state.variantCodes[variantKey] = variant.Name;

					// Add nations to color overrides
					variant.Nations.forEach((nation) => {
						const nationKey = nation.replace(overrideReg, "");
						state.nationCodes[nationKey] = nation;
					});
				});
			}
		);
		builder.addMatcher(
			diplicityService.endpoints.getUserConfig.matchFulfilled,
			(state, { payload: userConfig }) => {
				const userConfigColors = userConfig.Colors || [];
				userConfigColors.forEach((userConfigColor) => {
					if (userConfigColor !== "") {
						const { type, value, variantCode, nationCode } =
							parseUserConfigColor(userConfigColor);
						if (type === "position") {
							state.positions.push(value);
						} else if (type === "nation") {
							const nation = state.nationCodes[nationCode as string];
							state.nations[nation] = value;
						} else if (type === "variant") {
							const variant = state.variantCodes[variantCode as string];
							const nation = state.nationCodes[nationCode as string];
							if (!(variant in state.variants)) {
								state.variants[variant] = {};
							}
							state.variants[variant][nation] = value;
						}
					}
				})
			}
		);
	},
});

export const actions = colorOverridesSlice.actions;

export default colorOverridesSlice.reducer;
