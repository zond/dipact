import { createSlice } from "@reduxjs/toolkit";
import { diplicityService } from "./service";
import { overrideReg } from "./utils";

type colorOverrides = {
  nationCodes: { [key: string]: string };
  variantCodes: { [key: string]: string };
  positions: string[];
  variants: { [key: string]: { [key: string]: string } };
  nations: { [key: string]: string };
};

const initialState: colorOverrides = {
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
      diplicityService.endpoints.getVariants.matchFulfilled,
      (state, { payload }) => {
        const variants = payload.Properties.map(
          (variantResponse) => variantResponse.Properties
        );
        variants.forEach((variant) => {
          // Add variants to color overrides
          const variantKey = variant.Name.replace(overrideReg, "");
          state.variantCodes[variantKey] = variant.Name;

          // Add nations to color overrides
          variant.Nations.map((nation) => {
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
