import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PhaseState = null | number;

const initialState = null;

const phaseSlice = createSlice({
  name: "phase",
  initialState: initialState as PhaseState,
  reducers: {
    set: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
    clear: (state) => {
      return null;
    },
  },
});

export const actions = phaseSlice.actions;

export default phaseSlice.reducer;
