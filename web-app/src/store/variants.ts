import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { Variant } from "./types";

const initialState: { entities: Variant[]; loaded: boolean } = {
	entities: [],
	loaded: false,
};
const variantsSlice = createSlice({
	name: "variantsSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			diplicityService.endpoints.getVariants.matchFulfilled,
			(state, { payload }) => {
				const entities = payload.Properties.map((vr) => vr.Properties);
				return { entities, loaded: true };
			}
		);
	},
});

export default variantsSlice.reducer;
