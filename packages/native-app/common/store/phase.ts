import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

type Phase = null | number;

const initialState = null;

const phaseSlice = createSlice({
  name: "phase",
  initialState: initialState as Phase,
  reducers: {
    set: (_, action: PayloadAction<number>) => {
      return action.payload;
    },
    clear: () => {
      return null;
    },
  },
});

export const phaseActions = phaseSlice.actions;
export const phaseReducer = phaseSlice.reducer;
export const phaseSelectors = {
  selectphase: createSelector(
    (state: { phase: Phase }) => state.phase,
    (phase) => phase
  ),
};
