import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { ColorOverrides } from "./types";
import { overrideReg } from "./utils";

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
		addPositionOverride: (state, { payload }) => {
			state.positions.push(payload);
		},
		addNationOverride: (state, { payload }) => {
			const { nationCode, value } = payload;
			const nation = state.nationCodes[nationCode];
			state.nations[nation] = value;
		},
		addVariantOverride: (state, { payload }) => {
			const { variantCode, nationCode, value } = payload;
			const variant = state.variantCodes[variantCode];
			const nation = state.nationCodes[nationCode];
			if (!(variant in state.variants)) {
				state.variants[variant] = {};
			}
			state.variants[variant][nation] = value;
		},
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
	},
});

export const actions = colorOverridesSlice.actions;

export default colorOverridesSlice.reducer;
