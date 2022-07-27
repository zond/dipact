import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {} as { gameId?: string; newestPhaseId?: string };

const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    setGameId: (state, action: PayloadAction<string>) => {
      return { ...state, gameId: action.payload };
    },
    setNewestPhaseId: (state, action: PayloadAction<string>) => {
      return { ...state, newestPhaseId: action.payload };
    },
  },
});

export const actions = gameSlice.actions;

export default gameSlice.reducer;
