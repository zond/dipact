import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateOrder {
  source: string | null;
  type: string | null;
  target: string | null;
  aux: string | null;
}

const initialState: CreateOrder = {
  source: null,
  type: null,
  target: null,
  aux: null,
};

const createOrderSlice = createSlice({
  name: "createOrder",
  initialState,
  reducers: {
    clear: () => {
      return { ...initialState };
    },
    setSource: (state, { payload }: PayloadAction<string>) => {
      return { ...state, source: payload };
    },
    setType: (state, { payload }: PayloadAction<string>) => {
      return { ...state, type: payload };
    },
    setTarget: (state, { payload }: PayloadAction<string>) => {
      return { ...state, type: payload };
    },
    setAux: (state, { payload }: PayloadAction<string>) => {
      return { ...state, type: payload };
    },
  },
});

export const actions = createOrderSlice.actions;

export default createOrderSlice.reducer;
